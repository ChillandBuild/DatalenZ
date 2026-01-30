/**
 * Execution-related type definitions
 */

export interface ExecutionPlan {
  steps: string[]
  estimatedComplexity: string
  requiredLibraries: string[]
}

export interface Artifact {
  type: 'code' | 'chart' | 'table' | 'error'
  content: string | Record<string, any>
  metadata?: Record<string, any>
}

export interface ExecutionResult {
  success: boolean
  code: string
  stdout: string
  stderr: string
  artifacts: Artifact[]
  executionTime: number
  retryCount?: number
}

export interface ErrorAnalysis {
  errorType: string
  errorMessage: string
  rootCause: string
  suggestedFix: string
}
