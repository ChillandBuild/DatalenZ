'use client'

import { useState } from 'react'
import { Code2, BarChart3, Terminal, ChevronDown, ChevronUp, History } from 'lucide-react'
import { CodeDisplay } from './code-display'
import { ChartDisplay } from './chart-display'
import { TerminalLog } from './terminal-log'
import { ExecutionHistory } from './execution-history'

interface WorkspaceProps {
  executionData: any | null
  executionHistory?: any[]
  onRerunQuery?: (query: string) => void
}

type TabType = 'code' | 'charts' | 'plan' | 'history'

export function Workspace({ executionData, executionHistory = [], onRerunQuery }: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabType>('code')
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(true)

  const tabs = [
    { id: 'code' as TabType, label: 'Code', icon: Code2 },
    { id: 'charts' as TabType, label: 'Charts', icon: BarChart3 },
    { id: 'plan' as TabType, label: 'Plan', icon: Terminal },
    { id: 'history' as TabType, label: 'History', icon: History },
  ]

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Tab Navigation */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100 px-2 pt-2">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm transition-all ${activeTab === tab.id
                    ? 'bg-white text-black border border-gray-200 border-b-white font-medium shadow-sm translate-y-[1px]'
                    : 'text-gray-500 hover:text-black hover:bg-gray-50/50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {activeTab === 'code' && (
          <div className="h-full overflow-auto p-6">
            {executionData?.result?.code ? (
              <CodeDisplay code={executionData.result.code} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
                    <Code2 className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">No code generated</p>
                  <p className="text-sm mt-1">Ask a question to generate Python code</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="h-full overflow-auto p-6">
            {executionData?.result?.artifacts?.some((a: any) => a.type === 'chart') ? (
              <ChartDisplay artifacts={executionData.result.artifacts} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
                    <BarChart3 className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">No charts available</p>
                  <p className="text-sm mt-1">Ask for a visualization to see it here</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="h-full overflow-auto p-6">
            {executionData?.plan?.steps ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Execution Plan</h3>
                <ol className="space-y-4">
                  {executionData.plan.steps.map((step: string, index: number) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Complexity:</span>
                      <span className="ml-2 font-medium text-black">
                        {executionData.plan.estimated_complexity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Libraries:</span>
                      <span className="ml-2 font-medium text-black">
                        {executionData.plan.required_libraries.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
                    <Terminal className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">No plan generated</p>
                  <p className="text-sm mt-1">Ask a question to see the execution plan</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="h-full overflow-auto">
            <ExecutionHistory
              executions={executionHistory}
              onRerun={onRerunQuery}
            />
          </div>
        )}
      </div>

      {/* Terminal Log (Collapsible) */}
      {executionData?.result && (
        <div className="border-t border-gray-200 bg-black text-white">
          <button
            onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
            className="w-full px-6 py-2 flex items-center justify-between hover:bg-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Terminal Output</span>
            </div>
            {isTerminalExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {isTerminalExpanded && (
            <div className="max-h-64 overflow-auto border-t border-gray-800">
              <TerminalLog
                stdout={executionData.result.stdout}
                stderr={executionData.result.stderr}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
