
/**
 * Reserves Summary Tile Component
 * 
 * Displays current reserves including:
 * - Emergency fund
 * - Travel savings
 * - Other designated reserves
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const ReservesTile = () => {
  const { data: reserves } = useQuery({
    queryKey: ['reserves'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reserves')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserves</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reserves?.map((reserve) => (
            <div key={reserve.id} className="flex justify-between items-center">
              <span className="font-medium">{reserve.name}</span>
              <span className="text-primary">${reserve.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
