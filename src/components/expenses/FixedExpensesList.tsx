import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFixedExpenses, updateFixedExpenseStatus } from '@/lib/supabase/queries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import useHousehold from '@/hooks/useHousehold';
import type { FixedExpense } from '@/types/database.types';

export const FixedExpensesList: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: household, isLoading: isLoadingHousehold } = useHousehold();

  const { data: fixedExpenses, isLoading, isError, error } = useQuery({
    queryKey: ['fixed-expenses', household?.householdId],
    queryFn: async () => {
      if (!household?.householdId) throw new Error('No household ID');
      const { data, error } = await getFixedExpenses();
      if (error) throw error;
      return data || [];
    },
    enabled: !!household?.householdId,
    retry: 1
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const result = await updateFixedExpenseStatus(id, completed);
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] });
      toast({ 
        description: "Status updated successfully",
        duration: 3000
      });
    },
    onError: () => {
      toast({ 
        variant: "destructive",
        description: "Failed to update expense status",
        duration: 3000
      });
    }
  });

  const handleStatusChange = (id: string, checked: boolean) => {
    updateStatus({ id, completed: checked });
  };

  if (isLoadingHousehold || isLoading) {
    return React.createElement('div',
      { className: "text-center py-4" },
      'Loading expenses...'
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load expenses';
    return React.createElement('div',
      { className: "text-center text-destructive py-4" },
      errorMessage
    );
  }

  if (!fixedExpenses?.length) {
    return React.createElement('div',
      { className: "text-center text-muted-foreground py-4" },
      'No fixed expenses found for this month'
    );
  }

  return React.createElement(Table, null, [
    React.createElement(TableHeader, { key: 'header' },
      React.createElement(TableRow, null, [
        React.createElement(TableHead, { key: 'desc' }, 'Description'),
        React.createElement(TableHead, { key: 'cat' }, 'Category'),
        React.createElement(TableHead, { key: 'amount', className: "text-right" }, 'Amount'),
        React.createElement(TableHead, { key: 'date' }, 'Due Date'),
        React.createElement(TableHead, { key: 'status' }, 'Paid')
      ])
    ),
    React.createElement(TableBody, { key: 'body' },
      fixedExpenses.map((expense: FixedExpense) => {
        const amount = Number(expense.amount || 0);
        return React.createElement(TableRow, { key: expense.id }, [
          React.createElement(TableCell, { key: 'desc' }, expense.description),
          React.createElement(TableCell, { key: 'cat' }, expense.category?.name || 'Uncategorized'),
          React.createElement(TableCell, { key: 'amount', className: "text-right" }, 
            `$${amount.toFixed(2)}`
          ),
          React.createElement(TableCell, { key: 'date' }, expense.due_date),
          React.createElement(TableCell, { key: 'status' },
            React.createElement(Checkbox, {
              checked: expense.status?.completed,
              onCheckedChange: (checked: boolean) => handleStatusChange(expense.id, checked)
            })
          )
        ]);
      })
    )
  ]);
};
