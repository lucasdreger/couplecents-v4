import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useReserves } from "@/hooks/useReserves";
import { useAuth } from "@/context/AuthContext";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Reserve {
  id: string;
  name: string;
  category: string;
  current_value: number;
  target_value: number | null;
  last_updated: string;
  change_percentage?: number;
}

export const ReservesTile = () => {
  const { user } = useAuth();
  const { reserves, loading, updateValue } = useReserves();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Uses DD/MM/YYYY format
  };

  const handleEdit = (reserve: Reserve) => {
    setEditingId(reserve.id);
    // Format the value as currency but without the € symbol
    setEditValue(reserve.current_value.toFixed(2).replace('.', ','));
  };
  
  // Select all text in input when it appears
  useEffect(() => {
    if (editingId && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 10);
    }
  }, [editingId]);

  const handleSave = (id: string) => {
    // Convert comma to dot for parsing
    const cleanValue = editValue.replace(/[€\s]/g, '').replace(',', '.');
    const value = parseFloat(cleanValue);
    
    if (!isNaN(value) && user?.id) {
      updateValue({ id, value, userId: user.id });
      setEditingId(null);
      toast.success("Reserve updated successfully");
    } else if (isNaN(value)) {
      toast.error("Please enter a valid number");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };
  
  // Ensure reserves is an array before using
  const reservesArray = Array.isArray(reserves) ? reserves : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserves</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : reservesArray.length === 0 ? (
          <div className="text-center py-3 text-muted-foreground">No reserves found</div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {reservesArray.map(reserve => (
              <Card 
                key={reserve.id} 
                className={`border transition-all duration-200 group 
                  ${hoveredId === reserve.id 
                    ? 'bg-accent/15 shadow-sm ring-1 ring-primary/10' 
                    : 'bg-card/50'}`}
                onMouseEnter={() => setHoveredId(reserve.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{reserve.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {reserve.category}
                        </p>
                      </div>
                      
                      {editingId === reserve.id ? (
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
                            onClick={() => handleSave(reserve.id)}
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
                              {reserve.current_value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                            {reserve.target_value && (
                              <p className="text-xs text-muted-foreground">
                                Target: {reserve.target_value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                              </p>
                            )}
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleEdit(reserve)}
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {reserve.target_value && (
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(reserve.current_value / reserve.target_value) * 100} 
                          className="h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {Math.round((reserve.current_value / reserve.target_value) * 100)}%
                        </span>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDate(reserve.last_updated)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
