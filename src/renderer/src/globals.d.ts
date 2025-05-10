import { electronAPI } from '@electron-toolkit/preload'

declare namespace Window {
  export let electronAPI: electronAPI
}
