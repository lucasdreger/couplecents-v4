/**
 * Supabase Client Configuration
 * 
 * Sets up the Supabase client with environment variables
 * for database access and real-time subscriptions.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Log successful connection
supabase
  .from('investments')
  .select('count')
  .then(({ data, error }) => {
    if (error) {
      console.error('Failed to connect to Supabase:', error);
    } else {
      console.log('Successfully connected to Supabase');
    }
  })
  .catch(error => {
    console.error('Error testing Supabase connection:', error);
  });
