import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Save, RotateCcw, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
const TrainingConfig = () => {
    const [config, setConfig] = useState({
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
    });
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedDataset, setSelectedDataset] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        // Load saved configuration
        const loadConfig = async () => {
            try {
                const response = await fetch('/api/training/config');
                if (response.ok) {
                    const data = await response.json();
                    setConfig(data.config || config);
                    setSelectedModel(data.selected_model || '');
                    setSelectedDataset(data.selected_dataset || '');
                }
            }
            catch (error) {
                console.error('Failed to load config:', error);
            }
        };
        loadConfig();
    }, []);
    const saveConfig = async () => {
        setIsSaving(true);
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
            });
            if (response.ok) {
                toast.success('Configuration saved successfully!');
            }
            else {
                throw new Error('Failed to save configuration');
            }
        }
        catch (error) {
            toast.error('Failed to save configuration');
        }
        finally {
            setIsSaving(false);
        }
    };
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
        });
        toast.success('Reset to default configuration');
    };
    const updateConfig = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };
    const updatePeftConfig = (key, value) => {
        setConfig(prev => ({
            ...prev,
            peft_config: { ...prev.peft_config, [key]: value }
        }));
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Training Configuration" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Configure training parameters for your AI model fine-tuning" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Model & Dataset Selection" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Selected Model" }), _jsxs("select", { value: selectedModel, onChange: (e) => setSelectedModel(e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Select a model..." }), _jsx("option", { value: "llama-7b", children: "Llama 2 7B" }), _jsx("option", { value: "mistral-7b", children: "Mistral 7B" }), _jsx("option", { value: "phi-3-mini", children: "Phi-3 Mini" }), _jsx("option", { value: "gemma-7b", children: "Gemma 7B" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Selected Dataset" }), _jsxs("select", { value: selectedDataset, onChange: (e) => setSelectedDataset(e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Select a dataset..." }), _jsx("option", { value: "customer_support.jsonl", children: "customer_support.jsonl" }), _jsx("option", { value: "training_data.csv", children: "training_data.csv" }), _jsx("option", { value: "instructions.txt", children: "instructions.txt" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Basic Training Parameters" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Learning Rate" }), _jsx("input", { type: "number", step: "0.00001", value: config.learning_rate, onChange: (e) => updateConfig('learning_rate', parseFloat(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Batch Size" }), _jsx("input", { type: "number", min: "1", value: config.batch_size, onChange: (e) => updateConfig('batch_size', parseInt(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Epochs" }), _jsx("input", { type: "number", min: "1", value: config.epochs, onChange: (e) => updateConfig('epochs', parseInt(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Max Length" }), _jsx("input", { type: "number", min: "128", max: "4096", value: config.max_length, onChange: (e) => updateConfig('max_length', parseInt(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Warmup Steps" }), _jsx("input", { type: "number", min: "0", value: config.warmup_steps, onChange: (e) => updateConfig('warmup_steps', parseInt(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Gradient Accumulation Steps" }), _jsx("input", { type: "number", min: "1", value: config.gradient_accumulation_steps, onChange: (e) => updateConfig('gradient_accumulation_steps', parseInt(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "PEFT/LoRA Configuration" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "use_peft", checked: config.use_peft, onChange: (e) => updateConfig('use_peft', e.target.checked), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("label", { htmlFor: "use_peft", className: "text-sm font-medium text-gray-700", children: "Enable PEFT (Parameter Efficient Fine-Tuning)" })] })] }), config.use_peft && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "LoRA Rank (r)" }), _jsx("input", { type: "number", min: "1", max: "64", value: config.peft_config.r, onChange: (e) => updatePeftConfig('r', parseInt(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "LoRA Alpha" }), _jsx("input", { type: "number", min: "1", value: config.peft_config.lora_alpha, onChange: (e) => updatePeftConfig('lora_alpha', parseInt(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "LoRA Dropout" }), _jsx("input", { type: "number", step: "0.01", min: "0", max: "1", value: config.peft_config.lora_dropout, onChange: (e) => updatePeftConfig('lora_dropout', parseFloat(e.target.value)), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Advanced Settings" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Optimizer" }), _jsxs("select", { value: config.optimizer, onChange: (e) => updateConfig('optimizer', e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "adamw_torch", children: "AdamW (PyTorch)" }), _jsx("option", { value: "adamw_hf", children: "AdamW (HuggingFace)" }), _jsx("option", { value: "sgd", children: "SGD" }), _jsx("option", { value: "adafactor", children: "Adafactor" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Learning Rate Scheduler" }), _jsxs("select", { value: config.scheduler, onChange: (e) => updateConfig('scheduler', e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "cosine", children: "Cosine" }), _jsx("option", { value: "linear", children: "Linear" }), _jsx("option", { value: "constant", children: "Constant" }), _jsx("option", { value: "polynomial", children: "Polynomial" })] })] })] }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "fp16", checked: config.fp16, onChange: (e) => updateConfig('fp16', e.target.checked), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("label", { htmlFor: "fp16", className: "text-sm font-medium text-gray-700", children: "Enable FP16 (Mixed Precision Training)" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "gradient_checkpointing", checked: config.gradient_checkpointing, onChange: (e) => updateConfig('gradient_checkpointing', e.target.checked), className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500" }), _jsx("label", { htmlFor: "gradient_checkpointing", className: "text-sm font-medium text-gray-700", children: "Enable Gradient Checkpointing (Memory Optimization)" })] })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("button", { onClick: resetToDefaults, className: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50", children: [_jsx(RotateCcw, { className: "h-4 w-4 mr-2" }), "Reset to Defaults"] }), _jsx("div", { className: "flex items-center space-x-3", children: _jsxs("button", { onClick: saveConfig, disabled: isSaving, className: "inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50", children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), isSaving ? 'Saving...' : 'Save Configuration'] }) })] }), _jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(Info, { className: "h-5 w-5 text-yellow-600 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-yellow-900", children: "Configuration Tips" }), _jsxs("ul", { className: "text-sm text-yellow-700 mt-1 space-y-1", children: [_jsx("li", { children: "\u2022 Lower learning rates (1e-5 to 5e-4) work better for fine-tuning" }), _jsx("li", { children: "\u2022 Use PEFT/LoRA for memory efficiency with large models" }), _jsx("li", { children: "\u2022 Enable FP16 to reduce memory usage and speed up training" }), _jsx("li", { children: "\u2022 Adjust batch size based on your GPU memory" })] })] })] }) })] }));
};
export default TrainingConfig;
