import { contextBridge, ipcRenderer } from 'electron'
import { Link } from './types/link'

const electronAPI = {
  searchLinks: (query: string) => ipcRenderer.invoke('search-links', query),
  getAllLinks: () => ipcRenderer.invoke('get-all-links'),
  createLink: (link: Omit<Link, 'id' | 'visit_count' | 'created_at' | 'updated_at'>) => ipcRenderer.invoke('create-link', link),
  deleteLink: (id: number) => ipcRenderer.invoke('delete-link', id),
  incrementVisitCount: (id: number) => ipcRenderer.invoke('increment-visit-count', id),
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url)
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)