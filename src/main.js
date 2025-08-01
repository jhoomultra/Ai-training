import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.js';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsxs(BrowserRouter, { children: [_jsx(App, {}), _jsx(Toaster, { position: "top-right" })] }) }));
