/**
 * Investments Summary Tile Component
 * 
 * Displays current investment status including:
 * - Investment categories
 * - Current values with edit capability
 * - Distribution chart
 * - Last update timestamps
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvestments } from "@/hooks/useInvestments";
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

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

interface Investment {
  id: string;
  name: string;
  current_value: number;
  last_updated: string;
  change_percentage?: number;
}

export const InvestmentsTile = () => {
  const { user } = useAuth();
  const { investments, isLoading, updateValue } = useInvestments();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [currentInvestment, setCurrentInvestment] = useState<Investment | null>(null);
  
  const totalInvestments = investments?.reduce((sum: number, inv: Investment) => sum + inv.current_value, 0) || 0;
  
  const pieData = investments?.map(inv => ({
    name: inv.name,
    value: inv.current_value
  }));

  const handleEdit = (investment: Investment) => {
    setEditingId(investment.id);
    setCurrentInvestment(investment);
    setEditValue(investment.current_value.toString());
  };

  const handleSave = (id: string) => {
    const value = parseFloat(editValue);
    if (!isNaN(value) && user?.id && currentInvestment) {
      const oldValue = currentInvestment.current_value;
      
      // Pass both the new value and old value to the mutation function
      updateValue({ 
        id, 
        value, 
        oldValue  // This was missing before
      });
      
      toast.success('Investment updated successfully');
      setEditingId(null);
      setCurrentInvestment(null);
    } else if (isNaN(value)) {
      toast.error('Please enter a valid number');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setCurrentInvestment(null);
  };
  
  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Uses DD/MM/YYYY format
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Investment Cards */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Investments</span>
              <span className="text-lg font-medium">
                {totalInvestments.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : !investments || investments.length === 0 ? (
              <div className="text-center py-3 text-muted-foreground">No investments found</div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {investments.map((investment: Investment) => (
                  <Card key={investment.id} className="border bg-card/50 hover:bg-accent/5 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{investment.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last updated: {formatDate(investment.last_updated)}
                          </p>
                        </div>
                        
                        {editingId === investment.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-24 text-right"
                              placeholder="0,00"
                            />
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleSave(investment.id)}
                              className="h-8 w-8"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={handleCancel}
                              className="h-8 w-8"
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <p className="font-bold">
                                {investment.current_value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                              </p>
                              {investment.change_percentage !== undefined && (
                                <div className={`flex items-center text-xs ${investment.change_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {investment.change_percentage >= 0 ? (
                                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                                  )}
                                  {Math.abs(investment.change_percentage).toFixed(2)}%
                                </div>
                              )}
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleEdit(investment)}
                              className="h-8 w-8"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Distribution Pie Chart */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            ) : !investments || investments.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data to display
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={renderCustomizedLabel}
                  >
                    {pieData?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [
                      value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
                      'Value'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
