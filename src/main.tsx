import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Handle SPA routing redirects for both GitHub Pages and custom domain
(function() {
  const hostname = window.location.hostname;
  const isCustomDomain = hostname === 'couplecents.lucasdreger.com';
  const isGitHubPages = hostname.includes('github.io');
  
  // Check if we need to restore a route from localStorage (set by 404.html)
  const redirectUrl = localStorage.getItem('spa-redirect');
  if (redirectUrl) {
    // Remove the item so it doesn't affect future navigation
    localStorage.removeItem('spa-redirect');
    
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
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
