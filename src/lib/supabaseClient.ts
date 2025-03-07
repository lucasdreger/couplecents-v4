import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { TypedSupabaseClient } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase: TypedSupabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
  }
)

// Test database connection
supabase.from('investments').select('count').single()
  .then(() => {
    console.log('Successfully connected to Supabase')
  })
  .catch((error) => {
    console.error('Failed to connect to Supabase:', error)
  })
