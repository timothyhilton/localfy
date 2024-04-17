import { dialog } from 'electron'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import readline from 'readline'
import SpotifyTrackResType from './types/SpotifyTrackListResType'
import yts from 'yt-search'
import { BrowserWindow } from 'electron/main'

export default async function startBackup(
  tracks: SpotifyTrackResType,
  windowToSendLogsTo: BrowserWindow
): Promise<void> {
  function logToRenderer(message: string): void {
    console.log(message)
    windowToSendLogsTo.webContents.send('send-download-log', message)
  }

  logToRenderer(`initiating backup of: ${tracks.href}`)

  const directory = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (directory.canceled) {
    logToRenderer('cancelled')
  }

  tracks.items.forEach(async (item) => {
    let artistsString = ''
    item.track.artists.forEach((a) => (artistsString += a.name + ' '))
    const searchQuery = `${artistsString}${item.track.name} official audio`
    // todo: make the above more elegant

    logToRenderer(`Searching for: ${searchQuery}`)

    const videoUrl = (await yts(searchQuery)).videos[0].url

    logToRenderer(`Attempting to download ${videoUrl}`)

    const stream = ytdl(videoUrl, {
      quality: 'highestaudio'
    })

    const start = Date.now()

    ffmpeg(stream)
      .audioBitrate(128)
      .save(`${directory.filePaths[0]}/${item.track.name}.mp3`)
      .on('progress', (p) => {
        readline.cursorTo(process.stdout, 0)
        process.stdout.write(`${p.targetSize}kb downloaded`)
        // todo: make the above 2 lines compatible with the log to renderer thing
      })
      .on('end', () => {
        logToRenderer(`\ndownloaded ${item.track.name} in ${(Date.now() - start) / 1000}s`)
      })
  })
}
