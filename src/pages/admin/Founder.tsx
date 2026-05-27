import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

type F = {
  id: number;
  name: string;
  designation: string | null;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
};

export default function FounderAdmin() {
  const [d, setD] = useState<Partial<F>>({});
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("founder_profile").select("*").eq("id", 1).maybeSingle();
      if (data) setD(data);
      setLoading(false);
    })();
  }, []);

  async function save() {
    setBusy(true);
    try {
      const payload = { ...d, id: 1, updated_at: new Date().toISOString() };
      const { error } = await supabase.from("founder_profile").upsert(payload as any);
      if (error) throw error;
      toast.success("Founder profile saved");
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try {
      const url = await uploadImage("founder", f);
      setD({ ...d, image_url: url });
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

  if (loading) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Founder profile</h1>
        <p className="text-muted-foreground mt-1">Edit the founder section that appears on your website.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <Field label="Photo">
            {d.image_url && <img src={d.image_url} alt="" className="h-32 w-32 rounded-full object-cover mb-2" />}
            <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name"><input value={d.name || ""} onChange={(e) => setD({ ...d, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Designation"><input value={d.designation || ""} onChange={(e) => setD({ ...d, designation: e.target.value })} className={inputCls} /></Field>
          </div>
          <Field label="Tagline (e.g. By IITian for Assam ❤️)"><input value={d.tagline || ""} onChange={(e) => setD({ ...d, tagline: e.target.value })} className={inputCls} /></Field>
          <Field label="Description"><textarea value={d.description || ""} onChange={(e) => setD({ ...d, description: e.target.value })} rows={5} className={inputCls + " resize-none"} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Instagram URL"><input value={d.instagram_url || ""} onChange={(e) => setD({ ...d, instagram_url: e.target.value })} className={inputCls} /></Field>
            <Field label="Facebook URL"><input value={d.facebook_url || ""} onChange={(e) => setD({ ...d, facebook_url: e.target.value })} className={inputCls} /></Field>
            <Field label="LinkedIn URL"><input value={d.linkedin_url || ""} onChange={(e) => setD({ ...d, linkedin_url: e.target.value })} className={inputCls} /></Field>
            <Field label="Twitter URL"><input value={d.twitter_url || ""} onChange={(e) => setD({ ...d, twitter_url: e.target.value })} className={inputCls} /></Field>
          </div>
          <button onClick={save} disabled={busy} className="btn-glow">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
          </button>
        </div>

        <div className="glass-card p-6 h-fit sticky top-20">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Live preview</div>
          <div className="flex flex-col items-center text-center">
            <div className="h-28 w-28 rounded-full bg-muted overflow-hidden ring-2 ring-primary/40 shadow-glow mb-3">
              {d.image_url && <img src={d.image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="font-bold text-lg text-gradient">{d.name || "—"}</div>
            <div className="text-xs text-muted-foreground">{d.designation}</div>
            <div className="text-xs text-primary mt-1">{d.tagline}</div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-4">{d.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-input/50 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary transition-colors";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">{label}</label>{children}</div>;
}
