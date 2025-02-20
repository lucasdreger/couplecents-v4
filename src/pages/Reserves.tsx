
import { useAuth } from '@/hooks/useAuth'
import { useReserves } from '@/hooks/useReserves'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export const Reserves = () => {
  console.log("Rendering Reserves page") // Debug log
  const { user } = useAuth()
  const { reserves, updateValue } = useReserves()
  
  console.log("Reserves data:", reserves) // Debug log
  
  const totalReserves = reserves?.reduce((sum, res) => sum + res.current_value, 0) || 0

  // Add a loading state check
  if (!reserves) {
    return <div>Loading reserves...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reserves</h2>
        <div className="text-2xl">Total: ${totalReserves.toFixed(2)}</div>
      </div>

      <div className="grid gap-4">
        {reserves?.map(reserve => (
          <Card key={reserve.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                {reserve.name}
                <span className="text-muted-foreground text-sm">
                  {reserve.category}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    defaultValue={reserve.current_value}
                    onChange={e => {
                      const value = parseFloat(e.target.value)
                      if (!isNaN(value)) {
                        updateValue({ id: reserve.id, value, userId: user?.id || '' })
                      }
                    }}
                  />
                  {reserve.target_value && (
                    <Progress 
                      value={(reserve.current_value / reserve.target_value) * 100} 
                      className="flex-1"
                    />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(reserve.last_updated).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
