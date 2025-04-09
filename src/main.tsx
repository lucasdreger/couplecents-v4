import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Handle GitHub Pages SPA routing
(function() {
  // Check if we need to restore a route from localStorage (set by 404.html)
  const redirectUrl = localStorage.getItem('spa-redirect');
  if (redirectUrl) {
    // Remove the item so it doesn't affect future navigation
    localStorage.removeItem('spa-redirect');
    
    // Extract the path part of the URL to use with router
    const url = new URL(window.location.origin + redirectUrl);
    const path = url.pathname.replace(/^\/couplecents-v4/, '');
    
    // Use history API to navigate properly within the app
    if (path && path !== '/') {
      window.history.replaceState(null, '', path);
    }
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
