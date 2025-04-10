import { ReactElement, useEffect } from 'react';
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
import { DebugOverlay } from '@/components/ui/debug-overlay';

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

// Get the base URL from import.meta.env or default to '/'
const baseUrl = import.meta.env.BASE_URL || '/';

// Use BrowserRouter for all environments
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

function App(): ReactElement {
  useEffect(() => {
    // Add critical inline styles to ensure visibility
    const style = document.createElement('style');
    style.textContent = `
      #root, body, html {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log('App mounted - Current pathname:', window.location.pathname);
    
    // Add custom domain check
    const isCustomDomain = window.location.hostname === 'couplecents.lucasdreger.com';
    if (isCustomDomain) {
      console.log('Custom domain detected:', window.location.hostname);
    }
    
    // Add a safety timeout to ensure the app becomes visible
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout reached - Force showing app content');
      const root = document.getElementById('root');
      if (root) {
        root.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
      }
      document.body.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
    }, 3000);
    
    return () => {
      document.head.removeChild(style);
      clearTimeout(safetyTimeout);
    };
  }, []);
  
  return (
    <div id="app-wrapper" className="app-wrapper" style={{ display: 'block', minHeight: '100vh' }}>
      {/* Debug overlay */}
      <DebugOverlay />
      
      {/* Normal app structure */}
      <div data-app-root="true" style={{ display: 'block', minHeight: '100vh' }}>
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
      </div>
    </div>
  );
}

export default App;
