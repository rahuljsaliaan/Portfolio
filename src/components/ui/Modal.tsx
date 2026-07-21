import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { EASE_OUT_EXPO, MOTION, Z } from '@/lib/constants'
import { useEnv } from '@/hooks/useEnv'
import { cn } from '@/lib/utils'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

function trapTab(e: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null,
  )
  if (nodes.length === 0) return
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id of the element that titles the dialog (for aria-labelledby) */
  labelledBy: string
  children: ReactNode
  className?: string
}

/**
 * Accessible dialog: focus trap, Esc to close, focus restored to the trigger,
 * background made `inert`, body scroll locked. Focus is restored on close-intent
 * (effect cleanup), not on unmount, so the exit animation never feels laggy.
 */
export function Modal({ open, onClose, labelledBy, children, className }: ModalProps) {
  const { reducedMotion } = useEnv()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement as HTMLElement | null
    const root = document.getElementById('root')
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPad = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    root?.setAttribute('inert', '')

    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 20)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'Tab') {
        trapTab(e, panelRef.current)
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPad
      root?.removeAttribute('inert')
      trigger?.focus?.()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open ? (
        <m.div
          className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-ocean-abyss/70 p-4 backdrop-blur-md sm:p-6"
          style={{ zIndex: Z.modal }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION.duration.fast }}
          onClick={onClose}
        >
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className={cn(
              'relative my-auto w-full max-w-2xl rounded-3xl border border-current-cyan/15 bg-ocean-mist p-6 shadow-2xl outline-none sm:p-8',
              className,
            )}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: MOTION.duration.fast, ease: EASE_OUT_EXPO }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-current-cyan/20 text-drift-gray transition-colors hover:border-current-cyan/50 hover:text-current-cyan"
            >
              <X className="size-4" aria-hidden={true} />
            </button>
            {children}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
