import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

type S = {
  id: number;
  site_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image_url: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  contact_email: string | null;
  whatsapp_number: string | null;
  google_maps_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
};

export default function SettingsAdmin() {
  const [d, setD] = useState<Partial<S>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (data) setD(data);
      setLoading(false);
    })();
  }, []);

  async function save() {
    setBusy(true);
    try {
      const payload = { ...d, id: 1, updated_at: new Date().toISOString() };
      const { error } = await supabase.from("site_settings").upsert(payload as any);
      if (error) throw error;
      toast.success("Settings saved");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

  async function upload(field: keyof S, e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try {
      const url = await uploadImage("media", f, "settings");
      setD({ ...d, [field]: url } as any);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

  if (loading) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Website settings</h1>
        <p className="text-muted-foreground mt-1">General configuration for your website.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold">Branding</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Logo">
            {d.logo_url && <img src={d.logo_url} alt="" className="h-16 w-16 object-contain rounded-xl mb-2 bg-background/40" />}
            <input type="file" accept="image/*" onChange={(e) => upload("logo_url", e)} className="text-sm" />
          </Field>
          <Field label="Favicon">
            {d.favicon_url && <img src={d.favicon_url} alt="" className="h-12 w-12 object-contain rounded-xl mb-2 bg-background/40" />}
            <input type="file" accept="image/*" onChange={(e) => upload("favicon_url", e)} className="text-sm" />
          </Field>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Contact email"><input value={d.contact_email || ""} onChange={(e) => setD({ ...d, contact_email: e.target.value })} className={inputCls} /></Field>
          <Field label="WhatsApp number (digits only)"><input value={d.whatsapp_number || ""} onChange={(e) => setD({ ...d, whatsapp_number: e.target.value })} className={inputCls} placeholder="918822821202" /></Field>
        </div>
        <Field label="Google Maps URL"><input value={d.google_maps_url || ""} onChange={(e) => setD({ ...d, google_maps_url: e.target.value })} className={inputCls} /></Field>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="font-semibold">Social media</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Instagram"><input value={d.instagram_url || ""} onChange={(e) => setD({ ...d, instagram_url: e.target.value })} className={inputCls} /></Field>
          <Field label="Facebook"><input value={d.facebook_url || ""} onChange={(e) => setD({ ...d, facebook_url: e.target.value })} className={inputCls} /></Field>
          <Field label="LinkedIn"><input value={d.linkedin_url || ""} onChange={(e) => setD({ ...d, linkedin_url: e.target.value })} className={inputCls} /></Field>
          <Field label="Twitter"><input value={d.twitter_url || ""} onChange={(e) => setD({ ...d, twitter_url: e.target.value })} className={inputCls} /></Field>
        </div>
      </div>

      <button onClick={save} disabled={busy} className="btn-glow">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
      </button>
    </div>
  );
}

const inputCls = "w-full bg-input/50 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary transition-colors";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">{label}</label>{children}</div>;
}
