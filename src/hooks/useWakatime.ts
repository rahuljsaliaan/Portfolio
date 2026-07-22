import { useEffect, useState } from 'react'
import type { LanguageStat } from '@/data/types'
import { fallbackLanguages, wakatime } from '@/data/wakatime'

export type WakatimeStatus = 'loading' | 'live' | 'fallback'

interface ShareResponse {
  data?: Array<{ name?: string; total_seconds?: number; hours?: number; color?: string }>
}

const MAX_LANGUAGES = 6

/**
 * Fetches live language stats from a public WakaTime embed JSON URL.
 * Falls back to the curated list when no URL is configured or the fetch fails
 * (e.g. CORS / offline) — the UI always has something to show.
 */
export function useWakatime() {
  const [languages, setLanguages] = useState<LanguageStat[]>(fallbackLanguages)
  const [status, setStatus] = useState<WakatimeStatus>(wakatime.shareUrl ? 'loading' : 'fallback')

  useEffect(() => {
    if (!wakatime.shareUrl) return
    let cancelled = false

    fetch(wakatime.shareUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`WakaTime ${res.status}`)
        return res.json() as Promise<ShareResponse>
      })
      .then((json) => {
        const langs = (json.data ?? [])
          .filter((d): d is { name: string; total_seconds?: number; hours?: number; color?: string } =>
            typeof d?.name === 'string',
          )
          .map((d) => ({
            name: d.name,
            hours:
              typeof d.total_seconds === 'number'
                ? Math.round(d.total_seconds / 3600)
                : typeof d.hours === 'number'
                  ? Math.round(d.hours)
                  : 0,
            color: typeof d.color === 'string' ? d.color : undefined,
          }))
          .filter((l) => l.hours > 0)
          .sort((a, b) => b.hours - a.hours)
          .slice(0, MAX_LANGUAGES)
        if (cancelled) return
        if (langs.length) {
          setLanguages(langs)
          setStatus('live')
        } else {
          setStatus('fallback')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('fallback')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { languages, status }
}
