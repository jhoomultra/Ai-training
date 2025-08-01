import React, { useState, useEffect } from 'react'
import { Server, Play, Square, Copy, ExternalLink, Settings, Code } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Deployment {
  id: string
  model_id: string
  endpoint_url: string
  status: string
  created_date: string
}

const APIDeployment: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [endpointName, setEndpointName] = useState('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [testPrompt, setTestPrompt] = useState('What is artificial intelligence?')
  const [testResponse, setTestResponse] = useState('')
  const [testingEndpoint, setTestingEndpoint] = useState('')

  useEffect(() => {
    fetchDeployments()
  }, [])

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/deployments')
      if (response.ok) {
        const data = await response.json()
        setDeployments(data)
      }
    } catch (error) {
      console.error('Failed to fetch deployments:', error)
    }
  }

  const deployModel = async () => {
    if (!selectedModel) {
      toast.error('Please select a model to deploy')
      return
    }

    setIsDeploying(true)
    try {
      const response = await fetch('/api/deploy/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: selectedModel,
          endpoint_name: endpointName || `api-${selectedModel}`
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Model deployed successfully!')
        setSelectedModel('')
        setEndpointName('')
        fetchDeployments()
      } else {
        throw new Error('Failed to deploy model')
      }
    } catch (error) {
      toast.error('Failed to deploy model')
    } finally {
      setIsDeploying(false)
    }
  }

  const testEndpoint = async (endpointUrl: string) => {
    if (!testPrompt.trim()) {
      toast.error('Please enter a test prompt')
      return
    }

    setTestingEndpoint(endpointUrl)
    setTestResponse('')

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: testPrompt
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTestResponse(data.response)
        toast.success('Test completed successfully!')
      } else {
        throw new Error('Failed to test endpoint')
      }
    } catch (error) {
      toast.error('Failed to test endpoint')
      setTestResponse('Error: Failed to get response from endpoint')
    } finally {
      setTestingEndpoint('')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const generateCurlExample = (endpointUrl: string) => {
    return `curl -X POST "${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Your question here"
  }'`
  }

  const generatePythonExample = (endpointUrl: string) => {
    return `import requests

url = "${endpointUrl}"
data = {
    "prompt": "Your question here"
}

response = requests.post(url, json=data)
result = response.json()
print(result["response"])`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">API Deployment</h1>
        <p className="mt-2 text-gray-600">
          Deploy your trained models as REST APIs for integration
        </p>
      </div>

      {/* Deploy New Model */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deploy New Model</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Trained Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a model...</option>
                <option value="llama-7b-custom">Llama 7B (Custom)</option>
                <option value="mistral-7b-finetuned">Mistral 7B (Fine-tuned)</option>
                <option value="phi-3-mini-custom">Phi-3 Mini (Custom)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint Name (Optional)
              </label>
              <input
                type="text"
                value={endpointName}
                onChange={(e) => setEndpointName(e.target.value)}
                placeholder="e.g., customer-support-bot"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <button
            onClick={deployModel}
            disabled={isDeploying || !selectedModel}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            <Server className="h-5 w-5 mr-2" />
            {isDeploying ? 'Deploying...' : 'Deploy Model'}
          </button>
        </div>
      </div>

      {/* Active Deployments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Deployments</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {deployments.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No deployments found. Deploy your first model to see it here.
            </div>
          ) : (
            deployments.map((deployment) => (
              <div key={deployment.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Server className="h-8 w-8 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {deployment.model_id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Deployed: {new Date(deployment.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deployment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {deployment.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Endpoint:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {deployment.endpoint_url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(deployment.endpoint_url)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => testEndpoint(deployment.endpoint_url)}
                      disabled={testingEndpoint === deployment.endpoint_url}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {testingEndpoint === deployment.endpoint_url ? 'Testing...' : 'Test API'}
                    </button>
                    
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </button>
                    
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Docs
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* API Testing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Testing</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Prompt
            </label>
            <textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your test prompt here..."
            />
          </div>
          
          {testResponse && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response
              </label>
              <div className="bg-gray-50 border border-gray-300 rounded-md p-3">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{testResponse}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Integration Examples */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Examples</h3>
        <div className="space-y-6">
          {deployments.length > 0 && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">cURL</h4>
                  <button
                    onClick={() => copyToClipboard(generateCurlExample((deployments[0]?.endpoint_url ?? '') ?? ''))}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  {generateCurlExample((deployments[0]?.endpoint_url ?? '') ?? '')}
                </pre>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">Python</h4>
                  <button
                    onClick={() => copyToClipboard(generatePythonExample((deployments[0]?.endpoint_url ?? '') ?? ''))}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  {generatePythonExample((deployments[0]?.endpoint_url ?? '') ?? '')}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default APIDeployment