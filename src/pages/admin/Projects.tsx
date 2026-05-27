import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, GripVertical, ExternalLink, Github } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tech: string[] | null;
  website_url: string | null;
  github_url: string | null;
  category: string | null;
  display_order: number;
  featured: boolean;
};

const empty: Partial<Project> = {
  title: "",
  description: "",
  image_url: "",
  tech: [],
  website_url: "",
  github_url: "",
  category: "",
  featured: true,
};

export default function ProjectsAdmin() {
  const [list, setList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("projects").select("*").order("display_order");
    setList((data as Project[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = list.findIndex((p) => p.id === active.id);
    const newIdx = list.findIndex((p) => p.id === over.id);
    const next = arrayMove(list, oldIdx, newIdx);
    setList(next);
    const updates = next.map((p, i) => supabase.from("projects").update({ display_order: i }).eq("id", p.id));
    await Promise.all(updates);
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Projects</h1>
          <p className="text-muted-foreground mt-1">Drag to reorder. Changes sync to the website instantly.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="btn-glow">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          No projects yet. Click "New project" to add the first one.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={list.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {list.map((p) => (
                <Row key={p.id} p={p} onEdit={() => setEditing(p)} onDelete={() => remove(p.id)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {editing && <Editor draft={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function Row({ p, onEdit, onDelete }: { p: Project; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="glass-card p-4 flex items-center gap-4">
      <button {...attributes} {...listeners} className="text-muted-foreground hover:text-primary cursor-grab touch-none">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden shrink-0">
        {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{p.title}</div>
        <div className="text-xs text-muted-foreground truncate">{p.category} · {p.tech?.join(", ")}</div>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        {p.website_url && <a href={p.website_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><ExternalLink className="h-4 w-4" /></a>}
        {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Github className="h-4 w-4" /></a>}
      </div>
      <button onClick={onEdit} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
      <button onClick={onDelete} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}

function Editor({ draft, onClose, onSaved }: { draft: Partial<Project>; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Partial<Project>>(draft);
  const [busy, setBusy] = useState(false);
  const isNew = !d.id;

  async function save() {
    if (!d.title?.trim()) return toast.error("Title required");
    setBusy(true);
    try {
      const payload = {
        title: d.title,
        description: d.description || null,
        image_url: d.image_url || null,
        tech: d.tech || [],
        website_url: d.website_url || null,
        github_url: d.github_url || null,
        category: d.category || null,
        featured: d.featured ?? true,
      };
      const { error } = isNew
        ? await supabase.from("projects").insert(payload)
        : await supabase.from("projects").update(payload).eq("id", d.id!);
      if (error) throw error;
      toast.success("Saved");
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadImage("projects", f);
      setD({ ...d, image_url: url });
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="glass-card p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gradient">{isNew ? "New project" : "Edit project"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <Field label="Title"><input value={d.title || ""} onChange={(e) => setD({ ...d, title: e.target.value })} className={inputCls} /></Field>
          <Field label="Description"><textarea value={d.description || ""} onChange={(e) => setD({ ...d, description: e.target.value })} rows={3} className={inputCls + " resize-none"} /></Field>

          <Field label="Image">
            {d.image_url && <img src={d.image_url} alt="" className="w-full h-40 object-cover rounded-xl mb-2" />}
            <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category"><input value={d.category || ""} onChange={(e) => setD({ ...d, category: e.target.value })} className={inputCls} placeholder="Web App" /></Field>
            <Field label="Tech (comma separated)">
              <input value={(d.tech || []).join(", ")} onChange={(e) => setD({ ...d, tech: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className={inputCls} placeholder="React, Node" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Website URL"><input value={d.website_url || ""} onChange={(e) => setD({ ...d, website_url: e.target.value })} className={inputCls} placeholder="https://..." /></Field>
            <Field label="GitHub URL"><input value={d.github_url || ""} onChange={(e) => setD({ ...d, github_url: e.target.value })} className={inputCls} placeholder="https://github.com/..." /></Field>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={d.featured ?? true} onChange={(e) => setD({ ...d, featured: e.target.checked })} className="accent-primary" />
            Show on website
          </label>

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
  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
