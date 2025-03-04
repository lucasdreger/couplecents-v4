import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'

interface DefaultIncome {
  lucas_main_income: number;
  lucas_other_income: number;
  camila_main_income: number;
  camila_other_income: number;
}

interface Props {
  defaultIncome: DefaultIncome;
  isLoading: boolean;
}

export const DefaultIncomeManagement = ({ defaultIncome, isLoading }: Props) => {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [lucasMainIncome, setLucasMainIncome] = React.useState(defaultIncome?.lucas_main_income?.toString() || '')
  const [lucasOtherIncome, setLucasOtherIncome] = React.useState(defaultIncome?.lucas_other_income?.toString() || '')
  const [camilaMainIncome, setCamilaMainIncome] = React.useState(defaultIncome?.camila_main_income?.toString() || '')
  const [camilaOtherIncome, setCamilaOtherIncome] = React.useState(defaultIncome?.camila_other_income?.toString() || '')

  React.useEffect(() => {
    if (defaultIncome) {
      setLucasMainIncome(defaultIncome.lucas_main_income?.toString() || '')
      setLucasOtherIncome(defaultIncome.lucas_other_income?.toString() || '')
      setCamilaMainIncome(defaultIncome.camila_main_income?.toString() || '')
      setCamilaOtherIncome(defaultIncome.camila_other_income?.toString() || '')
    }
  }, [defaultIncome])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('default_income')
        .update({
          lucas_main_income: parseFloat(lucasMainIncome) || 0,
          lucas_other_income: parseFloat(lucasOtherIncome) || 0,
          camila_main_income: parseFloat(camilaMainIncome) || 0,
          camila_other_income: parseFloat(camilaOtherIncome) || 0
        })
        .eq('id', defaultIncome.id)

      if (error) throw error

      toast({
        description: "Default income values updated successfully",
      })
    } catch (error) {
      toast({
        description: "Error updating default income values",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLucasMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.,]/g, '')
    setLucasMainIncome(value)
  }

  const handleLucasOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.,]/g, '')
    setLucasOtherIncome(value)
  }

  const handleCamilaMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.,]/g, '')
    setCamilaMainIncome(value)
  }

  const handleCamilaOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.,]/g, '')
    setCamilaOtherIncome(value)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Default Income Values</CardTitle>
        </CardHeader>
        <CardContent>
          Loading...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Income Values</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Lucas</h3>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Main Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    type="text"
                    value={lucasMainIncome}
                    onChange={handleLucasMainChange}
                    className="pl-7"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Other Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    type="text"
                    value={lucasOtherIncome}
                    onChange={handleLucasOtherChange}
                    className="pl-7"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Camila</h3>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Main Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    type="text"
                    value={camilaMainIncome}
                    onChange={handleCamilaMainChange}
                    className="pl-7"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Other Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    type="text"
                    value={camilaOtherIncome}
                    onChange={handleCamilaOtherChange}
                    className="pl-7"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
