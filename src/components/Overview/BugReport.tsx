import React from 'react';
import { useInvestments } from '@/hooks/useInvestments';
import { useAuth } from '@/hooks/useAuth';

export function BugReport() {
  const { user } = useAuth();
  const { investments, isLoading: investmentsLoading } = useInvestments();

  // Log component tree and data state
  React.useEffect(() => {
    console.group('Debug Report');
    console.log('Auth State:', { user });
    console.log('Investments State:', { investments, isLoading: investmentsLoading });
    console.log('Component Tree:');
    console.log('App');
    console.log('└─ QueryProvider');
    console.log('   └─ ThemeProvider');
    console.log('      └─ AuthProvider');
    console.log('         └─ DashboardLayout');
    console.log('            └─ OverviewPage');
    console.log('               ├─ InvestmentsTile');
    console.log('               ├─ BudgetTile');
    console.log('               ├─ ReservesTile');
    console.log('               ├─ MonthlyChart');
    console.log('               └─ CategoryBreakdown');
    console.groupEnd();
  }, [user, investments, investmentsLoading]);

  return null;
}
