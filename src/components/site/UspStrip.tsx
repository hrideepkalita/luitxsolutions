import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Reveal } from "./Reveal";

export function UspStrip() {
  const { t } = useLanguage();
  return (
    <section className="relative py-12 border-y border-border/40 bg-secondary/20">
      <div className="container">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {t.usp.map((u) => (
              <div key={u} className="flex items-center gap-2.5 group">
                <span className="grid place-items-center h-7 w-7 rounded-full bg-gradient-primary shadow-glow group-hover:scale-110 transition-transform">
                  <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                </span>
                <span className="font-medium text-sm md:text-base">{u}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
