import { useQuery } from '@tanstack/react-query'
import { getMonthlyIncome, getMonthlyExpenses, getInvestments, getReserves } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer 
} from 'recharts'

/**
 * Financial Dashboard
 * 
 * Central view displaying:
 * - Monthly income and expenses summary
 * - Investment portfolio overview
 * - Expense breakdown visualization
 * - Real-time financial status
 * 
 * Uses Recharts for data visualization and React Query for data fetching.
 * All amounts are properly formatted and calculations are handled safely.
 */

export const Dashboard = () => {
  // Get current month and year for queries
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // Fetch data using React Query
  const { data: income } = useQuery({
    queryKey: ['income', year, month],
    queryFn: async () => {
      const { data } = await getMonthlyIncome(year, month)
      return data
    }
  })

  const { data: expenses } = useQuery({
    queryKey: ['expenses', year, month],
    queryFn: async () => {
      const { data } = await getMonthlyExpenses(year, month)
      return data
    }
  })

  const { data: investments } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const { data } = await getInvestments()
      return data
    }
  })

  // Calculate totals for display
  const totalExpenses = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.current_value, 0) || 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${income ? (income.lucas_income + income.camila_income + income.other_income).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalInvestments.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="description" />
              <YAxis />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
