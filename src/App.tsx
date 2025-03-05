
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import PrivateRoute from '@/components/Auth/PrivateRoute';
import Login from '@/pages/Login';
import { DashboardLayout } from '@/layouts/DashboardLayout';
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
            path: "/monthly-expenses",
            element: <MonthlyExpenses />
          },
          {
            path: "/analytics",
            element: <FinancialAnalytics />
          },
          {
            path: "/administration",
            element: <Administration />
          },
          // User profile routes
          {
            path: "/profile",
            element: <div className="p-8 space-y-6">
              <h1 className="text-3xl font-bold">Profile Information</h1>
              <p className="text-muted-foreground">
                Manage your personal information and preferences here.
              </p>
            </div>
          },
          {
            path: "/email-preferences",
            element: <div className="p-8 space-y-6">
              <h1 className="text-3xl font-bold">Email Preferences</h1>
              <p className="text-muted-foreground">
                Manage your email notification settings here.
              </p>
            </div>
          },
          {
            path: "/change-password",
            element: <div className="p-8 space-y-6">
              <h1 className="text-3xl font-bold">Change Password</h1>
              <p className="text-muted-foreground">
                Update your password and security settings here.
              </p>
            </div>
          },
          {
            path: "/security",
            element: <div className="p-8 space-y-6">
              <h1 className="text-3xl font-bold">Security Settings</h1>
              <p className="text-muted-foreground">
                Manage your account security settings here.
              </p>
            </div>
          },
          {
            path: "/payment-methods",
            element: <div className="p-8 space-y-6">
              <h1 className="text-3xl font-bold">Payment Methods</h1>
              <p className="text-muted-foreground">
                Manage your payment methods here.
              </p>
            </div>
          }
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
  );
}

export default App;
