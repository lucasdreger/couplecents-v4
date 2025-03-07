import React from "react";
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormLabel } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
}

interface CreditCardBillProps {
  expenses: Expense[];
  title?: string;
}

export function CreditCardBill({ expenses, title = "Credit Card Bill" }: CreditCardBillProps) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex flex-col">
                <span className="font-medium">{expense.description}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </div>
              <span className="font-medium">{formatCurrency(expense.amount)}</span>
            </div>
          ))}
          
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No expenses recorded for this credit card.
            </p>
          ) : (
            <div className="flex justify-between pt-4 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}