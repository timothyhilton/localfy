import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import yts from 'yt-search'
import { BrowserWindow } from 'electron/main'
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import settings from 'electron-settings'
import fs from 'fs'
import path from 'path'
import ffmetadata from 'ffmetadata'
import * as mm from 'music-metadata';
import Track from './types/Tracks';

const ffmpegPath = ffmpegStatic!.replace('app.asar', 'app.asar.unpacked');
const ffprobePath = ffprobeStatic.path.replace('app.asar', 'app.asar.unpacked');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
ffmetadata.setFfmpegPath(ffmpegPath);

export default async function startBackup(
  tracks: Track[],
  folderName: string,
  windowToSendLogsTo: BrowserWindow
): Promise<void> {

  function logToRenderer(message: string, progress?: number): void {
    console.log(message)
    windowToSendLogsTo.webContents.send('send-download-log', { message: message, progress: progress, folderName: folderName })
  }

  logToRenderer(`initiating backup of playlist: ${folderName}`)

  const directory = getDirectory(folderName)
  if(!directory) {
    logToRenderer("Directory doesn't exist")
    return
  }
  
  const songIds = await extractSongIdsFromMetadata(directory, logToRenderer)

  // filter out any track that has already been downloaded
  const filteredTracks = tracks.filter(item => !(songIds.includes(item.id)))

  await downloadSpotifyTrackList(filteredTracks, directory, logToRenderer)
}

function getDirectory(folderName: string) {
  const directory: string = settings.getSync('directory') as string
  if(!fs.existsSync(directory)) {
    return
  }

  const finalDir = path.join(directory, folderName)
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
      const error = e as Error
      logger(`Error parsing metadata for ${fileName}: ${error.message}`)
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

async function downloadSpotifyTrackList(trackList: Track[], directory: string, logger: Function) {
  let rawProgress = 0
  await Promise.all(trackList.map(async (item) => {
    const artistsString = item.artists.join(', ');

    const searchQuery = `${artistsString} ${item.name} official audio`
    // todo: make the above more elegant

    logger(`Searching for: ${searchQuery}`)

    try {
      const videoUrl = (await yts(searchQuery)).videos[0].url
      logger(`Attempting to download ${videoUrl}`)

      const audioStream = ytdl(videoUrl, {
        quality: 'highestaudio'
      })
      const albumCoverUrl = item.coverArtUrl
      // todo: error handling for the above

      const start = Date.now()

      const songPath = `${directory}/${item.name.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '')}.mp3`;
      
      const saveCoverArt: boolean = (await settings.getSync('saveCoverArt')) as boolean
      
      const ffmpegOptions = [
        {
          filter: 'scale',
          options: '300:300',
          inputs: '[1:v]',
          outputs: 'cover_scaled',
        },
      ]

      const ffmpegCommand = ffmpeg()
        .input(audioStream)
        .input(albumCoverUrl)
        .complexFilter(ffmpegOptions)
        .outputOptions('-map', '0:a')
        .outputOptions('-map', '[cover_scaled]')
        .outputOptions('-metadata', `title=${item.name}`)
        .outputOptions('-metadata', `album=${item.album}`)
        .outputOptions('-metadata', `artist=${artistsString}`)
        //.outputOptions('-metadata', `album_artist=${item.album.artists[0].name}`)
        .outputOptions('-metadata', `comment=${item.id} WARNING: DO NOT CHANGE OR LOCALFY WILL NOT KNOW WHAT SONG THIS IS.`)
        .audioBitrate(128)
        .save(songPath)
        .on('progress', (p) => {
          logger(`Downloaded ${p.targetSize}kb`)
        })
        .on('end', () => {
          rawProgress += 1
          logger(`\ndownloaded ${item.name} in ${(Date.now() - start) / 1000}s`, (rawProgress / trackList.length) * 100)
        })

      if (saveCoverArt) {
        ffmpegCommand.input(albumCoverUrl)
      }

      await ffmpegCommand.run()
    } catch (e) {
      const error = e as Error
      logger(`Error downloading ${item.name}: ${error.message}`)
    }
  }))
}

