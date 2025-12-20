import { contextBridge, ipcRenderer } from 'electron'
import { Link } from './types/link'

export interface ElectronAPI {
  searchLinks: (query: string) => Promise<Link[]>
  getAllLinks: () => Promise<Link[]>
  createLink: (link: Omit<Link, 'id' | 'visit_count' | 'created_at' | 'updated_at'>) => Promise<Link>
  deleteLink: (id: number) => Promise<void>
  incrementVisitCount: (id: number) => Promise<void>
  openUrl: (url: string) => Promise<void>
}

const electronAPI: ElectronAPI = {
  searchLinks: (query: string) => ipcRenderer.invoke('search-links', query),
  getAllLinks: () => ipcRenderer.invoke('get-all-links'),
  createLink: (link) => ipcRenderer.invoke('create-link', link),
  deleteLink: (id: number) => ipcRenderer.invoke('delete-link', id),
  incrementVisitCount: (id: number) => ipcRenderer.invoke('increment-visit-count', id),
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url)
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}