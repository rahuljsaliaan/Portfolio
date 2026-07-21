import { useEffect, useState } from 'react'
import type { LanguageStat } from '@/data/types'
import { fallbackLanguages, wakatime } from '@/data/wakatime'

export type WakatimeStatus = 'loading' | 'live' | 'fallback'

interface ShareResponse {
  data?: Array<{ name?: string; percent?: number; color?: string }>
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
          .filter((d): d is { name: string; percent: number; color?: string } =>
            typeof d?.name === 'string' && typeof d?.percent === 'number',
          )
          .map((d) => ({ name: d.name, percent: d.percent, color: d.color }))
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
