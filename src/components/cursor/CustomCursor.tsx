import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { m, useMotionValue, useSpring } from 'framer-motion'
import { CURSOR, Z } from '@/lib/constants'
import { useEnv } from '@/hooks/useEnv'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label'

/** Glowing dot + trailing ring. Disabled on touch / reduced-motion (native cursor). */
export function CustomCursor() {
  const { isTouch, reducedMotion } = useEnv()
  const enabled = !isTouch && !reducedMotion

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: CURSOR.ringStiffness, damping: CURSOR.ringDamping })
  const ringY = useSpring(y, { stiffness: CURSOR.ringStiffness, damping: CURSOR.ringDamping })
  const dotX = useSpring(x, { stiffness: CURSOR.dotStiffness, damping: CURSOR.dotDamping })
  const dotY = useSpring(y, { stiffness: CURSOR.dotStiffness, damping: CURSOR.dotDamping })

  const [hovering, setHovering] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('cursor-none')

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
    }
    const onOver = (e: Event) => {
      const target = e.target as Element | null
      setHovering(Boolean(target?.closest?.(INTERACTIVE)))
    }
    const onLeave = () => setHidden(true)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.documentElement.classList.remove('cursor-none')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: Z.cursor }} aria-hidden={true}>
      <m.div
        className="fixed left-0 top-0 rounded-full border border-current-cyan"
        style={{
          x: ringX,
          y: ringY,
          width: CURSOR.ringSize,
          height: CURSOR.ringSize,
          marginLeft: -CURSOR.ringSize / 2,
          marginTop: -CURSOR.ringSize / 2,
        }}
        animate={{ scale: hovering ? 1.6 : 1, opacity: hidden ? 0 : hovering ? 1 : 0.6 }}
        transition={{ scale: { duration: 0.2 }, opacity: { duration: 0.2 } }}
      />
      <m.div
        className="fixed left-0 top-0 rounded-full bg-current-cyan shadow-[0_0_8px_var(--color-current-cyan)]"
        style={{
          x: dotX,
          y: dotY,
          width: CURSOR.dotSize,
          height: CURSOR.dotSize,
          marginLeft: -CURSOR.dotSize / 2,
          marginTop: -CURSOR.dotSize / 2,
        }}
        animate={{ opacity: hidden ? 0 : 1 }}
      />
    </div>,
    document.body,
  )
}
