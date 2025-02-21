
import React, { useEffect } from 'react';
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
import { useAuth } from '@/hooks/useAuth';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log('Overview page mounted, user:', user); // Debug log
  }, [user]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.email}
        </p>
      </div>

      <ErrorBoundary fallback={<div>Error loading investments</div>}>
        <Suspense fallback={<div>Loading investments...</div>}>
          <InvestmentsTile />
        </Suspense>
      </ErrorBoundary>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorBoundary fallback={<div>Error loading budget</div>}>
          <Suspense fallback={<div>Loading budget...</div>}>
            <BudgetTile />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div>Error loading reserves</div>}>
          <Suspense fallback={<div>Loading reserves...</div>}>
            <ReservesTile />
          </Suspense>
        </ErrorBoundary>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary fallback={<div>Error loading monthly data</div>}>
          <Suspense fallback={<div>Loading chart...</div>}>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Budget vs Actual</CardTitle>
                <CardDescription>Compare planned versus actual spending</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyChart />
              </CardContent>
            </Card>
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div>Error loading categories</div>}>
          <Suspense fallback={<div>Loading categories...</div>}>
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown />
              </CardContent>
            </Card>
          </Suspense>
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
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Import Suspense if not already available
const Suspense = React.Suspense;
