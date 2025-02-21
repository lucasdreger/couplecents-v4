/**
 * Investments Summary Tile Component
 * 
 * Displays current investment status including:
 * - Investment categories
 * - Current values with edit capability
 * - Distribution chart
 * - Last update timestamps
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/hooks/useAuth';
import { useInvestments } from '@/hooks/useInvestments';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const InvestmentsTile = () => {
  const { user } = useAuth();
  const { investments, updateValue } = useInvestments();

  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.current_value, 0) || 0;
  const pieData = investments?.map(inv => ({
    name: inv.name,
    value: inv.current_value
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Investments</CardTitle>
            <CardDescription>Manage your investment portfolio</CardDescription>
          </div>
          <span className="text-xl font-semibold">Total: ${totalInvestments.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-semibold">Current Values</h3>
            <div className="space-y-4">
              {investments?.map((investment) => (
                <div key={investment.id} className="flex items-center gap-4">
                  <span className="min-w-[120px] font-medium">{investment.name}</span>
                  <Input
                    type="number"
                    className="w-32"
                    defaultValue={investment.current_value}
                    onChange={e => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        updateValue({ id: investment.id, value, userId: user?.id || '' });
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Last updated: {new Date(investment.last_updated).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
