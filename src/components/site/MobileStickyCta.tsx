import { MessageCircle, Rocket } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/918822821202?text=Hello%20LuitX%20Solutions%20%F0%9F%91%8B%F0%9F%8F%BB%20I%20need%20a%20website";

/** Mobile-only sticky bottom CTA bar — touch-friendly buttons. */
export function MobileStickyCta() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div className="glass rounded-2xl p-2 flex gap-2">
        <a
          href="#contact"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold bg-gradient-primary text-primary-foreground shadow-glow active:scale-95 transition-transform"
        >
          <Rocket className="h-4 w-4" />
          Get Started
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold bg-[#25D366] text-white active:scale-95 transition-transform"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
