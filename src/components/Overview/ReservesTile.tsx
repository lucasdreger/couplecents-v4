import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

interface MonthlyDetails {
  total_income: number;
  total_expenses: number;
}

interface ReservesData {
  amount: number;
  percentage: number;
}

export const ReservesTile = () => {
  const { data: reserves, isLoading, isError } = useQuery({
    queryKey: ['reserves'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('total_income, total_expenses')
        .single();
        
      if (error) throw error;
      
      const totalIncome = (data as MonthlyDetails)?.total_income || 0;
      const totalExpenses = (data as MonthlyDetails)?.total_expenses || 0;
      const reserves = totalIncome - totalExpenses;
      
      return {
        amount: reserves,
        percentage: totalIncome ? (reserves / totalIncome) * 100 : 0
      } as ReservesData;
    }
  });
  
  const amount = reserves?.amount || 0;
  const percentage = reserves?.percentage || 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserves</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading reserves...</div>
        ) : isError ? (
          <div>Error loading reserves</div>
        ) : (
          <div className="space-y-2">
            <p className="text-3xl font-bold">
              ${amount.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {percentage.toFixed(1)}% of income
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
