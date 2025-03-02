import React, { useState } from 'react';
import { LayoutDashboard, CalendarIcon } from "lucide-react";
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
import { InvestmentDistribution } from './InvestmentDistribution';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useInvestments } from '@/hooks/useInvestments';
import { useReserves } from '@/hooks/useReserves';
import { Skeleton } from '@/components/ui/skeleton';

// Create a reusable error fallback component
const ErrorFallback = ({ message }: { message: string }) => (
  <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
    {message}
  </div>
);

// New component for displaying the Total Assets Summary
const TotalAssetsSummary = () => {
  const { investments, isLoading: investmentsLoading } = useInvestments();
  const { reserves, loading: reservesLoading } = useReserves();
  
  const isLoading = investmentsLoading || reservesLoading;
  
  // Calculate total investments
  const totalInvestments = Array.isArray(investments) 
    ? investments.reduce((sum, inv) => sum + (inv.current_value || 0), 0) 
    : 0;
  
  // Calculate total reserves
  const totalReserves = Array.isArray(reserves) 
    ? reserves.reduce((sum, res) => sum + (res.current_value || 0), 0) 
    : 0;
  
  // Calculate total assets
  const totalAssets = totalInvestments + totalReserves;
  
  if (isLoading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Total Assets</span>
            <Skeleton className="h-6 w-24" />
          </CardTitle>
          <CardDescription>Sum of all investments and reserves</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Investments</span>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reserves</span>
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white/50 backdrop-blur-sm border-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Total Assets</span>
          <span className="text-xl font-bold text-primary">
            {totalAssets.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </CardTitle>
        <CardDescription>Sum of all investments and reserves</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Investments</span>
            <span className="font-medium">
              {totalInvestments.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reserves</span>
            <span className="font-medium">
              {totalReserves.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
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
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={selectedTimeRange === 'month' ? "default" : "outline"}
              onClick={() => setSelectedTimeRange('month')}
            >
              Month
            </Button>
            <Button 
              size="sm" 
              variant={selectedTimeRange === 'quarter' ? "default" : "outline"}
              onClick={() => setSelectedTimeRange('quarter')}
            >
              Quarter
            </Button>
            <Button 
              size="sm" 
              variant={selectedTimeRange === 'year' ? "default" : "outline"}
              onClick={() => setSelectedTimeRange('year')}
            >
              Year
            </Button>
          </div>
        </div>
      </div>

      {/* Total Assets Summary */}
      <ErrorBoundary fallback={<ErrorFallback message="Error loading assets data" />}>
        <TotalAssetsSummary />
      </ErrorBoundary>

      {/* Investments and Reserves Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <InvestmentsTile />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reserves</CardTitle>
          </CardHeader>
          <CardContent>
            <ReservesTile />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <ErrorBoundary fallback={<ErrorFallback message="Error loading categories" />}>
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="border-b border-border/40 pb-2">
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Expenses by category</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CategoryBreakdown />
            </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Investment Distribution */}
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
            <CardDescription>Compare planned versus actual spending</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <MonthlyChart />
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
