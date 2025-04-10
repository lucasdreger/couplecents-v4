import { OverviewPage } from '@/components/Overview/OverviewPage';
import { useEffect, useState } from 'react';

// Modified Dashboard to show the real application content by default
export const Dashboard = () => {
  // Set showFallback to false by default to show the real application
  const [showFallback, setShowFallback] = useState(false);
  
  useEffect(() => {
    console.log('Dashboard component mounted - showing real application content');
  }, []);

  // Simple test UI (now hidden by default)
  if (showFallback) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: '#f9fafb',
        color: '#111827',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>GitHub Pages Test</h1>
        <p style={{ marginBottom: '1rem' }}>This is a basic test to see if rendering works.</p>
        <div style={{ marginBottom: '1rem' }}>
          Current time: {new Date().toLocaleTimeString()}
        </div>
        <button 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer' 
          }}
          onClick={() => setShowFallback(false)}
        >
          Show Regular Dashboard
        </button>
      </div>
    );
  }

  // Regular dashboard content with data-dashboard attribute for detection
  return (
    <div data-dashboard="true" style={{ display: 'block', minHeight: '100vh' }}>
      <OverviewPage />
    </div>
  );
};
