/**
 * Lightweight decorative background — pure CSS, GPU-accelerated.
 * Removed cursor glow + floating snippets + heavy blur for performance.
 */
export function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute inset-0 grid-bg opacity-[0.18]" />
      <div
        className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[90px]"
        style={{ transform: "translateZ(0)" }}
      />
      <div
        className="absolute top-1/2 -right-40 h-[480px] w-[480px] rounded-full bg-primary-glow/10 blur-[110px]"
        style={{ transform: "translateZ(0)" }}
      />
    </div>
  );
}
