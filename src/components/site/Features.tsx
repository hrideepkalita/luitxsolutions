import { Zap, Search, Smartphone, Shield, TrendingUp } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Reveal } from "./Reveal";

const ICONS = [Zap, Search, Smartphone, Shield, TrendingUp];

export function Features() {
  const { t } = useLanguage();
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-primary mb-4">
            03 — FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient">{t.features.title}</h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {t.features.items.map((f, i) => {
            const Icon = ICONS[i] ?? Zap;
            return (
              <Reveal key={f.title} delay={i * 70}>
                <div className="glass-card group p-6 text-center h-full">
                  <div className="inline-grid place-items-center h-12 w-12 rounded-2xl bg-gradient-primary shadow-glow mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
