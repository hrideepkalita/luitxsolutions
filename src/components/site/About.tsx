import { useLanguage } from "@/i18n/LanguageContext";
import { Reveal } from "./Reveal";

export function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-primary mb-6">
            02 — ABOUT
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">{t.about.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{t.about.body}</p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { v: "100+", l: "Projects" },
              { v: "24/7", l: "Support" },
              { v: "5★", l: "Rated" },
            ].map((s) => (
              <div key={s.l} className="glass-card p-5 text-center">
                <div className="text-3xl font-bold text-gradient-brand">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <OwnerMonogram caption={t.owner.caption} />
        </Reveal>
      </div>
    </section>
  );
}

function OwnerMonogram({ caption }: { caption: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-72 w-72 md:h-80 md:w-80">
        <div className="absolute inset-0 rounded-full bg-gradient-primary blur-3xl opacity-30 animate-pulse-glow" />
        <div className="absolute inset-0 rounded-full border border-primary/40 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full border border-primary-glow/30 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "25s" }} />
        <div className="absolute inset-10 rounded-full glass glow-ring grid place-items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="relative text-center">
            <div className="text-7xl font-bold text-gradient-brand">LX</div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mt-2">FOUNDER</div>
          </div>
        </div>
      </div>
      <p className="mt-8 italic text-center text-muted-foreground max-w-xs">"{caption}"</p>
    </div>
  );
}
