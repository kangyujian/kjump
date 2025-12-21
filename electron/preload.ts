import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('electronAPI', {
  getAllLinks: () => ipcRenderer.invoke('get-all-links'),
  searchLinks: (query: string, tag?: string) => ipcRenderer.invoke('search-links', query, tag),
  createLink: (link: any) => ipcRenderer.invoke('create-link', link),
  updateLink: (id: number, title: string, url: string, tags?: string) => ipcRenderer.invoke('update-link', id, title, url, tags),
  deleteLink: (id: number) => ipcRenderer.invoke('delete-link', id),
  incrementVisitCount: (id: number) => ipcRenderer.invoke('increment-visit-count', id),
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
  setDockIcon: (dataUrl: string) => ipcRenderer.invoke('set-dock-icon', dataUrl),
})
