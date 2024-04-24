import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginScreen from '@renderer/LoginScreen'
import './globals.css'
import { ThemeProvider } from '@renderer/components/theme-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <LoginScreen />
        </ThemeProvider>
    </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')