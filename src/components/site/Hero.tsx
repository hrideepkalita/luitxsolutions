import { useEffect, useState } from "react";
import { ArrowBigRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/luitx-logo-new.webp";

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
    <section id="top" className="relative pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-28 overflow-hidden">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="font-bold leading-[1.05] tracking-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
              <span className="block text-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-semibold mb-4 md:mb-6">{t.hero.titleParts[0]}</span>
              <span
                className="block overflow-hidden leading-[1.1] text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ minHeight: "2.2em" }}
                aria-live="polite"
              >
                <span className="text-gradient-brand">{typed}</span>
                <span className="inline-block w-[3px] h-[0.9em] align-middle bg-primary ml-1 animate-blink" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: "200ms" }}>
              {t.hero.desc}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <a href="#contact" className="btn-glow group">
                <ArrowBigRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                {t.hero.ctaPrimary}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost-glow">
                <ArrowBigRight className="h-4 w-4" />
                {t.hero.ctaWhatsapp}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div className="flex -space-x-2">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-primary shadow-glow" />
                ))}
              </div>
              <span>Trusted by ambitious businesses locally</span>
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
      {/* Single soft glow ring */}
      <div className="absolute inset-0 rounded-3xl border border-primary/30" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-primary opacity-10 blur-2xl" />

      {/* Logo card */}
      <div className="absolute inset-[10%] rounded-3xl glass grid place-items-center p-8 shadow-glow">
        <img
          src={logo}
          alt="LuitX — Build. Automate. Grow."
          decoding="async"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 2 minimal floating tags (CSS only) */}
      <FloatingTag className="-top-2 left-6">{"</>"}</FloatingTag>
      <FloatingTag className="-bottom-2 right-6">{"{ js }"}</FloatingTag>
    </div>
  );
}

function FloatingTag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute glass rounded-xl px-3 py-1.5 font-mono text-xs text-primary ${className}`}>
      {children}
    </div>
  );
}
