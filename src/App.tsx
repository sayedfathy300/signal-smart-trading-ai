
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';

console.log('=== APP.TSX LOADING ===');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('App component rendering...');
  
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: '#f8fafc', 
      minHeight: '100vh',
      width: '100%',
      padding: '20px'
    }}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-slate-900 text-white">
            <header style={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.8)', 
              padding: '1rem',
              marginBottom: '2rem',
              borderRadius: '8px'
            }}>
              <h1 className="text-2xl font-bold text-center">
                منصة التداول الذكي - AI Trading Platform
              </h1>
            </header>
            
            <main style={{ padding: '1rem' }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={
                  <div className="text-center text-white">
                    <h2>الصفحة غير موجودة - Page Not Found</h2>
                    <a href="/" className="text-blue-400 underline">العودة للصفحة الرئيسية</a>
                  </div>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

console.log('App component defined successfully');

export default App;
