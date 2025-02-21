
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type { FixedExpense } from '@/types/database.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const FixedExpenses = () => {
  const { data: fixedExpenses } = useQuery<FixedExpense[]>({
    queryKey: ['fixedExpenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Fixed Expenses</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status Required</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fixedExpenses?.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.description}</TableCell>
              <TableCell>${expense.estimated_amount.toFixed(2)}</TableCell>
              <TableCell>{expense.owner}</TableCell>
              <TableCell>{expense.status_required ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
