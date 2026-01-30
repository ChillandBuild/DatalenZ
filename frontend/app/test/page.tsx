'use client'

import { useState } from 'react'
import { FileUpload } from '@/components/file-upload'
import { useAuth } from '@/lib/auth/auth-context'

export default function TestPage() {
  const { user, signOut } = useAuth()
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setError(null)
    setUploadResult(null)

    try {
      // Get the auth token from Supabase
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please sign in first.')
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload to backend
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Upload failed')
      }

      const data = await response.json()
      setUploadResult(data)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-4">You need to be authenticated to test file upload</p>
          <a
            href="/auth"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">DataLens Test Page</h1>
              <p className="text-gray-600 mt-1">Test file upload functionality</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Signed in as:</p>
              <p className="font-medium">{user.email}</p>
              <button
                onClick={() => signOut()}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Upload Test Dataset</h2>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {uploadResult && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium mb-2">✅ Upload Successful!</p>
              <div className="text-sm text-gray-700">
                <p><strong>Filename:</strong> {uploadResult.filename}</p>
                <p><strong>Rows:</strong> {uploadResult.schema?.row_count}</p>
                <p><strong>Columns:</strong> {uploadResult.schema?.columns?.length}</p>
              </div>
            </div>
          )}

          {uploadResult?.schema && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Dataset Schema</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Column</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Unique</th>
                      <th className="px-4 py-2 text-left">Nulls</th>
                      <th className="px-4 py-2 text-left">Sample Values</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadResult.schema.columns.map((col: any, idx: number) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2 font-medium">{col.name}</td>
                        <td className="px-4 py-2 text-gray-600">{col.dtype}</td>
                        <td className="px-4 py-2 text-gray-600">{col.unique_count}</td>
                        <td className="px-4 py-2 text-gray-600">{col.null_count}</td>
                        <td className="px-4 py-2 text-gray-600">
                          {col.sample_values?.slice(0, 3).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Make sure the backend is running at http://localhost:8000</li>
            <li>Create a test CSV file with some data</li>
            <li>Drag and drop the file or click to browse</li>
            <li>Check the upload result and schema display</li>
            <li>Verify the data in the table matches your CSV</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
