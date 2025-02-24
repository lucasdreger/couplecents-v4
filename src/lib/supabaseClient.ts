
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
    flowType: 'implicit',
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
    },
    onAuthStateChange: (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        // Delete all supabase-related items from localStorage
        for (const key in localStorage) {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        }
      }
    }
  }
})

// Test database connection with error handling
supabase.from('investments').select('count').single()
  .then(() => {
    console.log('Successfully connected to Supabase')
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('Failed to connect to Supabase:', error.message)
      // Don't throw the error, just log it to prevent app crashes
      if (error.message === 'User rejected the request.') {
        console.log('User cancelled the authentication process')
      }
    } else {
      console.error('Failed to connect to Supabase:', String(error))
    }
  })

export default supabase
