import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

type T = {
  id: string;
  client_name: string;
  client_image_url: string | null;
  client_role: string | null;
  rating: number;
  feedback: string;
  display_order: number;
};

const empty: Partial<T> = { client_name: "", client_role: "", rating: 5, feedback: "", client_image_url: "" };

export default function TestimonialsAdmin() {
  const [list, setList] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<T> | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("display_order");
    setList((data as T[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Client feedback — synced to your website.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="btn-glow"><Plus className="h-4 w-4" /> New</button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">No testimonials yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((t) => (
            <div key={t.id} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0">
                  {t.client_image_url && <img src={t.client_image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{t.client_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.client_role}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(t)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(t.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-primary text-primary" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t.feedback}</p>
            </div>
          ))}
        </div>
      )}

      {editing && <Editor draft={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function Editor({ draft, onClose, onSaved }: { draft: Partial<T>; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Partial<T>>(draft);
  const [busy, setBusy] = useState(false);
  const isNew = !d.id;

  async function save() {
    if (!d.client_name?.trim() || !d.feedback?.trim()) return toast.error("Name and feedback required");
    setBusy(true);
    try {
      const payload = {
        client_name: d.client_name,
        client_image_url: d.client_image_url || null,
        client_role: d.client_role || null,
        rating: d.rating ?? 5,
        feedback: d.feedback,
      };
      const { error } = isNew
        ? await supabase.from("testimonials").insert(payload)
        : await supabase.from("testimonials").update(payload).eq("id", d.id!);
      if (error) throw error;
      toast.success("Saved");
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally { setBusy(false); }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try {
      const url = await uploadImage("testimonials", f);
      setD({ ...d, client_image_url: url });
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="glass-card p-6 w-full max-w-xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gradient">{isNew ? "New testimonial" : "Edit testimonial"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Client name"><input value={d.client_name || ""} onChange={(e) => setD({ ...d, client_name: e.target.value })} className={inputCls} /></Field>
            <Field label="Role / Company"><input value={d.client_role || ""} onChange={(e) => setD({ ...d, client_role: e.target.value })} className={inputCls} /></Field>
          </div>
          <Field label="Client image">
            {d.client_image_url && <img src={d.client_image_url} alt="" className="h-20 w-20 rounded-full object-cover mb-2" />}
            <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
          </Field>
          <Field label="Rating">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setD({ ...d, rating: n })} type="button">
                  <Star className={`h-6 w-6 ${n <= (d.rating ?? 5) ? "fill-primary text-primary" : "text-muted"}`} />
                </button>
              ))}
            </div>
          </Field>
          <Field label="Feedback"><textarea value={d.feedback || ""} onChange={(e) => setD({ ...d, feedback: e.target.value })} rows={4} className={inputCls + " resize-none"} /></Field>
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={onClose} className="btn-ghost-glow text-sm py-2 px-4">Cancel</button>
            <button onClick={save} disabled={busy} className="btn-glow text-sm py-2 px-4 disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </button>
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
