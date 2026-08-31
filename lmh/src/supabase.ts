import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || ''

export const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase = createClient(supabaseUrl || 'http://127.0.0.1:54321', supabasePublishableKey || 'missing-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
