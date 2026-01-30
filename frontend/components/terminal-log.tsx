'use client'

import { useEffect, useRef } from 'react'

interface TerminalLogProps {
  stdout: string
  stderr: string
}

export function TerminalLog({ stdout, stderr }: TerminalLogProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [stdout, stderr])

  return (
    <div
      ref={terminalRef}
      className="bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-auto"
      style={{ maxHeight: '16rem' }}
    >
      {/* Standard Output */}
      {stdout && (
        <div className="whitespace-pre-wrap">
          {stdout.split('\n').map((line, index) => (
            <div key={`stdout-${index}`} className="text-gray-100">
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      )}

      {/* Standard Error */}
      {stderr && (
        <div className="whitespace-pre-wrap mt-2">
          {stderr.split('\n').map((line, index) => (
            <div key={`stderr-${index}`} className="text-red-400">
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!stdout && !stderr && (
        <div className="text-gray-500 italic">No output yet</div>
      )}
    </div>
  )
}
