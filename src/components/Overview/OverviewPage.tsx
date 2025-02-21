
/**
 * Overview Page Component
 * 
 * Displays high-level financial information including:
 * - Total budget
 * - Investments status
 * - Reserves
 * - Monthly comparisons
 * - Category breakdowns
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BudgetTile } from './BudgetTile';
import { InvestmentsTile } from './InvestmentsTile';
import { ReservesTile } from './ReservesTile';
import { MonthlyChart } from './MonthlyChart';
import { CategoryBreakdown } from './CategoryBreakdown';

export const OverviewPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BudgetTile />
        <InvestmentsTile />
        <ReservesTile />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget vs Actual</CardTitle>
          <CardDescription>Compare planned versus actual spending</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyChart />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryBreakdown />
        </CardContent>
      </Card>
    </div>
  );
};
