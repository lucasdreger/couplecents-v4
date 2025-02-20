import { useQuery } from '@tanstack/react-query'
import { getMonthlyIncome, getMonthlyExpenses } from '@/lib/supabase'
import { Card } from '@/components/ui/card'

export function Dashboard() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const { data: income } = useQuery({
    queryKey: ['income', currentYear, currentMonth],
    queryFn: () => getMonthlyIncome(currentYear, currentMonth)
  })

  const { data: expenses } = useQuery({
    queryKey: ['expenses', currentYear, currentMonth],
    queryFn: () => getMonthlyExpenses(currentYear, currentMonth)
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold">Total Income</h3>
          <p className="text-2xl">${income?.data?.lucas_income + income?.data?.camila_income}</p>
        </Card>
        {/* Add more cards for expenses and savings */}
      </div>
    </div>
  )
}
