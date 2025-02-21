
/**
 * Supabase Client Configuration
 * 
 * Sets up the Supabase client with environment variables
 * for database access and real-time subscriptions.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
