import { useEffect, useState } from "react";
import { Loader2, Save, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

export default function SEOAdmin() {
  const [d, setD] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (data) setD(data);
      setLoading(false);
    })();
  }, []);

  async function save() {
    setBusy(true);
    const { error } = await supabase.from("site_settings").upsert({ ...d, id: 1, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("SEO saved");
  }

  async function uploadOg(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try {
      const url = await uploadImage("media", f, "og");
      setD({ ...d, og_image_url: url });
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

  function downloadSitemap() {
    const origin = window.location.origin;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc><priority>1.0</priority></url>\n  <url><loc>${origin}/#services</loc><priority>0.8</priority></url>\n  <url><loc>${origin}/#about</loc><priority>0.8</priority></url>\n  <url><loc>${origin}/#contact</loc><priority>0.8</priority></url>\n</urlset>`;
    const blob = new Blob([xml], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sitemap.xml";
    a.click();
  }

  if (loading) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gradient">SEO management</h1>
        <p className="text-muted-foreground mt-1">Meta tags, Open Graph, and sitemap.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <Field label="Site title (browser tab + SEO)"><input value={d.site_title || ""} onChange={(e) => setD({ ...d, site_title: e.target.value })} className={inputCls} maxLength={60} /><div className="text-xs text-muted-foreground mt-1">{(d.site_title || "").length}/60</div></Field>
        <Field label="Meta description"><textarea value={d.meta_description || ""} onChange={(e) => setD({ ...d, meta_description: e.target.value })} rows={3} maxLength={160} className={inputCls + " resize-none"} /><div className="text-xs text-muted-foreground mt-1">{(d.meta_description || "").length}/160</div></Field>
        <Field label="Meta keywords"><input value={d.meta_keywords || ""} onChange={(e) => setD({ ...d, meta_keywords: e.target.value })} className={inputCls} placeholder="comma, separated, keywords" /></Field>
        <Field label="Open Graph image (1200×630)">
          {d.og_image_url && <img src={d.og_image_url} alt="" className="w-full max-w-md aspect-[1200/630] object-cover rounded-xl mb-2" />}
          <input type="file" accept="image/*" onChange={uploadOg} className="text-sm" />
        </Field>
      </div>

      <div className="glass-card p-6 space-y-3">
        <h2 className="font-semibold">Sitemap</h2>
        <p className="text-sm text-muted-foreground">Generate a sitemap.xml file you can upload to your site root.</p>
        <button onClick={downloadSitemap} className="btn-ghost-glow text-sm py-2 px-4"><Download className="h-4 w-4" /> Download sitemap.xml</button>
      </div>

      <button onClick={save} disabled={busy} className="btn-glow">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save SEO
      </button>
    </div>
  );
}

const inputCls = "w-full bg-input/50 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary transition-colors";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">{label}</label>{children}</div>;
}
