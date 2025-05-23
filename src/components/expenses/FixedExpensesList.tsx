import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import type { PostgrestError } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import { ArrowUp, ArrowDown, Edit, Trash, Calculator } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface Props {
  year: number;
  month: number;
  onEdit?: (expense: FixedExpense) => void;
  onDelete?: (expense: FixedExpense) => void;
}

interface FixedExpense {
  id: string;
  description: string;
  estimated_amount: number;
  due_date?: string;
  categories?: {
    name: string;
  };
  status?: {
    fixed_expense_id: string;
    year: number;
    month: number;
    completed: boolean;
  };
  status_required: boolean;
  owner: string;
}

type SortField = 'description' | 'owner' | 'category' | 'amount' | 'due_date';
type SortOrder = 'asc' | 'desc';

export const FixedExpensesList = ({
  year,
  month,
  onEdit,
  onDelete
}: Props) => {
  const queryClient = useQueryClient();
  const {
    toast
  } = useToast();
  const [sortBy, setSortBy] = useState<SortField>('description');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const {
    data: fixedExpenses,
    isLoading,
    isError
  } = useQuery<FixedExpense[], PostgrestError>({
    queryKey: ['fixed-expenses', year, month],
    queryFn: async () => {
      const {
        data: allFixedExpenses,
        error: expensesError
      } = await supabase.from('fixed_expenses').select('*, categories(name)').order('description');
      if (expensesError) throw expensesError;

      const {
        data: statusData,
        error: statusError
      } = await supabase.from('monthly_fixed_expense_status').select('*').eq('year', year).eq('month', month);
      if (statusError) throw statusError;

      return allFixedExpenses.map(expense => ({
        ...expense,
        status: statusData?.find(status => status.fixed_expense_id === expense.id)
      }));
    }
  });

  const handleStatusChange = async (expenseId: string, checked: boolean) => {
    try {
      const {
        error
      } = await supabase.from('monthly_fixed_expense_status').upsert({
        fixed_expense_id: expenseId,
        year,
        month,
        completed: checked
      }, {
        onConflict: 'fixed_expense_id,year,month'
      });
      if (error) throw error;
      queryClient.invalidateQueries({
        queryKey: ['fixed-expenses', year, month]
      });
      toast({
        description: `Task marked as ${checked ? 'completed' : 'pending'}`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        description: "Failed to update status"
      });
    }
  };

  const handleSortChange = (field: SortField) => {
    if (field === sortBy) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field === sortBy) {
      return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return null;
  };

  const sortExpenses = (expenses: FixedExpense[]) => {
    return [...expenses].sort((a, b) => {
      if (sortBy === 'description') {
        return sortOrder === 'asc' ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description);
      }
      if (sortBy === 'owner') {
        return sortOrder === 'asc' ? a.owner.localeCompare(b.owner) : b.owner.localeCompare(a.owner);
      }
      if (sortBy === 'category') {
        const catA = a.categories?.name || '';
        const catB = b.categories?.name || '';
        return sortOrder === 'asc' ? catA.localeCompare(catB) : catB.localeCompare(catA);
      }
      if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.estimated_amount - b.estimated_amount : b.estimated_amount - a.estimated_amount;
      }
      if (sortBy === 'due_date') {
        const dateA = a.due_date || '';
        const dateB = b.due_date || '';
        return sortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
      }
      return 0;
    });
  };

  const totalAmount = fixedExpenses?.reduce((sum, expense) => sum + expense.estimated_amount, 0) || 0;

  if (isLoading) {
    return <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>;
  }

  if (isError) {
    return <div className="text-red-500">Failed to load fixed expenses</div>;
  }

  if (!fixedExpenses?.length) {
    return <div className="py-4 text-center text-muted-foreground">No fixed expenses found for this month</div>;
  }

  return <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSortChange('description')} className="cursor-pointer">
            <div className="flex items-center">
              Description {getSortIcon('description')}
            </div>
          </TableHead>
          <TableHead onClick={() => handleSortChange('owner')} className="cursor-pointer">
            <div className="flex items-center">
              Owner {getSortIcon('owner')}
            </div>
          </TableHead>
          <TableHead onClick={() => handleSortChange('category')} className="cursor-pointer">
            <div className="flex items-center">
              Category {getSortIcon('category')}
            </div>
          </TableHead>
          <TableHead onClick={() => handleSortChange('amount')} className="cursor-pointer text-right">
            <div className="flex items-center justify-end">
              Amount {getSortIcon('amount')}
            </div>
          </TableHead>
          <TableHead onClick={() => handleSortChange('due_date')} className="cursor-pointer">
            <div className="flex items-center">
              Due Date {getSortIcon('due_date')}
            </div>
          </TableHead>
          <TableHead>Paid</TableHead>
          {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortExpenses(fixedExpenses).map(expense => <TableRow key={expense.id} className={`transition-colors duration-200 ${hoveredRow === expense.id ? 'bg-accent/10' : ''}`} onMouseEnter={() => setHoveredRow(expense.id)} onMouseLeave={() => setHoveredRow(null)}>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{expense.owner}</TableCell>
            <TableCell>{expense.categories?.name}</TableCell>
            <TableCell className="text-right">
              {expense.estimated_amount.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR'
          })}
            </TableCell>
            <TableCell>{expense.due_date}</TableCell>
            <TableCell>
              {expense.status_required ? <Checkbox checked={expense.status?.completed || false} onCheckedChange={checked => handleStatusChange(expense.id, checked === true)} /> : <span className="text-xs text-muted-foreground"></span>}
            </TableCell>
            {(onEdit || onDelete) && <TableCell>
                <div className="flex gap-1 justify-end">
                  {onEdit && <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} className={`transition-opacity duration-200 ${hoveredRow === expense.id ? 'opacity-100' : 'opacity-0'}`}>
                      <Edit className="h-4 w-4" />
                    </Button>}
                  {onDelete && <Button variant="ghost" size="icon" onClick={() => onDelete(expense)} className={`transition-opacity duration-200 ${hoveredRow === expense.id ? 'opacity-100' : 'opacity-0'}`}>
                      <Trash className="h-4 w-4" />
                    </Button>}
                </div>
              </TableCell>}
          </TableRow>)}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="font-medium">Total Fixed Expenses</TableCell>
          <TableCell className="text-right font-medium">
            <div className="flex items-center justify-end gap-2">
              <Calculator className="h-4 w-4" />
              {totalAmount.toLocaleString('de-DE', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
          </TableCell>
          <TableCell colSpan={onEdit || onDelete ? 3 : 2}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>;
};
