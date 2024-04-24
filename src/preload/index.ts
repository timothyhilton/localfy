import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // renderer -> main
  startBackup: (playlistId: string) => ipcRenderer.send('startBackup', playlistId),
  startAuthFlow: (client_id: string) => ipcRenderer.send('startAuthFlow', client_id),
  
  // main -> renderer
  onDownloadLog: (callback: Function) =>
    ipcRenderer.on('send-download-log', (_event, data: { message: string, progress?: number }) => callback(data)),
  onSetToken: (callback: Function) =>
    ipcRenderer.on('set-token', (_event, token: string) => callback(token)),
  
  // renderer -> main -> renderer
  changeDirectory: () => ipcRenderer.invoke('changeDirectory'),
  getDirectory: () => ipcRenderer.invoke('getDirectory'),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
