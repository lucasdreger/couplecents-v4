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

interface Props {
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBudget: number
  remainingBudget: number
}

export const BudgetTile = ({ monthlyIncome, monthlyExpenses, monthlyBudget, remainingBudget }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
          <div className="flex items-center justify-between">
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
