
import { useState } from 'react';
import { useAutoIncrements } from '@/hooks/useAutoIncrements';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvestments } from '@/hooks/useInvestments';
import { useReserves } from '@/hooks/useReserves';
import { CalendarIcon, PlusIcon, EditIcon, InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AutoIncrementManagement() {
  const { investmentConfigs, reserveConfigs, loading, remove } = useAutoIncrements();
  const { investments } = useInvestments();
  const { reserves } = useReserves();
  const [showInfo, setShowInfo] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getInvestmentName = (id: string) => {
    const investment = investments?.find(inv => inv.id === id);
    return investment?.name || 'Unknown Investment';
  };

  const getReserveName = (id: string) => {
    const reserve = reserves?.find(res => res.id === id);
    return reserve?.name || 'Unknown Reserve';
  };

  const getFixedExpenseName = (config: any) => {
    if (!config.fixed_expenses) return 'None';
    return config.fixed_expenses.description || 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Auto-Increment Configurations
            </CardTitle>
            <CardDescription>
              Monthly automated updates for investments and reserves
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowInfo(true)}
                >
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>How auto-increments work</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : ((!investmentConfigs || investmentConfigs.length === 0) && 
              (!reserveConfigs || reserveConfigs.length === 0)) ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No auto-increment configurations found
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Auto-increment can be set up from the Investments or Reserves cards
              by clicking on the calendar icon next to an item.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {investmentConfigs && investmentConfigs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Investment Increments</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment</TableHead>
                      <TableHead>Linked Expense</TableHead>
                      <TableHead className="text-right">Monthly Amount</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investmentConfigs.map(config => (
                      <TableRow key={config.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {getInvestmentName(config.investment_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getFixedExpenseName(config)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {config.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(config.updated_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove('investment', config.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {reserveConfigs && reserveConfigs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Reserve Increments</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reserve</TableHead>
                      <TableHead>Linked Expense</TableHead>
                      <TableHead className="text-right">Monthly Amount</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reserveConfigs.map(config => (
                      <TableRow key={config.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {getReserveName(config.reserve_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getFixedExpenseName(config)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {config.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(config.updated_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove('reserve', config.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <AlertDialog open={showInfo} onOpenChange={setShowInfo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How Auto-Increments Work</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <p>
                  Auto-increments automatically add a specified amount to investments 
                  and reserves each month. This feature helps track monthly additions 
                  from fixed expenses.
                </p>
                
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="font-semibold mb-1">Monthly Process</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Values are updated on the first day of each month</li>
                    <li>History is automatically tracked for each change</li>
                    <li>Auto-updates appear as distinct entries in history logs</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="font-semibold mb-1">Setup</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Click the calendar icon on any investment or reserve card</li>
                    <li>Set the monthly amount to add automatically</li>
                    <li>Optionally link to a fixed expense to keep track of sources</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
