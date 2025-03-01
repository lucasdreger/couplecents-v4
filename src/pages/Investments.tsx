import { useAuth } from '@/context/AuthContext'
import { useInvestments } from '@/hooks/useInvestments'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const Investments = () => {
  const { user } = useAuth()
  const { investments, updateValue } = useInvestments()

  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.current_value, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Investments</h2>
        <div className="text-2xl">Total: ${totalInvestments.toFixed(2)}</div>
      </div>

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
  )
}
