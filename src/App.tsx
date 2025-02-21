/**
 * Main application component that sets up:
 * - React Query for data fetching
 * - Router for navigation
 * - UI providers for tooltips and toasts
 * - Protected routes through MainLayout
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { Login } from './components/Auth/Login';
import { Navigation } from './components/Layout/Navigation';
import { OverviewPage } from './components/Overview/OverviewPage';
import { MonthlyDetailsPage } from './components/MonthlyDetails/MonthlyDetailsPage';
import { CategoriesPage } from './components/Categories/CategoriesPage';
import { FixedExpensesPage } from './components/FixedExpenses/FixedExpensesPage';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"

import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create React Query client for managing server state
const queryClient = new QueryClient()

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route
                path="/overview"
                element={
                  <ProtectedLayout>
                    <OverviewPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/monthly-details"
                element={
                  <ProtectedLayout>
                    <MonthlyDetailsPage />
                  </ProtectedLayout>
                }
              />
              {/* Add other protected routes similarly */}
            </Routes>
          </Box>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
