import { z } from 'zod'

export const expenseSchema = z.object({
  description: z.string().min(3),
  amount: z.number().min(0),
  category_id: z.string().uuid(),
  date: z.string()
})

export const investmentSchema = z.object({
  name: z.string().min(3),
  category: z.string().min(2),
  current_value: z.number().min(0)
})
