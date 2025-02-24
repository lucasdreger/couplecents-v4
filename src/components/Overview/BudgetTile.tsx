import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const BudgetTile = () => {
  const { data: budgetData } = useQuery({
    queryKey: ['totalBudget'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_details')
        .select('total_income, total_expenses')
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Total Budget</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" color="primary">
          ${budgetData?.total_income ?? 0}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Expenses: ${budgetData?.total_expenses ?? 0}
        </Typography>
      </Box>
    </Paper>
  );
};
