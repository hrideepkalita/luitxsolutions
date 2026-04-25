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
                      <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow group-hover:scale-110 transition-transform duration-500">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />
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
