import * as React from 'react';
import { ArrowDownRight, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Accordion, AccordionItem } from './accordion';

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  category: string;
  lastProcessed?: Date;
  nextDue?: Date;
  description?: string;
  enabled: boolean;
}

interface RecurringTransactionsProps {
  transactions: RecurringTransaction[];
  onEdit?: (transaction: RecurringTransaction) => void;
  onToggle?: (id: string, enabled: boolean) => void;
  onDelete?: (id: string) => void;
  className?: string;
  currency?: string;
  showUpcoming?: boolean;
}

export function RecurringTransactions({
  transactions,
  onEdit,
  onToggle,
  onDelete,
  className,
  currency = 'USD',
  showUpcoming = true,
}: RecurringTransactionsProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  const sortedTransactions = React.useMemo(
    () =>
      [...transactions].sort((a, b) => {
        if (!a.nextDue || !b.nextDue) return 0;
        return a.nextDue.getTime() - b.nextDue.getTime();
      }),
    [transactions]
  );

  const accordionItems: AccordionItem[] = sortedTransactions.map((transaction) => ({
    id: transaction.id,
    title: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Badge
            variant={transaction.type === 'income' ? 'success' : 'destructive'}
            className="h-6"
          >
            {transaction.type === 'income' ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {transaction.type}
          </Badge>
          <span>{transaction.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="h-6">
            {transaction.frequency}
          </Badge>
          <span className={cn(
            'font-medium',
            transaction.type === 'income' ? 'text-success' : 'text-destructive'
          )}>
            {formatter.format(transaction.amount)}
          </span>
        </div>
      </div>
    ),
    content: (
      <div className="space-y-4">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span>{transaction.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Start Date:</span>
            <span>{transaction.startDate.toLocaleDateString()}</span>
          </div>
          {transaction.endDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">End Date:</span>
              <span>{transaction.endDate.toLocaleDateString()}</span>
            </div>
          )}
          {transaction.nextDue && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Next Due:</span>
              <span>{transaction.nextDue.toLocaleDateString()}</span>
            </div>
          )}
          {transaction.description && (
            <p className="text-muted-foreground mt-2">
              {transaction.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          {onToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggle(transaction.id, !transaction.enabled)}
            >
              {transaction.enabled ? 'Disable' : 'Enable'}
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(transaction)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(transaction.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    ),
    icon: transaction.type === 'income' ? ArrowUpRight : ArrowDownRight,
  }));

  const upcomingTransactions = React.useMemo(() => {
    const now = new Date();
    return sortedTransactions
      .filter((t) => t.enabled && t.nextDue && t.nextDue > now)
      .slice(0, 5);
  }, [sortedTransactions]);

  const totals = React.useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (!transaction.enabled) return acc;
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );
  }, [transactions]);

  return (
    <div className={className}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-success" />
            <h4 className="font-medium">Monthly Income</h4>
          </div>
          <p className="mt-2 text-2xl font-bold text-success">
            {formatter.format(totals.income)}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-destructive" />
            <h4 className="font-medium">Monthly Expenses</h4>
          </div>
          <p className="mt-2 text-2xl font-bold text-destructive">
            {formatter.format(totals.expenses)}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Net Monthly</h4>
          </div>
          <p className={cn(
            'mt-2 text-2xl font-bold',
            totals.income - totals.expenses >= 0 ? 'text-success' : 'text-destructive'
          )}>
            {formatter.format(totals.income - totals.expenses)}
          </p>
        </Card>
      </div>

      {showUpcoming && upcomingTransactions.length > 0 && (
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Upcoming Transactions</h4>
          </div>
          <div className="space-y-2">
            {upcomingTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={transaction.type === 'income' ? 'success' : 'destructive'}
                    className="h-6"
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {transaction.type}
                  </Badge>
                  <span>{transaction.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {transaction.nextDue?.toLocaleDateString()}
                  </span>
                  <span className={cn(
                    'font-medium',
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
                  )}>
                    {formatter.format(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Accordion
        type="multiple"
        items={accordionItems}
        className="space-y-2"
      />
    </div>
  );
}

// Type-safe recurring transaction calculation helpers
export function calculateNextOccurrence(
  transaction: RecurringTransaction,
  from: Date = new Date()
): Date {
  const base = transaction.lastProcessed || transaction.startDate;
  const next = new Date(base);

  switch (transaction.frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  // If next occurrence is before 'from', keep calculating until we find the next future occurrence
  while (next < from) {
    switch (transaction.frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
  }

  return next;
}

export function calculateRecurringTotal(
  transactions: RecurringTransaction[],
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
): {
  income: number;
  expenses: number;
  net: number;
} {
  const periodMultipliers = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    yearly: 365,
  };

  const result = transactions.reduce(
    (acc, transaction) => {
      if (!transaction.enabled) return acc;

      let multiplier = 1;
      switch (transaction.frequency) {
        case 'daily':
          multiplier = periodMultipliers[period] / 1;
          break;
        case 'weekly':
          multiplier = periodMultipliers[period] / 7;
          break;
        case 'monthly':
          multiplier = periodMultipliers[period] / 30;
          break;
        case 'yearly':
          multiplier = periodMultipliers[period] / 365;
          break;
      }

      const amount = transaction.amount * multiplier;
      if (transaction.type === 'income') {
        acc.income += amount;
      } else {
        acc.expenses += amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  return {
    ...result,
    net: result.income - result.expenses,
  };
}