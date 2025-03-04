
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvestmentsTile } from './InvestmentsTile';
import { ReservesTile } from './ReservesTile';
import { MonthlyChart } from './MonthlyChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, TrendingUp, Coins } from 'lucide-react';
import { InvestmentDistribution } from './InvestmentDistribution';
import { useInvestments } from '@/hooks/useInvestments';
import { useReserves } from '@/hooks/useReserves';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from '@/components/ui/sparkles';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { useTheme } from '@/context/ThemeContext';
import { BudgetTile } from './BudgetTile';
import { FinancialAnalytics } from './FinancialAnalytics';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { GlowingEffect } from '@/components/ui/glowing-effect';

// Create a reusable error fallback component
const ErrorFallback = ({ message }: { message: string }) => (
  <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
    {message}
  </div>
);

// Total Assets component
const TotalAssets = () => {
  const { investments, isLoading: isInvestmentsLoading } = useInvestments();
  const { reserves, isLoading: isReservesLoading } = useReserves();
  const { theme } = useTheme();
  
  const isLoading = isInvestmentsLoading || isReservesLoading;
  
  const totalInvestments = investments?.reduce((sum: number, inv: any) => sum + inv.current_value, 0) || 0;
  const totalReserves = reserves?.reduce((sum: number, reserve: any) => sum + reserve.current_value, 0) || 0;
  const totalAssets = totalInvestments + totalReserves;
  
  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }
  
  return (
    <div className="flex flex-col space-y-6 relative">
      <div className="text-center z-10">
        <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          {totalAssets.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </h3>
        <p className="text-muted-foreground">Total Assets Value</p>
      </div>
      
      <div className="flex justify-between text-center z-10">
        <div className="flex-1 p-4 rounded-lg glass">
          <p className="text-lg font-semibold">
            {totalInvestments.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="text-sm text-muted-foreground">Investments</p>
        </div>
        <div className="w-6"></div>
        <div className="flex-1 p-4 rounded-lg glass">
          <p className="text-lg font-semibold">
            {totalReserves.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="text-sm text-muted-foreground">Reserves</p>
        </div>
      </div>

      <div className="absolute inset-0 -z-10">
        <Sparkles 
          className="h-full w-full" 
          color={theme === "dark" ? "var(--sparkles-color)" : "#8350e8"}
          size={2}
          density={60}
          speed={0.5}
          opacity={0.3}
        />
      </div>
    </div>
  );
};

interface Props {
  expenses?: any[];
  monthlyIncome?: number;
  monthlyBudget?: number;
  monthlyExpenses?: number;
  isLoading?: boolean;
}

export const OverviewPage = ({ 
  expenses = [], 
  monthlyIncome = 0, 
  monthlyBudget = 0, 
  monthlyExpenses = 0, 
  isLoading = false 
}: Props) => {
  const { investments, isLoading: investmentsLoading } = useInvestments();
  const { reserves, isLoading: reservesLoading } = useReserves();

  if (isLoading || investmentsLoading || reservesLoading) {
    return <LoadingSpinner />;
  }

  // We need to safely handle the investments/reserves data
  const safeInvestments = investments || [];
  const safeReserves = reserves || [];

  const totalInvestments = safeInvestments.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
  const totalReserves = safeReserves.reduce((sum: number, reserve: any) => sum + (reserve.amount || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <BudgetTile
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        monthlyBudget={monthlyBudget}
        remainingBudget={monthlyIncome - monthlyExpenses}
      />
      <ReservesTile reserves={safeReserves} />
      <CategoryBreakdown expenses={expenses} />
      <div className="md:col-span-2 xl:col-span-3">
        <FinancialAnalytics data={[
          { name: 'Jan', income: 3500, expenses: 2200, savings: 800, investments: 500 },
          { name: 'Feb', income: 3500, expenses: 2100, savings: 900, investments: 500 },
          { name: 'Mar', income: 3700, expenses: 2400, savings: 800, investments: 500 },
          { name: 'Apr', income: 3600, expenses: 2000, savings: 1100, investments: 500 },
          { name: 'May', income: 3800, expenses: 2300, savings: 1000, investments: 500 },
          { name: 'Jun', income: 4000, expenses: 2500, savings: 1000, investments: 500 },
        ]} />
      </div>
      <InvestmentDistribution investments={safeInvestments} />
    </div>
  );
};
