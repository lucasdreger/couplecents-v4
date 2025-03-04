import { useInvestments } from "@/hooks/useInvestments";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4B0082', '#FF1493', '#008B8B', '#8B4513', '#808000'];

// Custom label that only shows percentage inside the pie slice
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

export const InvestmentDistribution = () => {
  const { investments, isLoading } = useInvestments();
  
  const pieData = investments?.map(inv => ({
    name: inv.name,
    value: inv.current_value
  }))
  .sort((a, b) => b.value - a.value); // Sort by value descending

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Skeleton className="h-[250px] w-[250px] rounded-full" />
      </div>
    );
  }

  if (!investments?.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No investment data available. Add some investments to see your portfolio distribution.
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {pieData?.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => value.toLocaleString('de-DE', { 
              style: 'currency', 
              currency: 'EUR',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};