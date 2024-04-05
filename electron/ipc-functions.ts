import { ipcMain, shell } from "electron"


export function setupIpcMainOns(): void{

    ipcMain.on('startAuthFlow', (_event, client_id: string) => {
        shell.openExternal(`https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=playlist-read-private%20playlist-read-collaborative&redirect_uri=fyfy%3A%2F%2Fredirect&state=test`)
    })

}