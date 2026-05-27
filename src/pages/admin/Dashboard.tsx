import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Star, MessageSquare, Eye, Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/admin/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, testimonials: 0, messages: 0, visitors: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [p, t, m, v, msgs] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("visitors").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("id,name,email,created_at,is_read").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        projects: p.count ?? 0,
        testimonials: t.count ?? 0,
        messages: m.count ?? 0,
        visitors: v.count ?? 0,
      });
      setRecent(msgs.data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back — here's what's happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} label="Projects" value={stats.projects} />
        <StatCard icon={Star} label="Testimonials" value={stats.testimonials} />
        <StatCard icon={MessageSquare} label="Messages" value={stats.messages} />
        <StatCard icon={Eye} label="Visitors" value={stats.visitors} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent messages</h2>
            <Link to="/admin/messages" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-border/40">
              {recent.map((m) => (
                <li key={m.id} className="py-3 flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${m.is_read ? "bg-muted" : "bg-primary shadow-glow"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{m.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4">Quick actions</h2>
          <div className="space-y-2">
            <QA to="/admin/projects" icon={Plus} label="Add new project" />
            <QA to="/admin/testimonials" icon={Plus} label="Add testimonial" />
            <QA to="/admin/founder" icon={Plus} label="Edit founder" />
            <QA to="/" icon={ExternalLink} label="View website" external />
          </div>
        </div>
      </div>
    </div>
  );
}

function QA({ to, icon: Icon, label, external }: { to: string; icon: any; label: string; external?: boolean }) {
  const cls = "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-primary/5 hover:bg-primary/15 border border-primary/20 hover:border-primary/40 transition-all";
  if (external) return (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
      <Icon className="h-4 w-4 text-primary" /> {label}
    </a>
  );
  return (
    <Link to={to} className={cls}>
      <Icon className="h-4 w-4 text-primary" /> {label}
    </Link>
  );
}
