
/**
 * Budget Summary Tile Component
 * 
 * Displays the total budget information including:
 * - Total income
 * - Total expenses
 * - Net balance
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const BudgetTile = () => {
  const { data: budgetData } = useQuery({
    queryKey: ['totalBudget'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('total_income, total_expenses')
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-primary">
            ${budgetData?.total_income ?? 0}
          </p>
          <p className="text-sm text-muted-foreground">
            Expenses: ${budgetData?.total_expenses ?? 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
