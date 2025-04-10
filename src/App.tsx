import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
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
import { useEffect, useState } from 'react';

// Debug component that will always render regardless of authentication
function DebugOverlay() {
  const [expanded, setExpanded] = useState(false);
  const [cssDisabled, setCssDisabled] = useState(false);
  const [domInfo, setDomInfo] = useState<{ elements: number, rootChildren: number }>({
    elements: 0,
    rootChildren: 0
  });

  // Check DOM periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setDomInfo({
        elements: document.querySelectorAll('*').length,
        rootChildren: document.getElementById('root')?.children.length || 0
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to toggle all CSS in the document
  const toggleCSS = () => {
    const newState = !cssDisabled;
    setCssDisabled(newState);

    // Get all stylesheets
    const styleSheets = Array.from(document.styleSheets);

    styleSheets.forEach(sheet => {
      try {
        if (sheet.disabled !== newState) {
          sheet.disabled = newState;
        }
      } catch (e) {
        console.error("Error toggling stylesheet:", e);
      }
    });

    // Also add an emergency override style if disabling CSS
    if (newState) {
      const style = document.createElement('style');
      style.id = 'emergency-override';
      style.innerHTML = `
        * { 
          display: block !important; 
          visibility: visible !important; 
          opacity: 1 !important;
          color: black !important;
          background: white !important;
          position: static !important;
          margin: 2px !important;
          border: 1px solid #ddd !important;
          max-height: none !important;
          max-width: none !important;
          overflow: visible !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      document.getElementById('emergency-override')?.remove();
    }
  };

  // Force show app content
  const forceShowContent = () => {
    const root = document.getElementById('root');
    if (root) {
      root.style.display = 'block';
      root.style.visibility = 'visible';
      root.style.opacity = '1';

      // Find and show all possible app containers
      ['#app', '.app', '[role="main"]', 'main', '.container', '.content'].forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          (el as HTMLElement).style.display = 'block';
          (el as HTMLElement).style.visibility = 'visible';
          (el as HTMLElement).style.opacity = '1';
        });
      });
    }
  };

  // Try direct rendering of content
  const renderDirectContent = () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      // Create a new container for our direct content
      const directContainer = document.createElement('div');
      directContainer.style.padding = '20px';
      directContainer.style.margin = '20px';
      directContainer.style.background = '#fff';
      directContainer.style.border = '1px solid #ddd';
      directContainer.style.borderRadius = '4px';
      directContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      directContainer.style.fontFamily = 'system-ui, sans-serif';

      // Add some content to it
      directContainer.innerHTML = `
        <h1 style="font-size: 24px; margin-bottom: 16px;">Direct DOM Render Test</h1>
        <p style="margin-bottom: 8px;">This content was rendered directly to the DOM.</p>
        <p style="margin-bottom: 16px;">If you can see this but not your app, there's a React rendering issue.</p>
        <div style="display: flex; gap: 8px;">
          <a href="/couplecents-v4/" style="color: #3b82f6; text-decoration: underline;">Refresh</a>
          <a href="/couplecents-v4/index-debug.html" style="color: #3b82f6; text-decoration: underline;">Debug Page</a>
        </div>
      `;

      // Prepend to the root element
      rootElement.prepend(directContainer);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 10000,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      maxWidth: expanded ? '400px' : '300px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <h3 style={{ margin: '0' }}>Debug Panel</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0 5px'
          }}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      <div>App is loaded</div>
      <div>URL: {window.location.pathname}</div>
      <div>DOM elements: {domInfo.elements}</div>
      <div>Root children: {domInfo.rootChildren}</div>

      {expanded && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <button
              onClick={toggleCSS}
              style={{
                padding: '8px 12px',
                backgroundColor: cssDisabled ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px',
                fontSize: '12px'
              }}
            >
              {cssDisabled ? 'Re-enable CSS' : 'Disable CSS'}
            </button>

            <button
              onClick={forceShowContent}
              style={{
                padding: '8px 12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Force Show
            </button>
          </div>

          <button
            onClick={renderDirectContent}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '12px'
            }}
          >
            Render Test Content
          </button>

          <div style={{ marginTop: '10px' }}>
            <a
              href="/couplecents-v4/index-debug.html"
              style={{ color: '#4ade80', display: 'block', marginBottom: '5px' }}
            >
              Go to Debug Page
            </a>
            <a
              href="/couplecents-v4/test.html"
              style={{ color: '#4ade80', display: 'block' }}
            >
              Go to Static Test Page
            </a>
          </div>
        </div>
      )}
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

// Check if we're on GitHub Pages or custom domain
const isGitHubPages = window.location.hostname.includes('github.io');
// Check if we're on custom domain
const isCustomDomain = window.location.hostname === 'couplecents.lucasdreger.com';

console.log('App initialization - Base URL:', baseUrl);
console.log('Is GitHub Pages:', isGitHubPages);
console.log('Is Custom Domain:', isCustomDomain);

// Create routes configuration
const routes = [
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
];

// Use HashRouter for GitHub Pages and BrowserRouter for custom domain or local environment
// For custom domain, we can use BrowserRouter which gives cleaner URLs
const router = isGitHubPages && !isCustomDomain
  ? createHashRouter(routes) 
  : createBrowserRouter(routes, { basename: baseUrl });

function App() {
  useEffect(() => {
    console.log('App mounted - Current pathname:', window.location.pathname);
    
    // Add debug info to console
    console.log('Window URL:', window.location.href);
    console.log('Using router type:', (isGitHubPages && !isCustomDomain) ? 'HashRouter' : 'BrowserRouter');
    
    // Check for CSS visibility problems and fix them if needed
    if (isGitHubPages || isCustomDomain) {
      console.log('Ensuring visibility for hosted environment...');
      // Force elements to be visible after a short delay to ensure React has rendered
      setTimeout(() => {
        const rootElement = document.getElementById('root');
        if (rootElement) {
          rootElement.style.visibility = 'visible';
          rootElement.style.opacity = '1';
          
          // Also ensure the app container is visible
          const appContainer = rootElement.firstElementChild;
          if (appContainer instanceof HTMLElement) {
            appContainer.style.visibility = 'visible';
            appContainer.style.opacity = '1';
            appContainer.style.display = 'block';
          }
        }
      }, 100);
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
