'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle } from 'lucide-react'
import { processQuery, QueryResponse } from '@/lib/api/client'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  sessionId: string | null
  datasetSchema: any | null
  onExecutionData: (data: any) => void
  initialMessages?: any[]
  messages: Message[]
  onMessagesChange: (messages: Message[]) => void
}

export function ChatInterface({
  sessionId,
  datasetSchema,
  onExecutionData,
  initialMessages = [],
  messages,
  onMessagesChange
}: ChatInterfaceProps) {

  // Load initial messages when provided (session restoration)
  useEffect(() => {
    if (initialMessages.length > 0) {
      const restored = initialMessages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }))
      onMessagesChange([
        {
          id: '0',
          role: 'system',
          content: 'Session restored. Previous conversation loaded.',
          timestamp: new Date()
        },
        ...restored
      ])
    }
  }, [initialMessages])

  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    // Check if session exists
    if (!sessionId) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: 'No active session. Please refresh the page.',
        timestamp: new Date()
      }
      onMessagesChange([...messages, errorMessage])
      return
    }

    // Check if dataset is uploaded
    if (!datasetSchema) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: 'Please upload a dataset first before asking questions.',
        timestamp: new Date()
      }
      onMessagesChange([...messages, errorMessage])
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    onMessagesChange([...messages, userMessage])
    const query = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      // Call backend API to process query
      const response: QueryResponse = await processQuery({
        query,
        session_id: sessionId
      })

      // Update execution data for workspace
      onExecutionData(response)

      // Create assistant response message
      let responseContent = ''
      if (response.result.success) {
        responseContent = 'Analysis complete! Check the workspace for results.'
        if (response.result.retry_count && response.result.retry_count > 0) {
          responseContent += ` (Corrected after ${response.result.retry_count} ${response.result.retry_count === 1 ? 'retry' : 'retries'})`
        }
      } else {
        responseContent = 'Analysis failed. Check the terminal output for details.'
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      }

      onMessagesChange([...messages, userMessage, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date()
      }
      onMessagesChange([...messages, userMessage, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                ? 'bg-black text-white'
                : message.role === 'system'
                  ? 'bg-gray-50 text-gray-600 border border-gray-100 text-xs font-mono'
                  : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-[10px] mt-1 opacity-50 ${message.role === 'user' ? 'text-white' : 'text-gray-500'
                }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-gray-100">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your data..."
            className="flex-1 resize-none bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
