import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DatasetUpload from './pages/DatasetUpload'
import ModelSelection from './pages/ModelSelection'
import TrainingConfig from './pages/TrainingConfig'
import TrainingMonitor from './pages/TrainingMonitor'
import APIDeployment from './pages/APIDeployment'
import ModelManagement from './pages/ModelManagement'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dataset" element={<DatasetUpload />} />
        <Route path="/models" element={<ModelSelection />} />
        <Route path="/config" element={<TrainingConfig />} />
        <Route path="/training" element={<TrainingMonitor />} />
        <Route path="/api" element={<APIDeployment />} />
        <Route path="/manage" element={<ModelManagement />} />
      </Routes>
    </Layout>
  )
}

export default App