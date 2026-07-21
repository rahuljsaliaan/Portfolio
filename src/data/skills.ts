import { Braces, BrainCircuit, Database, LayoutDashboard, Server, Workflow } from 'lucide-react'
import type { SkillCategory } from './types'

// NOTE: `level` values are illustrative and drive bar length only — no real
// proficiency metric is implied.
// TODO: calibrate proficiency levels to taste (or flip a category to display:'tags').
export const skillCategories: SkillCategory[] = [
  {
    id: 'agentic-ai',
    title: 'Agentic AI & LLM Systems',
    icon: BrainCircuit,
    display: 'bars',
    highlight: true,
    skills: [
      { name: 'Agent harness design', level: 92 },
      { name: 'LangChain', level: 88 },
      { name: 'LangGraph', level: 85 },
      { name: 'DSPy', level: 90 },
      { name: 'Prompt & pipeline engineering', level: 90 },
      { name: 'RAG & retrieval systems', level: 86 },
      { name: 'LLM eval & observability (Langfuse)', level: 82 },
      { name: 'Structured outputs (Pydantic/Zod)', level: 88 },
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    icon: Braces,
    display: 'bars',
    skills: [
      { name: 'TypeScript', level: 92 },
      { name: 'JavaScript', level: 90 },
      { name: 'Python', level: 90 },
      { name: 'Go', level: 78 },
      { name: 'Java', level: 72 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Architecture',
    icon: Server,
    display: 'tags',
    skills: [
      { name: 'Node.js' },
      { name: 'Express' },
      { name: 'FastAPI' },
      { name: 'Microservices' },
      { name: 'Event-driven (Kafka, NATS)' },
      { name: 'REST / RPC design' },
      { name: 'Design patterns' },
      { name: 'System design' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    icon: LayoutDashboard,
    display: 'tags',
    skills: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'Redux' },
      { name: 'Tailwind' },
      { name: 'D3' },
      { name: 'styled-components' },
    ],
  },
  {
    id: 'data-infra',
    title: 'Data & Infra',
    icon: Database,
    display: 'tags',
    skills: [
      { name: 'MongoDB' },
      { name: 'MySQL' },
      { name: 'Redis' },
      { name: 'Supabase' },
      { name: 'OpenSearch' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
    ],
  },
  {
    id: 'practices',
    title: 'Practices',
    icon: Workflow,
    display: 'tags',
    skills: [
      { name: 'DevOps' },
      { name: 'CI/CD' },
      { name: 'Schema-driven development' },
      { name: 'SDK design' },
    ],
  },
]
