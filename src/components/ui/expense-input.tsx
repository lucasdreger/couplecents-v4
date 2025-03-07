import React from 'react';
import { CurrencyInput } from './currency-input';
import { DateInput } from './date-input';
import { Combobox } from './combobox';
import { FormField } from './form';
import { Label } from './label';
import { Textarea } from './textarea';
import { Button } from './button';
import { useCategories } from '@/hooks/useCategories';
import type { ExpenseFormData } from '@/lib/validations/schema';
import { cn } from '@/lib/utils';

interface ExpenseInputProps {
  value: Partial<ExpenseFormData>;
  onChange: (value: Partial<ExpenseFormData>) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  errors?: Partial<Record<keyof ExpenseFormData, string>>;
  className?: string;
}

export function ExpenseInput({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  errors,
  className
}: ExpenseInputProps) {
  const { categories } = useCategories();

  const handleChange = (field: keyof ExpenseFormData, fieldValue: any) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className={cn('space-y-4', className)}>
      <FormField>
        <Label htmlFor="amount">Amount</Label>
        <CurrencyInput
          id="amount"
          value={value.amount || 0}
          onChange={(val) => handleChange('amount', val)}
          error={!!errors?.amount}
        />
        {errors?.amount && (
          <span className="text-sm text-destructive">{errors.amount}</span>
        )}
      </FormField>

      <FormField>
        <Label htmlFor="date">Date</Label>
        <DateInput
          id="date"
          value={value.date ? new Date(value.date) : new Date()}
          onChange={(date) => handleChange('date', date.toISOString())}
          error={!!errors?.date}
        />
        {errors?.date && (
          <span className="text-sm text-destructive">{errors.date}</span>
        )}
      </FormField>

      <FormField>
        <Label htmlFor="category">Category</Label>
        <Combobox
          value={value.category_id || ''}
          onValueChange={(val) => handleChange('category_id', val)}
          items={categories}
          getValue={(item) => item.id}
          getLabel={(item) => item.name}
          placeholder="Select a category"
          error={!!errors?.category_id}
        />
        {errors?.category_id && (
          <span className="text-sm text-destructive">{errors.category_id}</span>
        )}
      </FormField>

      <FormField>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={value.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className={cn(errors?.description && 'border-destructive')}
        />
        {errors?.description && (
          <span className="text-sm text-destructive">{errors.description}</span>
        )}
      </FormField>

      {onSubmit && (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </Button>
      )}
    </div>
  );
}