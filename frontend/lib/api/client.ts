/**
 * API client for backend communication
 */

import { createClient } from '@/lib/supabase/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Get authentication token from Supabase session
 */
async function getAuthToken(): Promise<string | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('Not authenticated')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `API error: ${response.status}`)
  }

  return response.json()
}

// Session API
export interface CreateSessionRequest {
  dataset_schema?: any
}

export interface SessionResponse {
  id: string
  user_id: string
  created_at: string
  last_activity: string
  dataset_schema?: any
  is_active: boolean
}

export async function createSession(data: CreateSessionRequest = {}): Promise<SessionResponse> {
  return apiRequest<SessionResponse>('/api/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function listSessions(): Promise<SessionResponse[]> {
  return apiRequest<SessionResponse[]>('/api/sessions')
}

export async function getSession(sessionId: string): Promise<SessionResponse> {
  return apiRequest<SessionResponse>(`/api/sessions/${sessionId}`)
}

export interface Message {
  id: string
  role: string
  content: string
  created_at: string
}

export interface ExecutionLog {
  id: string
  query: string
  code: string
  success: boolean
  stdout: string | null
  stderr: string | null
  execution_time: number
  retry_count: number
  created_at: string
}

export interface RestoreSessionResponse {
  message: string
  session_id: string
  session: SessionResponse
  messages: Message[]
  execution_logs: ExecutionLog[]
}

export async function restoreSession(sessionId: string): Promise<RestoreSessionResponse> {
  return apiRequest(`/api/sessions/${sessionId}/restore`, {
    method: 'POST',
  })
}

export async function deleteSession(sessionId: string): Promise<{ message: string }> {
  return apiRequest(`/api/sessions/${sessionId}`, {
    method: 'DELETE',
  })
}

// Query API
export interface QueryRequest {
  query: string
  session_id: string
}

export interface ExecutionPlan {
  steps: string[]
  estimated_complexity: string
  required_libraries: string[]
}

export interface ProcessedResult {
  success: boolean
  code: string
  stdout: string
  stderr: string
  artifacts: Array<{
    type: string
    content: any
    metadata?: any
  }>
  execution_time: number
  retry_count?: number
}

export interface QueryResponse {
  plan: ExecutionPlan
  result: ProcessedResult
  session_id: string
}

export async function processQuery(data: QueryRequest): Promise<QueryResponse> {
  return apiRequest<QueryResponse>('/api/query', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Upload API
export interface UploadResponse {
  schema: any
  message: string
  filename: string
}

export async function uploadFile(file: File, sessionId?: string): Promise<UploadResponse> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('Not authenticated')
  }

  const formData = new FormData()
  formData.append('file', file)
  if (sessionId) {
    formData.append('session_id', sessionId)
  }

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `Upload failed: ${response.status}`)
  }

  return response.json()
}
