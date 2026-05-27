import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ActivityAdmin() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100);
      setList(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Activity log</h1>
        <p className="text-muted-foreground mt-1">Recent admin actions.</p>
      </div>
      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">No activity yet.</div>
      ) : (
        <div className="glass-card p-4">
          <ul className="divide-y divide-border/40">
            {list.map((a) => (
              <li key={a.id} className="py-3 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary shadow-glow" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.action}</div>
                  <div className="text-xs text-muted-foreground">{a.entity}</div>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
