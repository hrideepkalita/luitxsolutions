import { useEffect, useRef } from "react";

/**
 * Floating low-opacity code snippets + animated grid + cursor glow.
 * Decorative only — pointer-events-none so it doesn't block UI.
 */
const SNIPPETS = [
  "<div class=\"hero\">",
  "const grow = () => future;",
  "background: linear-gradient(135deg, blue, cyan);",
  "<html lang=\"en\">",
  "function automate() {}",
  "{ display: 'flex', gap: 24 }",
  "<Button>Build</Button>",
  ".glow { filter: blur(40px); }",
  "export default LuitX;",
  "@keyframes float { 50% { y: -20px } }",
  "useEffect(() => grow(), []);",
  "<meta name=\"viewport\" />",
];

export function BackgroundFX() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      <div className="cursor-glow" ref={glowRef} aria-hidden />
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute inset-0 grid-bg animate-drift opacity-40" />
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/2 -right-32 h-[600px] w-[600px] rounded-full bg-primary-glow/15 blur-[140px] animate-pulse-glow" />
        {SNIPPETS.map((s, i) => (
          <span
            key={i}
            className="absolute font-mono text-xs md:text-sm text-primary/20 whitespace-nowrap select-none"
            style={{
              left: `${(i * 53) % 95}%`,
              top: `${(i * 37) % 90}%`,
              animation: `${i % 2 ? "float-medium" : "float-slow"} ${6 + (i % 5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </>
  );
}
