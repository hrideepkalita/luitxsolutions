import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const { signIn, signUp, user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem("luitx_remember_email") || "");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  useEffect(() => {
    if (!loading && user && isAdmin) nav("/admin", { replace: true });
  }, [user, isAdmin, loading, nav]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin/login`,
        });
        if (error) toast.error(error.message);
        else toast.success("Password reset email sent");
        return;
      }
      const fn = mode === "signup" ? signUp : signIn;
      const { error, isAdmin: signedInAdmin } = await fn(email, password);
      if (error) {
        toast.error(error);
        return;
      }
      if (remember) localStorage.setItem("luitx_remember_email", email);
      else localStorage.removeItem("luitx_remember_email");
      toast.success(mode === "signup" ? "Account created!" : "Welcome back");
      if (signedInAdmin) nav("/admin", { replace: true });
      else if (mode === "login") toast.error("This account is signed in, but it is not an admin account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-hero">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="glass-card w-full max-w-md p-8 relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">LuitX Admin</h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              {mode === "forgot" ? "Reset password" : mode === "signup" ? "Create account" : "Secure access"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input/50 border border-border rounded-2xl pl-10 pr-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Password</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input/50 border border-border rounded-2xl pl-10 pr-10 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-primary"
                />
                Remember me
              </label>
              <button type="button" onClick={() => setMode("forgot")} className="text-primary hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-glow w-full disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "forgot" ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" && (
            <>
              No account?{" "}
              <button onClick={() => setMode("signup")} className="text-primary hover:underline">
                Create one
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Have an account?{" "}
              <button onClick={() => setMode("login")} className="text-primary hover:underline">
                Sign in
              </button>
            </>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("login")} className="text-primary hover:underline">
              Back to sign in
            </button>
          )}
        </div>

        <Link to="/" className="block mt-6 text-center text-xs text-muted-foreground hover:text-primary">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
