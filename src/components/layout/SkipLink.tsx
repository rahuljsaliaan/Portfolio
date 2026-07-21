/** Keyboard-first "skip to content" link — visually hidden until focused. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-full font-mono text-sm text-ocean-abyss focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[70] focus-visible:bg-current-cyan focus-visible:px-4 focus-visible:py-2"
    >
      Skip to content
    </a>
  )
}
