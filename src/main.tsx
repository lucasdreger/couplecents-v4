import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from './lib/supabaseClient';

// Handle SPA routing redirects for both GitHub Pages and custom domain
(function() {
  const hostname = window.location.hostname;
  const isCustomDomain = hostname === 'couplecents.lucasdreger.com';
  const isGitHubPages = hostname.includes('github.io');
  
  console.log('Initializing application on:', hostname);
  console.log('Custom domain detected:', isCustomDomain);
  
  // Check if we need to restore a route from localStorage (set by 404.html)
  const redirectUrl = localStorage.getItem('spa-redirect');
  if (redirectUrl) {
    // Remove the item so it doesn't affect future navigation
    localStorage.removeItem('spa-redirect');
    
    console.log('Handling SPA redirect to:', redirectUrl);
    
    if (isGitHubPages && !isCustomDomain) {
      // Extract the path part of the URL to use with router for GitHub Pages
      const url = new URL(window.location.origin + redirectUrl);
      const path = url.pathname.replace(/^\/couplecents-v4/, '');
      
      // Use history API to navigate properly within the app
      if (path && path !== '/') {
        window.history.replaceState(null, '', path);
      }
    } else if (isCustomDomain) {
      // For custom domain, we can replace state directly
      window.history.replaceState(null, '', redirectUrl);
    }
  }
  
  // Initialize Supabase connection
  async function testSupabaseConnection() {
    try {
      const { data, error } = await supabase.from('health_check').select('*').limit(1);
      if (error) {
        console.warn('Supabase connection test failed:', error.message);
      } else {
        console.log('Successfully connected to Supabase');
      }
    } catch (err) {
      console.error('Error testing Supabase connection:', err);
    }
  }
  
  // Test connection after a short delay to allow other initialization
  setTimeout(() => {
    testSupabaseConnection();
  }, 2000);
  
  // Force UI to render after maximum wait time
  setTimeout(() => {
    console.log('Maximum wait time for authentication reached, forcing UI update');
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const event = new Event('force-render');
      document.dispatchEvent(event);
    }
  }, 5000);
})();

// Create the root with error handling
let root: ReactDOM.Root;
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  root = ReactDOM.createRoot(rootElement);
  console.log('React root created successfully');
} catch (error) {
  console.error('Error creating React root:', error);
  // Create a fallback element
  const fallbackDiv = document.createElement('div');
  fallbackDiv.id = 'root-fallback';
  document.body.appendChild(fallbackDiv);
  root = ReactDOM.createRoot(fallbackDiv);
}

// Add visual inline styles to ensure the app renders
const inlineStyleEl = document.createElement('style');
inlineStyleEl.textContent = `
  #root { display: block !important; min-height: 100vh !important; }
  body { display: block !important; }
`;
document.head.appendChild(inlineStyleEl);

// Render the app with error boundaries
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
