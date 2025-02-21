import { MonthlyExpenses } from '@/pages/MonthlyExpenses'
// ...existing imports...

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // ...existing routes...
      {
        path: "expenses",
        element: <MonthlyExpenses />
      },
      // ...other routes...
    ]
  }
])
