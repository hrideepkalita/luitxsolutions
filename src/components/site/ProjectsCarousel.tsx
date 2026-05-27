import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "./Reveal";

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tech: string[] | null;
  website_url: string | null;
  github_url: string | null;
  category: string | null;
};

export function ProjectsCarousel() {
  const [list, setList] = useState<Project[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("id,title,description,image_url,tech,website_url,github_url,category")
        .eq("featured", true)
        .order("display_order");
      setList((data as Project[]) ?? []);
    })();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (list.length === 0) return;
    const el = scroller.current; if (!el) return;
    let raf = 0;
    let last = performance.now();
    const speed = 30; // px / second
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      if (!paused.current) {
        el.scrollLeft += speed * dt;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [list.length]);

  function scrollBy(dir: 1 | -1) {
    const el = scroller.current; if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  if (list.length === 0) return null;

  // Duplicate for seamless infinite scroll
  const items = [...list, ...list];

  return (
    <section id="projects" className="relative py-20 md:py-28">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-primary mb-4">
            Our Work
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Recent Projects</h2>
          <p className="text-muted-foreground text-lg">A glimpse of what we've built for clients worldwide.</p>
        </Reveal>

        <div className="relative">
          <button
            onClick={() => scrollBy(-1)}
            className="hidden md:grid absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 place-items-center rounded-full glass hover:border-primary/60 hover:shadow-glow transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="hidden md:grid absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 place-items-center rounded-full glass hover:border-primary/60 hover:shadow-glow transition-all"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            ref={scroller}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
            onTouchStart={() => { paused.current = true; }}
            onTouchEnd={() => { setTimeout(() => { paused.current = false; }, 1500); }}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((p, i) => (
              <article
                key={p.id + "-" + i}
                className="glass-card group shrink-0 w-[280px] sm:w-[320px] snap-start overflow-hidden"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-full w-full bg-gradient-primary opacity-20" />
                  )}
                  {p.category && (
                    <div className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-wider">
                      {p.category}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-gradient transition-all">{p.title}</h3>
                  {p.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>}
                  {p.tech && p.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.tech.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {p.website_url && (
                      <a href={p.website_url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="h-3 w-3" /> Live
                      </a>
                    )}
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary">
                        <Github className="h-3 w-3" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
