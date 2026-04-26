import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage, LANG_LABELS } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";
import logo from "@/assets/luitx-logo-new.webp";

const NAV_IDS = ["services", "about", "features", "contact"] as const;

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: { id: (typeof NAV_IDS)[number]; label: string }[] = [
    { id: "services", label: t.nav.services },
    { id: "about", label: t.nav.about },
    { id: "features", label: t.nav.features },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container">
        <nav
          className={`glass rounded-full px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "shadow-glow" : ""
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="relative h-11 w-11 rounded-xl grid place-items-center bg-background/60 ring-1 ring-primary/40 shadow-[0_0_18px_hsl(var(--primary)/0.35)] p-1.5 transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="LuitX logo" className="h-full w-full object-contain" decoding="async" />
            </span>
            <span className="font-display font-bold text-lg tracking-tight text-gradient">LuitX Solutions</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gradient-primary after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium hover:border-primary/60 transition-colors"
                aria-label="Change language"
              >
                <Globe className="h-3.5 w-3.5" />
                {LANG_LABELS[lang]}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 glass rounded-2xl p-1 min-w-[120px] animate-fade-up">
                  {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-primary/10 transition-colors ${
                        lang === l ? "text-primary" : ""
                      }`}
                    >
                      {LANG_LABELS[l]} · {l === "en" ? "English" : l === "hi" ? "हिंदी" : "অসমীয়া"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="#contact" className="hidden md:inline-flex btn-glow text-sm py-2 px-5">
              {t.nav.cta}
            </a>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden glass rounded-3xl mt-2 p-4 animate-fade-up">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="btn-glow mt-2 justify-center">
                {t.nav.cta}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
