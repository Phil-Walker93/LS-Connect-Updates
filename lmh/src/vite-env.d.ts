/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HUB_URL?: string
  readonly VITE_LS_CONNECT_URL?: string
  readonly VITE_PCAD_URL?: string
  readonly VITE_BANKING_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
