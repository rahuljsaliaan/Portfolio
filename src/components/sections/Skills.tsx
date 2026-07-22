import { Section } from '@/components/layout/Section'
import { Card } from '@/components/ui/Card'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { TechGlyph } from '@/components/ui/TechGlyph'
import { LiveLanguages } from './LiveLanguages'
import { skillCategories } from '@/data/skills'
import type { Accent } from '@/data/types'
import { techIcon } from '@/lib/techIcons'
import { cn } from '@/lib/utils'

const ROTATION: Accent[] = ['teal', 'seafoam', 'violet', 'cyan']

function SkillChip({ name }: { name: string }) {
  const icon = techIcon(name)
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-current-cyan/15 bg-current-cyan/[0.05] px-2.5 py-1.5 font-mono text-xs text-foam-white/90 transition-colors hover:border-current-cyan/40 hover:bg-current-cyan/10">
      {icon ? (
        <TechGlyph icon={icon} className="size-3.5 shrink-0" />
      ) : (
        <span className="size-1.5 shrink-0 rounded-full bg-current-cyan/60" aria-hidden={true} />
      )}
      {name}
    </span>
  )
}

export function Skills() {
  return (
    <Section id="skills">
      <LiveLanguages />
      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => {
          const Icon = cat.icon
          const accent: Accent = cat.highlight ? 'cyan' : ROTATION[i % ROTATION.length]
          return (
            <StaggerItem key={cat.id} className={cn('h-full', cat.highlight && 'sm:col-span-2')}>
              <Card accent={accent} interactive className="h-full p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-current-cyan/20 bg-current-cyan/5 text-current-cyan">
                    <Icon className="size-5" aria-hidden={true} />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foam-white">{cat.title}</h3>
                  {cat.highlight ? (
                    <Tag variant="status" className="ml-auto">
                      core
                    </Tag>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <SkillChip key={skill.name} name={skill.name} />
                  ))}
                </div>
              </Card>
            </StaggerItem>
          )
        })}
      </Stagger>
    </Section>
  )
}
