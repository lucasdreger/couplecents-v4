import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

import PrivateRoute from '@/components/Auth/PrivateRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Expenses from '@/pages/Expenses';
import FixedExpenses from '@/pages/FixedExpenses';
import Income from '@/pages/Income';
import Investments from '@/pages/Investments';
import Reserves from '@/pages/Reserves';
import Administration from '@/pages/Administration';
import NotFound from '@/pages/NotFound';
import DashboardLayout from '@/layouts/DashboardLayout';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="expense-empower-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/fixed-expenses" element={<FixedExpenses />} />
                  <Route path="/income" element={<Income />} />
                  <Route path="/investments" element={<Investments />} />
                  <Route path="/reserves" element={<Reserves />} />
                  <Route path="/administration" element={<Administration />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              style: { background: 'var(--background)', color: 'var(--foreground)' },
              className: 'border border-border shadow-lg',
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
