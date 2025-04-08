
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutoIncrementConfig {
  id: string;
  investment_id?: string;
  reserve_id?: string;
  fixed_expense_id: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
}

interface SaveAutoIncrementParams {
  type: 'investment' | 'reserve';
  item_id: string;
  fixed_expense_id: string | null;
  amount: number;
}

export function useAutoIncrements() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Query investment auto-increments
  const { data: investmentConfigs, isLoading: isLoadingInvestments } = useQuery({
    queryKey: ['investment-auto-increments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investment_auto_increment')
        .select('*, fixed_expenses(id, description, estimated_amount)');
      
      if (error) throw error;
      return data;
    }
  });

  // Query reserve auto-increments
  const { data: reserveConfigs, isLoading: isLoadingReserves } = useQuery({
    queryKey: ['reserve-auto-increments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reserve_auto_increment')
        .select('*, fixed_expenses(id, description, estimated_amount)');
      
      if (error) throw error;
      return data;
    }
  });

  // Get fixed expenses for dropdown
  const { data: fixedExpenses } = useQuery({
    queryKey: ['fixed-expenses-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('id, description, estimated_amount, owner')
        .order('description');
      
      if (error) throw error;
      return data;
    }
  });

  // Mutation to save auto-increment config
  const saveMutation = useMutation({
    mutationFn: async ({ type, item_id, fixed_expense_id, amount }: SaveAutoIncrementParams) => {
      setLoading(true);
      
      try {
        const table = type === 'investment' ? 'investment_auto_increment' : 'reserve_auto_increment';
        const idField = type === 'investment' ? 'investment_id' : 'reserve_id';
        
        // Check if configuration already exists
        const { data: existing } = await supabase
          .from(table)
          .select('id')
          .eq(idField, item_id)
          .single();
        
        if (existing) {
          // Update existing configuration
          const { error } = await supabase
            .from(table)
            .update({
              fixed_expense_id,
              amount,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
            
          if (error) throw error;
          return { id: existing.id, updated: true };
        } else {
          // Create new configuration
          const payload: any = {
            fixed_expense_id,
            amount,
          };
          
          payload[idField] = item_id;
          
          const { data, error } = await supabase
            .from(table)
            .insert(payload)
            .select()
            .single();
            
          if (error) throw error;
          return { id: data.id, updated: false };
        }
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      const key = variables.type === 'investment' 
        ? 'investment-auto-increments' 
        : 'reserve-auto-increments';
        
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(`Auto-increment configuration saved successfully`);
    },
    onError: (error) => {
      console.error('Error saving auto-increment config:', error);
      toast.error('Failed to save auto-increment configuration');
    }
  });

  // Mutation to delete auto-increment config
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: 'investment' | 'reserve', id: string }) => {
      setLoading(true);
      
      try {
        const table = type === 'investment' ? 'investment_auto_increment' : 'reserve_auto_increment';
        
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        return { success: true };
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      const key = variables.type === 'investment' 
        ? 'investment-auto-increments' 
        : 'reserve-auto-increments';
        
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(`Auto-increment configuration removed`);
    },
    onError: (error) => {
      console.error('Error deleting auto-increment config:', error);
      toast.error('Failed to remove auto-increment configuration');
    }
  });

  const getConfigForItem = (type: 'investment' | 'reserve', itemId: string) => {
    if (type === 'investment' && investmentConfigs) {
      return investmentConfigs.find(config => config.investment_id === itemId);
    } else if (type === 'reserve' && reserveConfigs) {
      return reserveConfigs.find(config => config.reserve_id === itemId);
    }
    return null;
  };

  const save = (params: SaveAutoIncrementParams) => {
    saveMutation.mutate(params);
  };

  const remove = (type: 'investment' | 'reserve', id: string) => {
    deleteMutation.mutate({ type, id });
  };

  return {
    investmentConfigs,
    reserveConfigs,
    fixedExpenses,
    loading: isLoadingInvestments || isLoadingReserves || loading,
    getConfigForItem,
    save,
    remove
  };
}
