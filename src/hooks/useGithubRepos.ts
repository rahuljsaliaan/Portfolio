import { useEffect, useState } from 'react'
import { externalLinks } from '@/data/site'

export interface GithubRepo {
  id: number
  name: string
  description: string | null
  url: string
  homepage: string | null
  language: string | null
  stars: number
}

export type GithubStatus = 'loading' | 'ready' | 'error'

interface GithubApiRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  fork: boolean
  archived: boolean
}

const USERNAME = externalLinks.github.split('/').filter(Boolean).pop() ?? 'rahuljsaliaan'
const MAX_REPOS = 6

/**
 * Public GitHub repos for the secondary "open source" strip. Uses the public,
 * CORS-enabled API (no key). Repos with a live demo (homepage) are surfaced
 * first, then by stars. Fails soft — the profile link is always shown regardless.
 */
export function useGithubRepos() {
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [status, setStatus] = useState<GithubStatus>('loading')

  useEffect(() => {
    let cancelled = false
    fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub ${res.status}`)
        return res.json() as Promise<GithubApiRepo[]>
      })
      .then((data) => {
        if (cancelled) return
        const mapped = data
          .filter((r) => !r.fork && !r.archived)
          .map<GithubRepo>((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            url: r.html_url,
            homepage: r.homepage?.trim() ? r.homepage.trim() : null,
            language: r.language,
            stars: r.stargazers_count,
          }))
          .sort(
            (a, b) => Number(Boolean(b.homepage)) - Number(Boolean(a.homepage)) || b.stars - a.stars,
          )
          .slice(0, MAX_REPOS)
        setRepos(mapped)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { repos, status }
}
