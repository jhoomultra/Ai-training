import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import Dashboard from './pages/Dashboard.js';
import DatasetUpload from './pages/DatasetUpload.js';
import ModelSelection from './pages/ModelSelection.js';
import TrainingConfig from './pages/TrainingConfig.js';
import TrainingMonitor from './pages/TrainingMonitor.js';
import APIDeployment from './pages/APIDeployment.js';
import ModelManagement from './pages/ModelManagement.js';
function App() {
    return (_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/dataset", element: _jsx(DatasetUpload, {}) }), _jsx(Route, { path: "/models", element: _jsx(ModelSelection, {}) }), _jsx(Route, { path: "/config", element: _jsx(TrainingConfig, {}) }), _jsx(Route, { path: "/training", element: _jsx(TrainingMonitor, {}) }), _jsx(Route, { path: "/api", element: _jsx(APIDeployment, {}) }), _jsx(Route, { path: "/manage", element: _jsx(ModelManagement, {}) })] }) }));
}
export default App;
