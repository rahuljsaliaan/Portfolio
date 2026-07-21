import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** rendered if the WebGL scene throws (context loss, unsupported GL, runtime error) */
  fallback?: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * React.lazy/Suspense only catches *loading* failures — not runtime throws or a
 * failed/lost WebGL context. This boundary catches those and shows the fallback.
 */
export class SceneBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
