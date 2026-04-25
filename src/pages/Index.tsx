import { useEffect } from "react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { BackgroundFX } from "@/components/site/BackgroundFX";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { UspStrip } from "@/components/site/UspStrip";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { Contact } from "@/components/site/Contact";
import { CtaSection } from "@/components/site/CtaSection";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

const Index = () => {
  useEffect(() => {
    document.title = "LuitX — Build. Automate. Grow. | Web Development & Automation Agency, Assam";

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", "LuitX is a digital agency in Assam building high-converting websites, landing pages, automation, and digital marketing solutions for businesses worldwide.");
    setMeta("keywords", "website development Assam, web design Guwahati, affordable website India, business website builder, digital agency Assam, automation solutions India");
    setMeta("og:title", "LuitX — Build. Automate. Grow.", "property");
    setMeta("og:description", "Premium websites, landing pages & automation. From Assam, For The World.", "property");
    setMeta("og:type", "website", "property");

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/";

    // JSON-LD
    const ldId = "luitx-jsonld";
    document.getElementById(ldId)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = ldId;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "LuitX",
      description: "Digital agency for website development, automation, and growth.",
      url: window.location.origin,
      telephone: "+91-8822821202",
      address: { "@type": "PostalAddress", addressRegion: "Assam", addressCountry: "IN" },
      sameAs: [],
      slogan: "Build. Automate. Grow.",
    });
    document.head.appendChild(script);
  }, []);

  return (
    <LanguageProvider>
      <ScrollProgress />
      <BackgroundFX />
      <Navbar />
      <main>
        <Hero />
        <UspStrip />
        <Services />
        <About />
        <Features />
        <CtaSection />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </LanguageProvider>
  );
};

export default Index;
