import { app, shell, BrowserWindow, ipcMain, globalShortcut, dialog, nativeImage } from 'electron'
import { release } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
// import { updateElectronApp, UpdateSourceType } from 'update-electron-app'
import { initDatabase, searchLinks, getAllLinks, createLink, updateLink, deleteLink, incrementVisitCount, closeDatabase, getTasksByDate, createTask, updateTask, deleteTask, toggleTaskCompleted } from '../src/services/database'
import { openUrl } from '../src/services/urlLauncher'
import { getAllSettings } from '../src/services/settings'
import { Link } from '../src/types/link'
import * as fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Logger helper
function logToFile(message: string) {
  const logPath = join(app.getPath('userData'), 'main.log')
  const timestamp = new Date().toISOString()
  fs.appendFileSync(logPath, `${timestamp} - ${message}\n`)
}


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

// Set application name
app.setName('KJump')

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

logToFile('Checking single instance lock...')
if (!app.requestSingleInstanceLock()) {
    logToFile('Failed to acquire single instance lock, quitting.')
    app.quit()
    process.exit(0)
  }
  
  let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/preload.cjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

process.on('uncaughtException', (error) => {
  dialog.showErrorBox('Uncaught Exception', error.stack || error.message)
})

async function createWindow() {
  logToFile('Creating window...')
  try {
  // 获取保存的窗口设置
  const settings = await getSettingsFromDatabase()
  
  win = new BrowserWindow({
    title: 'KJump',
    icon: join(process.env.PUBLIC || '', 'icon.jpg'),
    width: parseInt((settings.window_width || '600') as string, 10),
    height: parseInt((settings.window_height || '400') as string, 10),
    minWidth: 400,
    minHeight: 300,
    frame: true,
    transparent: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload,
      // Enable contextIsolation for security and to allow contextBridge usage
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  })

  win.once('ready-to-show', () => {
    logToFile('Window ready to show')
    win?.show()
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
  // updateElectronApp({
  //   updateSource: {
  //     type: UpdateSourceType.ElectronPublicUpdateService,
  //   },
  // })
  } catch (error) {
    logToFile(`Failed to create window: ${(error as Error).message}`)
    dialog.showErrorBox('Failed to create window', (error as Error).stack || (error as Error).message)
  }
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
      global_shortcut: 'Alt+Space'
    }
  }
}

app.whenReady().then(() => {
  try {
    // 初始化数据库
    initDatabase()
  } catch (error) {
    dialog.showErrorBox('Database Initialization Error', (error as Error).stack || (error as Error).message)
    return
  }
  
  // 创建窗口
  createWindow()

  // 设置 macOS Dock 图标
  if (process.platform === 'darwin') {
    app.dock.setIcon(join(process.env.PUBLIC || '', 'icon.jpg'))
  }

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
  // 默认快捷键 - Option+空格 (macOS) / Alt+空格 (Windows/Linux)
  const shortcut = process.platform === 'darwin' ? 'Alt+Space' : 'Alt+Space'
  
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

  // 任务页面快捷键 Alt+Shift+T
  const tasksShortcut = 'Alt+Shift+T'
  const ok = globalShortcut.register(tasksShortcut, () => {
    if (win) {
      if (!win.isVisible()) {
        win.show()
      }
      win.focus()
      win.webContents.send('navigate-to-tasks')
    }
  })
  if (!ok) {
    console.log('任务页面快捷键注册失败')
  }
}

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  logToFile('Second instance detected')
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    if (!win.isVisible()) win.show()
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
ipcMain.handle('search-links', async (_event, query: string, tag?: string) => {
  return searchLinks(query, tag)
})

ipcMain.handle('get-all-links', async () => {
  return getAllLinks()
})

ipcMain.handle('create-link', async (_event, link: Omit<Link, 'id' | 'visit_count' | 'created_at' | 'updated_at'>) => {
  return createLink(link)
})

ipcMain.handle('update-link', async (_event, id: number, title: string, url: string, tags?: string) => {
  return updateLink(id, title, url, tags)
})

ipcMain.handle('delete-link', async (_event, id: number) => {
  return deleteLink(id)
})

ipcMain.handle('increment-visit-count', async (_event, id: number) => {
  return incrementVisitCount(id)
})

ipcMain.handle('open-url', async (_event, url: string) => {
  return openUrl(url)
})

ipcMain.handle('set-dock-icon', async (_event, dataUrl: string) => {
  if (process.platform === 'darwin') {
    const image = nativeImage.createFromDataURL(dataUrl)
    app.dock.setIcon(image)
  }
})

// 任务管理 IPC
ipcMain.handle('get-tasks-by-date', async (_event, date: string) => {
  return getTasksByDate(date)
})

ipcMain.handle('create-task', async (_event, task: { title: string; notes?: string; date: string }) => {
  return createTask(task)
})

ipcMain.handle('update-task', async (_event, id: number, fields: { title?: string; notes?: string; date?: string }) => {
  return updateTask(id, fields)
})

ipcMain.handle('toggle-task-completed', async (_event, id: number, completed: boolean) => {
  return toggleTaskCompleted(id, completed)
})

ipcMain.handle('delete-task', async (_event, id: number) => {
  return deleteTask(id)
})
