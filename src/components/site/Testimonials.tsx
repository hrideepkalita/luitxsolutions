import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "./Reveal";

type T = {
  id: string;
  client_name: string;
  client_image_url: string | null;
  client_role: string | null;
  rating: number;
  feedback: string;
};

export function Testimonials() {
  const [list, setList] = useState<T[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id,client_name,client_image_url,client_role,rating,feedback")
        .order("display_order");
      setList((data as T[]) ?? []);
    })();
  }, []);

  if (list.length === 0) return null;

  return (
    <section id="testimonials" className="relative py-20 md:py-28">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-primary mb-4">
            Client Love
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">What clients say</h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <article className="glass-card p-6 h-full relative">
                <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/30" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-muted overflow-hidden ring-1 ring-primary/30 shrink-0">
                    {t.client_image_url && <img src={t.client_image_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{t.client_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.client_role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, n) => (
                    <Star key={n} className={`h-3.5 w-3.5 ${n < t.rating ? "fill-primary text-primary" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.feedback}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
