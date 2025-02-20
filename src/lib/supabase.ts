import { createClient } from '@supabase/supabase-js'
import type { Category, DefaultIncome, FixedExpense } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Categories
export const getCategories = () => 
  supabase.from('categories').select('*')

export const addCategory = (name: string) =>
  supabase.from('categories').insert({ name })

// Fixed Expenses
export const getFixedExpenses = () =>
  supabase.from('fixed_expenses').select('*, categories(*)')

// Investments
export const getInvestments = () =>
  supabase.from('investments').select('*').order('name')

export const updateInvestment = (id: string, value: number) =>
  supabase.from('investments').update({ 
    current_value: value,
    last_updated: new Date().toISOString()
  }).eq('id', id)

// Income
export const getMonthlyIncome = (year: number, month: number) =>
  supabase.from('monthly_income')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single()

export const updateMonthlyIncome = (year: number, month: number, data: Partial<MonthlyIncome>) =>
  supabase.from('monthly_income').upsert({
    year,
    month,
    ...data
  })

// Expenses
export const getMonthlyExpenses = (year: number, month: number) =>
  supabase.from('variable_expenses')
    .select('*, categories(*)')
    .eq('year', year)
    .eq('month', month)
    .order('date')

export const getFixedExpenseStatus = (year: number, month: number) =>
  supabase.from('monthly_fixed_expense_status')
    .select('*, fixed_expenses(*)')
    .eq('year', year)
    .eq('month', month)

// Reserves
export const getReserves = () =>
  supabase.from('reserves').select('*').order('name')

export const updateReserve = (id: string, value: number) =>
  supabase.from('reserves').update({
    current_value: value,
    last_updated: new Date().toISOString()
  }).eq('id', id)