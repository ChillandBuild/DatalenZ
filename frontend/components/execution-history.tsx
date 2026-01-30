'use client'

import { useState } from 'react'
import { Code2, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react'

interface ExecutionLog {
  id: string
  query: string
  code: string
  success: boolean
  stdout: string
  stderr: string
  execution_time: number
  retry_count: number
  created_at: string
}

interface ExecutionHistoryProps {
  executions: ExecutionLog[]
  onRerun?: (query: string) => void
}

export function ExecutionHistory({ executions, onRerun }: ExecutionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatTime = (seconds: number) => {
    if (seconds < 1) return `${Math.round(seconds * 1000)}ms`
    return `${seconds.toFixed(2)}s`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString()
  }

  if (executions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Code2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No execution history</p>
        <p className="text-xs mt-1">Your code executions will appear here</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {executions.map((execution) => {
        const isExpanded = expandedId === execution.id

        return (
          <div key={execution.id} className="p-4">
            {/* Header */}
            <div
              onClick={() => toggleExpand(execution.id)}
              className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded"
            >
              <div className="flex-shrink-0 mt-1">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>

              <div className="flex-shrink-0 mt-1">
                {execution.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {execution.query}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(execution.created_at)}
                  </span>
                  <span>{formatTime(execution.execution_time)}</span>
                  {execution.retry_count > 0 && (
                    <span className="text-orange-600">
                      {execution.retry_count} {execution.retry_count === 1 ? 'retry' : 'retries'}
                    </span>
                  )}
                </div>
              </div>

              {onRerun && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRerun(execution.query)
                  }}
                  className="flex-shrink-0 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  Re-run
                </button>
              )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-4 ml-10 space-y-3">
                {/* Code */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Code</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                    <code>{execution.code}</code>
                  </pre>
                </div>

                {/* Output */}
                {execution.stdout && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Output</h4>
                    <pre className="bg-gray-50 border border-gray-200 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {execution.stdout}
                    </pre>
                  </div>
                )}

                {/* Errors */}
                {execution.stderr && (
                  <div>
                    <h4 className="text-xs font-semibold text-red-700 mb-2">Errors</h4>
                    <pre className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {execution.stderr}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
