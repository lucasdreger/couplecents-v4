
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 fade-in">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">Here's an overview of your finances</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 slide-up">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <h2 className="text-3xl font-bold">$24,500</h2>
              </div>
            </div>
          </Card>

          <Card className="p-6 slide-up [animation-delay:100ms]">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                <h2 className="text-3xl font-bold">$8,250</h2>
              </div>
            </div>
          </Card>

          <Card className="p-6 slide-up [animation-delay:200ms]">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Expenses</p>
                <h2 className="text-3xl font-bold">$4,890</h2>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-background rounded-full">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Online Purchase</p>
                    <p className="text-sm text-muted-foreground">Today at 2:45 PM</p>
                  </div>
                </div>
                <p className="font-semibold text-destructive">-$89.99</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
