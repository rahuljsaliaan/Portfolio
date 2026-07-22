import { ArrowUp } from 'lucide-react'
import { contact } from '@/data/contact'
import { scrollToSection } from '@/lib/utils'

export function Footer() {
  return (
    <footer className="border-t border-current-cyan/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="group inline-flex items-center gap-2 font-mono text-xs text-drift-gray transition-colors hover:text-current-cyan"
        >
          <ArrowUp
            className="size-3.5 transition-transform group-hover:-translate-y-0.5"
            aria-hidden={true}
          />
          Back to the surface
        </button>
        <p className="font-mono text-xs text-drift-gray">{contact.footer}</p>
      </div>
    </footer>
  )
}
