/**
 * Investments Summary Tile Component
 * 
 * Displays current investment status including:
 * - Investment categories
 * - Current values with edit capability
 * - Last update timestamps
 */
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvestments } from "@/hooks/useInvestments";
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

const COLORS = {
  stocks: '#10b981',
  bonds: '#3b82f6',
  crypto: '#8b5cf6',
  real_estate: '#ef4444',
  other: '#6b7280'
};

type InvestmentData = {
  name: string;
  value: number;
  color: string;
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
  const { investments, isLoading, updateValue, getTotalInvestments, getInvestmentsByCategory } = useInvestments();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [currentInvestment, setCurrentInvestment] = useState<Investment | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chartData = React.useMemo((): InvestmentData[] => {
    if (!investments?.length) return [];

    const categoryTotals = getInvestmentsByCategory();
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
      value: amount,
      color: COLORS[category as keyof typeof COLORS]
    }));
  }, [investments, getInvestmentsByCategory]);

  const handleEdit = (investment: Investment) => {
    setEditingId(investment.id);
    setCurrentInvestment(investment);
    
    // Format the value as currency but without the € symbol
    setEditValue(investment.current_value.toFixed(2).replace('.', ','));
  };
  
  // Select all text in input when it appears
  useEffect(() => {
    if (editingId && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 10);
    }
  }, [editingId]);
  
  const handleSave = (id: string) => {
    // Convert comma to dot for parsing
    const cleanValue = editValue.replace(/[€\s]/g, '').replace(',', '.');
    const value = parseFloat(cleanValue);
    
    if (!isNaN(value) && user?.id && currentInvestment) {
      const oldValue = currentInvestment.current_value;
      
      // Pass both the new value and old value to the mutation function
      updateValue({ 
        id, 
        value, 
        oldValue
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investments</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalInvestments = getTotalInvestments();
  
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 rounded-xl">
        <GlowingEffect 
          spread={40}
          glow={true}
          disabled={false}
          proximity={100}
          inactiveZone={0.5}
          borderWidth={1}
        />
      </div>
      <CardHeader>
        <CardTitle>Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">
          {totalInvestments.toLocaleString('de-DE', { 
            style: 'currency', 
            currency: 'EUR' 
          })}
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className={cn(
                      "stroke-background dark:stroke-background",
                      "transition-colors duration-200"
                    )}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  value.toLocaleString('de-DE', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }),
                  'Amount'
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

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
              <Card 
                key={investment.id} 
                className={`border relative overflow-hidden transition-all duration-300 group 
                  ${hoveredId === investment.id 
                    ? 'bg-accent/20 shadow-md scale-[1.02] border-primary/20 transform glow-border' 
                    : 'bg-card/50 hover:bg-accent/5'}`}
                onMouseEnter={() => setHoveredId(investment.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
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
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                          <Input
                            ref={inputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-32 text-right pl-7"
                            placeholder="0,00"
                            autoFocus
                          />
                        </div>
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
                          className="h-8 w-8 opacity-80 dark:opacity-100 group-hover:opacity-100 transition-opacity duration-200 bg-muted/30 hover:bg-muted/50"
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
  );
};
