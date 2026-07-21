import { m, useScroll, useTransform } from 'framer-motion'
import { useEnv } from '@/hooks/useEnv'

/** Mid-depth decorative glows that drift slowly on scroll (behind all content). */
export function ParallaxBlobs() {
  const { reducedMotion } = useEnv()
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -160])
  const y2 = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, 120])

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden={true}
    >
      <m.div
        style={{ y: y1 }}
        className="absolute -left-32 top-[16%] h-96 w-96 rounded-full bg-nebula/8 blur-[120px]"
      />
      <m.div
        style={{ y: y2 }}
        className="absolute -right-24 top-[52%] h-[28rem] w-[28rem] rounded-full bg-biolume-teal/10 blur-[130px]"
      />
      <m.div
        style={{ y: y1 }}
        className="absolute left-[45%] top-[80%] h-72 w-72 rounded-full bg-jelly-violet/8 blur-[110px]"
      />
    </div>
  )
}
