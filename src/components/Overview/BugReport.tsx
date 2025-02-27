import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useInvestments } from "@/hooks/useInvestments";
import { useCategories } from "@/hooks/useCategories";

export function BugReport() {
  const { user } = useAuth();
  const { investments, isLoading: investmentsLoading } = useInvestments();
  const { categories, isLoading: categoriesLoading } = useCategories();

  // Log component tree and data state
  React.useEffect(() => {
    console.group('Debug Report');
    console.log('Auth State:', { user });
    console.log('Data State:', { 
      investments, 
      isLoading: investmentsLoading,
      categories,
      categoriesLoading
    });
    console.log('Component Tree:');
    console.log('App');
    console.log('└─ QueryProvider');
    console.log('   └─ ThemeProvider');
    console.log('      └─ AuthProvider');
    console.log('         └─ DashboardLayout');
    console.log('            └─ Routes');
    console.log('               ├─ Overview');
    console.log('               ├─ Expenses');
    console.log('               ├─ Fixed Expenses');
    console.log('               ├─ Income');
    console.log('               ├─ Investments');
    console.log('               ├─ Reserves');
    console.log('               └─ Administration');
    console.groupEnd();
  }, [user, investments, investmentsLoading, categories, categoriesLoading]);

  return null;
}
