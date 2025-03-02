/**
 * Budget Summary Tile Component
 * 
 * Displays the total budget information including:
 * - Total income
 * - Total expenses
 * - Net balance
 */
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from 'react';
import { queryKeys } from '@/lib/queries';

export const BudgetTile = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const { data: income } = useQuery({
    queryKey: ['income', currentYear, currentMonth],
    queryFn: async () => {
      const { data } = await supabase
        .from('monthly_income')
        .select('*')
        .eq('year', currentYear)
        .eq('month', currentMonth)
        .single();
      return data;
    }
  });

  const { data: fixedExpenses } = useQuery({
    queryKey: ['fixed-expenses', currentYear, currentMonth],
    queryFn: async () => {
      const { data } = await supabase
        .from('fixed_expenses')
        .select('*');
      return data;
    }
  });

  const { data: variableExpenses } = useQuery({
    queryKey: queryKeys.expenses(currentYear, currentMonth),
    queryFn: async () => {
      const { data } = await supabase
        .from('variable_expenses')
        .select('*')
        .eq('year', currentYear)
        .eq('month', currentMonth);
      return data;
    }
  });

  // Calculate total income
  const totalIncome = income ? (
    (income.lucas_main_income || 0) + 
    (income.lucas_other_income || 0) + 
    (income.camila_main_income || 0) + 
    (income.camila_other_income || 0)
  ) : 0;

  // Calculate total expenses
  const totalFixedExpenses = fixedExpenses?.reduce((sum, expense) => 
    sum + (expense.estimated_amount || 0), 0) || 0;

  const totalVariableExpenses = variableExpenses?.reduce((sum, expense) => 
    sum + (expense.amount || 0), 0) || 0;

  const totalExpenses = totalFixedExpenses + totalVariableExpenses;
  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid gap-3">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">Income</p>
        <p className="font-medium text-lg">
          {totalIncome.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Total Expenses</p>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Fixed: {totalFixedExpenses.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
            <span>•</span>
            <span>Variable: {totalVariableExpenses.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
          </div>
        </div>
        <p className="font-medium text-lg">
          {totalExpenses.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
      
      <div className="h-px bg-border my-1"></div>
      
      <div className="flex justify-between items-center">
        <p className="font-medium">Available Balance</p>
        <p className={`font-bold text-xl ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {balance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
    </div>
  );
};
