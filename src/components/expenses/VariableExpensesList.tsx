import { Edit, Trash } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { VariableExpense } from '@/types/database.types'

interface Props {
  expenses?: VariableExpense[]
  onEdit?: (expense: VariableExpense) => void
  onDelete?: (expense: VariableExpense) => void
}

export const VariableExpensesList = ({ expenses, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses?.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{expense.category?.name}</TableCell>
            <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit?.(expense)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete?.(expense)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
