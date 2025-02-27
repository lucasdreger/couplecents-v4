import { z } from 'zod'

export const expenseSchema = z.object({
  description: z.string().min(3),
  amount: z.number().min(0),
  category_id: z.string().uuid(),
  date: z.string(),
  created_by: z.string().uuid(),
})

export const fixedExpenseSchema = z.object({
  description: z.string().min(3),
  amount: z.number().min(0),
  category_id: z.string().uuid(),
  owner: z.enum(['Lucas', 'Camila']),
  status_required: z.boolean(),
})

export const investmentSchema = z.object({
  name: z.string().min(3),
  category: z.string().min(2),
  current_value: z.number().min(0),
  notes: z.string().optional(),
})

export const reserveSchema = z.object({
  name: z.string().min(3),
  current_amount: z.number().min(0),
  target_amount: z.number().optional(),
  notes: z.string().optional(),
})

export const monthlyIncomeSchema = z.object({
  lucas_income: z.number().min(0),
  camila_income: z.number().min(0),
  other_income: z.number().min(0),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
})
