import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';


import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
        <BrowserRouter>
            
            <MantineProvider withGlobalStyles withNormalizeCSS> 
            <AuthProvider>
                <App />
            </AuthProvider>
            </MantineProvider>
        </BrowserRouter>
    </React.StrictMode>

);
