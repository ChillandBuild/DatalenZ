'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { ChatInterface, Message } from '@/components/chat-interface'
import { Workspace } from '@/components/workspace'
import { FileUpload } from '@/components/file-upload'
import { SessionHistory } from '@/components/session-history'
import { Sidebar } from '@/components/sidebar'
import { MathBackground } from '@/components/math-background'
import { createSession, uploadFile, restoreSession, processQuery } from '@/lib/api/client'
import { Loader2, X } from 'lucide-react'

export default function AnalyzePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [leftPanelWidth, setLeftPanelWidth] = useState(40) // percentage
  const [isResizing, setIsResizing] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [executionData, setExecutionData] = useState<any>(null)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [datasetSchema, setDatasetSchema] = useState<any>(null)
  const [executionHistory, setExecutionHistory] = useState<any[]>([])
  const [restoredMessages, setRestoredMessages] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to DataLenz! Upload a dataset to get started, or ask me anything about your data.',
      timestamp: new Date()
    }
  ])

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  // Create session on mount
  useEffect(() => {
    if (user && !sessionId && !isCreatingSession) {
      initializeSession()
    }
  }, [user, sessionId, isCreatingSession])

  const initializeSession = async () => {
    setIsCreatingSession(true)
    setSessionError(null)

    try {
      const session = await createSession()
      setSessionId(session.id)
      console.log('Session created:', session.id)
    } catch (error) {
      console.error('Failed to create session:', error)
      setSessionError(error instanceof Error ? error.message : 'Failed to create session')
    } finally {
      setIsCreatingSession(false)
    }
  }

  const generateAutoInsights = async (currentSessionId: string) => {
    console.log('[Auto-Insights] Starting generation for session:', currentSessionId)
    const insightPrompt = "Analyze this dataset with deep, structured reasoning. Provide a comprehensive summary including: 1. Data structure overview. 2. Key statistics. 3. Three interesting trends. 4. Three suggested questions. \n\nIMPORTANT: You MUST generate and save at least 3 distinct visualizations as PNG files (e.g., 'distribution.png', 'correlation.png', 'trends.png') using matplotlib/seaborn. These files are required to display the charts in the UI."

    // Add system message indicating analysis is starting
    const analyzingMsg: Message = {
      id: crypto.randomUUID(),
      role: 'system',
      content: 'Generating automatic insights...',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, analyzingMsg])

    try {
      console.log('[Auto-Insights] Sending query to backend...')
      const response = await processQuery({
        query: insightPrompt,
        session_id: currentSessionId
      })
      console.log('[Auto-Insights] Backend response:', response)

      setExecutionData(response)

      if (response.result.success) {
        console.log('[Auto-Insights] Success! Adding assistant message.')
        const insightMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'I have analyzed your dataset. Check the workspace for a detailed summary and visualizations.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, insightMsg])
      } else {
        console.error('[Auto-Insights] Failed (backend returned success=false):', response)
      }
    } catch (error) {
      console.error('[Auto-Insights] Failed to generate insights:', error)
    }
  }

  const handleFileUpload = async (file: File) => {
    console.log('[FileUpload] Starting upload for file:', file.name)
    if (!sessionId) {
      console.error('[FileUpload] No active session!')
      throw new Error('No active session')
    }

    try {
      const response = await uploadFile(file, sessionId)
      console.log('[FileUpload] Upload successful:', response)
      setDatasetSchema(response.schema)
      setShowUpload(false)

      // Add success message
      const successMsg: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: `Dataset loaded! I can see ${response.schema.columns?.length || 0} columns.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, successMsg])

      // Trigger Auto-Insights
      console.log('[FileUpload] Triggering Auto-Insights...')
      generateAutoInsights(sessionId)
    } catch (error) {
      console.error('[FileUpload] Upload failed:', error)
      throw error
    }
  }

  const handleSelectSession = async (selectedSessionId: string) => {
    try {
      setShowHistory(false)
      setIsCreatingSession(true)

      // Restore the selected session
      const response = await restoreSession(selectedSessionId)

      setSessionId(response.session_id)
      setDatasetSchema(response.session?.dataset_schema || null)
      setExecutionData(null) // Clear current execution data
      setExecutionHistory(response.execution_logs || [])
      setRestoredMessages(response.messages || [])

      console.log('Session restored:', response.session_id)

    } catch (error) {
      console.error('Failed to restore session:', error)
      setSessionError(error instanceof Error ? error.message : 'Failed to restore session')
    } finally {
      setIsCreatingSession(false)
    }
  }

  const handleRerunQuery = (query: string) => {
    console.log('Re-running query:', query)
  }

  // Handle panel resize
  const handleMouseDown = () => {
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const newWidth = ((e.clientX - 64) / (window.innerWidth - 64)) * 100
    if (newWidth >= 30 && newWidth <= 70) {
      setLeftPanelWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  if (!user) {
    return null // Will redirect
  }

  // Show loading state while creating session
  if (isCreatingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-white relative">
        <MathBackground />
        <div className="text-center bg-white/80 p-8 rounded-xl border border-gray-200 backdrop-blur-sm shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Initializing secure environment...</p>
        </div>
      </div>
    )
  }

  // Show error state if session creation failed
  if (sessionError) {
    return (
      <div className="flex h-screen items-center justify-center bg-white relative">
        <MathBackground />
        <div className="text-center max-w-md">
          <div className="bg-white/80 border border-red-200 rounded-xl p-8 backdrop-blur-sm shadow-lg">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Session Error</h2>
            <p className="text-red-700 mb-4">{sessionError}</p>
            <button
              onClick={initializeSession}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <MathBackground />

      {/* Sidebar */}
      <Sidebar
        onSignOut={signOut}
        onNewSession={initializeSession}
        onHistoryClick={() => setShowHistory(true)}
        onUploadClick={() => setShowUpload(true)}
      />

      {/* Main Content - Floating Panels */}
      <div className="flex-1 flex p-4 gap-4 overflow-hidden relative z-10">

        {/* Left Panel - Chat Interface */}
        <div
          className="h-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <ChatInterface
            sessionId={sessionId}
            datasetSchema={datasetSchema}
            onExecutionData={(data) => {
              setExecutionData(data)
              if (data?.result) {
                setExecutionHistory(prev => [...prev, {
                  id: Date.now().toString(),
                  query: data.result.query || '',
                  code: data.result.code,
                  success: data.result.success,
                  stdout: data.result.stdout,
                  stderr: data.result.stderr,
                  execution_time: data.result.execution_time,
                  retry_count: data.result.retry_count || 0,
                  created_at: new Date().toISOString()
                }])
              }
            }}
            initialMessages={restoredMessages}
            messages={messages}
            onMessagesChange={setMessages}
          />
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-transparent hover:bg-black/20 cursor-col-resize transition-colors rounded-full"
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel - Workspace */}
        <div
          className="h-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          style={{ width: `${100 - leftPanelWidth}%` }}
        >
          <Workspace
            executionData={executionData}
            executionHistory={executionHistory}
            onRerunQuery={handleRerunQuery}
          />
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upload Dataset</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        </div>
      )}

      {/* Session History Sidebar */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-end z-50">
          <div className="bg-white h-full w-96 shadow-2xl border-l border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Session History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ height: 'calc(100% - 64px)' }}>
              <SessionHistory
                onSelectSession={handleSelectSession}
                currentSessionId={sessionId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
