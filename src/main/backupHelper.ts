import { dialog } from "electron"
import youtubedl from "youtube-dl-exec"

export default async function startBackup(playlistId: string){
    console.log(`initiating backup of playlist with id: ${playlistId}`)

    const directory = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if(directory.canceled) { console.log("cancelled") }

    console.log(directory.filePaths[0])

    try {
        const videoDownload = youtubedl("https://www.youtube.com/watch?v=o8LRks7K-8o", {
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
            output: `${directory.filePaths[0]}/%(title)s.%(ext)s`
        });
        const result = await videoDownload
        
    } catch (error) {
        console.error('Failed to download video', error);
    }
}