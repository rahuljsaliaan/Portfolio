import { useEffect, useState } from 'react'
import type { SectionId } from '@/data/types'

/**
 * Scroll-spy: returns the id of the section occupying the middle band of the
 * viewport. `ids` must be a stable array reference (e.g. the `sectionOrder` const).
 */
export function useActiveSection(ids: SectionId[]): SectionId {
  const [active, setActive] = useState<SectionId>(ids[0])

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (top) setActive(top.target.id as SectionId)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
