import { dialog } from 'electron'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import readline from 'readline'
import SpotifyTrackResType from './types/SpotifyTrackListResType'
import yts from 'yt-search'

export default async function startBackup(tracks: SpotifyTrackResType): Promise<void> {
  console.log(`initiating backup of: ${tracks.href}`)

  const directory = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (directory.canceled) {
    console.log('cancelled')
  }

  tracks.items.forEach(async (item) => {
    let artistsString = ''
    item.track.artists.forEach((a) => (artistsString += a.name + ' '))
    const searchQuery = `${artistsString}${item.track.name} official audio`
    // todo: make the above more elegant
    console.log(searchQuery)

    const videoUrl = (await yts(searchQuery)).videos[0].url

    console.log(videoUrl)

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
      })
      .on('end', () => {
        console.log(`\ndownloaded ${item.track.name} in ${(Date.now() - start) / 1000}s`)
      })
  })
}
