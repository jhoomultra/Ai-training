import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Play, Square, Download, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
const TrainingMonitor = () => {
    const [trainingStatus, setTrainingStatus] = useState({
        is_training: false,
        current_job: null,
        progress: 0,
        logs: []
    });
    const [trainingJobs, setTrainingJobs] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedDataset, setSelectedDataset] = useState('');
    const [isStarting, setIsStarting] = useState(false);
    useEffect(() => {
        // Fetch training status periodically
        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/training/status');
                if (response.ok) {
                    const data = await response.json();
                    setTrainingStatus(data);
                }
            }
            catch (error) {
                console.error('Failed to fetch training status:', error);
            }
        };
        // Fetch training jobs
        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/training/jobs');
                if (response.ok) {
                    const data = await response.json();
                    setTrainingJobs(data);
                }
            }
            catch (error) {
                console.error('Failed to fetch training jobs:', error);
            }
        };
        fetchStatus();
        fetchJobs();
        // Set up polling for training status
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, []);
    const startTraining = async () => {
        if (!selectedModel || !selectedDataset) {
            toast.error('Please select both model and dataset');
            return;
        }
        setIsStarting(true);
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
            });
            if (response.ok) {
                const data = await response.json();
                toast.success('Training started successfully!');
                // Refresh status
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else {
                throw new Error('Failed to start training');
            }
        }
        catch (error) {
            toast.error('Failed to start training');
        }
        finally {
            setIsStarting(false);
        }
    };
    const stopTraining = async () => {
        try {
            const response = await fetch('/api/training/stop', {
                method: 'POST',
            });
            if (response.ok) {
                toast.success('Training stopped');
            }
            else {
                throw new Error('Failed to stop training');
            }
        }
        catch (error) {
            toast.error('Failed to stop training');
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'running':
                return _jsx(RefreshCw, { className: "h-5 w-5 text-blue-500 animate-spin" });
            case 'completed':
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-500" });
            case 'failed':
                return _jsx(AlertCircle, { className: "h-5 w-5 text-red-500" });
            case 'stopped':
                return _jsx(Square, { className: "h-5 w-5 text-yellow-500" });
            default:
                return _jsx(Clock, { className: "h-5 w-5 text-gray-500" });
        }
    };
    const formatDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date();
        const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Training Monitor" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Monitor and control your AI model training processes" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Training Controls" }), !trainingStatus.is_training ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Model" }), _jsxs("select", { value: selectedModel, onChange: (e) => setSelectedModel(e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Choose a model..." }), _jsx("option", { value: "llama-7b", children: "Llama 2 7B" }), _jsx("option", { value: "mistral-7b", children: "Mistral 7B" }), _jsx("option", { value: "phi-3-mini", children: "Phi-3 Mini" }), _jsx("option", { value: "gemma-7b", children: "Gemma 7B" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Dataset" }), _jsxs("select", { value: selectedDataset, onChange: (e) => setSelectedDataset(e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Choose a dataset..." }), _jsx("option", { value: "customer_support.jsonl", children: "customer_support.jsonl" }), _jsx("option", { value: "training_data.csv", children: "training_data.csv" }), _jsx("option", { value: "instructions.txt", children: "instructions.txt" })] })] })] }), _jsxs("button", { onClick: startTraining, disabled: isStarting || !selectedModel || !selectedDataset, className: "inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(Play, { className: "h-5 w-5 mr-2" }), isStarting ? 'Starting...' : 'Start Training'] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Training Job: ", trainingStatus.current_job] }), _jsxs("p", { className: "text-lg font-semibold text-gray-900", children: ["Progress: ", trainingStatus.progress.toFixed(1), "%"] })] }), _jsxs("button", { onClick: stopTraining, className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700", children: [_jsx(Square, { className: "h-4 w-4 mr-2" }), "Stop Training"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3", children: _jsx("div", { className: "bg-primary-600 h-3 rounded-full transition-all duration-300", style: { width: `${trainingStatus.progress}%` } }) })] }))] }), trainingStatus.logs.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Training Metrics" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: trainingStatus.logs, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "step" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "loss", stroke: "#ef4444", strokeWidth: 2, name: "Loss" })] }) })] })), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Training History" }) }), _jsx("div", { className: "divide-y divide-gray-200", children: trainingJobs.length === 0 ? (_jsx("div", { className: "px-6 py-8 text-center text-gray-500", children: "No training jobs found. Start your first training to see history here." })) : (trainingJobs.map((job) => (_jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [getStatusIcon(job.status), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium text-gray-900", children: [job.model_id, " \u2192 ", job.dataset_id] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Job ID: ", job.id] })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 capitalize", children: job.status }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Duration: ", formatDuration(job.start_time, job.end_time)] })] }), job.status === 'completed' && job.output_path && (_jsxs("button", { className: "inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50", children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), "Download"] }))] })] }) }, job.id)))) })] }), trainingStatus.is_training && trainingStatus.logs.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Real-time Logs" }), _jsx("div", { className: "bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto", children: _jsx("div", { className: "space-y-1 text-sm font-mono", children: trainingStatus.logs.slice(-10).map((log, index) => (_jsxs("div", { className: "text-green-400", children: [_jsxs("span", { className: "text-gray-500", children: ["[", new Date(log.timestamp).toLocaleTimeString(), "]"] }), ' ', "Step ", log.step, ": Loss = ", log.loss.toFixed(4), ", LR = ", log.learning_rate.toExponential(2)] }, index))) }) })] }))] }));
};
export default TrainingMonitor;
