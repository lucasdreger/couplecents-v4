import { OverviewPage } from '@/components/Overview/OverviewPage';
import { useEffect, useState } from 'react';

// Modified Dashboard to provide a simpler view that always works
export const Dashboard = () => {
  const [showSimpleView, setShowSimpleView] = useState(false);
  
  useEffect(() => {
    console.log('Dashboard component mounted');
    
    // Check if we're on the custom domain
    const isCustomDomain = window.location.hostname === 'couplecents.lucasdreger.com';
    
    // On custom domain, show the simple view by default to ensure content is visible
    if (isCustomDomain) {
      setShowSimpleView(true);
    }
  }, []);

  // Simple view that doesn't depend on authentication
  if (showSimpleView) {
    return (
      <div data-dashboard="true" style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
          padding: '30px',
          borderRadius: '8px',
          color: 'white',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>CoupleCents Dashboard</h1>
          <p>Your financial partner for better budgeting</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Card 1 */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', marginTop: '0' }}>Monthly Overview</h2>
            <p style={{ color: '#6b7280' }}>Track your monthly spending and income</p>
            <div style={{ marginTop: '15px' }}>
              <button 
                onClick={() => window.location.href = '/monthly-expenses'} 
                style={{
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
            </div>
          </div>
          
          {/* Card 2 */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', marginTop: '0' }}>Analytics</h2>
            <p style={{ color: '#6b7280' }}>Visualize your financial data</p>
            <div style={{ marginTop: '15px' }}>
              <button 
                onClick={() => window.location.href = '/analytics'} 
                style={{
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Analytics
              </button>
            </div>
          </div>
          
          {/* Card 3 */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', marginTop: '0' }}>Administration</h2>
            <p style={{ color: '#6b7280' }}>Manage categories and settings</p>
            <div style={{ marginTop: '15px' }}>
              <button 
                onClick={() => window.location.href = '/administration'} 
                style={{
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Manage Settings
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '20px'
        }}>
          <button 
            onClick={() => setShowSimpleView(false)} 
            style={{
              background: '#4b5563',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load Full Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Regular dashboard content
  return (
    <div data-dashboard="true" style={{ display: 'block', minHeight: '100vh' }}>
      <OverviewPage />
    </div>
  );
};
