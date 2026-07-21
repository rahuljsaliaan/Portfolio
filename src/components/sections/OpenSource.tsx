import { ArrowUpRight, ExternalLink, Star } from 'lucide-react'
import { GithubIcon } from '@/components/icons/BrandIcons'
import { Card } from '@/components/ui/Card'
import { openSource } from '@/data/projects'
import { useGithubRepos } from '@/hooks/useGithubRepos'

/** Secondary strip: live public repos from GitHub, each with Code + Live-demo links. */
export function OpenSource() {
  const { repos, status } = useGithubRepos()
  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-drift-gray">
          Also building in the open
        </h3>
        <a
          href={openSource.href}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-drift-gray transition-colors hover:text-current-cyan"
        >
          <GithubIcon className="size-4" />
          {openSource.handle}
        </a>
      </div>

      {status === 'loading' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-ocean-deep/40" aria-hidden={true} />
          ))}
        </div>
      ) : null}

      {status === 'ready' && repos.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <Card as="li" key={repo.id} accent="teal" interactive className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-sm text-foam-white">{repo.name}</span>
                {repo.stars > 0 ? (
                  <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-drift-gray">
                    <Star className="size-3" aria-hidden={true} />
                    {repo.stars}
                  </span>
                ) : null}
              </div>
              {repo.description ? (
                <p className="line-clamp-2 text-xs leading-relaxed text-drift-gray">
                  {repo.description}
                </p>
              ) : null}
              <div className="mt-auto flex items-center gap-3 pt-2">
                {repo.language ? (
                  <span className="font-mono text-[11px] text-drift-gray">{repo.language}</span>
                ) : null}
                <div className="ml-auto flex items-center gap-3">
                  {repo.homepage ? (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Live demo of ${repo.name}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-current-cyan transition-colors hover:text-foam-white"
                    >
                      Live <ExternalLink className="size-3" aria-hidden={true} />
                    </a>
                  ) : null}
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${repo.name} source on GitHub`}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-drift-gray transition-colors hover:text-foam-white"
                  >
                    Code <ArrowUpRight className="size-3" aria-hidden={true} />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
