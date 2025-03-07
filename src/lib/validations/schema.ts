import { z } from 'zod';

// Base schemas for common fields
const moneySchema = z.number()
  .min(0, 'Amount must be positive')
  .max(1000000, 'Amount too large');

const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
  .refine((date) => !isNaN(Date.parse(date)), 'Invalid date');

// Expense schemas
export const expenseFormSchema = z.object({
  amount: moneySchema,
  date: dateSchema,
  description: z.string().min(1, 'Description is required').max(100),
  category_id: z.string().uuid('Invalid category'),
});

export const expenseFilterSchema = z.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  minAmount: moneySchema.optional(),
  maxAmount: moneySchema.optional(),
});

// Income schemas
export const incomeFormSchema = z.object({
  amount: moneySchema,
  date: dateSchema,
  source: z.string().min(1, 'Source is required'),
  type: z.enum(['SALARY', 'BONUS', 'INVESTMENT', 'OTHER']),
  recurring: z.boolean().optional(),
});

// Investment schemas
export const investmentFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['STOCK', 'BOND', 'CRYPTO', 'REAL_ESTATE', 'OTHER']),
  initialValue: moneySchema,
  currentValue: moneySchema,
  targetValue: moneySchema.optional(),
  notes: z.string().max(500).optional(),
});

// Category schemas
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  budget: moneySchema.optional(),
  parentId: z.string().uuid('Invalid parent category').optional(),
});

// User preference schemas
export const userPreferencesSchema = z.object({
  currency: z.string().length(3),
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.boolean(),
  weekStartsOn: z.number().min(0).max(6),
  language: z.string().length(2),
});

// Profile schemas
export const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  avatar: z.string().url('Invalid URL').optional(),
});

// Reserve schemas
export const reserveFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  targetAmount: moneySchema,
  currentAmount: moneySchema,
  priority: z.number().min(1).max(5),
  notes: z.string().max(500).optional(),
});

// Derived types from schemas
export type ExpenseFormData = z.infer<typeof expenseFormSchema>;
export type ExpenseFilterData = z.infer<typeof expenseFilterSchema>;
export type IncomeFormData = z.infer<typeof incomeFormSchema>;
export type InvestmentFormData = z.infer<typeof investmentFormSchema>;
export type CategoryFormData = z.infer<typeof categoryFormSchema>;
export type UserPreferencesData = z.infer<typeof userPreferencesSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type ReserveFormData = z.infer<typeof reserveFormSchema>;