import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginScreen from './LoginScreen.tsx'
import '../globals.css'
import { ThemeProvider } from './components/theme-provider.tsx'
import { ModeToggle } from './components/mode-toggle.tsx'

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

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
})