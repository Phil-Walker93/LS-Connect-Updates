import { supabase } from './supabase'

export type HubIdentity = {
  user_id: string
  account: {
    email: string | null
    collaboration_code: string | null
  }
  roles: string[]
  visible_apps: string[]
  character: null | {
    id: string
    name: string
    handle: string
    phone: string
    bio: string
    avatar_url: string | null
    avatar_path: string | null
    account_type: string
    profile_color: string
    is_suspended: boolean
    is_archived: boolean
  }
}

export async function loadCurrentIdentity(): Promise<HubIdentity> {
  const { data, error } = await supabase.rpc('hub_current_identity')

  if (error) throw error
  if (!data) throw new Error('Keine LS-Connect-Identität verfügbar.')

  return data as HubIdentity
}
