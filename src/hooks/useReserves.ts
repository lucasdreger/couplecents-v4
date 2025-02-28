
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Reserve {
  id: string;
  name: string;
  category: string;
  current_value: number;
  target_value: number | null;
  last_updated: string;
}

interface UpdateReserveParams {
  id: string;
  value: number;
  userId: string;
}

export function useReserves() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Query to fetch reserves
  const { data: reserves, isLoading, error } = useQuery({
    queryKey: ['reserves'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('reserves')
          .select('*')
          .order('name');
          
        if (error) throw error;
        return data as Reserve[];
      } catch (err) {
        console.error('Error fetching reserves:', err);
        throw err;
      }
    },
    enabled: !!user,
  });

  // Mutation to update reserve value
  const updateMutation = useMutation({
    mutationFn: async ({ id, value, userId }: UpdateReserveParams) => {
      setLoading(true);
      try {
        // Get previous value
        const { data: prevRecord } = await supabase
          .from('reserves')
          .select('current_value')
          .eq('id', id)
          .single();
          
        const previousValue = prevRecord?.current_value || 0;
        
        // Update reserve
        const { data, error } = await supabase
          .from('reserves')
          .update({ 
            current_value: value, 
            last_updated: new Date().toISOString() 
          })
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        
        // Log history
        await supabase
          .from('reserve_history')
          .insert({
            reserve_id: id,
            previous_value: previousValue,
            new_value: value,
            updated_by: userId
          });
          
        return data;
      } catch (err) {
        console.error('Error updating reserve:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reserves'] });
      toast.success('Reserve updated successfully');
    },
    onError: (error) => {
      console.error('Error in updateMutation:', error);
      toast.error('Failed to update reserve');
    }
  });

  const updateValue = (params: UpdateReserveParams) => {
    updateMutation.mutate(params);
  };

  return { 
    reserves, 
    loading: isLoading || loading, 
    error, 
    updateValue 
  };
}
