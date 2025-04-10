import { OverviewPage } from '@/components/Overview/OverviewPage';

export const Dashboard = () => {
  // Regular dashboard content without any conditions
  return (
    <div data-dashboard="true" style={{ display: 'block', minHeight: '100vh' }}>
      <OverviewPage />
    </div>
  );
};
