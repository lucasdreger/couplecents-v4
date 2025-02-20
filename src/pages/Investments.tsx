import { useQuery } from "@tanstack/react-query"
import { getInvestments, getReserves } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentForm } from "@/components/investments/InvestmentForm"
import { ReserveForm } from "@/components/investments/ReserveForm"

export function Investments() {
  const { data: investments } = useQuery({
    queryKey: ['investments'],
    queryFn: getInvestments
  })

  const { data: reserves } = useQuery({
    queryKey: ['reserves'],
    queryFn: getReserves
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Investments & Reserves</h1>
      </div>

      <Tabs defaultValue="investments">
        <TabsList>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="reserves">Reserves</TabsTrigger>
        </TabsList>
        
        <TabsContent value="investments">
          <div className="grid gap-4 md:grid-cols-3">
            {investments?.data?.map((investment) => (
              <Card key={investment.id} className="p-4">
                <h3 className="font-semibold">{investment.name}</h3>
                <p className="text-2xl">${investment.current_value}</p>
                <p className="text-sm text-muted-foreground">{investment.category}</p>
              </Card>
            ))}
            <InvestmentForm />
          </div>
        </TabsContent>

        <TabsContent value="reserves">
          <div className="grid gap-4 md:grid-cols-3">
            {reserves?.data?.map((reserve) => (
              <Card key={reserve.id} className="p-4">
                <h3 className="font-semibold">{reserve.name}</h3>
                <p className="text-2xl">${reserve.current_value}</p>
                {reserve.target_value && (
                  <progress 
                    value={reserve.current_value} 
                    max={reserve.target_value}
                    className="w-full"
                  />
                )}
              </Card>
            ))}
            <ReserveForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
