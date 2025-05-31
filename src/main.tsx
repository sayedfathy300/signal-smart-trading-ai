
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('=== MAIN.TSX STARTING ===');

const container = document.getElementById("root");
if (!container) {
  console.error('ROOT ELEMENT NOT FOUND!');
  throw new Error("Root element not found");
}

console.log('Root element found:', container);

// Set body styles immediately
document.body.style.backgroundColor = '#0f172a';
document.body.style.color = '#f8fafc';
document.body.style.margin = '0';
document.body.style.padding = '0';

console.log('Body styles applied');

try {
  console.log('Creating React root...');
  const root = createRoot(container);
  
  console.log('Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('=== APP RENDERED SUCCESSFULLY ===');
} catch (error) {
  console.error('Error rendering app:', error);
  // Fallback content
  container.innerHTML = `
    <div style="color: white; background: #0f172a; padding: 20px; min-height: 100vh;">
      <h1>خطأ في تحميل التطبيق</h1>
      <p>Error: ${error.message}</p>
    </div>
  `;
}
