import { useAuth } from '@/hooks/useAuth'
import { useInvestments } from '@/hooks/useInvestments'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export const Investments = () => {
  const { user } = useAuth()
  const { investments, updateValue } = useInvestments()

  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.current_value, 0) || 0
  const pieData = investments?.map(inv => ({
    name: inv.name,
    value: inv.current_value
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Investments</h2>
        <div className="text-2xl">Total: ${totalInvestments.toFixed(2)}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  label
                >
                  {pieData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {investments?.map(investment => (
            <Card key={investment.id}>
              <CardHeader>
                <CardTitle>{investment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    defaultValue={investment.current_value}
                    onChange={e => {
                      const value = parseFloat(e.target.value)
                      if (!isNaN(value)) {
                        updateValue({ id: investment.id, value, userId: user?.id || '' })
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    Last updated: {new Date(investment.last_updated).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
