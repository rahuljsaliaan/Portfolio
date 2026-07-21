import type { RichText } from '@/data/types'
import { cn } from '@/lib/utils'

/** Renders data-defined prose with optional inline links (keeps markup out of data). */
export function RichTextView({ segments, className }: { segments: RichText; className?: string }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.href ? (
          <a
            key={i}
            href={seg.href}
            target={seg.external ? '_blank' : undefined}
            rel={seg.external ? 'noreferrer noopener' : undefined}
            className={cn(
              'text-current-cyan underline decoration-current-cyan/30 underline-offset-4 transition-colors hover:decoration-current-cyan',
              className,
            )}
          >
            {seg.text}
          </a>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  )
}
