/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_SERVER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  electronAPI: {
    searchLinks: (query: string) => Promise<Link[]>
    getAllLinks: () => Promise<Link[]>
    createLink: (link: Omit<Link, 'id' | 'visit_count' | 'created_at' | 'updated_at'>) => Promise<Link>
    deleteLink: (id: number) => Promise<void>
    incrementVisitCount: (id: number) => Promise<void>
    openUrl: (url: string) => Promise<void>
  }
}