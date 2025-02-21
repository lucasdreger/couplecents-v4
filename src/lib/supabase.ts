import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// Variable Expenses
export const getMonthlyExpenses = async (year: number, month: number) => {
  return await supabase
    .from('variable_expenses')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('year', year)
    .eq('month', month)
    .order('date.desc')
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
    .select('*')
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
