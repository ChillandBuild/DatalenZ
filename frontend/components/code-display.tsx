'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeDisplayProps {
  code: string
  language?: string
}

export function CodeDisplay({ code, language = 'python' }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting for Python
  const highlightCode = (code: string) => {
    // First escape HTML entities
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Then apply syntax highlighting
    // Comments (do first to avoid highlighting keywords in comments)
    highlighted = highlighted.replace(/(#.*$)/gm, '<span class="text-green-600">$1</span>')

    // Strings (do before keywords to avoid highlighting keywords in strings)
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1).)*?)\1/g, '<span class="text-amber-600">$1$2$1</span>')

    // Keywords
    highlighted = highlighted.replace(/\b(def|class|import|from|as|if|else|elif|for|while|return|try|except|finally|with|lambda|yield|async|await|True|False|None|and|or|not|in|is)\b/g, '<span class="text-purple-600 font-semibold">$1</span>')

    // Functions
    highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-blue-600">$1</span>')

    // Numbers - REMOVED because it conflicts with Tailwind classes (e.g. text-green-600)
    // highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-600">$1</span>')

    return highlighted
  }

  const lines = code.split('\n')

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Python Code</span>
          <span className="text-xs text-gray-500">({lines.length} lines)</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <div className="flex">
          {/* Line Numbers */}
          <div className="bg-gray-50 px-4 py-4 text-right select-none border-r border-gray-200">
            {lines.map((_, index) => (
              <div key={index} className="text-xs text-gray-400 leading-6">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1 px-4 py-4 overflow-x-auto">
            <pre className="text-sm font-mono leading-6">
              {lines.map((line, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: highlightCode(line) || '&nbsp;' }}
                />
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
