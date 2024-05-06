import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import readline from 'readline'
import SpotifyTrackResType from './types/SpotifyTrackListResType'
import yts from 'yt-search'
import { BrowserWindow } from 'electron/main'
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import settings, { file } from 'electron-settings'
import fs from 'fs'
import path from 'path'
import ffmetadata from 'ffmetadata'
import * as mm from 'music-metadata';

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
    windowToSendLogsTo.webContents.send('send-download-log', { message: message, progress: progress, playlistName: playlistName })
  }

  logToRenderer(`initiating backup of: ${tracks.href}`)

  const directory = getDirectory(playlistName)
  if(!directory) {
    logToRenderer("Directory doesn't exist")
    return
  }
  
  const songIds = await extractSongIdsFromMetadata(directory, logToRenderer)

  // filter out any track that has already been downloaded
  const filteredTracks = tracks.items
    .filter(item => !(songIds.includes(item.track.id)))

  downloadSpotifyTrackList(filteredTracks, directory, logToRenderer)
}

function getDirectory(playlistName: string) {
  const directory: string = settings.getSync('directory') as string
  if(!fs.existsSync(directory)) {
    return
  }

  const finalDir = path.join(directory, playlistName)
  if (!fs.existsSync(finalDir)){
    fs.mkdirSync(finalDir);
  }

  return finalDir
}

async function extractSongIdsFromMetadata(directory: string, logger: Function){
  const files = await fs.promises.readdir(directory);

  let existingSongIds: string[] = []
  await Promise.all(files.map(async fileName => {
    if(!fileName.endsWith(".mp3")){ return }
    
    let metadata: mm.IAudioMetadata
    try {
      metadata = await mm.parseFile(path.join(directory, fileName))
    } catch(e) {
      return
    }
    
    const txxxCommentObj = metadata.native["ID3v2.4"]
      .find(item => item.id == "TXXX:comment")

    if (!txxxCommentObj) {
      logger("TXXX.comment not found in metadata.")
      return;
    }

    const txxxComment: string = txxxCommentObj.value
    const filteredComment = txxxComment.split(' WARNING: ')[0]
    existingSongIds.push(filteredComment)
    logger(`filtered ${filteredComment}`)
  }));

  return existingSongIds
}

function downloadSpotifyTrackList(trackList, directory: string, logger: Function) {
  let rawProgress = 0
  trackList.forEach(async (item) => {
    let artistsString = ''
    item.track.artists.forEach((a) => (artistsString += a.name + ', '))
    artistsString = artistsString.substring(0, artistsString.length - 2)

    const searchQuery = `${artistsString} ${item.track.name} official audio`
    // todo: make the above more elegant

    logger(`Searching for: ${searchQuery}`)

    const videoUrl = (await yts(searchQuery)).videos[0].url

    logger(`Attempting to download ${videoUrl}`)

    const audioStream = ytdl(videoUrl, {
      quality: 'highestaudio'
    })
    const albumCoverUrl = item.track.album.images[0].url
    // todo: error handling for the above

    const start = Date.now()

    const songPath = `${directory}/${item.track.name.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '')}.mp3`;
    
    const saveCoverArt: boolean = (await settings.getSync('saveCoverArt')) as boolean
    
    // todo: make this more concise
    if(saveCoverArt) {
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
        .outputOptions('-map', '0:a')
        .outputOptions('-map', '[cover_scaled]')
        .outputOptions('-metadata', `title=${item.track.name}`)
        .outputOptions('-metadata', `album=${item.track.album.name}`)
        .outputOptions('-metadata', `artist=${artistsString}`)
        //.outputOptions('-metadata', `album_artist=${item.track.album.artists[0].name}`)
        .outputOptions('-metadata', `comment=${item.track.id} WARNING: DO NOT CHANGE OR LOCALFY WILL NOT KNOW WHAT SONG THIS IS.`)
        .audioBitrate(128)
        .save(songPath)
        .on('progress', (p) => {
          readline.cursorTo(process.stdout, 0)
          process.stdout.write(`${p.targetSize}kb downloaded`)
          // todo: make the above 2 lines compatible with the log to renderer thing
        })
        .on('end', () => {
          rawProgress += 1
          logger(`\ndownloaded ${item.track.name} in ${(Date.now() - start) / 1000}s`, (rawProgress / trackList.length) * 100)
        })
    } else {
      ffmpeg()
        .input(audioStream)
        .outputOptions('-metadata', `title=${item.track.name}`)
        .outputOptions('-metadata', `album=${item.track.album.name}`)
        .outputOptions('-metadata', `artist=${artistsString}`)
        //.outputOptions('-metadata', `album_artist=${item.track.album.artists[0].name}`)
        .outputOptions('-metadata', `comment=${item.track.id} WARNING: DO NOT CHANGE OR LOCALFY WILL NOT KNOW WHAT SONG THIS IS.`)
        .audioBitrate(128)
        .save(songPath)
        .on('progress', (p) => {
          readline.cursorTo(process.stdout, 0)
          process.stdout.write(`${p.targetSize}kb downloaded`)
          // todo: make the above 2 lines compatible with the log to renderer thing
        })
        .on('end', () => {
          rawProgress += 1
          logger(`\ndownloaded ${item.track.name} in ${(Date.now() - start) / 1000}s`, (rawProgress / trackList.length) * 100)
        })
    }
  })
}
