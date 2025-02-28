
import React from 'react';
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

// Create a reusable loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Create a reusable error fallback component
const ErrorFallback = ({ message }: { message: string }) => (
  <div className="p-4 border border-red-200 rounded bg-red-50 text-red-700">
    {message}
  </div>
);

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <ErrorFallback message="Please log in to view this page" />;
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user.email}
        </p>
      </div>
      
      <ErrorBoundary fallback={<ErrorFallback message="Error loading investments" />}>
        <InvestmentsTile />
      </ErrorBoundary>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorBoundary fallback={<ErrorFallback message="Error loading budget" />}>
          <BudgetTile />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<ErrorFallback message="Error loading reserves" />}>
          <ReservesTile />
        </ErrorBoundary>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary fallback={<ErrorFallback message="Error loading monthly data" />}>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget vs Actual</CardTitle>
              <CardDescription>Compare planned versus actual spending</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyChart />
            </CardContent>
          </Card>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<ErrorFallback message="Error loading categories" />}>
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown />
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
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
