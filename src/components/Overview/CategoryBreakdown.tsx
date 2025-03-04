
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { GlowingEffect } from '@/components/ui/glowing-effect'

interface CategoryBreakdownProps {
  expenses: Array<{
    category_id: string
    category_name: string
    total: number
  }>
}

export const CategoryBreakdown = ({ expenses }: CategoryBreakdownProps) => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
    "#D4A5A5", "#9FA8DA", "#CE93D8", "#9575CD", "#7986CB"
  ]

  const data = expenses.map((expense, index) => ({
    name: expense.category_name,
    value: expense.total,
    color: colors[index % colors.length]
  }))

  const renderCustomLabel = (entry: { name: string; value: number }, index: number) => {
    return `${((data[index].value / total) * 100).toFixed(0)}%`
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="relative overflow-hidden">
      <GlowingEffect disabled={false} spread={30} glow={true} />
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-1">
          {data.map((category, index) => (
            <div key={index} className="flex items-center">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="ml-2 text-sm">{category.name}</span>
              <span className="ml-auto text-sm text-muted-foreground">
                {formatCurrency(category.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
