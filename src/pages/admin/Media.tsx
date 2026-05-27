import { useCallback, useEffect, useState } from "react";
import { Loader2, Upload, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { storagePathFromUrl, uploadImage } from "@/lib/uploadImage";

type Media = {
  id: string;
  url: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  folder: string | null;
  created_at: string;
};

export default function MediaAdmin() {
  const [list, setList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [folder, setFolder] = useState<string>("all");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    setList((data as Media[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const folders = Array.from(new Set(list.map((m) => m.folder || "general")));

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        const url = await uploadImage("media", f, "general");
        await supabase.from("media").insert({
          url,
          file_name: f.name,
          mime_type: f.type,
          size_bytes: f.size,
          folder: "general",
        });
      }
      toast.success("Uploaded");
      load();
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  }, []);

  async function remove(m: Media) {
    if (!confirm("Delete this file?")) return;
    const path = storagePathFromUrl(m.url, "media");
    if (path) await supabase.storage.from("media").remove([path]);
    await supabase.from("media").delete().eq("id", m.id);
    toast.success("Deleted");
    load();
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  const filtered = folder === "all" ? list : list.filter((m) => (m.folder || "general") === folder);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Media library</h1>
        <p className="text-muted-foreground mt-1">Upload and manage images for your website.</p>
      </div>

      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
        className={`block glass-card p-10 text-center cursor-pointer border-2 border-dashed transition-all ${drag ? "border-primary bg-primary/10" : "border-border"}`}
      >
        <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        {uploading ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> : <Upload className="h-8 w-8 text-primary mx-auto" />}
        <div className="mt-3 font-medium">Drop files here or click to upload</div>
        <div className="text-xs text-muted-foreground mt-1">Images and videos supported</div>
      </label>

      {folders.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFolder("all")} className={`px-3 py-1.5 rounded-full text-xs ${folder === "all" ? "bg-primary/15 text-primary border border-primary/40" : "glass"}`}>All</button>
          {folders.map((f) => (
            <button key={f} onClick={() => setFolder(f)} className={`px-3 py-1.5 rounded-full text-xs ${folder === f ? "bg-primary/15 text-primary border border-primary/40" : "glass"}`}>{f}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="glass-card overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                {m.mime_type?.startsWith("image/") ? (
                  <img src={m.url} alt={m.file_name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <video src={m.url} className="h-full w-full object-cover" muted />
                )}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center gap-2">
                  <button onClick={() => copy(m.url)} className="glass rounded-full px-3 py-1.5 text-xs flex items-center gap-1">
                    {copied === m.url ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied === m.url ? "Copied" : "Copy URL"}
                  </button>
                  <button onClick={() => remove(m)} className="glass rounded-full px-3 py-1.5 text-xs text-destructive flex items-center gap-1">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
              <div className="p-2 text-xs truncate">{m.file_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
