import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Type-safe helper functions for common Supabase operations
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Type-safe select helpers
type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
type InsertRow<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type UpdateRow<T extends TableName> = Database['public']['Tables'][T]['Update'];

export async function selectFrom<T extends TableName>(
  table: T,
  options?: {
    columns?: string;
    filters?: Record<string, unknown>;
    range?: [number, number];
    orderBy?: { column: string; ascending?: boolean };
  }
) {
  let query = supabase.from(table).select(options?.columns || '*');

  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  if (options?.range) {
    const [from, to] = options.range;
    query = query.range(from, to);
  }

  if (options?.orderBy) {
    const { column, ascending = true } = options.orderBy;
    query = query.order(column, { ascending });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Row<T>[];
}

export async function insertInto<T extends TableName>(
  table: T,
  data: InsertRow<T> | InsertRow<T>[]
) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select();

  if (error) throw error;
  return result as Row<T>[];
}

export async function updateIn<T extends TableName>(
  table: T,
  id: string | number,
  data: UpdateRow<T>
) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select();

  if (error) throw error;
  return result?.[0] as Row<T>;
}

export async function deleteFrom<T extends TableName>(
  table: T,
  id: string | number
) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

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
  data: { 
    lucas_main_income?: number; 
    lucas_other_income?: number; 
    camila_main_income?: number; 
    camila_other_income?: number;
  }
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
