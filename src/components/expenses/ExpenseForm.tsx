import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ExpenseForm() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const form = useForm({
    defaultValues: {
      description: '',
      amount: 0,
      category_id: '',
      date: new Date().toISOString().split('T')[0]
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <Input {...form.register('description')} placeholder="Description" />
          <Input {...form.register('amount')} type="number" placeholder="Amount" />
          <Select onValueChange={(value) => form.setValue('category_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.data?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input {...form.register('date')} type="date" />
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
