import React, { useEffect, useState } from 'react';

export const DebugOverlay: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<{
    url: string;
    hostname: string;
    pathname: string;
    userAgent: string;
    rendered: boolean;
    rootNode: boolean;
    rootDisplay: string;
    bodyDisplay: string;
  }>({
    url: '',
    hostname: '',
    pathname: '',
    userAgent: '',
    rendered: false,
    rootNode: false,
    rootDisplay: '',
    bodyDisplay: '',
  });

  useEffect(() => {
    // Only enable in development or with URL param
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('debug');
    
    if (process.env.NODE_ENV === 'development' || debugParam === 'true') {
      setVisible(true);
    }

    // Collect debugging info
    const rootElement = document.getElementById('root');
    
    setInfo({
      url: window.location.href,
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      userAgent: navigator.userAgent,
      rendered: !!rootElement?.childElementCount,
      rootNode: !!rootElement,
      rootDisplay: rootElement ? window.getComputedStyle(rootElement).display : 'unknown',
      bodyDisplay: window.getComputedStyle(document.body).display,
    });
    
    // Update debug info every second
    const interval = setInterval(() => {
      const rootElement = document.getElementById('root');
      setInfo(prev => ({
        ...prev,
        rendered: !!rootElement?.childElementCount,
        rootNode: !!rootElement,
        rootDisplay: rootElement ? window.getComputedStyle(rootElement).display : 'unknown',
        bodyDisplay: window.getComputedStyle(document.body).display,
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        right: '0',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px',
        fontSize: '10px',
        zIndex: 9999,
        maxWidth: '300px',
        opacity: 0.7,
        fontFamily: 'monospace',
      }}
    >
      <div><strong>Host:</strong> {info.hostname}</div>
      <div><strong>Path:</strong> {info.pathname}</div>
      <div><strong>Root rendered:</strong> {info.rendered ? '✅' : '❌'}</div>
      <div><strong>Root display:</strong> {info.rootDisplay}</div>
      <div><strong>Body display:</strong> {info.bodyDisplay}</div>
    </div>
  );
};