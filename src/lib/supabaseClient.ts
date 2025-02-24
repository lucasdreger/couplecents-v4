
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
    detectSessionInUrl: false,
    flowType: 'pkce',
    storage: {
      getItem: (key: string): string | null => {
        try {
          return window.localStorage.getItem(key);
        } catch (error: unknown) {
          console.error('Error accessing localStorage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string): void => {
        try {
          window.localStorage.setItem(key, value);
        } catch (error: unknown) {
          console.error('Error setting localStorage:', error);
        }
      },
      removeItem: (key: string): void => {
        try {
          window.localStorage.removeItem(key);
        } catch (error: unknown) {
          console.error('Error removing from localStorage:', error);
        }
      }
    }
  }
})

// Test database connection
supabase.from('investments').select('count').single()
  .then(() => {
    console.log('Successfully connected to Supabase')
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('Failed to connect to Supabase:', error.message)
    } else {
      console.error('Failed to connect to Supabase:', String(error))
    }
  })
