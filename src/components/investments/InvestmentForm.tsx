import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function InvestmentForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      category: '',
      current_value: 0
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-4 flex items-center justify-center cursor-pointer hover:bg-muted">
          <Button variant="ghost">+ Add Investment</Button>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <Input {...form.register('name')} placeholder="Investment Name" />
          <Input {...form.register('category')} placeholder="Category" />
          <Input {...form.register('current_value')} type="number" placeholder="Current Value" />
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
