
/**
 * Investments Summary Tile Component
 * 
 * Displays current investment status including:
 * - Investment categories
 * - Current values
 * - Last update timestamps
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const InvestmentsTile = () => {
  const { data: investments } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investments?.map((investment) => (
            <div key={investment.id} className="flex justify-between items-center">
              <span className="font-medium">{investment.name}</span>
              <span className="text-primary">${investment.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
