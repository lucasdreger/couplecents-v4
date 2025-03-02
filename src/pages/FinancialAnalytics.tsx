import { FinancialAnalytics as FinancialAnalyticsComponent } from "@/components/Overview/FinancialAnalytics";

export const FinancialAnalytics = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Financial Analytics</h1>
      <FinancialAnalyticsComponent />
    </div>
  );
};