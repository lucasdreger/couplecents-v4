import * as React from 'react';
import { Check, Tags, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { DataTable } from './data-table';
import type { ColumnDef } from '@tanstack/react-table';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category?: string;
  confidence?: number;
  suggestedCategory?: string;
  merchant?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  rules?: {
    keywords?: string[];
    merchants?: string[];
    amountRange?: { min?: number; max?: number };
  };
  color?: string;
  parent?: string;
}

interface TransactionCategorizerProps {
  transactions: Transaction[];
  categories: Category[];
  onCategorize: (transactionId: string, categoryId: string) => void;
  onBulkCategorize?: (updates: { transactionId: string; categoryId: string }[]) => void;
  className?: string;
  currency?: string;
}

export function TransactionCategorizer({
  transactions,
  categories,
  onCategorize,
  onBulkCategorize,
  className,
  currency = 'USD',
}: TransactionCategorizerProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  const [selectedTransactions, setSelectedTransactions] = React.useState<string[]>([]);

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
            aria-label="Select all"
            className="h-4 w-4 rounded border-gray-300"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(!!e.target.checked)}
            aria-label="Select row"
            className="h-4 w-4 rounded border-gray-300"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.date.toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.description}</div>
            {row.original.merchant && (
              <div className="text-sm text-muted-foreground">
                {row.original.merchant}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {formatter.format(row.original.amount)}
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          const transaction = row.original;
          const category = categories.find(
            (c) => c.id === transaction.category
          );
          const suggested = categories.find(
            (c) => c.id === transaction.suggestedCategory
          );

          return (
            <div className="flex items-center gap-2">
              {category ? (
                <Badge
                  style={{
                    backgroundColor: category.color,
                  }}
                >
                  {category.name}
                </Badge>
              ) : suggested ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {suggested.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {transaction.confidence}% match
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onCategorize(transaction.id, suggested.id)
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Badge variant="outline">Uncategorized</Badge>
              )}
            </div>
          );
        },
      },
    ],
    [categories, formatter, onCategorize]
  );

  const uncategorizedCount = transactions.filter(
    (t) => !t.category
  ).length;

  const handleBulkCategorize = (categoryId: string) => {
    if (!onBulkCategorize || selectedTransactions.length === 0) return;

    const updates = selectedTransactions.map((transactionId) => ({
      transactionId,
      categoryId,
    }));

    onBulkCategorize(updates);
    setSelectedTransactions([]);
  };

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">
              Transaction Categorization
            </h3>
            {uncategorizedCount > 0 && (
              <Badge variant="secondary">
                {uncategorizedCount} uncategorized
              </Badge>
            )}
          </div>
          {selectedTransactions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedTransactions.length} selected
              </span>
              <div className="flex items-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkCategorize(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DataTable
          columns={columns}
          data={transactions}
          onRowSelectionChange={(selection) =>
            setSelectedTransactions(
              Object.keys(selection).filter((key) => selection[key])
            )
          }
        />
      </Card>
    </div>
  );
}

// Type-safe categorization helpers
export function suggestCategory(
  transaction: Transaction,
  categories: Category[]
): { categoryId: string; confidence: number } | null {
  let bestMatch: { categoryId: string; confidence: number } | null = null;

  for (const category of categories) {
    if (!category.rules) continue;

    let score = 0;
    let rules = 0;

    // Check keywords
    if (category.rules.keywords?.length) {
      rules++;
      const description = transaction.description.toLowerCase();
      const matchingKeywords = category.rules.keywords.filter((keyword) =>
        description.includes(keyword.toLowerCase())
      );
      if (matchingKeywords.length > 0) {
        score += matchingKeywords.length / category.rules.keywords.length;
      }
    }

    // Check merchants
    if (category.rules.merchants?.length && transaction.merchant) {
      rules++;
      const merchant = transaction.merchant.toLowerCase();
      if (
        category.rules.merchants
          .map((m) => m.toLowerCase())
          .includes(merchant)
      ) {
        score++;
      }
    }

    // Check amount range
    if (category.rules.amountRange) {
      rules++;
      const { min, max } = category.rules.amountRange;
      if (
        (!min || transaction.amount >= min) &&
        (!max || transaction.amount <= max)
      ) {
        score++;
      }
    }

    if (rules > 0) {
      const confidence = (score / rules) * 100;
      if (!bestMatch || confidence > bestMatch.confidence) {
        bestMatch = { categoryId: category.id, confidence };
      }
    }
  }

  return bestMatch;
}

export function createCategoryRule(
  transactions: Transaction[],
  categoryId: string
): Category['rules'] {
  const categoryTransactions = transactions.filter(
    (t) => t.category === categoryId
  );

  if (categoryTransactions.length === 0) return {};

  // Extract common keywords
  const words = categoryTransactions
    .map((t) => t.description.toLowerCase().split(/\W+/))
    .flat();
  const wordFrequency = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const commonKeywords = Object.entries(wordFrequency)
    .filter(
      ([word, count]) =>
        count >= categoryTransactions.length * 0.5 && word.length > 3
    )
    .map(([word]) => word);

  // Extract common merchants
  const merchants = categoryTransactions
    .filter((t) => t.merchant)
    .map((t) => t.merchant!);
  const commonMerchants = [
    ...new Set(merchants.filter((m) => merchants.filter((x) => x === m).length >= 2)),
  ];

  // Calculate amount range
  const amounts = categoryTransactions.map((t) => t.amount);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);

  return {
    keywords: commonKeywords,
    merchants: commonMerchants,
    amountRange: { min, max },
  };
}