import { useEffect, useState } from "react";
import { Rocket, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const WHATSAPP_URL =
  "https://wa.me/918822821202?text=Hello%20LuitX%20Solutions%20%F0%9F%91%8B%F0%9F%8F%BB%20I%20need%20a%20website";

function useTyping(words: readonly string[], speed = 70, pause = 1600) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx % words.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setWordIdx((i) => i + 1);
    } else {
      timeout = setTimeout(() => {
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        );
      }, deleting ? speed / 2 : speed);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIdx, words, speed, pause]);

  return text;
}

export function Hero() {
  const { t } = useLanguage();
  const typed = useTyping(t.hero.typing);

  return (
    <section id="top" className="relative pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-primary animate-fade-up">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-mono">{t.hero.tagline}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{t.hero.sub}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
              <span className="block text-foreground">{t.hero.titleParts[0]}</span>
              <span className="block min-h-[1.1em]">
                <span className="text-gradient-brand">{typed}</span>
                <span className="inline-block w-[3px] h-[0.9em] align-middle bg-primary ml-1 animate-blink" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: "200ms" }}>
              {t.hero.desc}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <a href="#contact" className="btn-glow group">
                <Rocket className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                {t.hero.ctaPrimary}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost-glow">
                <MessageCircle className="h-4 w-4" />
                {t.hero.ctaWhatsapp}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div className="flex -space-x-2">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-primary shadow-glow" />
                ))}
              </div>
              <span>Trusted by ambitious businesses worldwide</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      {/* Rotating glow rings */}
      <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin-slow" />
      <div className="absolute inset-6 rounded-full border border-primary-glow/20 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
      <div className="absolute inset-12 rounded-full border border-primary/10 animate-spin-slow" />

      {/* Center logo orb */}
      <div className="absolute inset-1/4 rounded-full glass grid place-items-center animate-pulse-glow">
        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
        <div className="relative text-center">
          <div className="text-5xl font-bold text-gradient-brand">L</div>
          <div className="text-xs font-mono text-muted-foreground tracking-widest mt-1">LUITX</div>
        </div>
      </div>

      {/* Floating tech tags */}
      <FloatingTag className="top-2 left-4" delay={0}>{"<html>"}</FloatingTag>
      <FloatingTag className="top-12 right-0" delay={0.5}>{"{ css }"}</FloatingTag>
      <FloatingTag className="bottom-12 left-0" delay={1}>{"() => js"}</FloatingTag>
      <FloatingTag className="bottom-2 right-8" delay={1.5}>{"<api/>"}</FloatingTag>
    </div>
  );
}

function FloatingTag({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`absolute glass rounded-xl px-3 py-1.5 font-mono text-xs text-primary shadow-glow ${className}`}
      style={{ animation: `float-slow 5s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
