import type { LanguageStat } from './types'

export const wakatime = {
  username: 'rahuljsaliaan',
  // TODO: paste your PUBLIC WakaTime "Languages" embed JSON URL to go live.
  // Get it at wakatime.com → your Languages chart → "Embed" → JSON, e.g.
  //   https://wakatime.com/share/@rahuljsaliaan/xxxxxxxx-xxxx-xxxx-xxxx.json
  // and enable "Display languages publicly" in WakaTime profile settings.
  // Leave '' to use the curated fallback below.
  shareUrl: '',
} as const

// Illustrative fallback shown until shareUrl is set (or if the fetch is blocked).
// TODO: these percentages are placeholders.
export const fallbackLanguages: LanguageStat[] = [
  { name: 'TypeScript', percent: 34 },
  { name: 'Python', percent: 27 },
  { name: 'Go', percent: 15 },
  { name: 'JavaScript', percent: 12 },
  { name: 'Java', percent: 7 },
  { name: 'Other', percent: 5 },
]
