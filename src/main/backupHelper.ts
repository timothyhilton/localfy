import { dialog } from "electron"
import { exec, ExecException } from 'child_process';
import ytdl from 'ytdl-core';
import fs from "fs";
import ffmpeg from "fluent-ffmpeg"
import readline from "readline";

const url = "https://www.youtube.com/watch?v=o8LRks7K-8o";

export default async function startBackup(playlistId: string){
    console.log(`initiating backup of playlist with id: ${playlistId}`)

    const directory = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if(directory.canceled) { console.log("cancelled") }

    console.log(directory.filePaths[0])

    let id = '7wNb0pHyGuI';

    let stream = ytdl(id, {
        quality: 'highestaudio',
    });

    let start = Date.now();

    ffmpeg(stream)
        .audioBitrate(128)
        .save(`${directory.filePaths[0]}/${id}.mp3`)
        .on('progress', p => {
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${p.targetSize}kb downloaded`);
        })
        .on('end', () => {
            console.log(`\ndownloaded ${id} in ${(Date.now() - start) / 1000}s`);
        });
}