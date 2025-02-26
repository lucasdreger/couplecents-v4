
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AdministrationPage from './features/administration/AdministrationPage';

// Components
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { OverviewPage } from "@/components/Overview/OverviewPage";
import { MonthlyExpenses } from "@/pages/MonthlyExpenses";
import { Login } from "@/components/Auth/Login";
import { PrivateRoute } from "@/components/Auth/PrivateRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }>
                <Route index element={<OverviewPage />} />
                <Route path="expenses" element={<MonthlyExpenses />} />
                <Route path="administration" element={<AdministrationPage />} />
              </Route>
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  );
};

export default App;
