import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
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
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Investments</Typography>
      <List dense>
        {investments?.map((investment) => (
          <ListItem key={investment.id}>
            <ListItemText
              primary={investment.name}
              secondary={`$${investment.amount}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
