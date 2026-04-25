import { useState } from "react";
import { Phone, Mail, Send, MessageCircle, MapPin } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { Reveal } from "./Reveal";

const WHATSAPP_URL =
  "https://wa.me/918822821202?text=Hello%20LuitX%20Solutions%20%F0%9F%91%8B%F0%9F%8F%BB%20I%20need%20a%20website";

const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(80),
  email: z.string().trim().email("Invalid email").max(160),
  phone: z.string().trim().min(6, "Invalid phone").max(20),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

export function Contact() {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    // Frontend-only for now (admin/backend coming next iteration)
    setTimeout(() => {
      toast.success(t.contact.success);
      form.reset();
      setSubmitting(false);
    }, 700);
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono text-primary mb-4">
            04 — CONTACT
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{t.contact.title}</h2>
          <p className="text-muted-foreground text-lg">{t.contact.subtitle}</p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-8">
          <Reveal className="lg:col-span-2 space-y-4">
            <ContactCard icon={Phone} label={t.contact.phoneLabel} value="+91 88228 21202" href="tel:+918822821202" />
            <ContactCard icon={Mail} label={t.contact.emailLabel} value="hello@luitx.com" href="mailto:hello@luitx.com" />
            <ContactCard icon={MessageCircle} label="WhatsApp" value="Chat instantly" href={WHATSAPP_URL} external />
            <ContactCard icon={MapPin} label="Based in" value="Assam, India" />
          </Reveal>

          <Reveal delay={120} className="lg:col-span-3">
            <form onSubmit={onSubmit} className="glass-card p-6 md:p-8 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="name" label={t.contact.name} />
                <Field name="email" label={t.contact.email} type="email" />
              </div>
              <Field name="phone" label={t.contact.phone} type="tel" />
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{t.contact.message}</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="mt-1.5 w-full bg-input/50 border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all resize-none"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-glow w-full disabled:opacity-60">
                <Send className="h-4 w-4" />
                {submitting ? "..." : t.contact.send}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required
        className="mt-1.5 w-full bg-input/50 border border-border rounded-2xl px-4 py-3 outline-none focus:border-primary focus:shadow-glow transition-all"
      />
    </div>
  );
}

function ContactCard({
  icon: Icon, label, value, href, external,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; href?: string; external?: boolean;
}) {
  const inner = (
    <div className="glass-card group p-5 flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-semibold group-hover:text-gradient transition-all">{value}</div>
      </div>
    </div>
  );
  if (!href) return inner;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <a href={href}>{inner}</a>
  );
}
