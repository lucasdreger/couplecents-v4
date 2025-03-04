
import React from 'react'
import { 
  AreaChart, 
  CartesianGrid, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Area as RechartsArea,
  Line as RechartsLine
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ChartData {
  name: string;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
}

interface Props {
  data: ChartData[];
}

export const FinancialAnalytics = ({ data }: Props) => {
  const [view, setView] = React.useState<'overview' | 'details'>('overview')

  // Calculate monthly totals
  const monthlyTotals = data.reduce((acc: any[], item) => {
    const month = item.name
    const totalIncome = item.income || 0
    const totalExpenses = item.expenses || 0
    const totalSavings = item.savings || 0
    const totalInvestments = item.investments || 0

    acc.push({
      name: month,
      income: totalIncome,
      expenses: totalExpenses,
      savings: totalSavings,
      investments: totalInvestments
    })

    return acc
  }, [])

  // Format data for the stacked area chart
  const stackedData = monthlyTotals.map(month => ({
    name: month.name,
    Income: month.income,
    Expenses: month.expenses,
    Savings: month.savings,
    Investments: month.investments
  }))

  // Calculate running totals
  const runningTotals = monthlyTotals.reduce((totals: any[], current) => {
    const previousMonth = totals[totals.length - 1] || {
      income: 0,
      expenses: 0,
      savings: 0,
      investments: 0
    }

    totals.push({
      name: current.name,
      income: previousMonth.income + current.income,
      expenses: previousMonth.expenses + current.expenses,
      savings: previousMonth.savings + current.savings,
      investments: previousMonth.investments + current.investments
    })

    return totals
  }, [])

  // Calculate total values
  const totalIncome = monthlyTotals.reduce((sum: number, item: ChartData) => sum + item.income, 0)
  const totalExpenses = monthlyTotals.reduce((sum: number, item: ChartData) => sum + item.expenses, 0)
  const totalSavings = monthlyTotals.reduce((sum: number, item: ChartData) => sum + item.savings, 0)
  const totalInvestments = monthlyTotals.reduce((sum: number, item: ChartData) => sum + item.investments, 0)

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Financial Analytics</CardTitle>
          <Tabs value={view} onValueChange={(v: string) => setView(v as 'overview' | 'details')}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {view === 'overview' ? (
              <AreaChart data={stackedData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7c7c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff7c7c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
                <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} />
                <RechartsArea type="monotone" dataKey="Income" stroke="#82ca9d" fillOpacity={1} fill="url(#colorIncome)" />
                <RechartsArea type="monotone" dataKey="Expenses" stroke="#ff7c7c" fillOpacity={1} fill="url(#colorExpenses)" />
                <RechartsArea type="monotone" dataKey="Savings" stroke="#8884d8" fillOpacity={1} fill="url(#colorSavings)" />
                <RechartsArea type="monotone" dataKey="Investments" stroke="#ffc658" fillOpacity={1} fill="url(#colorInvestments)" />
              </AreaChart>
            ) : (
              <LineChart data={runningTotals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <RechartsLine type="monotone" dataKey="income" name="Income" stroke="#82ca9d" />
                <RechartsLine type="monotone" dataKey="expenses" name="Expenses" stroke="#ff7c7c" />
                <RechartsLine type="monotone" dataKey="savings" name="Savings" stroke="#8884d8" />
                <RechartsLine type="monotone" dataKey="investments" name="Investments" stroke="#ffc658" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-lg font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(totalSavings)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-lg font-bold text-yellow-600">
                {formatCurrency(totalInvestments)}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
