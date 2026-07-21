import { lazy, Suspense, useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import type { Project } from '@/data/types'

// Code-split: the deep-dive body only loads when a card is first opened.
const ProjectDetail = lazy(() =>
  import('./ProjectDetail').then((m) => ({ default: m.ProjectDetail })),
)

function DetailFallback() {
  return (
    <div className="space-y-4" aria-hidden={true}>
      <div className="h-4 w-40 animate-pulse rounded bg-ocean-abyss/70" />
      <div className="h-8 w-3/4 animate-pulse rounded bg-ocean-abyss/70" />
      <div className="h-24 w-full animate-pulse rounded bg-ocean-abyss/70" />
    </div>
  )
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  // Retain the last project through the close animation so content doesn't pop out.
  const [shown, setShown] = useState<Project | null>(project)
  useEffect(() => {
    if (project) setShown(project)
  }, [project])

  return (
    <Modal open={project !== null} onClose={onClose} labelledBy="project-modal-title">
      <Suspense fallback={<DetailFallback />}>
        {shown ? <ProjectDetail project={shown} /> : null}
      </Suspense>
    </Modal>
  )
}
