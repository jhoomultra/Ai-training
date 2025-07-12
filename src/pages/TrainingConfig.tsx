import React, { useState, useEffect } from 'react'
import { Settings, Save, RotateCcw, Info, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface TrainingConfig {
  learning_rate: number
  batch_size: number
  epochs: number
  max_length: number
  warmup_steps: number
  save_steps: number
  eval_steps: number
  gradient_accumulation_steps: number
  use_peft: boolean
  peft_config: {
    r: number
    lora_alpha: number
    lora_dropout: number
    target_modules: string[]
  }
  optimizer: string
  scheduler: string
  fp16: boolean
  gradient_checkpointing: boolean
}

const TrainingConfig: React.FC = () => {
  const [config, setConfig] = useState<TrainingConfig>({
    learning_rate: 2e-4,
    batch_size: 4,
    epochs: 3,
    max_length: 512,
    warmup_steps: 100,
    save_steps: 500,
    eval_steps: 500,
    gradient_accumulation_steps: 4,
    use_peft: true,
    peft_config: {
      r: 16,
      lora_alpha: 32,
      lora_dropout: 0.1,
      target_modules: ['q_proj', 'v_proj', 'k_proj', 'o_proj']
    },
    optimizer: 'adamw_torch',
    scheduler: 'cosine',
    fp16: true,
    gradient_checkpointing: true
  })

  const [selectedModel, setSelectedModel] = useState('')
  const [selectedDataset, setSelectedDataset] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load saved configuration
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/training/config')
        if (response.ok) {
          const data = await response.json()
          setConfig(data.config || config)
          setSelectedModel(data.selected_model || '')
          setSelectedDataset(data.selected_dataset || '')
        }
      } catch (error) {
        console.error('Failed to load config:', error)
      }
    }

    loadConfig()
  }, [])

  const saveConfig = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/training/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          selected_model: selectedModel,
          selected_dataset: selectedDataset
        }),
      })

      if (response.ok) {
        toast.success('Configuration saved successfully!')
      } else {
        throw new Error('Failed to save configuration')
      }
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = () => {
    setConfig({
      learning_rate: 2e-4,
      batch_size: 4,
      epochs: 3,
      max_length: 512,
      warmup_steps: 100,
      save_steps: 500,
      eval_steps: 500,
      gradient_accumulation_steps: 4,
      use_peft: true,
      peft_config: {
        r: 16,
        lora_alpha: 32,
        lora_dropout: 0.1,
        target_modules: ['q_proj', 'v_proj', 'k_proj', 'o_proj']
      },
      optimizer: 'adamw_torch',
      scheduler: 'cosine',
      fp16: true,
      gradient_checkpointing: true
    })
    toast.success('Reset to default configuration')
  }

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const updatePeftConfig = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      peft_config: { ...prev.peft_config, [key]: value }
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training Configuration</h1>
        <p className="mt-2 text-gray-600">
          Configure training parameters for your AI model fine-tuning
        </p>
      </div>

      {/* Model & Dataset Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model & Dataset Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a model...</option>
              <option value="llama-7b">Llama 2 7B</option>
              <option value="mistral-7b">Mistral 7B</option>
              <option value="phi-3-mini">Phi-3 Mini</option>
              <option value="gemma-7b">Gemma 7B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Dataset
            </label>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a dataset...</option>
              <option value="customer_support.jsonl">customer_support.jsonl</option>
              <option value="training_data.csv">training_data.csv</option>
              <option value="instructions.txt">instructions.txt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Basic Training Parameters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Training Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Rate
            </label>
            <input
              type="number"
              step="0.00001"
              value={config.learning_rate}
              onChange={(e) => updateConfig('learning_rate', parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Size
            </label>
            <input
              type="number"
              min="1"
              value={config.batch_size}
              onChange={(e) => updateConfig('batch_size', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Epochs
            </label>
            <input
              type="number"
              min="1"
              value={config.epochs}
              onChange={(e) => updateConfig('epochs', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Length
            </label>
            <input
              type="number"
              min="128"
              max="4096"
              value={config.max_length}
              onChange={(e) => updateConfig('max_length', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warmup Steps
            </label>
            <input
              type="number"
              min="0"
              value={config.warmup_steps}
              onChange={(e) => updateConfig('warmup_steps', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gradient Accumulation Steps
            </label>
            <input
              type="number"
              min="1"
              value={config.gradient_accumulation_steps}
              onChange={(e) => updateConfig('gradient_accumulation_steps', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* PEFT/LoRA Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">PEFT/LoRA Configuration</h3>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="use_peft"
              checked={config.use_peft}
              onChange={(e) => updateConfig('use_peft', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="use_peft" className="text-sm font-medium text-gray-700">
              Enable PEFT (Parameter Efficient Fine-Tuning)
            </label>
          </div>
        </div>
        
        {config.use_peft && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LoRA Rank (r)
              </label>
              <input
                type="number"
                min="1"
                max="64"
                value={config.peft_config.r}
                onChange={(e) => updatePeftConfig('r', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LoRA Alpha
              </label>
              <input
                type="number"
                min="1"
                value={config.peft_config.lora_alpha}
                onChange={(e) => updatePeftConfig('lora_alpha', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LoRA Dropout
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.peft_config.lora_dropout}
                onChange={(e) => updatePeftConfig('lora_dropout', parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Advanced Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optimizer
            </label>
            <select
              value={config.optimizer}
              onChange={(e) => updateConfig('optimizer', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="adamw_torch">AdamW (PyTorch)</option>
              <option value="adamw_hf">AdamW (HuggingFace)</option>
              <option value="sgd">SGD</option>
              <option value="adafactor">Adafactor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Rate Scheduler
            </label>
            <select
              value={config.scheduler}
              onChange={(e) => updateConfig('scheduler', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="cosine">Cosine</option>
              <option value="linear">Linear</option>
              <option value="constant">Constant</option>
              <option value="polynomial">Polynomial</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="fp16"
              checked={config.fp16}
              onChange={(e) => updateConfig('fp16', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="fp16" className="text-sm font-medium text-gray-700">
              Enable FP16 (Mixed Precision Training)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="gradient_checkpointing"
              checked={config.gradient_checkpointing}
              onChange={(e) => updateConfig('gradient_checkpointing', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="gradient_checkpointing" className="text-sm font-medium text-gray-700">
              Enable Gradient Checkpointing (Memory Optimization)
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={resetToDefaults}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={saveConfig}
            disabled={isSaving}
            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900">Configuration Tips</h4>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Lower learning rates (1e-5 to 5e-4) work better for fine-tuning</li>
              <li>• Use PEFT/LoRA for memory efficiency with large models</li>
              <li>• Enable FP16 to reduce memory usage and speed up training</li>
              <li>• Adjust batch size based on your GPU memory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingConfig