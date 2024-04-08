import { dialog } from "electron"
import youtubedl from "youtube-dl-exec"
import createLogger from "progress-estimator"
import { join } from "path";

const logger = createLogger({
    storagePath: join(__dirname, '.progress-estimator'),
});

export default async function initiateBackup(playlistId: string){
    console.log(`initiating backup of playlist with id: ${playlistId}`)

    const directory = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if(directory.canceled) { console.log("bruh") }

    console.log(directory.filePaths[0])

    try {
        const videoDownload = youtubedl("https://www.youtube.com/watch?v=o8LRks7K-8o", {
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
            output: `${directory.filePaths[0]}/%(title)s.%(ext)s`
        });

        const result = await logger(videoDownload, `Obtaining https://www.youtube.com/watch?v=o8LRks7K-8o`);
        console.log(result);
        
    } catch (error) {
        console.error('Failed to download video', error);
    }
}