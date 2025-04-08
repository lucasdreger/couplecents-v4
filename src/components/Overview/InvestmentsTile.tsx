
/**
 * Investments Summary Tile Component
 * 
 * Displays current investment status including:
 * - Investment categories
 * - Current values with edit capability
 * - Last update timestamps
 */
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvestments } from "@/hooks/useInvestments";
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, PencilIcon, CheckIcon, XIcon, CalendarCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { AutoIncrementConfig } from '@/components/management/AutoIncrementConfig';
import { useAutoIncrements } from '@/hooks/useAutoIncrements';

interface Investment {
  id: string;
  name: string;
  current_value: number;
  last_updated: string;
  change_percentage?: number;
}

export const InvestmentsTile = () => {
  const { user } = useAuth();
  const { investments, isLoading, updateValue } = useInvestments();
  const { getConfigForItem } = useAutoIncrements();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [currentInvestment, setCurrentInvestment] = useState<Investment | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleEdit = (investment: Investment) => {
    setEditingId(investment.id);
    setCurrentInvestment(investment);
    
    // Format the value as currency but without the € symbol
    setEditValue(investment.current_value.toFixed(2).replace('.', ','));
  };
  
  // Select all text in input when it appears
  useEffect(() => {
    if (editingId && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 10);
    }
  }, [editingId]);

  const handleConfigureAutoIncrement = (investment: Investment) => {
    setSelectedInvestment(investment);
    setConfigOpen(true);
  };
  
  const handleSave = (id: string) => {
    // Convert comma to dot for parsing
    const cleanValue = editValue.replace(/[€\s]/g, '').replace(',', '.');
    const value = parseFloat(cleanValue);
    
    if (!isNaN(value) && user?.id && currentInvestment) {
      const oldValue = currentInvestment.current_value;
      
      // Pass both the new value and old value to the mutation function
      updateValue({ 
        id, 
        value, 
        oldValue
      });
      
      toast.success('Investment updated successfully');
      setEditingId(null);
      setCurrentInvestment(null);
    } else if (isNaN(value)) {
      toast.error('Please enter a valid number');
    }
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setCurrentInvestment(null);
  };
  
  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Uses DD/MM/YYYY format
  };

  const hasAutoIncrement = (investmentId: string) => {
    return !!getConfigForItem('investment', investmentId);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investments</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !investments || investments.length === 0 ? (
          <div className="text-center py-3 text-muted-foreground">No investments found</div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {investments.map((investment: Investment) => (
              <Card 
                key={investment.id} 
                className={`border transition-all duration-300 group 
                  ${hoveredId === investment.id 
                    ? 'bg-accent/20 shadow-md scale-[1.02] border-primary/20 transform' 
                    : 'bg-card/50 hover:bg-accent/5'}`}
                onMouseEnter={() => setHoveredId(investment.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{investment.name}</h4>
                        {hasAutoIncrement(investment.id) && (
                          <CalendarCheckIcon 
                            className="h-4 w-4 text-green-500" 
                            title="Auto-increment configured"
                          />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {formatDate(investment.last_updated)}
                      </p>
                    </div>
                    
                    {editingId === investment.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                          <Input
                            ref={inputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-32 text-right pl-7"
                            placeholder="0,00"
                            autoFocus
                          />
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleSave(investment.id)}
                          className="h-8 w-8"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={handleCancel}
                          className="h-8 w-8"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="font-bold">
                            {investment.current_value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                          </p>
                          {investment.change_percentage !== undefined && (
                            <div className={`flex items-center text-xs ${investment.change_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {investment.change_percentage >= 0 ? (
                                <ArrowUpIcon className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDownIcon className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(investment.change_percentage).toFixed(2)}%
                            </div>
                          )}
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleEdit(investment)}
                            className="h-8 w-8"
                            title="Edit value"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleConfigureAutoIncrement(investment)}
                            className="h-8 w-8"
                            title="Configure auto-increment"
                          >
                            <CalendarCheckIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {selectedInvestment && (
        <AutoIncrementConfig
          type="investment"
          itemId={selectedInvestment.id}
          itemName={selectedInvestment.name}
          open={configOpen}
          onOpenChange={setConfigOpen}
        />
      )}
    </Card>
  );
};
