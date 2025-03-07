import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { OverviewPage } from '@/components/Overview/OverviewPage';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { queryKeys } from '@/lib/queries';
import { supabase } from '@/lib/supabaseClient';
import { MonthlySummary } from '@/types/supabase';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { expenses, isLoading: isLoadingExpenses } = useExpenses(currentYear, currentMonth);
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const { data: monthlySummary, isLoading: isLoadingSummary } = useQuery<MonthlySummary>({
    queryKey: queryKeys.monthlyAnalytics(currentYear),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_summary')
        .select('*')
        .eq('year', currentYear)
        .eq('month', currentMonth)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const isLoading = isLoadingExpenses || isLoadingCategories || isLoadingSummary;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
        </div>
      </div>
    );
  }

  return (
    <OverviewPage
      expenses={expenses}
      categories={categories}
      monthlySummary={monthlySummary}
      year={currentYear}
      month={currentMonth}
    />
  );
}
