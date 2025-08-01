import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FolderOpen, Download, Trash2, Eye, Settings, Upload, HardDrive, Calendar, Cpu, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
const ModelManagement = () => {
    const [models, setModels] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('created_date');
    useEffect(() => {
        fetchModels();
    }, []);
    const fetchModels = async () => {
        try {
            // Simulate API call - replace with actual API
            const mockModels = [
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
            ];
            setModels(mockModels);
        }
        catch (error) {
            console.error('Failed to fetch models:', error);
        }
    };
    const deleteModel = async (modelId) => {
        if (!confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
            return;
        }
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setModels(prev => prev.filter(model => model.id !== modelId));
            toast.success('Model deleted successfully');
        }
        catch (error) {
            toast.error('Failed to delete model');
        }
    };
    const downloadModel = async (modelId) => {
        try {
            toast.success('Model download started');
            // Simulate download
        }
        catch (error) {
            toast.error('Failed to download model');
        }
    };
    const toggleModelSelection = (modelId) => {
        setSelectedModels(prev => prev.includes(modelId)
            ? prev.filter(id => id !== modelId)
            : [...prev, modelId]);
    };
    const bulkDelete = async () => {
        if (selectedModels.length === 0) {
            toast.error('No models selected');
            return;
        }
        if (!confirm(`Are you sure you want to delete ${selectedModels.length} model(s)?`)) {
            return;
        }
        try {
            setModels(prev => prev.filter(model => !selectedModels.includes(model.id)));
            setSelectedModels([]);
            toast.success(`${selectedModels.length} model(s) deleted successfully`);
        }
        catch (error) {
            toast.error('Failed to delete models');
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            case 'training':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const filteredModels = models
        .filter(model => filterStatus === 'all' || model.status === filterStatus)
        .sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'size':
                return parseFloat(a.size) - parseFloat(b.size);
            case 'created_date':
                return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
            default:
                return 0;
        }
    });
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Model Management" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Manage your trained models, view performance metrics, and organize your AI assets" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(FolderOpen, { className: "h-8 w-8 text-blue-500" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Models" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: models.length })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Cpu, { className: "h-8 w-8 text-green-500" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Active Models" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: models.filter(m => m.status === 'active').length })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(HardDrive, { className: "h-8 w-8 text-purple-500" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Size" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [models.reduce((acc, model) => acc + parseFloat(model.size), 0).toFixed(1), " GB"] })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(BarChart3, { className: "h-8 w-8 text-orange-500" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Avg Accuracy" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [(models.reduce((acc, model) => acc + (model.accuracy || 0), 0) / models.length).toFixed(1), "%"] })] })] }) })] }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Filter by Status" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "archived", children: "Archived" }), _jsx("option", { value: "training", children: "Training" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Sort by" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "created_date", children: "Created Date" }), _jsx("option", { value: "name", children: "Name" }), _jsx("option", { value: "size", children: "Size" })] })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [selectedModels.length > 0 && (_jsxs("button", { onClick: bulkDelete, className: "inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50", children: [_jsx(Trash2, { className: "h-4 w-4 mr-2" }), "Delete Selected (", selectedModels.length, ")"] })), _jsxs("button", { className: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700", children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "Import Model"] })] })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Your Models" }) }), filteredModels.length === 0 ? (_jsxs("div", { className: "px-6 py-12 text-center", children: [_jsx(FolderOpen, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No models found" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Get started by training your first model." })] })) : (_jsx("div", { className: "divide-y divide-gray-200", children: filteredModels.map((model) => (_jsx("div", { className: "px-6 py-4 hover:bg-gray-50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("input", { type: "checkbox", checked: selectedModels.includes(model.id), onChange: () => toggleModelSelection(model.id), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: model.name }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(model.status)}`, children: model.status })] }), _jsxs("div", { className: "mt-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(HardDrive, { className: "h-4 w-4 mr-1" }), model.size] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1" }), formatDate(model.created_date)] }), model.accuracy && (_jsxs("div", { className: "flex items-center", children: [_jsx(BarChart3, { className: "h-4 w-4 mr-1" }), model.accuracy, "% accuracy"] })), model.training_time && (_jsxs("div", { className: "flex items-center", children: [_jsx(Cpu, { className: "h-4 w-4 mr-1" }), model.training_time, " training"] }))] }), model.dataset_used && (_jsxs("p", { className: "mt-1 text-xs text-gray-400", children: ["Trained on: ", model.dataset_used] }))] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => { }, className: "p-2 text-gray-400 hover:text-gray-600", title: "View Details", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => downloadModel(model.id), className: "p-2 text-gray-400 hover:text-gray-600", title: "Download Model", children: _jsx(Download, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => { }, className: "p-2 text-gray-400 hover:text-gray-600", title: "Configure", children: _jsx(Settings, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => deleteModel(model.id), className: "p-2 text-gray-400 hover:text-red-600", title: "Delete Model", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }) }, model.id))) }))] })] }));
};
export default ModelManagement;
