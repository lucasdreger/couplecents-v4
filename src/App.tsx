import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/hooks/useAuth'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"

// Components
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { OverviewPage } from "@/components/Overview/OverviewPage"
import { MonthlyExpenses } from "@/pages/MonthlyExpenses"
import { Administration } from "@/pages/Administration"
import { Login } from "@/components/Auth/Login"

// Define main router configuration
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { 
        index: true,
        element: <OverviewPage />,
      },
      { 
        path: "expenses",
        element: <MonthlyExpenses />,
      },
      { 
        path: "admin",
        element: <Administration />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
