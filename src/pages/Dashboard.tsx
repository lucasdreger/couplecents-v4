import { OverviewPage } from '@/components/Overview/OverviewPage';

// Redirect old Dashboard to new OverviewPage
export const Dashboard = () => {
  return (
    <OverviewPage>
      <div className="container mx-auto p-6 space-y-6">
        {/* Financial Overview Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <LayoutDashboard className="h-7 w-7 text-primary" />
                <span>Financial Overview</span>
              </h2>
              <p className="text-muted-foreground mt-1 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" /> {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Total Budget Card */}
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle>Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetTile />
          </CardContent>
        </Card>

        {/* Investments and Reserves Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ErrorBoundary fallback={<ErrorFallback message="Error loading investments" />}>
            <div className="bg-card rounded-lg border shadow-sm">
              <InvestmentsTile />
            </div>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<ErrorFallback message="Error loading reserves" />}>
            <div className="bg-card rounded-lg border shadow-sm">
              <ReservesTile />
            </div>
          </ErrorBoundary>
        </div>

        {/* Category and Investment Distribution Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ErrorBoundary fallback={<ErrorFallback message="Error loading categories" />}>
            <Card className="shadow-sm border-primary/10">
              <CardHeader className="border-b border-border/40 pb-2">
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <CategoryBreakdown />
              </CardContent>
            </Card>
          </ErrorBoundary>

          <ErrorBoundary fallback={<ErrorFallback message="Error loading investments distribution" />}>
            <Card className="shadow-sm border-primary/10">
              <CardHeader className="border-b border-border/40 pb-2">
                <CardTitle>Investment Distribution</CardTitle>
                <CardDescription>Distribution of investments by type</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <InvestmentDistribution />
              </CardContent>
            </Card>
          </ErrorBoundary>
        </div>

        {/* Monthly Chart */}
        <ErrorBoundary fallback={<ErrorFallback message="Error loading monthly data" />}>
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="border-b border-border/40 pb-2">
              <CardTitle>Monthly Budget vs Actual</CardTitle>
              <CardDescription>Compare planned versus actual spending</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <MonthlyChart />
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
    </OverviewPage>
  );
};
