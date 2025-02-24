import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

// Define minimal types we need
type User = {
  id: string;
  email?: string;
}

type Session = {
  user: User;
  access_token: string;
  refresh_token: string;
}

type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_DELETED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY'

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

// Clear all Supabase-related localStorage items on auth state change
supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    Object.keys(localStorage)
      .filter(key => key.startsWith('sb-'))
      .forEach(key => localStorage.removeItem(key));
  }
});

// Test database connection with enhanced error handling
supabase.from('investments').select('count').single()
  .then(() => {
    console.log('Successfully connected to Supabase')
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('Failed to connect to Supabase:', error.message);
      if (error.message === 'User rejected the request.') {
        console.log('Authentication required - redirecting to login');
        // Clear any stale auth state
        Object.keys(localStorage)
          .filter(key => key.startsWith('sb-'))
          .forEach(key => localStorage.removeItem(key));
      }
    } else {
      console.error('Failed to connect to Supabase:', String(error));
    }
  });

// Re-export for convenience
export type { User, Session, AuthChangeEvent };
export type { Database };
export default supabase;
