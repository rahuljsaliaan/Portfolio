import { useEffect, useId, useRef } from 'react'
import { useAnimationFrame, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

const POINTS = 12

// Catmull-Rom through the points → one smooth closed cubic-bezier path (no corners).
function smoothClosedPath(pts: number[][]) {
  const n = pts.length
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`
  }
  return `${d}Z`
}

// A rounded-superellipse (fills the card) whose radius breathes per-point over time.
function blobPath(time: number, amp: number) {
  const c = 50
  const r = 45
  const exp = 4.2
  const pts: number[][] = []
  for (let i = 0; i < POINTS; i++) {
    const th = (i / POINTS) * Math.PI * 2
    const ct = Math.cos(th)
    const st = Math.sin(th)
    const ex = Math.sign(ct) * Math.pow(Math.abs(ct), 2 / exp)
    const ey = Math.sign(st) * Math.pow(Math.abs(st), 2 / exp)
    const wob = Math.sin(time * 0.8 + i * 1.3) + 0.5 * Math.cos(time * 0.55 + i * 2.1)
    const rr = 1 + (wob * amp) / 100
    pts.push([c + ex * r * rr, c + ey * r * rr])
  }
  return smoothClosedPath(pts)
}

/**
 * The card's surface: an always-morphing liquid blob (never a rectangle). Driven
 * by framer-motion's frameloop; the path is written straight to the DOM (no React
 * renders per frame) and only animates while on-screen. `active` (hover) makes the
 * liquid gather + wobble harder.
 */
export function LiquidBlob({
  active,
  interactive,
  reduced,
}: {
  active: boolean
  interactive: boolean
  reduced: boolean
}) {
  const gid = 'lb' + useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const inView = useInView(svgRef)
  const restAmp = interactive ? 1.8 : 2.4
  const ampRef = useRef(restAmp)
  const activeRef = useRef(active)
  useEffect(() => {
    activeRef.current = active
  }, [active])

  useAnimationFrame((time) => {
    if (reduced || !inView || !pathRef.current) return
    const target = activeRef.current ? 4 : restAmp
    ampRef.current += (target - ampRef.current) * 0.05
    pathRef.current.setAttribute('d', blobPath(time / 1000, ampRef.current))
  })

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden={true}
      className={cn(
        // larger than the panel + clipped by the card frame → reads as liquid
        // light flowing *inside* a crisp tech panel, not a free-form blob outline
        'pointer-events-none absolute -inset-[14%] -z-10 h-[128%] w-[128%] blur-[6px] transition-opacity duration-500',
        interactive ? 'opacity-35 group-hover:opacity-90' : 'opacity-60',
      )}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--panel-accent)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--panel-accent)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={blobPath(0, restAmp)}
        fill={`url(#${gid})`}
        stroke="var(--panel-accent)"
        strokeOpacity="0.35"
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
