





export const supabase = createClient(supabaseUrl, supabaseKey);const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;import { createClient } from '@supabase/supabase-js';