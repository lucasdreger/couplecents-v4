import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetTile } from './BudgetTile';
import { InvestmentsTile } from './InvestmentsTile';
import { ReservesTile } from './ReservesTile';
import { MonthlyChart } from './MonthlyChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvestmentDistribution } from './InvestmentDistribution';

// Create a reusable error fallback component
const ErrorFallback = ({ message }: { message: string }) => (
  <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
    {message}
  </div>
);

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

      {/* Total Budget Card */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Total Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetTile />
        </CardContent>
      </Card>

      {/* Investments and Reserves Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorBoundary fallback={<ErrorFallback message="Error loading investments" />}>
          <div className="bg-card rounded-lg border shadow-sm">
            <InvestmentsTile />
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<ErrorFallback message="Error loading reserves" />}>
          <div className="bg-card rounded-lg border shadow-sm">
            <ReservesTile />
          </div>
        </ErrorBoundary>
      </div>

      {/* Category and Investment Distribution Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
