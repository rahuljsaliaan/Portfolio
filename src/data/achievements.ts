import { Cpu, Medal, TrendingUp } from 'lucide-react'
import type { AchievementChip, Stat } from './types'

export const stats: Stat[] = [
  { value: 3, label: 'years of engineering experience', real: true },
  // TODO: replace with real numbers
  { value: 10, suffix: '+', label: 'AI pipelines & agent workflows shipped' },
  { value: 15, suffix: '+', label: 'microservices designed & deployed' },
  { value: 34, label: 'public repositories' },
]

export const achievementChips: AchievementChip[] = [
  { label: 'Promoted to SDE 2 (Jul 2026)', icon: TrendingUp, real: true },
  // real in substance — refine wording
  { label: 'Leads AI harness architecture at Auxify', icon: Cpu, real: true },
  { label: 'Hackathon finalist', icon: Medal, real: true },
]
