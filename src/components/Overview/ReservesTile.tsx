import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Reserve } from '@/types/supabase';
import { useReserves } from '@/hooks/useReserves';
import { Skeleton } from '@/components/ui/skeleton';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from "@/context/AuthContext";
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface EditableReserveProps {
  reserve: Reserve;
  onSave: (id: string, amount: number) => void;
  onCancel: () => void;
}

const EditableReserve = ({ reserve, onSave, onCancel }: EditableReserveProps) => {
  const [editValue, setEditValue] = useState(reserve.amount.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSave = () => {
    const value = parseFloat(editValue.replace(',', '.'));
    if (!isNaN(value)) {
      onSave(reserve.id, value);
    } else {
      toast.error('Please enter a valid number');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
        <Input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-32 pl-7 text-right"
          placeholder="0,00"
        />
      </div>
      <Button size="icon" variant="ghost" onClick={handleSave}>
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={onCancel}>
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function ReservesTile() {
  const { user } = useAuth();
  const { reserves, isLoading, updateReserve } = useReserves();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const totalReserves = React.useMemo(() => {
    return reserves.reduce((total, reserve) => total + reserve.amount, 0);
  }, [reserves]);

  const handleSave = async (id: string, amount: number) => {
    try {
      await updateReserve({ id, amount, userId: user?.id });
      setEditingId(null);
      toast.success('Reserve updated successfully');
    } catch (error) {
      toast.error('Failed to update reserve');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reserves</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Reserves</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">
          {totalReserves.toLocaleString('de-DE', { 
            style: 'currency', 
            currency: 'EUR' 
          })}
        </div>

        <div className="space-y-4">
          {reserves.map((reserve) => {
            const progress = (reserve.amount / reserve.target_amount) * 100;
            
            return (
              <div
                key={reserve.id}
                className="space-y-2"
                onMouseEnter={() => setHoveredId(reserve.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{reserve.name}</span>
                  <div className="flex items-center space-x-2">
                    {editingId === reserve.id ? (
                      <EditableReserve
                        reserve={reserve}
                        onSave={handleSave}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <>
                        <span className="text-sm tabular-nums">
                          {reserve.amount.toLocaleString('de-DE', { 
                            style: 'currency', 
                            currency: 'EUR' 
                          })}
                        </span>
                        {hoveredId === reserve.id && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingId(reserve.id)}
                            className="h-8 w-8"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs tabular-nums text-muted-foreground w-12">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            );
          })}

          {reserves.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No reserves found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
