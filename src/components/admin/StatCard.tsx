import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint?: string;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const target = value;
    const duration = 800;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="text-3xl font-bold mt-2 text-gradient-brand">{n}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className="h-10 w-10 rounded-xl bg-primary/15 ring-1 ring-primary/40 grid place-items-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
