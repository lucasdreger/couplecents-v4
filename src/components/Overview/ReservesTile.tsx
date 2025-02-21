import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const ReservesTile = () => {
  const { data: reserves } = useQuery({
    queryKey: ['reserves'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('total_income, total_expenses')
        .single();
      if (error) throw error;

      const totalIncome = data?.total_income || 0;
      const totalExpenses = data?.total_expenses || 0;
      const reserves = totalIncome - totalExpenses;

      return {
        amount: reserves,
        percentage: totalIncome ? (reserves / totalIncome) * 100 : 0
      };
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserves</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl font-bold">
            ${reserves?.amount.toFixed(2) ?? '0.00'}
          </p>
          <p className="text-sm text-muted-foreground">
            {reserves?.percentage.toFixed(1) ?? '0'}% of income
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
