import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from '@/lib/utils'
import { TrendingDown, TrendingUp, ArrowRight } from 'lucide-react'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface MonthlySummaryProps {
  month: string
  year: number
  totalIncome: number
  totalExpenses: number
  previousMonthExpenses?: number
  remainingBudget: number
  categoriesCount: number
}

export const MonthlySummary = ({
  month,
  year,
  totalIncome,
  totalExpenses,
  previousMonthExpenses,
  remainingBudget,
  categoriesCount
}: MonthlySummaryProps) => {
  const navigate = useNavigate()
  
  // Calculate expense trend percentage
  const expenseTrend = previousMonthExpenses 
    ? ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
    : 0

  // Format trend to 1 decimal place and handle negative sign
  const formattedTrend = `${expenseTrend >= 0 ? '+' : ''}${expenseTrend.toFixed(1)}%`
  
  const isOverBudget = remainingBudget < 0
  const budgetUsagePercentage = Math.min(Math.abs((totalExpenses / totalIncome) * 100), 100)
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {month} {year} Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Glowing effect for card */}
        <div className="absolute inset-0 rounded-lg">
          <GlowingEffect 
            spread={30} 
            glow={true} 
            disabled={false} 
            proximity={60}
          />
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                {formatCurrency(totalExpenses)}
              </p>
              
              {previousMonthExpenses && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md flex items-center ${
                  expenseTrend > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {expenseTrend > 0 ? 
                    <TrendingUp className="h-3 w-3 mr-0.5" /> : 
                    <TrendingDown className="h-3 w-3 mr-0.5" />
                  }
                  {formattedTrend}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Budget Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-muted-foreground">Budget Usage</p>
            <p className="text-sm font-medium">{budgetUsagePercentage.toFixed(0)}%</p>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className={`h-full rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-green-600'}`} 
              style={{ width: `${budgetUsagePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <p className={`font-medium ${isOverBudget ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
              {isOverBudget ? 'Over budget:' : 'Remaining:'}
              {' '}{formatCurrency(Math.abs(remainingBudget))}
            </p>
            <p className="text-muted-foreground">{categoriesCount} categories</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/expenses/${year}/${month.toLowerCase()}`)}
            className="text-sm flex gap-1 items-center"
          >
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}