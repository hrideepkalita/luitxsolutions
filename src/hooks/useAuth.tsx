import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthResult = { error: string | null; isAdmin?: boolean };

interface AuthCtx {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

async function fetchIsAdmin(uid: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", uid)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.warn("[auth] role check failed:", error.message);
    return false;
  }
  return !!data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const applySession = useCallback(async (s: Session | null) => {
    if (!mounted.current) return false;
    setLoading(true);
    setSession(s);
    setUser(s?.user ?? null);

    let admin = false;
    if (s?.user) admin = await fetchIsAdmin(s.user.id);

    if (mounted.current) {
      setIsAdmin(admin);
      setLoading(false);
    }
    return admin;
  }, []);

  useEffect(() => {
    mounted.current = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      // Defer to avoid deadlock inside the auth callback
      setTimeout(() => applySession(s), 0);
    });

    supabase.auth.getSession().then(({ data }) => applySession(data.session));

    return () => {
      mounted.current = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  const value: AuthCtx = {
    user,
    session,
    isAdmin,
    loading,
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        const admin = await applySession(data.session);
        return { error: null, isAdmin: admin };
      }
      return { error: error?.message ?? null };
    },
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (!error && data.session) {
        const admin = await applySession(data.session);
        return { error: null, isAdmin: admin };
      }
      return { error: error?.message ?? null };
    },
    signOut: async () => {
      setIsAdmin(false);
      await supabase.auth.signOut();
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
