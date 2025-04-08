
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriesManagement } from "@/components/administration/CategoriesManagement";
import { FixedExpensesManagement } from "@/components/administration/FixedExpensesManagement";
import { DefaultIncomeManagement } from "@/components/administration/DefaultIncomeManagement";
import { AutoIncrementManagement } from "@/components/management/AutoIncrementManagement";
import { Sparkles } from "@/components/ui/sparkles";
import { CreditCard, ChevronRight, Wallet, Layers, CalendarClock } from "lucide-react";

export const Administration = () => {
  const [activeTab, setActiveTab] = useState("categories");
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
      
      <div className="relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="fixed-expenses">Fixed Expenses</TabsTrigger>
            <TabsTrigger value="default-income">Default Income</TabsTrigger>
            <TabsTrigger value="auto-increments">Auto Increments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-6">
            <CategoriesManagement />
          </TabsContent>
          
          <TabsContent value="fixed-expenses" className="space-y-6">
            <FixedExpensesManagement />
          </TabsContent>
          
          <TabsContent value="default-income" className="space-y-6">
            <DefaultIncomeManagement />
          </TabsContent>
          
          <TabsContent value="auto-increments" className="space-y-6">
            <AutoIncrementManagement />
          </TabsContent>
        </Tabs>
        
        <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
          <Sparkles 
            className="h-full w-full" 
            color="#8350e8" 
            size={1.5}
            density={40}
            speed={0.3}
            opacity={0.05}
          />
        </div>
      </div>
    </div>
  );
};

export default Administration;
