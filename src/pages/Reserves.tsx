import { useAuth } from '@/context/AuthContext';
import { useReserves } from '@/hooks/useReserves';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export const Reserves = () => {
  const { user } = useAuth();
  const { reserves, loading, error, updateValue } = useReserves();
  
  // Ensure reserves is an array before using reduce
  const reservesArray = Array.isArray(reserves) ? reserves : [];
  const totalReserves = reservesArray.reduce((sum, res) => sum + res.current_value, 0);
  
  // Add loading and error state handling
  if (loading) {
    return <div className="p-8 text-center">Loading reserves...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading reserves data</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reserves</h2>
        <div className="text-2xl">Total: ${totalReserves.toFixed(2)}</div>
      </div>
      
      {reservesArray.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No reserves found. Create reserves in the Administration section.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reservesArray.map(reserve => (
            <Card key={reserve.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {reserve.name}
                  <span className="text-muted-foreground text-sm">
                    {reserve.category}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      defaultValue={reserve.current_value}
                      onChange={e => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          updateValue({ id: reserve.id, value, userId: user?.id || '' });
                        }
                      }}
                    />
                    {reserve.target_value && (
                      <Progress 
                        value={(reserve.current_value / reserve.target_value) * 100} 
                        className="flex-1"
                      />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(reserve.last_updated).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
