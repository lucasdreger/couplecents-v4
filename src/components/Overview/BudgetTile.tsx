/**
 * Budget Summary Tile Component
 * 
 * Displays the total budget information including:
 * - Total income
 * - Total expenses
 * - Net balance
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BudgetTileProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

export function BudgetTile({ 
  totalIncome,
  totalExpenses,
  savings 
}: BudgetTileProps) {
  const expensePercentage = totalIncome > 0 
    ? (totalExpenses / totalIncome) * 100 
    : 0;

  const savingsPercentage = totalIncome > 0 
    ? (savings / totalIncome) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Income</span>
            <span className="text-right font-bold">
              {totalIncome.toLocaleString('de-DE', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">Expenses</span>
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            </div>
            <span className="text-right font-bold text-red-500">
              {totalExpenses.toLocaleString('de-DE', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </span>
          </div>

          <Progress 
            value={expensePercentage} 
            className="h-2 bg-muted"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">Savings</span>
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-right font-bold text-green-500">
              {savings.toLocaleString('de-DE', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </span>
          </div>

          <Progress 
            value={savingsPercentage} 
            className="h-2 bg-muted"
            indicatorClassName="bg-green-500"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Savings Rate: {savingsPercentage.toFixed(1)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
