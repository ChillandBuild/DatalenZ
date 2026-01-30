/**
 * Session-related type definitions
 */

import { DatasetSchema } from './dataset'
import { Artifact } from './execution'

export interface Session {
  id: string
  userId: string
  createdAt: Date
  lastActivity: Date
  messages: Message[]
  datasetSchema?: DatasetSchema
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  artifacts?: Artifact[]
}

export interface SessionCreate {
  userId: string
}

export interface SessionUpdate {
  datasetSchema?: DatasetSchema
  isActive?: boolean
}
