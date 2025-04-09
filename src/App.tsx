import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import PrivateRoute from '@/components/Auth/PrivateRoute';
import Login from '@/pages/Login';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard';
import { MonthlyExpenses } from '@/pages/MonthlyExpenses';
import Administration from '@/pages/Administration';
import FinancialAnalytics from '@/pages/FinancialAnalytics';
import NotFound from '@/pages/NotFound';

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

// Get the base URL from import.meta.env
const baseUrl = import.meta.env.BASE_URL || '/';

// Create router with the correct base URL
const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <Dashboard />
          },
          {
            path: "monthly-expenses",
            element: <MonthlyExpenses />
          },
          {
            path: "analytics",
            element: <FinancialAnalytics />
          },
          {
            path: "administration",
            element: <Administration />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
], {
  basename: baseUrl
});

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
  );
}

export default App;
