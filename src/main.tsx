
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx loading...');

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

// Set body background immediately
document.body.style.backgroundColor = '#0f172a';
document.body.style.color = '#f8fafc';

console.log('Creating React root...');
const root = createRoot(container);

console.log('Rendering App...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('App rendered successfully');
