/**
 * Investments Summary Tile Component
 * 
 * Displays current investment status including:
 * - Investment categories
 * - Current values with edit capability
 * - Distribution chart
 * - Last update timestamps
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvestments } from "@/hooks/useInvestments";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface Investment {
  id: string;
  name: string;
  current_value: number;
  last_updated: string;
  change_percentage?: number;
}

export const InvestmentsTile = () => {
  const { investments, isLoading } = useInvestments();
  
  const totalInvestments = investments?.reduce((sum: number, inv: Investment) => sum + inv.current_value, 0) || 0;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Investments</span>
            <span className="text-lg font-medium">${totalInvestments.toFixed(2)}</span>
          </CardTitle>
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
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {investments.map((investment: Investment) => (
                <Card key={investment.id} className="border bg-card/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{investment.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {new Date(investment.last_updated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${investment.current_value.toFixed(2)}</p>
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
