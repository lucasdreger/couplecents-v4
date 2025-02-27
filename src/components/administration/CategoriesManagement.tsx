import { useState } from 'react'
import React from 'react'  // Import React to access Suspense
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { queryKeys } from '@/lib/queries'

interface Category {
  id: string
  name: string
}

// Separate the categories list into its own component for suspense
function CategoriesList({ onDelete }: { 
  onDelete: (id: string) => void 
}) {
  const { data: categories } = useQuery<Category[]>({
    queryKey: queryKeys.categories(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (error) throw error
      return data
    }
  })

  if (!categories?.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No categories found
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category: Category) => (
        <div key={category.id} className="flex justify-between items-center p-2 rounded border">
          <span>{category.name}</span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export const CategoriesManagement = () => {
  const [newCategory, setNewCategory] = useState('')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate: addCategory } = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from('categories')
        .insert({ 
          name
        })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
      setNewCategory('')
      toast({ description: "Category added successfully" })
    },
    onError: (error: Error) => {
      toast({ 
        description: "Failed to add category: " + error.message,
        variant: "destructive"
      })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
      toast({ description: "Category deleted successfully" })
    },
    onError: (error: Error) => {
      toast({ 
        description: "Failed to delete category: " + error.message,
        variant: "destructive"
      })
    }
  })

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
          />
          <Button 
            onClick={() => addCategory(newCategory)}
            disabled={!newCategory.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        
        <React.Suspense fallback={
          <div className="flex items-center justify-center py-4">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        }>
          <CategoriesList 
            onDelete={deleteCategory}
          />
        </React.Suspense>
      </CardContent>
    </Card>
  )
}
