import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  screen,
  Tray,
  Menu,
  globalShortcut,
  dialog
} from 'electron'
import path, { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { readFileSync, writeFileSync } from 'fs'

const isFirstInstance = app.requestSingleInstanceLock()
if (!isFirstInstance) {
  app.quit()
} else {
  let mainWindow: undefined | BrowserWindow = undefined
  function createMainWindow() {
    const { width, height } = screen.getPrimaryDisplay().size
    console.log(width, height)
    const window = new BrowserWindow({
      icon,
      type: 'desktop',
      alwaysOnTop: false,
      frame: false,
      transparent: true,
      width
    })
    mainWindow = window
    window.setIgnoreMouseEvents(true)
    window.setPosition(0, 0)
    window.setSkipTaskbar(true)
    ipcMain.on('open-devtools', (e) => {
      window.setIgnoreMouseEvents(false)
      window.webContents.openDevTools()
      window.webContents.on('devtools-closed', () => {
        window.setIgnoreMouseEvents(true)
      })
    })
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      window.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
    window.on('ready-to-show', () => {
      window.show()
    })
  }

  let settingsWindow: undefined | BrowserWindow = undefined
  function createSettingsWindow() {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.show()
      return
    }
    const window = new BrowserWindow({
      icon,
      show: false,
      title: '中考倒计时 - 设置',
      webPreferences: {
        preload: resolve(__dirname, '../preload/index.js'),
        nodeIntegration: true
      }
    })
    window.removeMenu()
    window.on('ready-to-show', () => window.show())
    settingsWindow = window
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/settings.html')
    } else {
      window.loadFile(path.join(__dirname, '../renderer/settings.html'))
    }
  }

  ipcMain.on('switch-autorun', (_, checked: boolean) => {
    app.setLoginItemSettings({
      openAtLogin: checked,
      openAsHidden: false
    })
  })
  ipcMain.on('export-exams', async (ev, content: string) => {
    let r = await dialog.showSaveDialog(settingsWindow as BrowserWindow, {
      title: '导出日期数据',
      filters: [{ name: 'JSON配置文件', extensions: ['json'] }]
    })
    if (!r.canceled) {
      writeFileSync(r.filePath, content)
    }
  })
  ipcMain.handle('import-exams', async (ev) => {
    let r = await dialog.showOpenDialog(settingsWindow as BrowserWindow, {
      title: '导入日期数据',
      filters: [{ name: 'JSON配置文件', extensions: ['json'] }]
    })
    if (!r.canceled) {
      return readFileSync(r.filePaths[0]).toString('utf-8')
    }
    return false
  })
  app.on('second-instance', (ev) => {
    createSettingsWindow()
  })
  app.on('ready', () => {
    const trayIcon = new Tray(icon)
    const menu = Menu.buildFromTemplate([
      {
        label: '设置',
        click() {
          createSettingsWindow()
        }
      },
      {
        label: '退出',
        click() {
          app.quit()
        }
      }
    ])
    trayIcon.setContextMenu(menu)
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      settingsWindow?.webContents.openDevTools()
    })
    createMainWindow()
  })
}
