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
import { useEffect } from 'react';

// Debug component that will always render regardless of authentication
function DebugOverlay() {
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 10000,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>Debug Panel</h3>
      <div>App is loading</div>
      <div>URL: {window.location.pathname}</div>
      <a 
        href="/couplecents-v4/index-debug.html" 
        style={{ color: '#4ade80', display: 'block', marginTop: '8px' }}
      >
        Go to Debug Page
      </a>
    </div>
  );
}

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

console.log('App initialization - Base URL:', baseUrl);

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
  useEffect(() => {
    console.log('App mounted - Current pathname:', window.location.pathname);
    
    // Add more detailed DOM structure logging
    const rootElement = document.getElementById('root');
    console.log('Root element:', rootElement);
    if (rootElement) {
      console.log('Root children count:', rootElement.childNodes.length);
      console.log('Root HTML:', rootElement.innerHTML);
    }
  }, []);
  
  return (
    <>
      {/* Always visible debug overlay */}
      <DebugOverlay />
      
      {/* Normal app structure */}
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
    </>
  );
}

export default App;
