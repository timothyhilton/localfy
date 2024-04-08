import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  startAuthFlow: (client_id: string) => void,
  onSetToken: (callback: Function) => string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
