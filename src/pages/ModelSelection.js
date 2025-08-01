import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Cpu, Download, Star, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
const ModelSelection = () => {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [filterType, setFilterType] = useState('all');
    useEffect(() => {
        // Fetch available models
        const fetchModels = async () => {
            try {
                const response = await fetch('/api/models/available');
                if (response.ok) {
                    const data = await response.json();
                    setModels(data);
                }
            }
            catch (error) {
                console.error('Failed to fetch models:', error);
                // Fallback to static data
                setModels([
                    {
                        id: 'llama-7b',
                        name: 'Llama 2 7B',
                        description: 'Meta\'s Llama 2 model with 7 billion parameters. Great for general text generation and fine-tuning.',
                        size: '13.5 GB',
                        parameters: '7B',
                        type: 'text',
                        popularity: 95,
                        downloadUrl: 'meta-llama/Llama-2-7b-hf',
                        isDownloaded: false,
                        isDownloading: false
                    },
                    {
                        id: 'mistral-7b',
                        name: 'Mistral 7B',
                        description: 'High-performance language model with excellent instruction following capabilities.',
                        size: '14.2 GB',
                        parameters: '7B',
                        type: 'text',
                        popularity: 88,
                        downloadUrl: 'mistralai/Mistral-7B-v0.1',
                        isDownloaded: true,
                        isDownloading: false
                    },
                    {
                        id: 'phi-3-mini',
                        name: 'Phi-3 Mini',
                        description: 'Microsoft\'s compact yet powerful model, optimized for efficiency.',
                        size: '7.6 GB',
                        parameters: '3.8B',
                        type: 'text',
                        popularity: 82,
                        downloadUrl: 'microsoft/Phi-3-mini-4k-instruct',
                        isDownloaded: false,
                        isDownloading: false
                    },
                    {
                        id: 'gemma-7b',
                        name: 'Gemma 7B',
                        description: 'Google\'s open-source model based on Gemini research and technology.',
                        size: '16.9 GB',
                        parameters: '7B',
                        type: 'text',
                        popularity: 79,
                        downloadUrl: 'google/gemma-7b',
                        isDownloaded: false,
                        isDownloading: false
                    }
                ]);
            }
        };
        fetchModels();
    }, []);
    const downloadModel = async (modelId) => {
        setModels(prev => prev.map(model => model.id === modelId
            ? { ...model, isDownloading: true }
            : model));
        try {
            const response = await fetch('/api/models/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model_id: modelId }),
            });
            if (response.ok) {
                setModels(prev => prev.map(model => model.id === modelId
                    ? { ...model, isDownloaded: true, isDownloading: false }
                    : model));
                toast.success('Model downloaded successfully!');
            }
            else {
                throw new Error('Download failed');
            }
        }
        catch (error) {
            setModels(prev => prev.map(model => model.id === modelId
                ? { ...model, isDownloading: false }
                : model));
            toast.error('Failed to download model');
        }
    };
    const selectModel = (modelId) => {
        setSelectedModel(modelId);
        toast.success('Model selected for training!');
    };
    const filteredModels = models.filter(model => filterType === 'all' || model.type === filterType);
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Select Base Model" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Choose a pre-trained model to fine-tune with your dataset" })] }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: "Filter by type:" }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "all", children: "All Models" }), _jsx("option", { value: "text", children: "Text Models" }), _jsx("option", { value: "vision", children: "Vision Models" }), _jsx("option", { value: "multimodal", children: "Multimodal Models" })] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: filteredModels.map((model) => (_jsxs("div", { className: `bg-white rounded-lg shadow p-6 border-2 transition-all ${selectedModel === model.id
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Cpu, { className: "h-8 w-8 text-primary-600" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: model.name }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsxs("span", { className: "text-sm text-gray-500", children: [model.parameters, " parameters"] }), _jsx("span", { className: "text-gray-300", children: "\u2022" }), _jsx("span", { className: "text-sm text-gray-500", children: model.size })] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Star, { className: "h-4 w-4 text-yellow-400" }), _jsx("span", { className: "text-sm text-gray-600", children: model.popularity })] })] }), _jsx("p", { className: "text-gray-600 text-sm mb-4", children: model.description }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [model.isDownloaded ? (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: "Downloaded" })) : (_jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800", children: "Not Downloaded" })), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${model.type === 'text' ? 'bg-blue-100 text-blue-800' :
                                                model.type === 'vision' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-orange-100 text-orange-800'}`, children: model.type })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [!model.isDownloaded && (_jsxs("button", { onClick: () => downloadModel(model.id), disabled: model.isDownloading, className: "inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50", children: [_jsx(Download, { className: "h-4 w-4 mr-1" }), model.isDownloading ? 'Downloading...' : 'Download'] })), _jsx("button", { onClick: () => selectModel(model.id), disabled: !model.isDownloaded, className: `inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${selectedModel === model.id
                                                ? 'bg-primary-600 text-white'
                                                : model.isDownloaded
                                                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`, children: selectedModel === model.id ? 'Selected' : 'Select' })] })] })] }, model.id))) }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(Info, { className: "h-5 w-5 text-blue-600 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-blue-900", children: "Model Selection Tips" }), _jsx("p", { className: "text-sm text-blue-700 mt-1", children: "Choose models based on your use case: Llama 2 for general tasks, Mistral for instruction following, Phi-3 for efficiency, and Gemma for latest research. Larger models generally perform better but require more computational resources." })] })] }) })] }));
};
export default ModelSelection;
