
/**
 * Main application component that sets up:
 * - React Query for data fetching
 * - Router for navigation
 * - UI providers for tooltips and toasts
 * - Protected routes through MainLayout
 */

import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Expenses } from "@/pages/Expenses"
import { FixedExpenses } from "@/pages/FixedExpenses"
import { Income } from "@/pages/Income"
import { Investments } from "@/pages/Investments"
import { Administration } from "@/pages/Administration"
import { Login } from "@/components/Auth/Login"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { supabase } from './lib/supabaseClient';

// Create React Query client for managing server state
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { 
        index: true,
        element: <Dashboard />,
      },
      { 
        path: "expenses",
        element: <Expenses />,
      },
      { 
        path: "fixed-expenses",
        element: <FixedExpenses />,
      },
      { 
        path: "income",
        element: <Income />,
      },
      { 
        path: "investments",
        element: <Investments />,
      },
      { 
        path: "admin",
        element: <Administration />,
      },
    ],
  },
]);

const App: React.FC = () => {
  useEffect(() => {
    // Check for existing session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.setItem('isAuthenticated', 'false');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        localStorage.setItem('isAuthenticated', 'false');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
