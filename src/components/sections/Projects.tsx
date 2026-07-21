import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { cardClasses } from '@/components/ui/cardClasses'
import { Stagger, StaggerItem } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { ProjectModal } from './ProjectModal'
import { OpenSource } from './OpenSource'
import { projects } from '@/data/projects'
import type { Project } from '@/data/types'
import { cn } from '@/lib/utils'

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null)

  return (
    <Section id="projects">
      <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <StaggerItem key={project.id} className="h-full">
            <button
              type="button"
              onClick={() => setOpen(project)}
              aria-haspopup="dialog"
              className={cn(
                cardClasses(project.accent, true),
                'group flex h-full w-full flex-col items-start p-6 text-left',
              )}
            >
              <div className="mb-4 flex w-full items-start justify-between gap-3">
                <Tag variant="chip">{project.badge}</Tag>
                <ArrowUpRight
                  aria-hidden={true}
                  className="size-5 shrink-0 text-drift-gray transition-colors group-hover:text-current-cyan"
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-foam-white">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-drift-gray">{project.oneLiner}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <span className="mt-5 font-mono text-xs text-current-cyan">Read case study →</span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <OpenSource />

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </Section>
  )
}
