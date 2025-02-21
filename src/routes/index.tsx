import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/DashboardLayout';
import { OverviewPage } from '@/components/Overview/OverviewPage';
import { MonthlyExpenses } from '@/pages/MonthlyExpenses';
import { Login } from '@/pages/Login';
import { Administration } from '@/pages/Administration';
import { NotFound } from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: "expenses",
        element: <MonthlyExpenses />
      },
      {
        path: "admin",
        element: <Administration />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);
