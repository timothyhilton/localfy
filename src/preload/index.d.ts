import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  // renderer -> main
  startAuthFlow: () => void
  startBackup: (data: BackupHelperType) => void
  setSetting: (data: { setting: string, value: any }) => void

  // main -> renderer
  onSetToken: (callback: Function) => string
  onDownloadLog: (callback: Function) => { message: string; progress: number; folderName: string }

  // renderer -> main -> renderer
  changeDirectory: () => Promise<string>
  getDirectory: () => Promise<string>
  getSetting: (setting: string) => Promise<any>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
