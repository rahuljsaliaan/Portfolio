import type { SimpleIcon } from 'simple-icons'

/** A brand logo, tinted toward foam-white so dark brand colours stay visible on the ocean. */
export function TechGlyph({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden={true}
      style={{ fill: `color-mix(in srgb, #${icon.hex} 62%, var(--color-foam-white) 38%)` }}
    >
      <path d={icon.path} />
    </svg>
  )
}
