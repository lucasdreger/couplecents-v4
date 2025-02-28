import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import PrivateRoute from '@/components/Auth/PrivateRoute';
import Login from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Expenses } from '@/pages/Expenses';
import { Investments } from '@/pages/Investments';
import { Reserves } from '@/pages/Reserves';
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
  );
}

export default App;
