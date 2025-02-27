<<<<<<< HEAD

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import FixedExpenses from './pages/FixedExpenses';
import Income from './pages/Income';
import Investments from './pages/Investments';
import Reserves from './pages/Reserves';
import Administration from './pages/Administration';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="fixed-expenses" element={<FixedExpenses />} />
        <Route path="income" element={<Income />} />
        <Route path="investments" element={<Investments />} />
        <Route path="reserves" element={<Reserves />} />
        <Route path="administration" element={<Administration />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
=======
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import PrivateRoute from '@/components/Auth/PrivateRoute';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Expenses } from '@/pages/Expenses';
import { FixedExpenses } from '@/pages/FixedExpenses';
import { Income } from '@/pages/Income';
import { Investments } from '@/pages/Investments';
import { Reserves } from '@/pages/Reserves';
import { Administration } from '@/pages/Administration';
import { NotFound } from '@/pages/NotFound';
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

// Create router
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />
          },
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/expenses",
            element: <Expenses />
          },
          {
            path: "/fixed-expenses",
            element: <FixedExpenses />
          },
          {
            path: "/income",
            element: <Income />
          },
          {
            path: "/investments",
            element: <Investments />
          },
          {
            path: "/reserves",
            element: <Reserves />
          },
          {
            path: "/administration",
            element: <Administration />
          },
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="expense-empower-theme">
        <AuthProvider>
          <RouterProvider router={router} />
          
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
>>>>>>> 1d8e598 (Refactor: Remove deprecated household management components and clean up unused imports)
  );
};

export default App;
