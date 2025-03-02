import { FinancialAnalytics as FinancialAnalyticsContent } from '@/components/Overview/FinancialAnalytics';

export default function FinancialAnalytics() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Financial Analytics</h1>
      <FinancialAnalyticsContent />
    </div>
  );
}