import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart, 
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const FinancialAnalytics = () => {
  const { data: incomeByMonth, isLoading: isIncomeLoading } = useQuery({
    queryKey: ['incomeByMonth'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_income')
        .select('year, month, lucas_income, camila_income, other_income')
        .order('year, month');
      
      if (error) throw error;
      
      return data?.map(item => ({
        name: `${item.month}/${item.year}`,
        Lucas: Number(item.lucas_income || 0),
        Camila: Number(item.camila_income || 0),
        Other: Number(item.other_income || 0),
        Total: Number(item.lucas_income || 0) + Number(item.camila_income || 0) + Number(item.other_income || 0)
      })) || [];
    }
  });

  const { data: expensesByCategory, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['expensesByCategory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variable_expenses')
        .select(`
          amount,
          categories(name)
        `);
      
      if (error) throw error;
      
      // Group by category
      const categoryMap: Record<string, number> = {};
      data?.forEach(item => {
        const categoryName = item.categories?.name || 'Uncategorized';
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = 0;
        }
        categoryMap[categoryName] += Number(item.amount || 0);
      });
      
      return Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value
      }));
    }
  });

  const { data: savingsRate, isLoading: isSavingsLoading } = useQuery({
    queryKey: ['savingsRate'],
    queryFn: async () => {
      const { data: income, error: incomeError } = await supabase
        .from('monthly_income')
        .select('year, month, lucas_income, camila_income, other_income');
      
      if (incomeError) throw incomeError;
      
      const { data: expenses, error: expensesError } = await supabase
        .from('monthly_details')
        .select('year, month, total_expenses');
      
      if (expensesError) throw expensesError;
      
      // Match income and expenses by year/month
      const monthlyData = income?.map(incomeItem => {
        const matchingExpense = expenses?.find(exp => 
          exp.year === incomeItem.year && exp.month === incomeItem.month
        );
        
        const totalIncome = Number(incomeItem.lucas_income || 0) + 
                            Number(incomeItem.camila_income || 0) + 
                            Number(incomeItem.other_income || 0);
        
        const totalExpense = Number(matchingExpense?.total_expenses || 0);
        const savings = totalIncome - totalExpense;
        
        return {
          name: `${incomeItem.month}/${incomeItem.year}`,
          Income: totalIncome,
          Expenses: totalExpense,
          Savings: savings,
          SavingsRate: totalIncome > 0 ? (savings / totalIncome) * 100 : 0
        };
      }) || [];
      
      return monthlyData;
    }
  });

  const calculateAverageSavingsRate = () => {
    if (!savingsRate?.length) return 0;
    
    const totalRate = savingsRate.reduce((sum, item) => sum + item.SavingsRate, 0);
    return totalRate / savingsRate.length;
  };

  const getInsights = () => {
    if (!savingsRate?.length || !expensesByCategory?.length) return [];
    
    const insights = [];
    
    // Savings insight
    const avgSavingsRate = calculateAverageSavingsRate();
    if (avgSavingsRate > 20) {
      insights.push("Great job! Your average savings rate is above 20% of your income.");
    } else if (avgSavingsRate > 10) {
      insights.push("You're saving more than 10% of your income. Keep it up!");
    } else {
      insights.push("Consider increasing your savings rate by reducing expenses.");
    }
    
    // Top spending category
    if (expensesByCategory.length > 0) {
      const topCategory = [...expensesByCategory].sort((a, b) => b.value - a.value)[0];
      insights.push(`Your highest spending category is ${topCategory.name} at $${topCategory.value.toFixed(2)}.`);
    }
    
    // Income trend
    if (incomeByMonth && incomeByMonth.length >= 2) {
      const lastMonth = incomeByMonth[incomeByMonth.length - 1];
      const previousMonth = incomeByMonth[incomeByMonth.length - 2];
      
      if (lastMonth.Total > previousMonth.Total) {
        insights.push("Your income is trending upward compared to the previous month.");
      } else if (lastMonth.Total < previousMonth.Total) {
        insights.push("Your income has decreased compared to the previous month.");
      }
    }
    
    return insights;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Insights</CardTitle>
          <CardDescription>Key observations about your financial health</CardDescription>
        </CardHeader>
        <CardContent>
          {isSavingsLoading || isCategoryLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : (
            <ul className="space-y-2 list-disc pl-5">
              {getInsights().map((insight, index) => (
                <li key={index} className="text-sm">{insight}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="income">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="income">Income Trends</TabsTrigger>
          <TabsTrigger value="savings">Savings Rate</TabsTrigger>
          <TabsTrigger value="categories">Expense Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income Trends</CardTitle>
              <CardDescription>Monthly income breakdown by source</CardDescription>
            </CardHeader>
            <CardContent>
              {isIncomeLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={incomeByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} />
                      <Legend />
                      <Line type="monotone" dataKey="Lucas" stroke="#8884d8" />
                      <Line type="monotone" dataKey="Camila" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="Other" stroke="#ffc658" />
                      <Line type="monotone" dataKey="Total" stroke="#ff7300" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <CardTitle>Savings Rate</CardTitle>
              <CardDescription>Monthly savings as percentage of income</CardDescription>
            </CardHeader>
            <CardContent>
              {isSavingsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={savingsRate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === "SavingsRate" 
                          ? `${value.toLocaleString('de-DE', { maximumFractionDigits: 2 })}%` 
                          : value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
                        name
                      ]}/>
                      <Legend />
                      <Bar dataKey="Income" fill="#8884d8" />
                      <Bar dataKey="Expenses" fill="#82ca9d" />
                      <Bar dataKey="SavingsRate" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Breakdown of expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              {isCategoryLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
