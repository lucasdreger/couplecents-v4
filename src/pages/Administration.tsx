import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoriesManagement } from "@/components/administration/CategoriesManagement"
import { FixedExpensesManagement } from "@/components/administration/FixedExpensesManagement"
import { DefaultIncomeManagement } from "@/components/administration/DefaultIncomeManagement"

export const Administration = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
      
      <Tabs defaultValue="categories">
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
  )
}
