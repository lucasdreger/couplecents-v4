
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesManagement } from "@/components/administration/CategoriesManagement";
import { DefaultIncomeManagement } from "@/components/administration/DefaultIncomeManagement";
import { FixedExpensesManagement } from "@/components/administration/FixedExpensesManagement";
import { Sparkles } from "@/components/ui/sparkles";
import { useTheme } from "@/context/ThemeContext";
import { Settings } from "lucide-react";

export default function Administration() {
  const { theme } = useTheme();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <div className="z-10 relative">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-7 w-7 text-primary" />
            <span>Administration</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your financial categories, income and fixed expenses
          </p>
        </div>
        
        <div className="absolute inset-0 z-0">
          <Sparkles
            color={theme === "dark" ? "var(--sparkles-color)" : "#8350e8"}
            size={1.5}
            density={40}
            speed={0.3}
            opacity={0.15}
          />
        </div>
      </div>
      
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-lg p-1 bg-secondary/70 backdrop-blur-sm">
          <TabsTrigger value="categories" className="transition-all hover:text-purple-500">Categories</TabsTrigger>
          <TabsTrigger value="fixed-expenses" className="transition-all hover:text-purple-500">Fixed Expenses</TabsTrigger>
          <TabsTrigger value="default-income" className="transition-all hover:text-purple-500">Default Income</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4 card-glass p-6 rounded-lg">
          <CategoriesManagement />
        </TabsContent>
        
        <TabsContent value="fixed-expenses" className="space-y-4 card-glass p-6 rounded-lg">
          <FixedExpensesManagement />
        </TabsContent>
        
        <TabsContent value="default-income" className="space-y-4 card-glass p-6 rounded-lg">
          <DefaultIncomeManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
