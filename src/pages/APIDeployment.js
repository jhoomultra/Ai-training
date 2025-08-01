import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Server, Play, Copy, ExternalLink, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
const APIDeployment = () => {
    const [deployments, setDeployments] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [endpointName, setEndpointName] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const [testPrompt, setTestPrompt] = useState('What is artificial intelligence?');
    const [testResponse, setTestResponse] = useState('');
    const [testingEndpoint, setTestingEndpoint] = useState('');
    useEffect(() => {
        fetchDeployments();
    }, []);
    const fetchDeployments = async () => {
        try {
            const response = await fetch('/api/deployments');
            if (response.ok) {
                const data = await response.json();
                setDeployments(data);
            }
        }
        catch (error) {
            console.error('Failed to fetch deployments:', error);
        }
    };
    const deployModel = async () => {
        if (!selectedModel) {
            toast.error('Please select a model to deploy');
            return;
        }
        setIsDeploying(true);
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
            });
            if (response.ok) {
                const data = await response.json();
                toast.success('Model deployed successfully!');
                setSelectedModel('');
                setEndpointName('');
                fetchDeployments();
            }
            else {
                throw new Error('Failed to deploy model');
            }
        }
        catch (error) {
            toast.error('Failed to deploy model');
        }
        finally {
            setIsDeploying(false);
        }
    };
    const testEndpoint = async (endpointUrl) => {
        if (!testPrompt.trim()) {
            toast.error('Please enter a test prompt');
            return;
        }
        setTestingEndpoint(endpointUrl);
        setTestResponse('');
        try {
            const response = await fetch(endpointUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: testPrompt
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setTestResponse(data.response);
                toast.success('Test completed successfully!');
            }
            else {
                throw new Error('Failed to test endpoint');
            }
        }
        catch (error) {
            toast.error('Failed to test endpoint');
            setTestResponse('Error: Failed to get response from endpoint');
        }
        finally {
            setTestingEndpoint('');
        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };
    const generateCurlExample = (endpointUrl) => {
        return `curl -X POST "${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Your question here"
  }'`;
    };
    const generatePythonExample = (endpointUrl) => {
        return `import requests

url = "${endpointUrl}"
data = {
    "prompt": "Your question here"
}

response = requests.post(url, json=data)
result = response.json()
print(result["response"])`;
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "API Deployment" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Deploy your trained models as REST APIs for integration" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Deploy New Model" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Trained Model" }), _jsxs("select", { value: selectedModel, onChange: (e) => setSelectedModel(e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Choose a model..." }), _jsx("option", { value: "llama-7b-custom", children: "Llama 7B (Custom)" }), _jsx("option", { value: "mistral-7b-finetuned", children: "Mistral 7B (Fine-tuned)" }), _jsx("option", { value: "phi-3-mini-custom", children: "Phi-3 Mini (Custom)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Endpoint Name (Optional)" }), _jsx("input", { type: "text", value: endpointName, onChange: (e) => setEndpointName(e.target.value), placeholder: "e.g., customer-support-bot", className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), _jsxs("button", { onClick: deployModel, disabled: isDeploying || !selectedModel, className: "inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50", children: [_jsx(Server, { className: "h-5 w-5 mr-2" }), isDeploying ? 'Deploying...' : 'Deploy Model'] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Active Deployments" }) }), _jsx("div", { className: "divide-y divide-gray-200", children: deployments.length === 0 ? (_jsx("div", { className: "px-6 py-8 text-center text-gray-500", children: "No deployments found. Deploy your first model to see it here." })) : (deployments.map((deployment) => (_jsxs("div", { className: "px-6 py-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Server, { className: "h-8 w-8 text-primary-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: deployment.model_id }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Deployed: ", new Date(deployment.created_date).toLocaleDateString()] })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deployment.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'}`, children: deployment.status }) })] }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Endpoint:" }), _jsx("code", { className: "text-sm bg-gray-100 px-2 py-1 rounded", children: deployment.endpoint_url }), _jsx("button", { onClick: () => copyToClipboard(deployment.endpoint_url), className: "text-gray-400 hover:text-gray-600", children: _jsx(Copy, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { onClick: () => testEndpoint(deployment.endpoint_url), disabled: testingEndpoint === deployment.endpoint_url, className: "inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50", children: [_jsx(Play, { className: "h-4 w-4 mr-1" }), testingEndpoint === deployment.endpoint_url ? 'Testing...' : 'Test API'] }), _jsxs("button", { className: "inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50", children: [_jsx(Settings, { className: "h-4 w-4 mr-1" }), "Configure"] }), _jsxs("button", { className: "inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50", children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-1" }), "View Docs"] })] })] })] }, deployment.id)))) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "API Testing" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Test Prompt" }), _jsx("textarea", { value: testPrompt, onChange: (e) => setTestPrompt(e.target.value), rows: 3, className: "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Enter your test prompt here..." })] }), testResponse && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Response" }), _jsx("div", { className: "bg-gray-50 border border-gray-300 rounded-md p-3", children: _jsx("p", { className: "text-sm text-gray-900 whitespace-pre-wrap", children: testResponse }) })] }))] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Integration Examples" }), _jsx("div", { className: "space-y-6", children: deployments.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: "cURL" }), _jsx("button", { onClick: () => copyToClipboard(generateCurlExample((deployments[0]?.endpoint_url ?? '') ?? '')), className: "text-sm text-primary-600 hover:text-primary-700", children: "Copy" })] }), _jsx("pre", { className: "bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto", children: generateCurlExample((deployments[0]?.endpoint_url ?? '') ?? '') })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: "Python" }), _jsx("button", { onClick: () => copyToClipboard(generatePythonExample((deployments[0]?.endpoint_url ?? '') ?? '')), className: "text-sm text-primary-600 hover:text-primary-700", children: "Copy" })] }), _jsx("pre", { className: "bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto", children: generatePythonExample((deployments[0]?.endpoint_url ?? '') ?? '') })] })] })) })] })] }));
};
export default APIDeployment;
