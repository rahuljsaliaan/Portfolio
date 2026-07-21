import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { NavItem } from '@/data/types'
import { nav, sectionOrder, site } from '@/data/site'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useMagnetic } from '@/hooks/useMagnetic'
import { Z } from '@/lib/constants'
import { cn, scrollToSection } from '@/lib/utils'

function NavLink({ item, active, onSelect }: { item: NavItem; active: boolean; onSelect: () => void }) {
  const { ref, magneticProps, style } = useMagnetic<HTMLDivElement>(0.25)
  return (
    <m.div ref={ref} {...magneticProps} style={style} className="relative">
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? 'true' : undefined}
        className={cn(
          'relative px-3 py-2 font-sans text-sm transition-colors',
          active ? 'text-current-cyan' : 'text-drift-gray hover:text-foam-white',
        )}
      >
        {item.label}
        {active ? (
          <m.span
            layoutId="nav-underline"
            className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-current-cyan shadow-[0_0_8px_var(--color-current-cyan)]"
          />
        ) : null}
      </button>
    </m.div>
  )
}

export function Navbar() {
  const active = useActiveSection(sectionOrder)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0" style={{ zIndex: Z.nav }}>
      <div className="border-b border-current-cyan/10 bg-ocean-abyss/70 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="font-display text-lg font-bold tracking-tight text-foam-white"
          >
            {site.name}
            <span className="text-current-cyan">.</span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                active={active === item.id}
                onSelect={() => scrollToSection(item.id)}
              />
            ))}
          </div>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-current-cyan/20 text-foam-white md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" aria-hidden={true} /> : <Menu className="size-5" aria-hidden={true} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-b border-current-cyan/10 bg-ocean-abyss/95 backdrop-blur-lg md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
              {nav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    scrollToSection(item.id)
                    setMenuOpen(false)
                  }}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={cn(
                    'rounded-lg px-3 py-2 text-left font-sans text-sm transition-colors',
                    active === item.id
                      ? 'bg-current-cyan/5 text-current-cyan'
                      : 'text-drift-gray hover:text-foam-white',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
