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
      className="fixed bottom-24 md:bottom-6 right-5 z-50 h-14 w-14 rounded-full grid place-items-center bg-[#25D366] text-white shadow-[0_6px_20px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-110 wa-pulse"
    >
      <MessageCircle className="h-6 w-6" />
      <style>{`
        @keyframes wa-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.55);} 70% { box-shadow: 0 0 0 14px rgba(37,211,102,0);} 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0);} }
        .wa-pulse { animation: wa-pulse-ring 2.4s ease-out infinite; }
      `}</style>
    </a>
  );
}
