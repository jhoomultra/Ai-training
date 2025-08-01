import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { Brain, Database, Settings, Play, FolderOpen, BarChart3, Cpu } from 'lucide-react';
const Layout = ({ children }) => {
    const location = useLocation();
    const navigation = [
        { name: 'Dashboard', href: '/', icon: BarChart3 },
        { name: 'Upload Dataset', href: '/dataset', icon: Database },
        { name: 'Select Model', href: '/models', icon: Cpu },
        { name: 'Configure Training', href: '/config', icon: Settings },
        { name: 'Training Monitor', href: '/training', icon: Play },
        { name: 'Model Management', href: '/manage', icon: FolderOpen },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Brain, { className: "h-8 w-8 text-primary-600" }), _jsx("h1", { className: "ml-3 text-xl font-bold text-gray-900", children: "AI Training System" })] }), _jsx("div", { className: "flex items-center space-x-4", children: _jsx("span", { className: "text-sm text-gray-500", children: "Internal Use Only" }) })] }) }) }), _jsxs("div", { className: "flex", children: [_jsx("nav", { className: "w-64 bg-white shadow-sm min-h-screen", children: _jsx("div", { className: "p-4", children: _jsx("ul", { className: "space-y-2", children: navigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.href;
                                    return (_jsx("li", { children: _jsxs(Link, { to: item.href, className: `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`, children: [_jsx(Icon, { className: "mr-3 h-5 w-5" }), item.name] }) }, item.name));
                                }) }) }) }), _jsx("main", { className: "flex-1 p-8", children: children })] })] }));
};
export default Layout;
