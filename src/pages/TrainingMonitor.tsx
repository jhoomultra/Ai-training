import React, { useState, useEffect } from 'react'
import { Play, Square, Download, RefreshCw, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

interface TrainingStatus {
  is_training: boolean
  current_job: string | null
  progress: number
  logs: Array<{
    timestamp: string
    step: number
    loss: number
    learning_rate: number
  }>
}

interface TrainingJob {
  id: string
  model_id: string
  dataset_id: string
  status: string
  start_time: string
  end_time: string | null
  output_path: string | null
}

const TrainingMonitor: React.FC = () => {
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    is_training: false,
    current_job: null,
    progress: 0,
    logs: []
  })
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedDataset, setSelectedDataset] = useState('')
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    // Fetch training status periodically
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/training/status')
        if (response.ok) {
          const data = await response.json()
          setTrainingStatus(data)
        }
      } catch (error) {
        console.error('Failed to fetch training status:', error)
      }
    }

    // Fetch training jobs
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/training/jobs')
        if (response.ok) {
          const data = await response.json()
          setTrainingJobs(data)
        }
      } catch (error) {
        console.error('Failed to fetch training jobs:', error)
      }
    }

    fetchStatus()
    fetchJobs()

    // Set up polling for training status
    const interval = setInterval(fetchStatus, 2000)
    return () => clearInterval(interval)
  }, [])

  const startTraining = async () => {
    if (!selectedModel || !selectedDataset) {
      toast.error('Please select both model and dataset')
      return
    }

    setIsStarting(true)
    try {
      const response = await fetch('/api/training/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: selectedModel,
          dataset_id: selectedDataset,
          config: {
            learning_rate: 2e-4,
            batch_size: 4,
            epochs: 3,
            max_length: 512,
            use_peft: true
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Training started successfully!')
        // Refresh status
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        throw new Error('Failed to start training')
      }
    } catch (error) {
      toast.error('Failed to start training')
    } finally {
      setIsStarting(false)
    }
  }

  const stopTraining = async () => {
    try {
      const response = await fetch('/api/training/stop', {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Training stopped')
      } else {
        throw new Error('Failed to stop training')
      }
    } catch (error) {
      toast.error('Failed to stop training')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'stopped':
        return <Square className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDuration = (startTime: string, endTime: string | null) => {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000)
    
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training Monitor</h1>
        <p className="mt-2 text-gray-600">
          Monitor and control your AI model training processes
        </p>
      </div>

      {/* Training Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Controls</h3>
        
        {!trainingStatus.is_training ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a model...</option>
                  <option value="llama-7b">Llama 2 7B</option>
                  <option value="mistral-7b">Mistral 7B</option>
                  <option value="phi-3-mini">Phi-3 Mini</option>
                  <option value="gemma-7b">Gemma 7B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Dataset
                </label>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a dataset...</option>
                  <option value="customer_support.jsonl">customer_support.jsonl</option>
                  <option value="training_data.csv">training_data.csv</option>
                  <option value="instructions.txt">instructions.txt</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={startTraining}
              disabled={isStarting || !selectedModel || !selectedDataset}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-5 w-5 mr-2" />
              {isStarting ? 'Starting...' : 'Start Training'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Training Job: {trainingStatus.current_job}</p>
                <p className="text-lg font-semibold text-gray-900">
                  Progress: {trainingStatus.progress.toFixed(1)}%
                </p>
              </div>
              <button
                onClick={stopTraining}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Training
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${trainingStatus.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Training Metrics */}
      {trainingStatus.logs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingStatus.logs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Loss"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Training History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Training History</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {trainingJobs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No training jobs found. Start your first training to see history here.
            </div>
          ) : (
            trainingJobs.map((job) => (
              <div key={job.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.model_id} → {job.dataset_id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Job ID: {job.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {job.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Duration: {formatDuration(job.start_time, job.end_time)}
                      </p>
                    </div>
                    
                    {job.status === 'completed' && job.output_path && (
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Real-time Logs */}
      {trainingStatus.is_training && trainingStatus.logs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Logs</h3>
          <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="space-y-1 text-sm font-mono">
              {trainingStatus.logs.slice(-10).map((log, index) => (
                <div key={index} className="text-green-400">
                  <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  {' '}Step {log.step}: Loss = {log.loss.toFixed(4)}, LR = {log.learning_rate.toExponential(2)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrainingMonitor