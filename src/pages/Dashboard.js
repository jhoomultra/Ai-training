import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Database, Cpu, Play, TrendingUp, Server, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const Dashboard = () => {
    const [stats, setStats] = useState({
        totalDatasets: 0,
        trainedModels: 0,
        activeTraining: 0,
        deployedAPIs: 0
    });
    const [recentActivity, setRecentActivity] = useState([
        { id: 1, action: 'Dataset uploaded', name: 'customer_support.jsonl', time: '2 hours ago' },
        { id: 2, action: 'Model training completed', name: 'llama-7b-custom', time: '4 hours ago' },
        { id: 3, action: 'API deployed', name: 'support-bot-v1', time: '1 day ago' },
    ]);
    const trainingData = [
        { name: 'Day 1', loss: 2.4, accuracy: 0.65 },
        { name: 'Day 2', loss: 1.8, accuracy: 0.72 },
        { name: 'Day 3', loss: 1.2, accuracy: 0.81 },
        { name: 'Day 4', loss: 0.9, accuracy: 0.87 },
        { name: 'Day 5', loss: 0.6, accuracy: 0.92 },
    ];
    useEffect(() => {
        // Fetch dashboard stats from API
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            }
            catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);
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
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Monitor your AI training pipeline and model performance" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: stat.title }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stat.value })] }), _jsx("div", { className: `p-3 rounded-full ${stat.color}`, children: _jsx(Icon, { className: "h-6 w-6 text-white" }) })] }), _jsxs("div", { className: "mt-4 flex items-center", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-green-500" }), _jsx("span", { className: "text-sm text-green-600 ml-1", children: stat.change }), _jsx("span", { className: "text-sm text-gray-500 ml-1", children: "from last month" })] })] }, index));
                }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Training Progress" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: trainingData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "accuracy", stroke: "#3b82f6", strokeWidth: 2, name: "Accuracy" })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Activity" }), _jsx("div", { className: "space-y-4", children: recentActivity.map((activity) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Activity, { className: "h-5 w-5 text-gray-400" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: activity.action }), _jsx("p", { className: "text-sm text-gray-500", children: activity.name })] }), _jsx("div", { className: "flex-shrink-0 text-sm text-gray-500", children: activity.time })] }, activity.id))) })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("button", { className: "flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors", children: [_jsx(Database, { className: "h-5 w-5 mr-2" }), "Upload New Dataset"] }), _jsxs("button", { className: "flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors", children: [_jsx(Play, { className: "h-5 w-5 mr-2" }), "Start Training"] }), _jsxs("button", { className: "flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors", children: [_jsx(Server, { className: "h-5 w-5 mr-2" }), "Deploy API"] })] })] })] }));
};
export default Dashboard;
