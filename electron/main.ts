import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { updateElectronApp, UpdateSourceType } from 'update-electron-app'
import { initDatabase, searchLinks, getAllLinks, createLink, deleteLink, incrementVisitCount, closeDatabase } from '../src/services/database'
import { openUrl } from '../src/services/urlLauncher'
import { getAllSettings } from '../src/services/settings'
import { Link } from '../src/types/link'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  // 获取保存的窗口设置
  const settings = await getSettingsFromDatabase()
  
  win = new BrowserWindow({
    title: 'Raycast Link Manager',
    icon: join(process.env.PUBLIC || '', 'favicon.ico'),
    width: parseInt((settings.window_width || '600') as string, 10),
    height: parseInt((settings.window_height || '400') as string, 10),
    minWidth: 400,
    minHeight: 300,
    frame: false,
    transparent: true,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (url) { // electron-vite dev mode
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Apply electron-updater
  updateElectronApp({
    updateSource: {
      type: UpdateSourceType.ElectronPublicUpdateService,
    },
  })
}

/**
 * 从数据库获取设置
 */
async function getSettingsFromDatabase() {
  try {
    const settings = await getAllSettings()
    return settings
  } catch (error) {
    console.error('获取设置失败:', error)
    return {
      window_width: '600',
      window_height: '400',
      global_shortcut: 'Command+Shift+L'
    }
  }
}

app.whenReady().then(() => {
  // 初始化数据库
  initDatabase()
  
  // 创建窗口
  createWindow()

  app.on('browser-window-created', (_, window) => {
    // 默认设置窗口为隐藏
    window.setMenuBarVisibility(false)
  })

  // 注册全局快捷键
  registerGlobalShortcuts()

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
      allWindows[0].focus()
    } else {
      createWindow()
    }
  })
})

/**
 * 注册全局快捷键
 */
function registerGlobalShortcuts() {
  // 默认快捷键
  const shortcut = 'Command+Shift+L'
  
  // 注册全局快捷键
  const ret = globalShortcut.register(shortcut, () => {
    if (win) {
      if (win.isVisible()) {
        win.hide()
      } else {
        win.show()
        win.focus()
      }
    }
  })

  if (!ret) {
    console.log('全局快捷键注册失败')
  }
}

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('will-quit', () => {
  // 注销所有全局快捷键
  globalShortcut.unregisterAll()
  
  // 关闭数据库连接
  closeDatabase()
})

// IPC 通信处理
ipcMain.handle('search-links', async (event, query: string) => {
  return searchLinks(query)
})

ipcMain.handle('get-all-links', async () => {
  return getAllLinks()
})

ipcMain.handle('create-link', async (event, link: Omit<Link, 'id' | 'visit_count' | 'created_at' | 'updated_at'>) => {
  return createLink(link)
})

ipcMain.handle('delete-link', async (event, id: number) => {
  return deleteLink(id)
})

ipcMain.handle('increment-visit-count', async (event, id: number) => {
  return incrementVisitCount(id)
})

ipcMain.handle('open-url', async (event, url: string) => {
  return openUrl(url)
})