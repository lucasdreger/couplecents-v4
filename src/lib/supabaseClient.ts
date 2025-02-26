import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test database connection and RPC functions
Promise.all([
  supabase.from('investments').select('count').single(),
  supabase.rpc('get_user_household', { user_id: 'test' }).catch(err => {
    // This will fail with auth error which is expected, we just want to verify the function exists
    if (err.message.includes('auth')) {
      return null;
    }
    throw err;
  })
])
.then(() => {
  console.log('Successfully connected to Supabase and verified RPC functions')
})
.catch((error) => {
  console.error('Failed to connect to Supabase or RPC functions not found:', error)
})
