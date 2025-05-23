import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CalendarIcon, LayoutDashboard, TrendingUp, Coins } from 'lucide-react';
import { InvestmentDistribution } from './InvestmentDistribution';
import { useInvestments } from '@/hooks/useInvestments';
import { useReserves } from '@/hooks/useReserves';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from '@/components/ui/sparkles';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { useTheme } from '@/context/ThemeContext';

// Create a reusable error fallback component
const ErrorFallback = ({ message }: { message: string }) => (
  <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
    {message}
  </div>
);

// Loading component
const LoadingOverview = () => (
  <div className="flex h-screen w-full items-center justify-center" style={{ display: 'flex', minHeight: '100vh' }}>
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-lg text-muted-foreground">Loading CoupleCents...</p>
    </div>
  </div>
);

// Total Assets component
const TotalAssets = () => {
  const { investments, isLoading: isInvestmentsLoading } = useInvestments();
  const { reserves, isLoading: isReservesLoading } = useReserves();
  const { theme } = useTheme();
  
  const isLoading = isInvestmentsLoading || isReservesLoading;
  
  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.current_value, 0) || 0;
  const totalReserves = reserves?.reduce((sum, reserve) => sum + reserve.current_value, 0) || 0;
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

export const OverviewPage: React.FC = () => {
  const { user, loading, isInitialized } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [forceShow, setForceShow] = useState(false);
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Handle authentication and redirection
  useEffect(() => {
    // Check if we're on the custom domain
    const isCustomDomain = window.location.hostname === 'couplecents.lucasdreger.com';
    
    // Add a timeout to ensure we show something
    const timer = setTimeout(() => {
      console.log("OverviewPage: Safety timeout reached, forcing content to show");
      setForceShow(true);
    }, 5000);

    if (!loading && !user && !isCustomDomain && !forceShow) {
      console.log('OverviewPage: No user found, redirecting to login page');
      navigate('/login');
    }
    
    return () => clearTimeout(timer);
  }, [user, loading, navigate, forceShow]);
  
  // Show loading state while auth is being checked
  if (loading && !forceShow) {
    return <LoadingOverview />;
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6" style={{ display: 'block', visibility: 'visible' }}>
      {/* Header with greeting and date */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center z-10 relative">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Coins className="h-7 w-7 text-primary" />
              <span>CoupleCents Overview</span>
            </h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" /> {formattedDate}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-2 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium">Financial Health</span>
          </div>
        </div>
        
        <div className="absolute -z-0 bottom-0 right-0 w-full h-[150%]">
          <Sparkles 
            className="h-full w-full" 
            color={theme === "dark" ? "var(--sparkles-color)" : "#8350e8"}
            size={1.5}
            density={40}
            speed={0.3}
            opacity={0.15}
          />
        </div>
      </div>

      {/* Total Assets Card */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Total Assets</CardTitle>
          <CardDescription>Combined value of investments and reserves</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorBoundary fallback={<ErrorFallback message="Error loading assets data" />}>
            <TotalAssets />
          </ErrorBoundary>
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
          <Card className="shadow-sm border-primary/10 overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-2">
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Expenses by category</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 relative">
              <CategoryBreakdown timeRange={12} />
            </CardContent>
          </Card>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ErrorFallback message="Error loading investment distribution" />}>
          <Card className="shadow-sm border-primary/10 relative overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-2 relative z-10">
              <CardTitle>Investment Distribution</CardTitle>
              <CardDescription>Distribution by investment type</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 relative z-10">
              <InvestmentDistribution />
            </CardContent>
            <div className="absolute inset-0 -z-0">
              <ProgressiveBlur 
                direction="right" 
                blurLayers={6} 
                blurIntensity={0.1} 
                className="h-full w-full opacity-50"
              />
            </div>
          </Card>
        </ErrorBoundary>
      </div>
      
      {/* Monthly Budget vs Actual Chart */}
      <ErrorBoundary fallback={<ErrorFallback message="Error loading monthly data" />}>
        <Card className="shadow-sm border-primary/10 relative overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-2">
            <CardTitle>Monthly Budget vs Actual</CardTitle>
            <CardDescription>Compare planned versus actual spending for current year</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <MonthlyChart months={12} />
          </CardContent>
          <div className="absolute inset-0 -z-0">
            <ProgressiveBlur 
              direction="top" 
              blurLayers={6} 
              blurIntensity={0.1} 
              className="h-full w-full opacity-50"
            />
          </div>
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
