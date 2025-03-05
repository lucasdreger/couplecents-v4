/**
 * Budget Summary Tile Component
 * 
 * Displays the total budget information including:
 * - Total income
 * - Total expenses
 * - Net balance
 */
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from '@/lib/utils'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { Progress } from '@/components/ui/progress'

interface Props {
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBudget: number
  remainingBudget: number
}

export const BudgetTile = ({ monthlyIncome, monthlyExpenses, monthlyBudget, remainingBudget }: Props) => {
  // Calculate percentage of budget used
  const budgetPercentage = Math.min((monthlyExpenses / monthlyBudget) * 100, 100);
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add glowing effect to the card */}
        <div className="absolute inset-0">
          <GlowingEffect 
            spread={20}
            glow={true}
            disabled={false}
            proximity={40}
          />
        </div>
        
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Income</span>
            <span className="font-medium text-green-600">{formatCurrency(monthlyIncome)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Expenses</span>
            <span className="font-medium text-red-600">{formatCurrency(monthlyExpenses)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Budget</span>
            <span className="font-medium">{formatCurrency(monthlyBudget)}</span>
          </div>
          
          {/* Add progress bar for visual representation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Budget usage</span>
              <span>{budgetPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={budgetPercentage} className="h-2" 
              indicator={remainingBudget >= 0 ? 'bg-green-600' : 'bg-red-600'} />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Remaining Budget</span>
            <span className={`font-medium ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(remainingBudget)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
