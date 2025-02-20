
/**
 * Main application component that sets up:
 * - React Query for data fetching
 * - Router for navigation
 * - UI providers for tooltips and toasts
 * - Protected routes through MainLayout
 */

import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Expenses } from '@/pages/Expenses'
import { Investments } from '@/pages/Investments'
import { Login } from '@/pages/Login'
import { Reserves } from '@/pages/Reserves'
import { MonthlyIncome } from '@/pages/MonthlyIncome'
import { FixedExpenses } from '@/pages/FixedExpenses'

// Create React Query client for managing server state
const queryClient = new QueryClient()

// Define application routes with authentication protection
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'investments', element: <Investments /> },
      { path: 'reserves', element: <Reserves /> },
      { path: 'income', element: <MonthlyIncome /> },
      { path: 'fixed-expenses', element: <FixedExpenses /> },
      // Catch all undefined routes and redirect to dashboard
      { path: '*', element: <Navigate to="/" replace /> }
    ],
  },
  // Public routes
  { path: '/login', element: <Login /> },
])

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
