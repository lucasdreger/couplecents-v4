
import React from 'react';
import { CategoriesManagement } from "@/components/administration/CategoriesManagement";
import { DefaultIncomeManagement } from "@/components/administration/DefaultIncomeManagement";
import { FixedExpensesManagement } from "@/components/administration/FixedExpensesManagement";

export const Administration: React.FC = () => {
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
