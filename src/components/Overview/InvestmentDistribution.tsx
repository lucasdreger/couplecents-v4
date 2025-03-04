import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from '@/lib/utils'

interface Investment {
  id: string;
  name: string;
  amount: number;
  type: string;
  returns: number;
  user_id: string;
}

interface InvestmentDistributionProps {
  investments: Investment[];
}

export const InvestmentDistribution = ({ investments }: InvestmentDistributionProps) => {
  // Group investments by type
  const groupedInvestments = investments.reduce((acc: { [key: string]: number }, inv: Investment) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.amount
    return acc
  }, {})

  // Convert to array and sort by amount
  const sortedInvestments = Object.entries(groupedInvestments)
    .map(([type, amount]) => ({ type, amount }))
    .sort((a, b) => b.amount - a.amount)

  const totalInvestment = sortedInvestments.reduce((total, item) => total + item.amount, 0)

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
    "#D4A5A5", "#9FA8DA", "#CE93D8", "#9575CD", "#7986CB"
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Investment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedInvestments.map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm font-medium">
                      {sortedInvestments[index].type}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(sortedInvestments[index].amount)}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(sortedInvestments[index].amount / totalInvestment) * 100}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}