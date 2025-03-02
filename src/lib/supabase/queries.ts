import { supabase } from '../supabaseClient';
import type { PostgrestResponse } from '@supabase/supabase-js';
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

export const addVariableExpense = async (expense: {
  description: string;
  amount: number;
  date: string;
  category_id: string;
  year: number;
  month: number;
  created_by: string;
}) => {
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
  const { data, error } = await supabase
    .from('fixed_expenses')
    .select(`
      *,
      categories (name),
      monthly_fixed_expense_status!left (
        completed,
        year,
        month
      )
    `)
    .order('description');

  // Filter status for current year/month
  const processedData = data?.map(expense => ({
    ...expense,
    status: expense.monthly_fixed_expense_status?.filter(
      status => status.year === year && status.month === month
    ) || []
  }));

  return { data: processedData, error };
};

export const updateFixedExpenseStatus = async (
  fixed_expense_id: string,
  year: number,
  month: number,
  completed: boolean
) => {
  return await supabase
    .from('monthly_fixed_expense_status')
    .upsert({
      fixed_expense_id,
      year,
      month,
      completed
    }, {
      onConflict: 'fixed_expense_id,year,month'
    });
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

export const deleteFixedExpense = async (id: string) => {
  return supabase
    .from('fixed_expenses')
    .delete()
    .eq('id', id);
};

// Income
export const getMonthlyIncome = async (year: number, month: number) => {
  return supabase
    .from('monthly_income')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single();
};

export const addMonthlyIncome = async (income: {
  lucas_income: number;
  camila_income: number;
  other_income: number;
  month: number;
  year: number;
}) => {
  return supabase
    .from('monthly_income')
    .insert(income)
    .select()
    .single();
};

export const updateMonthlyIncome = async (id: string, income: {
  lucas_income?: number;
  camila_income?: number;
  other_income?: number;
}) => {
  return supabase
    .from('monthly_income')
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
    .order('name');
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
      previous_value: old_value,
      new_value,
      updated_by: user_id,
    })
    .select()
    .single();
};
