import { Braces, BrainCircuit, Database, LayoutDashboard, Server, Workflow } from 'lucide-react'
import type { SkillCategory } from './types'

// Skills are shown as tags (breadth), never as proficiency bars — a portfolio
// should read as signal, not imply a ceiling.
export const skillCategories: SkillCategory[] = [
  {
    id: 'agentic-ai',
    title: 'Agentic AI & LLM Systems',
    icon: BrainCircuit,
    highlight: true,
    skills: [
      { name: 'Agent harness design' },
      { name: 'LangChain' },
      { name: 'LangGraph' },
      { name: 'DSPy' },
      { name: 'Prompt & pipeline engineering' },
      { name: 'RAG & retrieval systems' },
      { name: 'LLM eval & observability (Langfuse)' },
      { name: 'Structured outputs (Pydantic/Zod)' },
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    icon: Braces,
    skills: [
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Python' },
      { name: 'Go' },
      { name: 'Java' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Architecture',
    icon: Server,
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
    skills: [
      { name: 'DevOps' },
      { name: 'CI/CD' },
      { name: 'Schema-driven development' },
      { name: 'SDK design' },
    ],
  },
]
