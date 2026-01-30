/**
 * API request and response type definitions
 */

import { DatasetSchema } from './dataset'
import { ExecutionResult } from './execution'
import { Message, Session } from './session'

// API Response wrapper
export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
  requestId?: string
}

// Upload endpoints
export interface UploadResponse {
  schema: DatasetSchema
  message: string
}

// Query endpoints
export interface QueryRequest {
  sessionId: string
  query: string
}

export interface QueryResponse {
  plan: string[]
  result: ExecutionResult
  message: Message
}

// Session endpoints
export interface SessionListResponse {
  sessions: Session[]
  total: number
}

export interface SessionDetailResponse {
  session: Session
  messages: Message[]
}
