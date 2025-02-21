
/**
 * Category Breakdown Component
 * 
 * Displays a detailed breakdown of expenses by category including:
 * - Category totals
 * - Percentage of total budget
 * - Monthly comparisons
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CategoryBreakdownData {
  amount: number;
  category: {
    name: string;
  } | null;
}

export const CategoryBreakdown = () => {
  const { data: categories } = useQuery<CategoryBreakdownData[]>({
    queryKey: ['categoryBreakdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variable_expenses')
        .select(`
          amount,
          category:categories(name)
        `)
        .order('category->name');
      if (error) throw error;
      return data;
    },
  });

  // Group and calculate totals by category
  const breakdown = React.useMemo(() => {
    const groupedData = categories?.reduce((acc, item) => {
      const categoryName = item.category?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(groupedData || {}).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(groupedData || {}).map(([category, amount]) => ({
      category,
      total: amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));
  }, [categories]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Percentage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {breakdown.map((row) => (
          <TableRow key={row.category}>
            <TableCell>{row.category}</TableCell>
            <TableCell className="text-right">${row.total.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              {row.percentage.toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
