import { Code2, LayoutTemplate, Workflow, TrendingUp, Smartphone, LifeBuoy } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Reveal } from "./Reveal";

const ICONS = [Code2, LayoutTemplate, Workflow, TrendingUp, Smartphone, LifeBuoy];

export function Services() {
  const { t } = useLanguage();
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-primary mb-4">
            01 — SERVICES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{t.services.title}</h2>
          <p className="text-muted-foreground text-lg">{t.services.subtitle}</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i] ?? Code2;
            return (
              <Reveal key={s.title} delay={i * 80}>
                <article className="glass-card group p-7 md:p-8 h-full">
                  <div className="flex items-start gap-5">
                    <div className="relative shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-primary/15 ring-1 ring-primary/40 grid place-items-center group-hover:bg-primary/25 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-gradient transition-all">{s.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>0{i + 1}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent" />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
