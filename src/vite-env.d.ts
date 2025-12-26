/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_SERVER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ElectronAPI {
  searchLinks: (query: string, tag?: string) => Promise<any[]>
  getAllLinks: () => Promise<any[]>
  createLink: (link: any) => Promise<any>
  updateLink: (id: number, title: string, url: string, tags?: string) => Promise<void>
  deleteLink: (id: number) => Promise<void>
  incrementVisitCount: (id: number) => Promise<void>
  openUrl: (url: string) => Promise<void>
  setDockIcon: (dataUrl: string) => Promise<void>
  getTasksByDate: (date: string) => Promise<any[]>
  createTask: (task: { title: string; notes?: string; date: string }) => Promise<any>
  updateTask: (id: number, fields: { title?: string; notes?: string; date?: string }) => Promise<void>
  toggleTaskCompleted: (id: number, completed: boolean) => Promise<void>
  deleteTask: (id: number) => Promise<void>
}

interface Window {
  electronAPI: ElectronAPI
}
