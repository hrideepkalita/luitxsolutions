import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/918822821202?text=Hello%20LuitX%20Solutions%20%F0%9F%91%8B%F0%9F%8F%BB%20I%20need%20a%20website";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full grid place-items-center bg-[#25D366] text-white shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-transform animate-pulse-glow"
      style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-300 animate-ping" />
    </a>
  );
}
