import { contact } from '@/data/contact'

export function Footer() {
  return (
    <footer className="border-t border-current-cyan/10 py-8">
      <p className="mx-auto max-w-6xl px-6 text-center font-mono text-xs text-drift-gray">
        {contact.footer}
      </p>
    </footer>
  )
}
