import React from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabaseClient'
import { useToast } from "@/components/ui/use-toast"
import { FormLabel } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface DefaultIncomeField {
  id: string;
  label: string;
  value: number;
  onUpdate: (value: number) => Promise<void>;
}

interface DefaultIncomeManagementProps {
  defaultIncome: {
    lucas_main_income: number;
    lucas_other_income: number;
    camila_main_income: number;
    camila_other_income: number;
  };
  onUpdate: (field: keyof typeof defaultIncome, value: number) => Promise<void>;
}

export function DefaultIncomeManagement({ defaultIncome, onUpdate }: DefaultIncomeManagementProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof defaultIncome) => {
    const value = parseFloat(e.target.value) || 0;
    
    try {
      setIsSubmitting(true);
      await onUpdate(field, value);
      toast({
        title: "Success",
        description: "Default income updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default income",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Monthly Income</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div>
              <Label>Lucas - Main Income</Label>
              <Input
                type="number"
                value={defaultIncome.lucas_main_income}
                onChange={(e) => handleInputChange(e, "lucas_main_income")}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Lucas - Other Income</Label>
              <Input
                type="number"
                value={defaultIncome.lucas_other_income}
                onChange={(e) => handleInputChange(e, "lucas_other_income")}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Camila - Main Income</Label>
              <Input
                type="number"
                value={defaultIncome.camila_main_income}
                onChange={(e) => handleInputChange(e, "camila_main_income")}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Camila - Other Income</Label>
              <Input
                type="number"
                value={defaultIncome.camila_other_income}
                onChange={(e) => handleInputChange(e, "camila_other_income")}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Monthly Income: {formatCurrency(
              Object.values(defaultIncome).reduce((a, b) => a + b, 0)
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
