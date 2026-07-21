/** Static, GPU-free stand-in shown under reduced-motion, no-WebGL, or while lazy-loading. */
export function SceneFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden={true}>
      <div className="absolute inset-0 rounded-full bg-current-cyan/10 blur-3xl" />
      <div className="size-28 rounded-full border border-current-cyan/30 shadow-[0_0_40px_-8px_var(--color-current-cyan)] sm:size-36" />
    </div>
  )
}
