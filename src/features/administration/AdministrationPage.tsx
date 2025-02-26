
import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriesManagement } from "@/components/administration/CategoriesManagement";
import { DefaultIncomeManagement } from "@/components/administration/DefaultIncomeManagement";
import { FixedExpensesManagement } from "@/components/administration/FixedExpensesManagement";

const AdministrationPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Administration</h1>
      
      <div className="grid gap-6">
        <CategoriesManagement />
        <DefaultIncomeManagement />
        <FixedExpensesManagement />
      </div>
    </div>
  );
};

export default AdministrationPage;
