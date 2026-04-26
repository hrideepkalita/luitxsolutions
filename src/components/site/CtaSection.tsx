import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Reveal } from "./Reveal";

const WHATSAPP_URL =
  "https://wa.me/918822821202?text=Hello%20LuitX%20Solutions%20%F0%9F%91%8B%F0%9F%8F%BB%20I%20need%20a%20website";

export function CtaSection() {
  const { t } = useLanguage();
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <Reveal>
          <div className="relative glass-card p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-primary-glow/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient">{t.cta.title}</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">{t.cta.desc}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#contact" className="btn-glow group">
                  {t.cta.contact}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost-glow">
                  <MessageCircle className="h-4 w-4" />
                  {t.cta.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
