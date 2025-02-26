import { supabase } from './supabaseClient';

// ...existing code...

// In any function that handles user data after authentication:
// Remove any code that sets or gets household_id

// For example, if there's a function like:
export const getUserData = async (userId: string) => {
  // Replace any query that filters by household with one that just gets user data
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  // Remove any household processing logic
  return data;
};

// ...existing code...
