import { dialog } from 'electron'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import readline from 'readline'
import SpotifyTrackResType from './types/SpotifyTrackListResType'
import yts from 'yt-search'
import { BrowserWindow } from 'electron/main'
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import settings from 'electron-settings'
import fs from 'fs'
import path from 'path'
import ffmetadata from 'ffmetadata'

const ffmpegPath = ffmpegStatic!.replace('app.asar', 'app.asar.unpacked');
const ffprobePath = ffprobeStatic.path.replace('app.asar', 'app.asar.unpacked');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
ffmetadata.setFfmpegPath(ffmpegPath);

export default async function startBackup(
  tracks: SpotifyTrackResType,
  playlistName: string,
  windowToSendLogsTo: BrowserWindow
): Promise<void> {

  function logToRenderer(message: string, progress?: number): void {
    console.log(message)
    windowToSendLogsTo.webContents.send('send-download-log', { message: message, progress: progress })
  }

  logToRenderer(`initiating backup of: ${tracks.href}`)

  const directory: string = (await settings.getSync('directory')) as string
  if(!fs.existsSync(directory)) {
    logToRenderer("Error: Directory doesn't exist")
    return
  }

  const finalDir = path.join(directory, playlistName)
  if (!fs.existsSync(finalDir)){
    fs.mkdirSync(finalDir);
  }

  let rawProgress = 0
  tracks.items.forEach(async (item) => {
    let artistsString = ''
    item.track.artists.forEach((a) => (artistsString += a.name + ', '))
    artistsString = artistsString.substring(0, artistsString.length - 2)

    const searchQuery = `${artistsString} ${item.track.name} official audio`
    // todo: make the above more elegant

    logToRenderer(`Searching for: ${searchQuery}`)

    const videoUrl = (await yts(searchQuery)).videos[0].url

    logToRenderer(`Attempting to download ${videoUrl}`)

    const audioStream = ytdl(videoUrl, {
      quality: 'highestaudio'
    })
    const albumCoverUrl = item.track.album.images[0].url
    // todo: error handling for the above

    const start = Date.now()

    const songPath = `${finalDir}/${item.track.name}.mp3`.replace('/[<>:"\/\\|?*\x00-\x1F]/g', '')

    ffmpeg()
      .input(audioStream)
      .input(albumCoverUrl)
      .complexFilter([
        {
          filter: 'scale',
          options: '300:300',
          inputs: '[1:v]',
          outputs: 'cover_scaled',
        },
      ])
      .outputOptions('-map', '0:a') // Ensure audio stream is mapped
      .outputOptions('-map', '[cover_scaled]') // Ensure mapped output from scale filter
      .outputOptions('-metadata', `title=${item.track.name}`)
      .outputOptions('-metadata', `album=${item.track.album.name}`)
      .outputOptions('-metadata', `artist=${artistsString}`)
      .outputOptions('-metadata', `encoded_by=${item.track.id}`)
      .audioBitrate(128)
      .save(songPath)
      .on('progress', (p) => {
        readline.cursorTo(process.stdout, 0)
        process.stdout.write(`${p.targetSize}kb downloaded`)
        // todo: make the above 2 lines compatible with the log to renderer thing
      })
      .on('end', () => {
        rawProgress += 1
        logToRenderer(`\ndownloaded ${item.track.name} in ${(Date.now() - start) / 1000}s`, (rawProgress / tracks.items.length) * 100)
      })
  })
}
