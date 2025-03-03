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
import { CalendarIcon, LayoutDashboard } from 'lucide-react';
import { InvestmentDistribution } from './InvestmentDistribution';
import { useInvestments } from '@/hooks/useInvestments';
import { useReserves } from '@/hooks/useReserves';
import { Skeleton } from '@/components/ui/skeleton';

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
  
  const isLoading = isInvestmentsLoading || isReservesLoading;
  
  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.current_value, 0) || 0;
  const totalReserves = reserves?.reduce((sum, reserve) => sum + reserve.current_amount, 0) || 0;
  const totalAssets = totalInvestments + totalReserves;
  
  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-primary">
          {totalAssets.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </h3>
        <p className="text-muted-foreground">Total Assets Value</p>
      </div>
      
      <div className="flex justify-between text-center">
        <div className="flex-1">
          <p className="text-lg font-semibold">
            {totalInvestments.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="text-sm text-muted-foreground">Investments</p>
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold">
            {totalReserves.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="text-sm text-muted-foreground">Reserves</p>
        </div>
      </div>
    </div>
  );
};

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  if (!user) {
    return <ErrorFallback message="Please log in to view this page" />;
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with greeting and date */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <LayoutDashboard className="h-7 w-7 text-primary" />
              <span>Financial Overview</span>
            </h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" /> {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Total Assets Card */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Total Assets</CardTitle>
          <CardDescription>Combined value of investments and reserves</CardDescription>
        </CardHeader>
        <CardContent>
          <TotalAssets />
        </CardContent>
      </Card>

      {/* Investments and Reserves Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorBoundary fallback={<ErrorFallback message="Error loading investments" />}>
          <InvestmentsTile />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<ErrorFallback message="Error loading reserves" />}>
          <ReservesTile />
        </ErrorBoundary>
      </div>

      {/* Category Breakdown and Investment Distribution Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorBoundary fallback={<ErrorFallback message="Error loading categories" />}>
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="border-b border-border/40 pb-2">
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Expenses by category</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CategoryBreakdown timeRange={12} />
            </CardContent>
          </Card>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorFallback message="Error loading investment distribution" />}>
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="border-b border-border/40 pb-2">
              <CardTitle>Investment Distribution</CardTitle>
              <CardDescription>Distribution by investment type</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <InvestmentDistribution />
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>

      {/* Monthly Chart */}
      <ErrorBoundary fallback={<ErrorFallback message="Error loading monthly data" />}>
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="border-b border-border/40 pb-2">
            <CardTitle>Monthly Budget vs Actual</CardTitle>
            <CardDescription>Compare planned versus actual spending for current year</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <MonthlyChart months={12} />
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
