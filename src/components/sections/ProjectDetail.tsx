import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { Tag } from '@/components/ui/Tag'
import type { Project } from '@/data/types'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.2em] text-current-cyan">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-drift-gray">{children}</p>
    </div>
  )
}

/** Deep-dive body — lazy-loaded (code-split) and mounted inside the Modal shell. */
export function ProjectDetail({ project }: { project: Project }) {
  const cs = project.caseStudy
  return (
    <div className="max-h-[74vh] overflow-y-auto pr-1">
      <Tag variant="chip" icon={Lock}>
        {project.badge}
      </Tag>
      <h2
        id="project-modal-title"
        className="mt-4 pr-8 font-display text-2xl font-bold text-foam-white sm:text-3xl"
      >
        {project.title}
      </h2>
      <p className="mt-2 text-drift-gray">{project.oneLiner}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        <Field label="Challenge">{cs.challenge}</Field>
        <Field label="Approach">{cs.approach}</Field>
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-current-cyan">
            Architecture highlights
          </p>
          <ul className="space-y-2">
            {cs.architecture.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-drift-gray">
                <span
                  aria-hidden={true}
                  className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-current-cyan"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-current-cyan/10 pt-6">
        {cs.impact.map((stat, i) => (
          <div key={i}>
            <div className="font-mono text-2xl font-bold text-current-cyan text-glow-cyan sm:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-drift-gray">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
