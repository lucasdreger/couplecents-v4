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
import { FinancialAnalytics } from './FinancialAnalytics';
import { useAuth } from '@/context/AuthContext';
import { CalendarIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Create a reusable loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

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
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with greeting and date */}
      <div className="mb-8">
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
            <div className="flex flex-col items-end">
              <p className="text-sm font-medium">Welcome back, <span className="text-primary">{user.email}</span></p>
              <div className="flex gap-2 mt-2">
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
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Budget - Now in a grid */}
            <ErrorBoundary fallback={<ErrorFallback message="Error loading budget" />}>
              <Card className="border shadow-sm md:col-span-1">
                <BudgetTile />
              </Card>
            </ErrorBoundary>

            {/* Investments Section */}
            <ErrorBoundary fallback={<ErrorFallback message="Error loading investments" />}>
              <div className="bg-card rounded-lg border shadow-sm md:col-span-2">
                <InvestmentsTile />
              </div>
            </ErrorBoundary>
          </div>
          
          {/* Reserves and Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ErrorBoundary fallback={<ErrorFallback message="Error loading reserves" />}>
              <div className="bg-card rounded-lg border shadow-sm h-full">
                <ReservesTile />
              </div>
            </ErrorBoundary>
            
            <ErrorBoundary fallback={<ErrorFallback message="Error loading categories" />}>
              <Card className="shadow-sm border-primary/10 h-full">
                <CardHeader className="border-b border-border/40 pb-2">
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Expenses by category</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <CategoryBreakdown />
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
        </TabsContent>
        
        <TabsContent value="analytics">
          <ErrorBoundary fallback={<ErrorFallback message="Error loading analytics" />}>
            <FinancialAnalytics />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
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
