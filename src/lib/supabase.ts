import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current authenticated session
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export const signInWithPassword = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPasswordForEmail = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

// Categories
export const getCategories = async () => {
  return await supabase
    .from('categories')
    .select('*')
    .order('name')
}

// Investments
export const getInvestments = async () => {
  return await supabase
    .from('investments')
    .select('*')
}

export const updateInvestment = async (id: string, value: number) => {
  return await supabase
    .from('investments')
    .update({ 
      current_value: value,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()
}

export const addInvestmentHistory = async (
  investmentId: string, 
  previousValue: number, 
  newValue: number,
  userId: string
) => {
  return await supabase
    .from('investment_history')
    .insert({
      investment_id: investmentId,
      previous_value: previousValue,
      new_value: newValue,
      updated_by: userId
    })
}

// Monthly Income
export const getMonthlyIncome = async (year: number, month: number) => {
  return await supabase
    .from('monthly_income')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single()
}

export const updateMonthlyIncome = async (
  year: number,
  month: number,
  data: { lucas_income?: number; camila_income?: number; other_income?: number }
) => {
  return await supabase
    .from('monthly_income')
    .update(data)
    .eq('year', year)
    .eq('month', month)
}

export const getDefaultIncome = async () => {
  return await supabase
    .from('default_income')
    .select('*')
    .limit(1)
    .single()
}

// Variable Expenses - Fix the category join syntax
export const getMonthlyExpenses = async (year: number, month: number) => {
  return await supabase
    .from('variable_expenses')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('year', year)
    .eq('month', month)
    .order('date', { ascending: false })
}

export const addVariableExpense = async (expense: {
  description: string
  amount: number
  date: string
  category_id: string
  year: number
  month: number
}) => {
  return await supabase
    .from('variable_expenses')
    .insert(expense)
    .select()
    .single()
}

export const updateVariableExpense = async (id: string, expense: Partial<{
  description: string
  amount: number
  date: string
  category_id: string
}>) => {
  return await supabase
    .from('variable_expenses')
    .update(expense)
    .eq('id', id)
    .select()
    .single()
}

export const deleteVariableExpense = async (id: string) => {
  return await supabase
    .from('variable_expenses')
    .delete()
    .eq('id', id)
}

// Fixed Expenses
export const getFixedExpenses = async () => {
  return await supabase
    .from('fixed_expenses')
    .select(`
      *,
      category:categories(name),
      status:monthly_fixed_expense_status(completed, completed_at)
    `)
    .order('description', { ascending: true })
}

export const updateFixedExpenseStatus = async (
  id: string,
  completed: boolean
) => {
  return await supabase
    .from('monthly_fixed_expense_status')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null
    })
    .eq('id', id)
}

// Reserves
export const getReserves = async () => {
  return await supabase
    .from('reserves')
    .select('*')
}

// Monthly Details
export const getMonthlyDetails = async () => {
  return await supabase
    .from('monthly_details')
    .select('total_income,total_expenses')
    .single()
}

export const getMonthlyDetailsHistory = async () => {
  return await supabase
    .from('monthly_details')
    .select('month,planned_amount,actual_amount')
    .order('month')
}
