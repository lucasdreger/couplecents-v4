import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/hooks/useAuth'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import AdministrationPage from './features/administration/AdministrationPage'

// Components
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { OverviewPage } from "@/components/Overview/OverviewPage"
import { MonthlyExpenses } from "@/pages/MonthlyExpenses"
import { Administration } from "@/pages/Administration"
import { Login } from "@/components/Auth/Login"
import { PrivateRoute } from "@/components/Auth/PrivateRoute"

// Replace BrowserRouter, Routes, Route usage with RouterProvider and createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navigation />
        <Outlet />
      </>
    ),
    children: [
      // Add your routes here
      // { path: '/', element: <Home /> },
      // { path: '/expenses', element: <Expenses /> },
      // etc.
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
