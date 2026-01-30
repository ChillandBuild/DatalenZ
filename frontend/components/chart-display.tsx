'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface Artifact {
  type: string
  content: any
  metadata?: any
}

interface ChartDisplayProps {
  artifacts: Artifact[]
}

export function ChartDisplay({ artifacts }: ChartDisplayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter for chart artifacts
  const chartArtifacts = artifacts.filter(a => a.type === 'chart')

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading charts...</div>
      </div>
    )
  }

  if (chartArtifacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No charts available</p>
          <p className="text-sm mt-2">Charts will appear here when generated</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {chartArtifacts.map((artifact, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              Chart {index + 1}
              {artifact.metadata?.chart_type && (
                <span className="ml-2 text-xs text-gray-500">
                  ({artifact.metadata.chart_type})
                </span>
              )}
            </h3>
          </div>
          <div className="w-full">
            <Plot
              data={artifact.content.data || []}
              layout={{
                ...artifact.content.layout,
                autosize: true,
                margin: { l: 50, r: 50, t: 50, b: 50 }
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['sendDataToCloud']
              }}
              style={{ width: '100%', height: '500px' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
