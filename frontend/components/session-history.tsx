'use client'

import { useState, useEffect } from 'react'
import { Clock, Trash2, FolderOpen, Loader2 } from 'lucide-react'
import { listSessions, deleteSession, SessionResponse } from '@/lib/api/client'

interface SessionHistoryProps {
  onSelectSession: (sessionId: string) => void
  currentSessionId: string | null
}

export function SessionHistory({ onSelectSession, currentSessionId }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<SessionResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await listSessions()
      // Sort by last activity, most recent first
      const sorted = data.sort((a, b) => 
        new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
      )
      setSessions(sorted)
    } catch (err) {
      console.error('Failed to load sessions:', err)
      setError(err instanceof Error ? err.message : 'Failed to load sessions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent session selection
    
    if (!confirm('Are you sure you want to delete this session? This will delete all messages and execution history.')) {
      return
    }

    try {
      setDeletingId(sessionId)
      await deleteSession(sessionId)
      // Remove from list
      setSessions(prev => prev.filter(s => s.id !== sessionId))
    } catch (err) {
      console.error('Failed to delete session:', err)
      alert('Failed to delete session: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={loadSessions}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No previous sessions</p>
        <p className="text-xs mt-1">Your analysis sessions will appear here</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {sessions.map((session) => {
        const isActive = session.id === currentSessionId
        const hasDataset = !!session.dataset_schema

        return (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              isActive ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500">
                    {formatDate(session.last_activity)}
                  </span>
                  {isActive && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
                
                {hasDataset && session.dataset_schema?.columns && (
                  <p className="text-sm text-gray-700 font-medium truncate">
                    Dataset: {session.dataset_schema.columns.length} columns
                  </p>
                )}
                
                {!hasDataset && (
                  <p className="text-sm text-gray-400 italic">
                    No dataset uploaded
                  </p>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  Created {formatDate(session.created_at)}
                </p>
              </div>

              <button
                onClick={(e) => handleDelete(session.id, e)}
                disabled={deletingId === session.id || isActive}
                className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={isActive ? "Cannot delete current session" : "Delete session"}
              >
                {deletingId === session.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
