
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppLayout } from '@/components/AppLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Charts from '@/pages/Charts';

console.log('=== APP.TSX LOADING ===');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a safe fallback component
const SafeFallback = ({ pageName }: { pageName: string }) => {
  console.log(`Rendering SafeFallback for: ${pageName}`);
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400">صفحة قيد التطوير</h2>
        <p className="text-gray-300">صفحة {pageName} قيد التطوير حالياً</p>
        <p className="text-gray-400">Page {pageName} is under development</p>
      </div>
    </div>
  );
};

function App() {
  console.log('=== App component rendering... ===');
  
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-white w-full">
        <QueryClientProvider client={queryClient}>
          <Router>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar lang={lang} />
                <div className="flex-1">
                  <AppLayout lang={lang} setLang={setLang}>
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/dashboard" element={
                          <ErrorBoundary>
                            <Dashboard />
                          </ErrorBoundary>
                        } />
                        <Route path="/charts" element={
                          <ErrorBoundary>
                            <Charts lang={lang} />
                          </ErrorBoundary>
                        } />
                        <Route path="/analysis" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Analysis / التحليل" />
                          </ErrorBoundary>
                        } />
                        <Route path="/portfolio" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Portfolio / المحفظة" />
                          </ErrorBoundary>
                        } />
                        <Route path="/trading-bot" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Trading Bot / روبوت التداول" />
                          </ErrorBoundary>
                        } />
                        <Route path="/trading-platform" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Trading Platform / منصة التداول" />
                          </ErrorBoundary>
                        } />
                        <Route path="/high-frequency-trading" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="High Frequency Trading / التداول عالي التردد" />
                          </ErrorBoundary>
                        } />
                        <Route path="/risk-management" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Risk Management / إدارة المخاطر" />
                          </ErrorBoundary>
                        } />
                        <Route path="/alternative-data" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Alternative Data / البيانات البديلة" />
                          </ErrorBoundary>
                        } />
                        <Route path="/ai-models" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="AI Models / نماذج الذكاء الاصطناعي" />
                          </ErrorBoundary>
                        } />
                        <Route path="/continuous-learning" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Continuous Learning / التعلم المستمر" />
                          </ErrorBoundary>
                        } />
                        <Route path="/explainable-ai" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Explainable AI / الذكاء الاصطناعي القابل للتفسير" />
                          </ErrorBoundary>
                        } />
                        <Route path="/security" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Security / الأمان" />
                          </ErrorBoundary>
                        } />
                        <Route path="/advanced-ui" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Advanced UI / الواجهة المتقدمة" />
                          </ErrorBoundary>
                        } />
                        <Route path="/interactive-analysis" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Interactive Analysis / التحليل التفاعلي" />
                          </ErrorBoundary>
                        } />
                        <Route path="/social-trading" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Social Trading / التداول الاجتماعي" />
                          </ErrorBoundary>
                        } />
                        <Route path="/blockchain-integration" element={
                          <ErrorBoundary>
                            <SafeFallback pageName="Blockchain Integration / تكامل البلوك تشين" />
                          </ErrorBoundary>
                        } />
                        <Route path="*" element={
                          <div className="text-center text-white p-8 bg-slate-900 min-h-screen flex items-center justify-center">
                            <div>
                              <h2 className="text-2xl mb-4">الصفحة غير موجودة - Page Not Found</h2>
                              <a href="/" className="text-blue-400 underline hover:text-blue-300">
                                العودة للصفحة الرئيسية
                              </a>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </ErrorBoundary>
                  </AppLayout>
                </div>
              </div>
            </SidebarProvider>
          </Router>
        </QueryClientProvider>
      </div>
    </ErrorBoundary>
  );
}

console.log('App component defined successfully');

export default App;
