/** Static background. Heavy blurred orbs are hidden on mobile for zero-lag scroll. */
export function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute inset-0 grid-bg opacity-[0.10]" />
      <div className="hidden md:block absolute -top-32 -left-32 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[80px]" />
      <div className="hidden md:block absolute top-1/2 -right-32 h-[400px] w-[400px] rounded-full bg-primary-glow/[0.06] blur-[90px]" />
    </div>
  );
}
