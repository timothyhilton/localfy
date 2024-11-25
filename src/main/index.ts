import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import startBackup from './backupHelper'
import settings from 'electron-settings'
import BackupHelperType from './types/BackupHelperType'
import defaultSettingsValues from '../../resources/defaultSettingsValues.json'

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // setup protocol "fyfy://"
  const protocolName = 'fyfy'
  if (process.defaultApp && process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(protocolName, process.execPath, [resolve(process.argv[1])])
  } else {
    app.setAsDefaultProtocolClient(protocolName)
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('startBackup', (_event, data: BackupHelperType) => {
    startBackup(data.tracks, data.folderName, mainWindow)
  })

  ipcMain.on('startAuthFlow', async (_event) => {
    const client_id = await settings.get('client_id')
    const codeChallenge = await settings.get('code_challenge')

    console.log("codeChallenge", codeChallenge)
    shell.openExternal(
      `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=playlist-read-private%20user-read-recently-played%20user-library-read%20playlist-read-collaborative&redirect_uri=fyfy%3A%2F%2Fredirect&code_challenge=${codeChallenge}&code_challenge_method=S256`
    )
  })

  ipcMain.handle('changeDirectory', async () => {
    const directory = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (directory.filePaths[0]) {
      settings.set('directory', directory.filePaths[0])
    }
    return directory.filePaths[0]
  })

  ipcMain.handle('getDirectory', async () => {
    return await settings.get('directory')
  })

  ipcMain.handle('getSetting', async (_event, setting: string) => {
    try {
      if (!(await settings.has(setting))) {
        await settings.set(setting, defaultSettingsValues[setting])
      }

      return await settings.get(setting)
    } catch (error) {
      console.error(`Error getting setting ${setting}:`, error)
      return defaultSettingsValues[setting]
    }
  })

  ipcMain.handle('setSetting', async (_event, data: { setting: string; value: any }) => {
    try {
      await settings.set(data.setting, data.value)
    } catch (error) {
      console.error(`Error setting ${data.setting}:`, error)
      throw error
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// protocol handling for windows and linux
if (process.platform == 'win32' || process.platform == 'linux') {
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (_event, commandLine) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
      handleAuthCallback(commandLine.pop()!)
    })
  }
}

// protocol handler for mac
if (process.platform == 'darwin') {
  app.on('open-url', (_event, url) => {
    handleAuthCallback(url)
  })
}

async function handleAuthCallback(url: string) {
  const code = url.match(/code=([^&]+)/)?.[1]

  if (code) {
    const codeVerifier = await settings.get('code_verifier')
    if (!codeVerifier) {
      console.error('No code verifier found')
      return
    }
    const token = await exchangeCodeForToken(code, codeVerifier as string)
    mainWindow.webContents.send('set-token', token)
  }
}

async function exchangeCodeForToken(code: string, codeVerifier: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'fyfy://redirect',
      client_id: await settings.get('client_id') as string,
      code_verifier: codeVerifier,
    }),
  })

  const data = await response.json()
  await settings.set('refresh_token', data.refresh_token)

  return data.access_token
}
