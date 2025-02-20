/**
 * Database Integration Layer
 * 
 * This module handles all Supabase interactions including:
 * - Authentication
 * - CRUD operations for all financial data
 * - History tracking for investments and reserves
 * - Monthly expense and income management
 * 
 * Each function is categorized by its domain (expenses, investments, etc.)
 * and includes proper type safety through TypeScript interfaces.
 */

/**
 * Supabase Client Configuration and Database Operations
 * 
 * This module provides a centralized interface for all Supabase database operations.
 * It includes functions for managing:
 * - Categories
 * - Fixed and Variable Expenses
 * - Investments and Reserves
 * - Monthly Income and Credit Card tracking
 * - History tracking for value changes
 */

import { createClient } from '@supabase/supabase-js'
import type { Category, DefaultIncome, FixedExpense, Investment, MonthlyIncome, MonthlyFixedExpenseStatus, VariableExpense, Reserve } from '../types/database.types'

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Category Operations
/** Fetch all expense categories */
export const getCategories = () => 
  supabase.from('categories').select('*')

/** Add a new expense category */
export const addCategory = (name: string) =>
  supabase.from('categories').insert({ name })

// Fixed Expenses Operations
/** Fetch all fixed expenses with their categories */
export const getFixedExpenses = () =>
  supabase.from('fixed_expenses').select('*, categories(*)')

// Investment Operations
/** Get all investments ordered by name */
export const getInvestments = () =>
  supabase.from('investments').select('*').order('name')

/** Update investment value and record last update time */
export const updateInvestment = (id: string, value: number) =>
  supabase.from('investments').update({ 
    current_value: value,
    last_updated: new Date().toISOString()
  }).eq('id', id)

// Income Operations
/** Fetch monthly income for a specific year and month */
export const getMonthlyIncome = (year: number, month: number) =>
  supabase.from('monthly_income')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single()

/** Update or insert monthly income for a specific year and month */
export const updateMonthlyIncome = (year: number, month: number, data: Partial<MonthlyIncome>) =>
  supabase.from('monthly_income').upsert({
    year,
    month,
    ...data
  })

// Expense Operations
/** Fetch all variable expenses for a specific year and month */
export const getMonthlyExpenses = (year: number, month: number) =>
  supabase.from('variable_expenses')
    .select('*, categories(*)')
    .eq('year', year)
    .eq('month', month)
    .order('date')

/** Fetch the status of fixed expenses for a specific year and month */
export const getFixedExpenseStatus = (year: number, month: number) =>
  supabase.from('monthly_fixed_expense_status')
    .select('*, fixed_expenses(*)')
    .eq('year', year)
    .eq('month', month)

// Reserve Operations
/** Fetch all reserves ordered by name */
export const getReserves = () =>
  supabase.from('reserves').select('*').order('name')

/** Update reserve value and record last update time */
export const updateReserve = (id: string, value: number) =>
  supabase.from('reserves').update({
    current_value: value,
    last_updated: new Date().toISOString()
  }).eq('id', id)

// Default Income Operations
/** Fetch default income */
export const getDefaultIncome = () =>
  supabase.from('default_income').select('*').single()

/** Update default income */
export const updateDefaultIncome = (data: Partial<DefaultIncome>) =>
  supabase.from('default_income').update(data)

// Credit Card Operations
/** Fetch monthly credit card expenses for a specific year and month */
export const getMonthlyCreditCard = (year: number, month: number) =>
  supabase.from('monthly_credit_card')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single()

/** Update or insert monthly credit card expenses for a specific year and month */
export const updateMonthlyCreditCard = (year: number, month: number, amount: number) =>
  supabase.from('monthly_credit_card').upsert({
    year,
    month,
    amount
  })

/** 
 * Variable Expense Operations
 * Handles CRUD operations for monthly variable expenses
 */
export const addVariableExpense = (expense: Omit<VariableExpense, 'id' | 'created_at'>) =>
  supabase.from('variable_expenses').insert(expense)

/** Update an existing variable expense */
export const updateVariableExpense = (id: string, expense: Partial<VariableExpense>) =>
  supabase.from('variable_expenses').update(expense).eq('id', id)

/** Delete a variable expense */
export const deleteVariableExpense = (id: string) =>
  supabase.from('variable_expenses').delete().eq('id', id)

// Fixed Expense Status Operations
/** Update the status of a fixed expense */
export const updateFixedExpenseStatus = (id: string, completed: boolean) =>
  supabase.from('monthly_fixed_expense_status').update({
    completed,
    completed_at: completed ? new Date().toISOString() : null
  }).eq('id', id)

/**
 * History Tracking Operations
 * These functions maintain audit trails for value changes
 */

/** Record investment value changes */
export const addInvestmentHistory = (
  investmentId: string, 
  previousValue: number, 
  newValue: number, 
  updatedBy: string
) =>
  supabase.from('investment_history').insert({
    investment_id: investmentId,
    previous_value: previousValue,
    new_value: newValue,
    updated_by: updatedBy
  })

/** Record reserve value changes */
export const addReserveHistory = (reserveId: string, previousValue: number, newValue: number, updatedBy: string) =>
  supabase.from('reserve_history').insert({
    reserve_id: reserveId,
    previous_value: previousValue,
    new_value: newValue,
    updated_by: updatedBy
  })