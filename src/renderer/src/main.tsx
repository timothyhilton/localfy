import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginScreen from '@renderer/LoginScreen'
import './globals.css'
import { ThemeProvider } from '@renderer/components/theme-provider'
import { ModeToggle } from '@renderer/components/mode-toggle'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            {<>
                <LoginScreen />
                <ModeToggle />
            </>}
        </ThemeProvider>
    </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// // Use contextBridge
// window.ipcRenderer.on('main-process-message', (_event, message) => {
//     console.log(message)
// })