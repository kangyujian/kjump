/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_SERVER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ElectronAPI {
  getAllLinks: () => Promise<any[]>;
  searchLinks: (query: string) => Promise<any[]>;
  createLink: (link: any) => Promise<any>;
  deleteLink: (id: number) => Promise<void>;
  incrementVisitCount: (id: number) => Promise<void>;
  openUrl: (url: string) => Promise<void>;
  setDockIcon: (dataUrl: string) => Promise<void>;
}

interface Window {
  electronAPI: ElectronAPI;
}
