import React from 'react';
import { Card } from "@/components/ui/card";
import { CategoriesManagement } from "@/components/administration/CategoriesManagement";
import { DefaultIncomeManagement } from "@/components/administration/DefaultIncomeManagement";
import { FixedExpensesManagement } from "@/components/administration/FixedExpensesManagement";
import { HouseholdManagement } from "@/components/administration/HouseholdManagement";
import { HouseholdInfo } from '@/components/HouseholdInfo';
import { useHousehold } from '@/hooks/useHousehold';

export const Administration: React.FC = () => {
  const { isLoadingHousehold } = useHousehold();

  if (isLoadingHousehold) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">Loading administration panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Administration</h1>
      
      <div className="grid gap-6">
        <HouseholdManagement />
        <CategoriesManagement />
        <DefaultIncomeManagement />
        <FixedExpensesManagement />
      </div>
      <div className="mt-6">
        <HouseholdInfo />
      </div>
    </div>
  );
};
