/**
 * Dataset-related type definitions
 */

export interface ColumnInfo {
  name: string
  dtype: string
  nullCount: number
  uniqueCount: number
  sampleValues: any[]
  minValue?: any
  maxValue?: any
}

export interface DatasetSchema {
  columns: ColumnInfo[]
  rowCount: number
  sampleData: any[][]
}

export interface ProfileResult {
  insights: string[]
  suggestedAnalyses: string[]
  dataQualityIssues: string[]
}
