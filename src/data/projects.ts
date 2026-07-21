import type { Project } from './types'
import { externalLinks } from './site'

const CONFIDENTIAL = 'Confidential · professional work'

export const projects: Project[] = [
  {
    id: 'agentic-harness-sdk',
    title: 'Agentic AI Harness SDK',
    oneLiner:
      'An intent-driven agent orchestration framework: agents resolve goals through declarative intent definitions, with state-driven planning and resumable multi-turn workflows.',
    tags: ['TypeScript', 'Python', 'DSPy', 'LLM orchestration', 'SDK design'],
    badge: CONFIDENTIAL,
    accent: 'cyan',
    caseStudy: {
      challenge:
        'Teams re-implemented bespoke agent loops for every new workflow — brittle, hard to resume mid-run, and impossible to evaluate consistently across products.',
      approach:
        'Modeled each workflow as a declarative intent: a goal, the claims required to satisfy it, and the tools that can produce those claims. A state-driven planner resolves the intent step by step and can pause, accept injected facts, and resume without losing context.',
      architecture: [
        'Declarative intent + claim-graph core with typed subgoals',
        'Resumable state machine backed by durable checkpoints',
        'Pluggable tool / skill registry with schema-validated I/O',
        'Structured outputs enforced end to end (Pydantic / Zod)',
      ],
      impact: [
        // TODO: replace with real impact numbers
        { value: '60%', label: 'faster new-workflow build time' },
        { value: '5+', label: 'product teams onboarded' },
      ],
    },
  },
  {
    id: 'doc-extraction-pipeline',
    title: 'Intelligent Document Extraction Pipeline',
    oneLiner:
      'An LLM pipeline that extracts structured specifications from dense technical documents, with staged validation gates and vendor-notation normalization.',
    tags: ['Python', 'DSPy', 'OpenSearch', 'Pydantic', 'OCR'],
    badge: CONFIDENTIAL,
    accent: 'teal',
    caseStudy: {
      challenge:
        'Critical specifications were buried in thousands of inconsistent technical PDFs, using vendor-specific notation that broke naive extraction and made downstream automation unreliable.',
      approach:
        'Built a staged pipeline: OCR + layout recovery, retrieval-grounded extraction, then multi-gate validation that normalizes vendor notation and rejects low-confidence fields for review.',
      architecture: [
        'OCR + layout recovery front-end',
        'Retrieval-grounded extraction over OpenSearch',
        'Staged validation gates with confidence thresholds',
        'Vendor-notation normalization to a canonical schema',
      ],
      impact: [
        // TODO: replace with real impact numbers
        { value: '94%', label: 'extraction accuracy' },
        { value: '10K+', label: 'documents processed' },
      ],
    },
  },
  {
    id: 'event-driven-platform',
    title: 'Event-Driven Microservices Platform',
    oneLiner:
      'A scalable service architecture with message-driven communication and schema-first contracts between services.',
    tags: ['FastAPI', 'NATS / Kafka', 'Docker', 'Kubernetes'],
    badge: CONFIDENTIAL,
    accent: 'violet',
    caseStudy: {
      challenge:
        'A growing set of tightly-coupled services made every change risky and every deploy a coordination problem.',
      approach:
        'Decomposed the monolith into event-driven services communicating over a message bus, with schema-first contracts and independent deploy pipelines.',
      architecture: [
        'Message-driven services over NATS / Kafka',
        'Schema-first contracts with versioned events',
        'Containerized workloads on Kubernetes',
        'Independent CI/CD per service',
      ],
      impact: [
        // TODO: replace with real impact numbers
        { value: '15+', label: 'services in production' },
        { value: '3x', label: 'faster independent deploys' },
      ],
    },
  },
  {
    id: 'requirements-quality-engine',
    title: 'AI Requirements Quality Engine',
    oneLiner:
      'An LLM-based analysis system that gates engineering requirements through a multi-criteria well-formedness framework.',
    tags: ['DSPy', 'LLM evaluation', 'Langfuse'],
    badge: CONFIDENTIAL,
    accent: 'cyan',
    caseStudy: {
      challenge:
        'Ambiguous or incomplete requirements slipped into engineering, surfacing as expensive rework late in the cycle.',
      approach:
        'Built an evaluation engine that scores each requirement against a multi-criteria well-formedness rubric, explains failures, and gates progression — with full tracing for observability.',
      architecture: [
        'Multi-criteria well-formedness rubric',
        'LLM-as-judge scoring with structured rationales',
        'Langfuse tracing for evaluation observability',
        'Gate + feedback loop into the authoring flow',
      ],
      impact: [
        // TODO: replace with real impact numbers
        { value: '40%', label: 'fewer requirement defects downstream' },
        { value: '2x', label: 'faster review turnaround' },
      ],
    },
  },
]

/** Muted strip beneath the case studies. */
export const openSource = {
  label: 'Open-source & personal builds',
  handle: 'github.com/rahuljsaliaan',
  href: externalLinks.github,
}
