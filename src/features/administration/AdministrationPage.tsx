import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const AdministrationPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Administration
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <Typography variant="body1">
              Manage users, permissions and roles
            </Typography>
          </StyledPaper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body1">
              Configure application settings and defaults
            </Typography>
          </StyledPaper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Typography variant="body1">
              Monitor system performance and status
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdministrationPage;
