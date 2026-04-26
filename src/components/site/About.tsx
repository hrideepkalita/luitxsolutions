import { useLanguage } from "@/i18n/LanguageContext";
import { Reveal } from "./Reveal";
import owner from "@/assets/owner.webp";

export function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="container grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <OwnerPortrait caption={t.owner.caption} />
        </Reveal>

        <Reveal delay={120}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-primary mb-5">
            About LuitX
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 text-gradient leading-tight">
            {t.owner.caption}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            {t.about.body}
          </p>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { v: "₹", l: "Affordable Pricing" },
              { v: "24/7", l: "Support" },
              { v: "5★", l: "Rated" },
            ].map((s) => (
              <div key={s.l} className="glass-card p-4 md:p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient-brand">{s.v}</div>
                <div className="text-[11px] md:text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OwnerPortrait({ caption }: { caption: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-72 w-72 md:h-80 md:w-80">
        {/* Soft static glow (no heavy animation) */}
        <div className="absolute inset-0 rounded-full bg-gradient-primary blur-3xl opacity-25" />
        <div className="absolute inset-0 rounded-full border border-primary/40" />
        <div className="absolute inset-3 rounded-full border border-primary-glow/25" />
        <div className="absolute inset-6 rounded-full glass glow-ring overflow-hidden bg-background/40">
          <img
            src={owner}
            alt="LuitX founder portrait"
            decoding="async"
            decoding="async"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
      <p className="sr-only">{caption}</p>
    </div>
  );
}
