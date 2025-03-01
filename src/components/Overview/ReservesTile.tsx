import { useState } from "react";
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
}

export const ReservesTile = () => {
  const { user } = useAuth();
  const { reserves, loading, updateValue } = useReserves();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  // Ensure reserves is an array before using reduce
  const reservesArray = Array.isArray(reserves) ? reserves : [];
  const totalReserves = reservesArray.reduce((sum, res) => sum + res.current_value, 0);
  
  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Uses DD/MM/YYYY format
  };

  const handleEdit = (reserve: Reserve) => {
    setEditingId(reserve.id);
    setEditValue(reserve.current_value.toString());
  };

  const handleSave = (id: string) => {
    const value = parseFloat(editValue);
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Reserves</span>
          <span className="text-lg font-medium">€{totalReserves.toFixed(2)}</span>
        </CardTitle>
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
              <Card key={reserve.id} className="border bg-card/50">
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
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24"
                          />
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
                            <p className="font-bold">€{reserve.current_value.toFixed(2)}</p>
                            {reserve.target_value && (
                              <p className="text-xs text-muted-foreground">
                                Target: €{reserve.target_value.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleEdit(reserve)}
                            className="h-8 w-8"
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
