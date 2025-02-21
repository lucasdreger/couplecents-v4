import { supabase } from '../supabaseClient';

// Variable Expenses
export const getVariableExpenses = () => {
  return supabase
    .from('variable_expenses')
    .select(`
      amount,
      category:categories(name)
    `)
    .order('category->name', { ascending: true });
};

// Other queries can be added here...
