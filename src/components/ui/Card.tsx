import type { HTMLAttributes, ReactNode } from 'react'
import type { Accent } from '@/data/types'
import { cardClasses } from './cardClasses'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  accent?: Accent
  interactive?: boolean
}

export function Card({ children, accent = 'cyan', interactive = false, className, ...rest }: CardProps) {
  return (
    <div className={cn(cardClasses(accent, interactive), className)} {...rest}>
      {children}
    </div>
  )
}
