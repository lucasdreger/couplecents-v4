import { useState } from 'react'
import React from 'react'  // Import React to access Suspense
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit, Check, X, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { queryKeys } from '@/lib/queries'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Category {
  id: string
  name: string
}

// Separate the categories list into its own component for suspense
function CategoriesList({ onDelete }: { 
  onDelete: (id: string) => void 
}) {
  const { data: categories } = useQuery({
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
  
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  
  const { mutate: updateCategory } = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
      setEditingId(null)
      toast({ description: "Category updated successfully" })
    },
    onError: (error: Error) => {
      toast({ 
        description: "Failed to update category: " + error.message,
        variant: "destructive"
      })
    }
  })
  
  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditValue(category.name)
  }
  
  const handleSave = (id: string) => {
    if (!editValue.trim()) return
    updateCategory({ id, name: editValue })
  }
  
  const handleDeleteClick = (id: string) => {
    setConfirmingDeleteId(id)
  }
  
  const handleConfirmDelete = () => {
    if (confirmingDeleteId) {
      onDelete(confirmingDeleteId)
      setConfirmingDeleteId(null)
    }
  }
  
  return (
    <>
      <div className="grid gap-2">
        {categories?.map((category) => (
          <div 
            key={category.id} 
            className={`flex justify-between items-center p-3 rounded border transition-all duration-300 
              ${hoveredId === category.id 
                ? 'bg-accent/20 shadow-md scale-[1.01] border-primary/20 transform' 
                : 'bg-card/50 hover:bg-accent/5'}`}
            onMouseEnter={() => setHoveredId(category.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {editingId === category.id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8"
                  autoFocus
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleSave(category.id)}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setEditingId(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <span>{category.name}</span>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(category)}
                    className={`transition-opacity duration-200 ${hoveredId === category.id ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteClick(category.id)}
                    className={`transition-opacity duration-200 ${hoveredId === category.id ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <AlertDialog open={!!confirmingDeleteId} onOpenChange={(open) => !open && setConfirmingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
              Any expenses associated with this category will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
        .insert({ name })
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
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        return { success: true }
      } catch (error: any) {
        console.error('Error deleting category:', error)
        throw new Error(error.message || 'Failed to delete category')
      }
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    addCategory(newCategory)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button type="submit" disabled={!newCategory.trim()}>Add</Button>
        </form>
        <React.Suspense fallback={
          <div className="flex items-center justify-center py-4">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        }>
          <CategoriesList onDelete={deleteCategory} />
        </React.Suspense>
      </CardContent>
    </Card>
  )
}
