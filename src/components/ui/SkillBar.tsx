import { m } from 'framer-motion'
import { useEnv } from '@/hooks/useEnv'
import { EASE_OUT_EXPO } from '@/lib/constants'

const BAR_FILL =
  'h-full rounded-full bg-gradient-to-r from-biolume-teal to-current-cyan shadow-[0_0_12px_var(--color-current-cyan)]'

/** Proficiency bar that grows + glows when scrolled into view. */
export function SkillBar({ name, level }: { name: string; level: number }) {
  const { reducedMotion } = useEnv()
  return (
    <div>
      <div className="mb-1.5 font-mono text-xs text-foam-white/85">{name}</div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ocean-mist">
        {reducedMotion ? (
          <div className={BAR_FILL} style={{ width: `${level}%` }} />
        ) : (
          <m.div
            className={BAR_FILL}
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          />
        )}
      </div>
    </div>
  )
}
