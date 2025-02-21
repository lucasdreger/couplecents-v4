import React from 'react';
import { HashRouter, Routes, Route } from "react-router-dom"
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
import { PrivateRoute } from "@/components/Auth/PrivateRoute"

const App: React.FC = () => {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <HashRouter>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="" element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }>
                <Route index element={<OverviewPage />} />
                <Route path="expenses" element={<MonthlyExpenses />} />
                <Route path="admin" element={<Administration />} />
              </Route>
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
            <Toaster />
            <Sonner />
          </HashRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
