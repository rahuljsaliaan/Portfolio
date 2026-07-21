import { Section } from '@/components/layout/Section'
import { Card } from '@/components/ui/Card'
import { SkillBar } from '@/components/ui/SkillBar'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { skillCategories } from '@/data/skills'
import type { Accent } from '@/data/types'
import { cn } from '@/lib/utils'

const ROTATION: Accent[] = ['teal', 'violet', 'cyan']

export function Skills() {
  return (
    <Section id="skills">
      <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => {
          const Icon = cat.icon
          const accent: Accent = cat.highlight ? 'cyan' : ROTATION[i % ROTATION.length]
          return (
            <StaggerItem
              key={cat.id}
              className={cn('h-full', cat.highlight && 'sm:col-span-2')}
            >
              <Card
                accent={accent}
                interactive
                className={cn(
                  'h-full p-6',
                  cat.highlight && 'shadow-[0_0_50px_-20px_var(--color-current-cyan)]',
                )}
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-current-cyan/20 bg-current-cyan/5 text-current-cyan">
                    <Icon className="size-5" aria-hidden={true} />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foam-white">
                    {cat.title}
                  </h3>
                  {cat.highlight ? (
                    <Tag variant="status" className="ml-auto">
                      core
                    </Tag>
                  ) : null}
                </div>

                {cat.display === 'bars' ? (
                  <div
                    className={cn(
                      'grid gap-x-8 gap-y-3',
                      cat.highlight && 'sm:grid-cols-2',
                    )}
                  >
                    {cat.skills.map((skill) => (
                      <SkillBar key={skill.name} name={skill.name} level={skill.level ?? 0} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <Tag key={skill.name}>{skill.name}</Tag>
                    ))}
                  </div>
                )}
              </Card>
            </StaggerItem>
          )
        })}
      </Stagger>
    </Section>
  )
}
