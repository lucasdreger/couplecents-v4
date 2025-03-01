import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const FinancialAnalytics = () => {
  // Monthly Trends Data
  const { data: monthlyTrends, isLoading: trendLoading } = useQuery({
    queryKey: ['monthlyTrends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('*')
        .order('year, month');
      
      if (error) throw error;
      return data?.map(item => ({
        month: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' }),
        expenses: item.actual_amount,
        income: item.total_income,
        savings: item.total_income - item.actual_amount
      }));
    }
  });

  // Category Distribution
  const { data: categoryStats, isLoading: categoryLoading } = useQuery({
    queryKey: ['categoryStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variable_expenses')
        .select(`
          amount,
          category:categories (name)
        `);
      
      if (error) throw error;
      
      const categoryTotals = data?.reduce((acc, curr) => {
        const category = curr.category?.name || 'Uncategorized';
        acc[category] = (acc[category] || 0) + curr.amount;
        return acc;
      }, {});

      return Object.entries(categoryTotals || {}).map(([name, value]) => ({
        name,
        value
      }));
    }
  });

  // Savings Rate Trend
  const { data: savingsRate, isLoading: savingsLoading } = useQuery({
    queryKey: ['savingsRate'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('*')
        .order('year, month');
      
      if (error) throw error;
      
      return data?.map(item => ({
        month: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' }),
        rate: ((item.total_income - item.actual_amount) / item.total_income * 100).toFixed(1)
      }));
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your financial data
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses Analysis</TabsTrigger>
          <TabsTrigger value="savings">Savings Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Income vs Expenses</CardTitle>
                <CardDescription>Compare income and expenses over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {trendLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `€${value}`} />
                      <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#8884d8" />
                      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Distribution of expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {categoryLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryStats?.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings Rate</CardTitle>
                <CardDescription>Monthly savings as percentage of income</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {savingsLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={savingsRate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="rate" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trends</CardTitle>
              <CardDescription>Detailed expense analysis over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {trendLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `€${value}`} />
                    <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Analysis</CardTitle>
              <CardDescription>Track your savings progress</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {trendLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `€${value}`} />
                    <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="savings" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};