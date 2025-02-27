import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesManagement } from "@/components/administration/CategoriesManagement";
import { DefaultIncomeManagement } from "@/components/administration/DefaultIncomeManagement";
import { FixedExpensesManagement } from "@/components/administration/FixedExpensesManagement";

export const Administration: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Administration</h1>
      
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="fixed-expenses">Fixed Expenses</TabsTrigger>
          <TabsTrigger value="default-income">Default Income</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <CategoriesManagement />
        </TabsContent>
        
        <TabsContent value="fixed-expenses">
          <FixedExpensesManagement />
        </TabsContent>
        
        <TabsContent value="default-income">
          <DefaultIncomeManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
