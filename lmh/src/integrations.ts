export type ExternalModuleId = 'ls-connect' | 'pcad' | 'banking'

export type ModuleTarget = {
  id: ExternalModuleId
  label: string
  envKey: 'VITE_LS_CONNECT_URL' | 'VITE_PCAD_URL' | 'VITE_BANKING_URL'
  url: string
}

const env = import.meta.env

export const hubUrl = env.VITE_HUB_URL?.trim() || window.location.origin

export const moduleTargets: Record<ExternalModuleId, ModuleTarget> = {
  'ls-connect': {
    id: 'ls-connect',
    label: 'LS Connect',
    envKey: 'VITE_LS_CONNECT_URL',
    url: env.VITE_LS_CONNECT_URL?.trim() || '',
  },
  pcad: {
    id: 'pcad',
    label: 'PCAD',
    envKey: 'VITE_PCAD_URL',
    url: env.VITE_PCAD_URL?.trim() || '',
  },
  banking: {
    id: 'banking',
    label: 'LS Banking',
    envKey: 'VITE_BANKING_URL',
    url: env.VITE_BANKING_URL?.trim() || '',
  },
}

export function getModuleTarget(id: ExternalModuleId) {
  return moduleTargets[id]
}

export function hasConfiguredTarget(id: ExternalModuleId) {
  return Boolean(moduleTargets[id].url)
}
