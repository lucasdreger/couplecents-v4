
/**
 * Main application component that sets up:
 * - React Query for data fetching
 * - Router for navigation
 * - UI providers for tooltips and toasts
 * - Protected routes through MainLayout
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { OverviewPage } from './components/Overview/OverviewPage';
import { Expenses } from './pages/Expenses';
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
    <div className="min-h-screen flex">
      <div className="flex-1 p-8 pt-16">
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex">
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
                path="/expenses"
                element={
                  <ProtectedLayout>
                    <Expenses />
                  </ProtectedLayout>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
