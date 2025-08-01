import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
const DatasetUpload = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const onDrop = useCallback(async (acceptedFiles) => {
        setIsUploading(true);
        for (const file of acceptedFiles) {
            const fileId = Math.random().toString(36).substr(2, 9);
            const newFile = {
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'uploading',
                progress: 0
            };
            setUploadedFiles(prev => [...prev, newFile]);
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('file_id', fileId);
                const response = await fetch('/api/upload/dataset', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    setUploadedFiles(prev => prev.map(f => f.id === fileId
                        ? { ...f, status: 'completed', progress: 100 }
                        : f));
                    toast.success(`${file.name} uploaded successfully!`);
                }
                else {
                    throw new Error('Upload failed');
                }
            }
            catch (error) {
                setUploadedFiles(prev => prev.map(f => f.id === fileId
                    ? { ...f, status: 'error', progress: 0 }
                    : f));
                toast.error(`Failed to upload ${file.name}`);
            }
        }
        setIsUploading(false);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/json': ['.json', '.jsonl'],
            'text/csv': ['.csv'],
            'text/plain': ['.txt']
        },
        multiple: true
    });
    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Upload Dataset" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Upload your training data in CSV, JSON, JSONL, or TXT format" })] }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { ...getRootProps(), className: `border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'}`, children: [_jsx("input", { ...getInputProps() }), _jsx(Upload, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("p", { className: "mt-4 text-lg font-medium text-gray-900", children: isDragActive ? 'Drop files here' : 'Drag & drop files here' }), _jsx("p", { className: "mt-2 text-sm text-gray-500", children: "or click to browse files" }), _jsx("p", { className: "mt-2 text-xs text-gray-400", children: "Supported formats: CSV, JSON, JSONL, TXT (Max 100MB per file)" })] }) }), uploadedFiles.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Uploaded Files" }) }), _jsx("div", { className: "divide-y divide-gray-200", children: uploadedFiles.map((file) => (_jsxs("div", { className: "px-6 py-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(File, { className: "h-8 w-8 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: file.name }), _jsx("p", { className: "text-sm text-gray-500", children: formatFileSize(file.size) })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [file.status === 'uploading' && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-primary-600 h-2 rounded-full transition-all duration-300", style: { width: `${file.progress}%` } }) }), _jsxs("span", { className: "text-sm text-gray-500", children: [file.progress, "%"] })] })), file.status === 'completed' && (_jsx(CheckCircle, { className: "h-5 w-5 text-green-500" })), file.status === 'error' && (_jsx(AlertCircle, { className: "h-5 w-5 text-red-500" })), _jsx("button", { onClick: () => removeFile(file.id), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-5 w-5" }) })] })] }, file.id))) })] })), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Dataset Format Guide" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "JSONL Format (Recommended)" }), _jsx("pre", { className: "bg-gray-50 p-3 rounded text-sm overflow-x-auto", children: `{"instruction": "What is AI?", "output": "AI is..."}
{"instruction": "Explain ML", "output": "ML is..."}` })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "CSV Format" }), _jsx("pre", { className: "bg-gray-50 p-3 rounded text-sm overflow-x-auto", children: `instruction,output
"What is AI?","AI is..."
"Explain ML","ML is..."` })] })] })] })] }));
};
export default DatasetUpload;
