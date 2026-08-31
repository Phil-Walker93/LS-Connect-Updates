export type ModuleStatus = 'available' | 'prepared' | 'planned'

export type HubModule = {
  id: string
  name: string
  shortName: string
  description: string
  icon: string
  status: ModuleStatus
}

export const hubModules: HubModule[] = [
  {
    id: 'ls-connect',
    name: 'LS Connect',
    shortName: 'Connect',
    description: 'Soziales Netzwerk und Bürgerplattform',
    icon: '💬',
    status: 'available',
  },
  {
    id: 'pcad',
    name: 'PCAD',
    shortName: 'PCAD',
    description: 'Polizei- und Einsatzsystem',
    icon: '🛡️',
    status: 'available',
  },
  {
    id: 'banking',
    name: 'LS Banking',
    shortName: 'Banking',
    description: 'Bank- und Finanzsystem',
    icon: '🏦',
    status: 'planned',
  },
  {
    id: 'notifications',
    name: 'Mitteilungen',
    shortName: 'Hinweise',
    description: 'Zentrale Benachrichtigungen',
    icon: '🔔',
    status: 'planned',
  },
  {
    id: 'settings',
    name: 'Einstellungen',
    shortName: 'Settings',
    description: 'Hub- und Darstellungseinstellungen',
    icon: '⚙️',
    status: 'planned',
  },
]
