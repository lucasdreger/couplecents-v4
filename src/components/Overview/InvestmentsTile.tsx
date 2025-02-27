/**
 * Investments Summary Tile Component
 * 
 * Displays current investment status including:
 * - Investment categories
 * - Current values with edit capability
 * - Distribution chart
 * - Last update timestamps
 */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
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

interface Investment {
  id: string;
  name: string;
  current_value: number;
  last_updated: string;
}

interface InvestmentChartData {
  name: string;
  value: number;
}

export const InvestmentsTile = () => {
  const { user } = useAuth();
  const { investments, isLoading, updateValue } = useInvestments();
  console.log('Investments data:', { investments, isLoading }); // Debug log

  const totalInvestments = investments?.reduce((sum: number, inv: Investment) => sum + inv.current_value, 0) || 0;
  const pieData: InvestmentChartData[] | undefined = investments?.map((inv: Investment) => ({
    name: inv.name,
    value: inv.current_value
  }));

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Investments</CardTitle>
          <CardDescription>Loading investment data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!investments?.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Investments</CardTitle>
          <CardDescription>No investments found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
                  {pieData?.map((_: InvestmentChartData, index: number) => (
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
              {investments?.map((investment: Investment) => (
                <div key={investment.id} className="flex items-center gap-4">
                  <span className="min-w-[120px] font-medium">{investment.name}</span>
                  <Input
                    type="number"
                    className="w-32"
                    defaultValue={investment.current_value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
