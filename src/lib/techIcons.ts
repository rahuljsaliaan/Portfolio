import {
  siApachekafka,
  siDocker,
  siExpress,
  siFastapi,
  siGo,
  siJavascript,
  siKubernetes,
  siLangchain,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siOpensearch,
  siPython,
  siReact,
  siRedis,
  siRedux,
  siRust,
  siStyledcomponents,
  siSupabase,
  siTailwindcss,
  siTypescript,
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

// Maps a skill / language name (as written in the data) to its brand logo.
// Concept skills (system design, RAG, etc.) intentionally have none → dot fallback.
const TECH: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Python: siPython,
  Go: siGo,
  Java: siOpenjdk,
  React: siReact,
  'Next.js': siNextdotjs,
  Redux: siRedux,
  Tailwind: siTailwindcss,
  'styled-components': siStyledcomponents,
  'Node.js': siNodedotjs,
  Express: siExpress,
  FastAPI: siFastapi,
  'Event-driven (Kafka, NATS)': siApachekafka,
  MongoDB: siMongodb,
  MySQL: siMysql,
  Redis: siRedis,
  Supabase: siSupabase,
  OpenSearch: siOpensearch,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  LangChain: siLangchain,
  Rust: siRust,
}

export function techIcon(name: string): SimpleIcon | undefined {
  return TECH[name]
}
