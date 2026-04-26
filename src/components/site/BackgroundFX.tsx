/**
 * Static, lightweight background. No animations — GPU-friendly.
 */
export function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute inset-0 grid-bg opacity-[0.12]" />
      <div className="absolute -top-32 -left-32 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute top-1/2 -right-32 h-[400px] w-[400px] rounded-full bg-primary-glow/[0.06] blur-[90px]" />
    </div>
  );
}
