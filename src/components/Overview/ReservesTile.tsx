import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
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
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Reserves</Typography>
      <List dense>
        {reserves?.map((reserve) => (
          <ListItem key={reserve.id}>
            <ListItemText
              primary={reserve.name}
              secondary={`$${reserve.amount}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
