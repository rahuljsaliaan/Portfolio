import { useContext } from 'react'
import { EnvContext } from '@/providers/env-context'

export function useEnv() {
  const ctx = useContext(EnvContext)
  if (!ctx) throw new Error('useEnv must be used within <EnvProvider>')
  return ctx
}
