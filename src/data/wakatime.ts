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
// TODO: these hour counts are placeholders — real numbers come from WakaTime.
export const fallbackLanguages: LanguageStat[] = [
  { name: 'TypeScript', hours: 132, color: '#38F2E5' },
  { name: 'Python', hours: 98, color: '#5EF2C9' },
  { name: 'JavaScript', hours: 61, color: '#B388FF' },
  { name: 'Go', hours: 46, color: '#00BFA5' },
  { name: 'Java', hours: 24, color: '#FF6BD6' },
  { name: 'Rust', hours: 12, color: '#CFE6FF' },
]
