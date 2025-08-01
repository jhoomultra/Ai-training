import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'completed' | 'error'
  progress: number
}

const DatasetUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    
    for (const file of acceptedFiles) {
      const fileId = Math.random().toString(36).substr(2, 9)
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      }

      setUploadedFiles(prev => [...prev, newFile])

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('file_id', fileId)

        const response = await fetch('/api/upload/dataset', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileId 
                ? { ...f, status: 'completed', progress: 100 }
                : f
            )
          )
          toast.success(`${file.name} uploaded successfully!`)
        } else {
          throw new Error('Upload failed')
        }
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'error', progress: 0 }
              : f
          )
        )
        toast.error(`Failed to upload ${file.name}`)
      }
    }
    
    setIsUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json', '.jsonl'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    multiple: true
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Dataset</h1>
        <p className="mt-2 text-gray-600">
          Upload your training data in CSV, JSON, JSONL, or TXT format
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            or click to browse files
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Supported formats: CSV, JSON, JSONL, TXT (Max 100MB per file)
          </p>
        </div>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Uploaded Files</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {file.status === 'uploading' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500">{file.progress}%</span>
                    </div>
                  )}
                  
                  {file.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  
                  {file.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dataset Format Guide */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dataset Format Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">JSONL Format (Recommended)</h4>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
{`{"instruction": "What is AI?", "output": "AI is..."}
{"instruction": "Explain ML", "output": "ML is..."}`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">CSV Format</h4>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
{`instruction,output
"What is AI?","AI is..."
"Explain ML","ML is..."`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetUpload