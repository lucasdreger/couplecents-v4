import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { BudgetTile } from './BudgetTile';
import { InvestmentsTile } from './InvestmentsTile';
import { ReservesTile } from './ReservesTile';
import { MonthlyChart } from './MonthlyChart';
import { CategoryBreakdown } from './CategoryBreakdown';

export const OverviewPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BudgetTile />
        </Grid>
        <Grid item xs={12} md={4}>
          <InvestmentsTile />
        </Grid>
        <Grid item xs={12} md={4}>
          <ReservesTile />
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Budget vs Actual
            </Typography>
            <MonthlyChart />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Breakdown
            </Typography>
            <CategoryBreakdown />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
