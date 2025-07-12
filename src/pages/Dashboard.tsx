import React, { useState, useEffect } from 'react'
import { 
  Database, 
  Cpu, 
  Play, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Server,
  Activity
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalDatasets: 0,
    trainedModels: 0,
    activeTraining: 0,
    deployedAPIs: 0
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Dataset uploaded', name: 'customer_support.jsonl', time: '2 hours ago' },
    { id: 2, action: 'Model training completed', name: 'llama-7b-custom', time: '4 hours ago' },
    { id: 3, action: 'API deployed', name: 'support-bot-v1', time: '1 day ago' },
  ])

  const trainingData = [
    { name: 'Day 1', loss: 2.4, accuracy: 0.65 },
    { name: 'Day 2', loss: 1.8, accuracy: 0.72 },
    { name: 'Day 3', loss: 1.2, accuracy: 0.81 },
    { name: 'Day 4', loss: 0.9, accuracy: 0.87 },
    { name: 'Day 5', loss: 0.6, accuracy: 0.92 },
  ]

  useEffect(() => {
    // Fetch dashboard stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Datasets',
      value: stats.totalDatasets,
      icon: Database,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Trained Models',
      value: stats.trainedModels,
      icon: Cpu,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Active Training',
      value: stats.activeTraining,
      icon: Play,
      color: 'bg-yellow-500',
      change: '0%'
    },
    {
      title: 'Deployed APIs',
      value: stats.deployedAPIs,
      icon: Server,
      color: 'bg-purple-500',
      change: '+25%'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Monitor your AI training pipeline and model performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Training Progress Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Training Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.name}</p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
            <Database className="h-5 w-5 mr-2" />
            Upload New Dataset
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Play className="h-5 w-5 mr-2" />
            Start Training
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Server className="h-5 w-5 mr-2" />
            Deploy API
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard