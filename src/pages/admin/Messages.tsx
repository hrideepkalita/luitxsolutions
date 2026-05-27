import { useEffect, useState } from "react";
import { Loader2, Trash2, Search, Mail, Phone, MessageCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type M = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function MessagesAdmin() {
  const [list, setList] = useState<M[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [active, setActive] = useState<M | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setList((data as M[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function toggleRead(m: M) {
    await supabase.from("messages").update({ is_read: !m.is_read }).eq("id", m.id);
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    if (active?.id === id) setActive(null);
    load();
  }

  const filtered = list.filter((m) => {
    if (filter === "unread" && m.is_read) return false;
    if (filter === "read" && !m.is_read) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s) || m.message.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Messages</h1>
        <p className="text-muted-foreground mt-1">Contact form submissions from your website.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full bg-input/50 border border-border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary" />
        </div>
        {(["all", "unread", "read"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm capitalize transition-all ${filter === f ? "bg-primary/15 text-primary border border-primary/40" : "glass text-muted-foreground hover:text-foreground"}`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">No messages.</div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filtered.map((m) => (
              <button key={m.id} onClick={() => { setActive(m); if (!m.is_read) supabase.from("messages").update({ is_read: true }).eq("id", m.id).then(load); }}
                className={`w-full text-left glass-card p-4 ${active?.id === m.id ? "border-primary/60 shadow-glow" : ""}`}>
                <div className="flex items-center gap-2">
                  {!m.is_read && <div className="h-2 w-2 rounded-full bg-primary shadow-glow shrink-0" />}
                  <div className="font-semibold truncate flex-1">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground shrink-0">{new Date(m.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-xs text-muted-foreground truncate mt-1">{m.email}</div>
                <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{m.message}</div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-3">
            {active ? (
              <div className="glass-card p-6 sticky top-20">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="text-xl font-bold">{active.name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(active.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleRead(active)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary" title={active.is_read ? "Mark unread" : "Mark read"}>
                      {active.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => remove(active.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <a href={`mailto:${active.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" /> {active.email}</a>
                  {active.phone && <a href={`tel:${active.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Phone className="h-4 w-4" /> {active.phone}</a>}
                </div>
                <div className="bg-input/30 rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed">{active.message}</div>
                <div className="flex gap-2 mt-4">
                  <a href={`mailto:${active.email}?subject=Re: Your message to LuitX&body=Hi ${encodeURIComponent(active.name)},%0D%0A%0D%0A`} className="btn-glow text-sm py-2 px-4"><Mail className="h-4 w-4" /> Reply via email</a>
                  {active.phone && (
                    <a href={`https://wa.me/${active.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${active.name}, thanks for reaching out to LuitX!`)}`} target="_blank" rel="noreferrer" className="btn-ghost-glow text-sm py-2 px-4"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center text-muted-foreground">Select a message to view.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
