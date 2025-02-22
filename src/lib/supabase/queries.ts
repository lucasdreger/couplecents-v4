import { supabase } from '../supabaseClient';
import type { VariableExpense, FixedExpense, Income, Investment } from '@/types/database.types';

// Variable Expenses
export const getMonthlyExpenses = async (year: number, month: number) => {
  return supabase
    .from('variable_expenses')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('year', year)
    .eq('month', month)
    .order('date', { ascending: false });
};

export const addVariableExpense = async (expense: Omit<VariableExpense, 'id' | 'created_at'>) => {
  return supabase
    .from('variable_expenses')
    .insert(expense)
    .select()
    .single();
};

export const updateVariableExpense = async (id: string, expense: Partial<VariableExpense>) => {
  return supabase
    .from('variable_expenses')
    .update(expense)
    .eq('id', id)
    .select()
    .single();
};

export const deleteVariableExpense = async (id: string) => {
  return supabase
    .from('variable_expenses')
    .delete()
    .eq('id', id);
};

// Fixed Expenses
export const getFixedExpenses = async (year: number, month: number) => {
  return supabase
    .from('fixed_expenses')
    .select(`
      *,
      category:categories(name),
      status:expense_status(completed)
    `)
    .eq('year', year)
    .eq('month', month)
    .order('description', { ascending: true });
};

export const addFixedExpense = async (expense: Omit<FixedExpense, 'id' | 'created_at'>) => {
  return supabase
    .from('fixed_expenses')
    .insert(expense)
    .select()
    .single();
};

export const updateFixedExpense = async (id: string, expense: Partial<FixedExpense>) => {
  return supabase
    .from('fixed_expenses')
    .update(expense)
    .eq('id', id)
    .select()
    .single();
};

export const updateFixedExpenseStatus = async (id: string, completed: boolean) => {
  return supabase
    .from('expense_status')
    .upsert({
      expense_id: id,
      completed,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
};

export const deleteFixedExpense = async (id: string) => {
  return supabase
    .from('fixed_expenses')
    .delete()
    .eq('id', id);
};

// Income
export const getMonthlyIncome = async (year: number, month: number) => {
  return supabase
    .from('income')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single();
};

export const addMonthlyIncome = async (income: Omit<Income, 'id' | 'created_at'>) => {
  return supabase
    .from('income')
    .insert(income)
    .select()
    .single();
};

export const updateMonthlyIncome = async (id: string, income: Partial<Income>) => {
  return supabase
    .from('income')
    .update(income)
    .eq('id', id)
    .select()
    .single();
};

// Investments
export const getInvestments = async () => {
  return supabase
    .from('investments')
    .select('*')
    .order('name')
    .throwOnError();
};

export const updateInvestment = async (id: string, current_value: number) => {
  return supabase
    .from('investments')
    .update({ 
      current_value,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
};

export const addInvestmentHistory = async (
  investment_id: string, 
  old_value: number, 
  new_value: number, 
  user_id: string
) => {
  return supabase
    .from('investment_history')
    .insert({
      investment_id,
      old_value,
      new_value,
      user_id,
      date: new Date().toISOString()
    })
    .select()
    .single();
};
