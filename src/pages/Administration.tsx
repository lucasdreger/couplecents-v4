
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesManagement } from "@/components/administration/CategoriesManagement";
import { DefaultIncomeManagement } from "@/components/administration/DefaultIncomeManagement";
import { FixedExpensesManagement } from "@/components/administration/FixedExpensesManagement";

export default function Administration() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <p className="text-sm text-muted-foreground">Manage your financial settings</p>
      </div>
      
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="fixed-expenses">Fixed Expenses</TabsTrigger>
          <TabsTrigger value="default-income">Default Income</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <CategoriesManagement />
        </TabsContent>
        
        <TabsContent value="fixed-expenses" className="space-y-4">
          <FixedExpensesManagement />
        </TabsContent>
        
        <TabsContent value="default-income" className="space-y-4">
          <DefaultIncomeManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
