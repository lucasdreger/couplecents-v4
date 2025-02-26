import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { useHousehold } from '@/hooks/useHousehold'

export const CategoriesManagement = () => {
  const [newCategory, setNewCategory] = useState('')
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { household, isLoading: isHouseholdLoading } = useHousehold()

  // Move useQuery to top level, before any conditional returns
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories', household?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('household_id', household?.id)
        .order('name')
      if (error) throw error
      return data
    },
    enabled: !!household // This will prevent the query from running if there's no household
  })

  const { mutate: addCategory } = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from('categories')
        .insert({ 
          name,
          household_id: household?.id
        })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setNewCategory('')
      toast({ description: "Category added successfully" })
    }
  })

  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({ description: "Category deleted successfully" })
    }
  })

  // Handle loading states
  if (isHouseholdLoading || isCategoriesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle no household case
  if (!household) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <p className="text-muted-foreground">Please create or join a household first.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button 
            onClick={() => addCategory(newCategory)}
            disabled={!newCategory.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {categories?.map((category) => (
            <div key={category.id} className="flex justify-between items-center p-2 rounded border">
              <span>{category.name}</span>
              <div className="space-x-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => deleteCategory(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
