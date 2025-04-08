
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutoIncrements } from '@/hooks/useAutoIncrements';
import { TrashIcon, BanknoteIcon, CalendarIcon } from 'lucide-react';

interface AutoIncrementConfigProps {
  type: 'investment' | 'reserve';
  itemId: string;
  itemName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AutoIncrementConfig({ 
  type, 
  itemId, 
  itemName, 
  open, 
  onOpenChange 
}: AutoIncrementConfigProps) {
  const { 
    fixedExpenses, 
    getConfigForItem, 
    save, 
    remove, 
    loading 
  } = useAutoIncrements();
  
  const [fixedExpenseId, setFixedExpenseId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('0');
  const [existingConfigId, setExistingConfigId] = useState<string | null>(null);

  // Load existing configuration when dialog opens
  useEffect(() => {
    if (open && itemId) {
      const config = getConfigForItem(type, itemId);
      if (config) {
        setFixedExpenseId(config.fixed_expense_id);
        setAmount(config.amount.toString());
        setExistingConfigId(config.id);
      } else {
        // Reset form for new configuration
        setFixedExpenseId(null);
        setAmount('0');
        setExistingConfigId(null);
      }
    }
  }, [open, itemId, type, getConfigForItem]);

  const handleSave = () => {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(numericAmount)) {
      return;
    }
    
    save({
      type,
      item_id: itemId,
      fixed_expense_id: fixedExpenseId,
      amount: numericAmount
    });
    
    onOpenChange(false);
  };

  const handleRemove = () => {
    if (existingConfigId) {
      remove(type, existingConfigId);
      onOpenChange(false);
    }
  };
  
  const typeName = type === 'investment' ? 'Investment' : 'Reserve';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Auto-Increment Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-1.5">
            <Label className="text-muted-foreground">
              {typeName}
            </Label>
            <div className="font-medium">{itemName}</div>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="fixed-expense">Link to Fixed Expense</Label>
            <Select
              value={fixedExpenseId || ''}
              onValueChange={setFixedExpenseId}
              disabled={loading}
            >
              <SelectTrigger id="fixed-expense">
                <SelectValue placeholder="Select a fixed expense" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {fixedExpenses?.map(expense => (
                  <SelectItem key={expense.id} value={expense.id}>
                    {expense.description} ({expense.estimated_amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="amount">Monthly Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                id="amount"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CalendarIcon className="h-3 w-3" />
              This amount will be added to the {type} automatically each month
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {existingConfigId && (
            <Button 
              variant="destructive" 
              onClick={handleRemove}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <TrashIcon className="h-4 w-4" />
              Remove
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <BanknoteIcon className="h-4 w-4" />
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
