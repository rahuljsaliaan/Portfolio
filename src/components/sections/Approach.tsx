import { Section } from '@/components/layout/Section'
import { Card } from '@/components/ui/Card'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { principles } from '@/data/approach'
import type { Accent } from '@/data/types'

const ACCENTS: Accent[] = ['violet', 'cyan', 'teal', 'seafoam']

export function Approach() {
  return (
    <Section id="approach">
      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {principles.map((principle, i) => {
          const Icon = principle.icon
          return (
            <StaggerItem key={principle.title} className="h-full">
              <Card accent={ACCENTS[i % ACCENTS.length]} interactive className="h-full p-6">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-current-cyan/20 bg-current-cyan/5 text-current-cyan">
                  <Icon className="size-5" aria-hidden={true} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foam-white">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-drift-gray">{principle.body}</p>
              </Card>
            </StaggerItem>
          )
        })}
      </Stagger>
    </Section>
  )
}
