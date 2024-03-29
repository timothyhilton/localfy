import { ipcMain, shell } from "electron"


export function setupIpcMainOns(): void{

    ipcMain.on('openExternal', (event, link: string) => {
        shell.openExternal(link)
    })

}