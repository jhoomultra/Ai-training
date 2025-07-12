import React, { useState, useEffect } from 'react'
import { Cpu, Download, Star, Info } from 'lucide-react'
import toast from 'react-hot-toast'

interface Model {
  id: string
  name: string
  description: string
  size: string
  parameters: string
  type: 'text' | 'vision' | 'multimodal'
  popularity: number
  downloadUrl: string
  isDownloaded: boolean
  isDownloading: boolean
}

const ModelSelection: React.FC = () => {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    // Fetch available models
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models/available')
        if (response.ok) {
          const data = await response.json()
          setModels(data)
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
        // Fallback to static data
        setModels([
          {
            id: 'llama-7b',
            name: 'Llama 2 7B',
            description: 'Meta\'s Llama 2 model with 7 billion parameters. Great for general text generation and fine-tuning.',
            size: '13.5 GB',
            parameters: '7B',
            type: 'text',
            popularity: 95,
            downloadUrl: 'meta-llama/Llama-2-7b-hf',
            isDownloaded: false,
            isDownloading: false
          },
          {
            id: 'mistral-7b',
            name: 'Mistral 7B',
            description: 'High-performance language model with excellent instruction following capabilities.',
            size: '14.2 GB',
            parameters: '7B',
            type: 'text',
            popularity: 88,
            downloadUrl: 'mistralai/Mistral-7B-v0.1',
            isDownloaded: true,
            isDownloading: false
          },
          {
            id: 'phi-3-mini',
            name: 'Phi-3 Mini',
            description: 'Microsoft\'s compact yet powerful model, optimized for efficiency.',
            size: '7.6 GB',
            parameters: '3.8B',
            type: 'text',
            popularity: 82,
            downloadUrl: 'microsoft/Phi-3-mini-4k-instruct',
            isDownloaded: false,
            isDownloading: false
          },
          {
            id: 'gemma-7b',
            name: 'Gemma 7B',
            description: 'Google\'s open-source model based on Gemini research and technology.',
            size: '16.9 GB',
            parameters: '7B',
            type: 'text',
            popularity: 79,
            downloadUrl: 'google/gemma-7b',
            isDownloaded: false,
            isDownloading: false
          }
        ])
      }
    }

    fetchModels()
  }, [])

  const downloadModel = async (modelId: string) => {
    setModels(prev => 
      prev.map(model => 
        model.id === modelId 
          ? { ...model, isDownloading: true }
          : model
      )
    )

    try {
      const response = await fetch('/api/models/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model_id: modelId }),
      })

      if (response.ok) {
        setModels(prev => 
          prev.map(model => 
            model.id === modelId 
              ? { ...model, isDownloaded: true, isDownloading: false }
              : model
          )
        )
        toast.success('Model downloaded successfully!')
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      setModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, isDownloading: false }
            : model
        )
      )
      toast.error('Failed to download model')
    }
  }

  const selectModel = (modelId: string) => {
    setSelectedModel(modelId)
    toast.success('Model selected for training!')
  }

  const filteredModels = models.filter(model => 
    filterType === 'all' || model.type === filterType
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Select Base Model</h1>
        <p className="mt-2 text-gray-600">
          Choose a pre-trained model to fine-tune with your dataset
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Models</option>
            <option value="text">Text Models</option>
            <option value="vision">Vision Models</option>
            <option value="multimodal">Multimodal Models</option>
          </select>
        </div>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModels.map((model) => (
          <div 
            key={model.id} 
            className={`bg-white rounded-lg shadow p-6 border-2 transition-all ${
              selectedModel === model.id 
                ? 'border-primary-500 ring-2 ring-primary-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Cpu className="h-8 w-8 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{model.parameters} parameters</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{model.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-600">{model.popularity}</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{model.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {model.isDownloaded ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Downloaded
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Not Downloaded
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  model.type === 'text' ? 'bg-blue-100 text-blue-800' :
                  model.type === 'vision' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {model.type}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {!model.isDownloaded && (
                  <button
                    onClick={() => downloadModel(model.id)}
                    disabled={model.isDownloading}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {model.isDownloading ? 'Downloading...' : 'Download'}
                  </button>
                )}
                
                <button
                  onClick={() => selectModel(model.id)}
                  disabled={!model.isDownloaded}
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                    selectedModel === model.id
                      ? 'bg-primary-600 text-white'
                      : model.isDownloaded
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedModel === model.id ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Model Selection Tips</h4>
            <p className="text-sm text-blue-700 mt-1">
              Choose models based on your use case: Llama 2 for general tasks, Mistral for instruction following, 
              Phi-3 for efficiency, and Gemma for latest research. Larger models generally perform better but 
              require more computational resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelSelection