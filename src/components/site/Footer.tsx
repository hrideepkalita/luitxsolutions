import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/luitx-logo-new.jpg";

export function Footer() {
  const { t } = useLanguage();
  const links = [
    { id: "services", label: t.nav.services },
    { id: "about", label: t.nav.about },
    { id: "features", label: t.nav.features },
    { id: "contact", label: t.nav.contact },
  ];
  return (
    <footer className="relative border-t border-border/40 mt-12">
      <div className="container py-14 text-left">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="relative h-10 w-10 rounded-xl overflow-hidden ring-1 ring-primary/40 shadow-glow">
                <img src={logo} alt="LuitX logo" className="h-full w-full object-cover scale-[1.6] border-8" />
              </span>
              <span className="font-bold text-lg text-gradient">LuitX Solutions</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-justify">Build. Automate. Grow. <br />Made with ❤️by LuitX Solutions</p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="glass h-10 w-10 rounded-full grid place-items-center hover:border-primary/60 hover:shadow-glow transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm font-mono uppercase tracking-wider text-muted-foreground">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-muted-foreground hover:text-primary transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm font-mono uppercase tracking-wider text-muted-foreground">{t.footer.contact}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="tel:+918822821202" className="hover:text-primary transition-colors">+91 88228 21202</a></li>
              <li><a href="mailto:rangiavlog@gmail.com" className="hover:text-primary transition-colors">rangiavlog@gmail.com</a></li>
              <li>Assam, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
