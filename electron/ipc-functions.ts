import { contextBridge, ipcMain, ipcRenderer } from "electron"

export function setupIpcMainOns(): void{

    ipcMain.on('consolelog', (message) => {
        console.log(message);
    })

}

export function setupContextBridge(): void{

    contextBridge.exposeInMainWorld('myAPI', {
        consolelog: (message: string) => ipcRenderer.send('consolelog', message)
    })
    
}