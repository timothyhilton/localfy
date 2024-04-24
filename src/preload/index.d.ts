import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  startAuthFlow: (client_id: string) => void
  onSetToken: (callback: Function) => string
  onDownloadLog: (callback: Function) => { message: string; progress: number }
  startBackup: (playlistId: string) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
