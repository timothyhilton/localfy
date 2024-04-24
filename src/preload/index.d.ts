import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  // renderer -> main
  startAuthFlow: (client_id: string) => void
  startBackup: (data: BackupHelperType) => void

  // main -> renderer
  onSetToken: (callback: Function) => string
  onDownloadLog: (callback: Function) => { message: string; progress: number }

  // renderer -> main -> renderer
  changeDirectory: () => Promise<string>
  getDirectory: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
