import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginScreen from '@renderer/LoginScreen'
import './globals.css'
import { ThemeProvider } from '@renderer/components/theme-provider'
import { isUserLoggedIn } from './components/api-util'
import HomePage from './HomePage'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            {
                await isUserLoggedIn() ? <HomePage /> : <LoginScreen />
            }
        </ThemeProvider>
    </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')