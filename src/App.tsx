import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.js'
import Dashboard from './pages/Dashboard.js'
import DatasetUpload from './pages/DatasetUpload.js'
import ModelSelection from './pages/ModelSelection.js'
import TrainingConfig from './pages/TrainingConfig.js'
import TrainingMonitor from './pages/TrainingMonitor.js'
import APIDeployment from './pages/APIDeployment.js'
import ModelManagement from './pages/ModelManagement.js'

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