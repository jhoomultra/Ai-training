import React, { useState, useEffect } from 'react'
import { 
  FolderOpen, 
  Download, 
  Trash2, 
  Eye, 
  Settings, 
  Upload,
  HardDrive,
  Calendar,
  Cpu,
  BarChart3
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ModelInfo {
  id: string
  name: string
  type: string
  size: string
  created_date: string
  last_used: string
  status: 'active' | 'archived' | 'training'
  accuracy?: number
  training_time?: string
  dataset_used?: string
}

const ModelManagement: React.FC = () => {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_date')

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      // Simulate API call - replace with actual API
      const mockModels: ModelInfo[] = [
        {
          id: 'llama-7b-custom-001',
          name: 'Llama 7B Customer Support',
          type: 'text',
          size: '13.5 GB',
          created_date: '2024-01-15T10:30:00Z',
          last_used: '2024-01-20T14:22:00Z',
          status: 'active',
          accuracy: 92.5,
          training_time: '2h 45m',
          dataset_used: 'customer_support.jsonl'
        },
        {
          id: 'mistral-7b-finetuned-002',
          name: 'Mistral 7B Technical Docs',
          type: 'text',
          size: '14.2 GB',
          created_date: '2024-01-12T08:15:00Z',
          last_used: '2024-01-18T09:10:00Z',
          status: 'active',
          accuracy: 89.3,
          training_time: '3h 12m',
          dataset_used: 'technical_docs.csv'
        },
        {
          id: 'phi-3-mini-custom-003',
          name: 'Phi-3 Mini FAQ Bot',
          type: 'text',
          size: '7.6 GB',
          created_date: '2024-01-10T16:45:00Z',
          last_used: '2024-01-16T11:30:00Z',
          status: 'archived',
          accuracy: 87.1,
          training_time: '1h 28m',
          dataset_used: 'faq_data.jsonl'
        }
      ]
      setModels(mockModels)
    } catch (error) {
      console.error('Failed to fetch models:', error)
    }
  }

  const deleteModel = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setModels(prev => prev.filter(model => model.id !== modelId))
      toast.success('Model deleted successfully')
    } catch (error) {
      toast.error('Failed to delete model')
    }
  }

  const downloadModel = async (modelId: string) => {
    try {
      toast.success('Model download started')
      // Simulate download
    } catch (error) {
      toast.error('Failed to download model')
    }
  }

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const bulkDelete = async () => {
    if (selectedModels.length === 0) {
      toast.error('No models selected')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedModels.length} model(s)?`)) {
      return
    }

    try {
      setModels(prev => prev.filter(model => !selectedModels.includes(model.id)))
      setSelectedModels([])
      toast.success(`${selectedModels.length} model(s) deleted successfully`)
    } catch (error) {
      toast.error('Failed to delete models')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      case 'training':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredModels = models
    .filter(model => filterStatus === 'all' || model.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return parseFloat(a.size) - parseFloat(b.size)
        case 'created_date':
          return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Model Management</h1>
        <p className="mt-2 text-gray-600">
          Manage your trained models, view performance metrics, and organize your AI assets
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FolderOpen className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Models</p>
              <p className="text-2xl font-bold text-gray-900">{models.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Cpu className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Models</p>
              <p className="text-2xl font-bold text-gray-900">
                {models.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {models.reduce((acc, model) => acc + parseFloat(model.size), 0).toFixed(1)} GB
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">
                {(models.reduce((acc, model) => acc + (model.accuracy || 0), 0) / models.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="training">Training</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="created_date">Created Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedModels.length > 0 && (
              <button
                onClick={bulkDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedModels.length})
              </button>
            )}
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
              <Upload className="h-4 w-4 mr-2" />
              Import Model
            </button>
          </div>
        </div>
      </div>

      {/* Models List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Models</h3>
        </div>
        
        {filteredModels.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No models found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by training your first model.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredModels.map((model) => (
              <div key={model.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model.id)}
                      onChange={() => toggleModelSelection(model.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-gray-900">{model.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                          {model.status}
                        </span>
                      </div>
                      
                      <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <HardDrive className="h-4 w-4 mr-1" />
                          {model.size}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(model.created_date)}
                        </div>
                        {model.accuracy && (
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            {model.accuracy}% accuracy
                          </div>
                        )}
                        {model.training_time && (
                          <div className="flex items-center">
                            <Cpu className="h-4 w-4 mr-1" />
                            {model.training_time} training
                          </div>
                        )}
                      </div>
                      
                      {model.dataset_used && (
                        <p className="mt-1 text-xs text-gray-400">
                          Trained on: {model.dataset_used}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {/* View model details */}}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => downloadModel(model.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Download Model"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {/* Configure model */}}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Configure"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => deleteModel(model.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete Model"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelManagement