
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
import Analysis from '@/pages/Analysis';
import Portfolio from '@/pages/Portfolio';
import TradingBot from '@/pages/TradingBot';
import TradingPlatform from '@/pages/TradingPlatform';
import HighFrequencyTrading from '@/pages/HighFrequencyTrading';
import RiskManagement from '@/pages/RiskManagement';
import AlternativeData from '@/pages/AlternativeData';
import AIModels from '@/pages/AIModels';
import ContinuousLearning from '@/pages/ContinuousLearning';
import ExplainableAI from '@/pages/ExplainableAI';
import SecurityDashboard from '@/pages/SecurityDashboard';
import AdvancedUI from '@/pages/AdvancedUI';
import InteractiveAnalysis from '@/pages/InteractiveAnalysis';
import SocialTrading from '@/pages/SocialTrading';
import BlockchainIntegration from '@/pages/BlockchainIntegration';

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
                            <Charts />
                          </ErrorBoundary>
                        } />
                        <Route path="/analysis" element={
                          <ErrorBoundary>
                            <Analysis />
                          </ErrorBoundary>
                        } />
                        <Route path="/portfolio" element={
                          <ErrorBoundary>
                            <Portfolio />
                          </ErrorBoundary>
                        } />
                        <Route path="/trading-bot" element={
                          <ErrorBoundary>
                            <TradingBot />
                          </ErrorBoundary>
                        } />
                        <Route path="/trading-platform" element={
                          <ErrorBoundary>
                            <TradingPlatform />
                          </ErrorBoundary>
                        } />
                        <Route path="/high-frequency-trading" element={
                          <ErrorBoundary>
                            <HighFrequencyTrading />
                          </ErrorBoundary>
                        } />
                        <Route path="/risk-management" element={
                          <ErrorBoundary>
                            <RiskManagement />
                          </ErrorBoundary>
                        } />
                        <Route path="/alternative-data" element={
                          <ErrorBoundary>
                            <AlternativeData />
                          </ErrorBoundary>
                        } />
                        <Route path="/ai-models" element={
                          <ErrorBoundary>
                            <AIModels />
                          </ErrorBoundary>
                        } />
                        <Route path="/continuous-learning" element={
                          <ErrorBoundary>
                            <ContinuousLearning />
                          </ErrorBoundary>
                        } />
                        <Route path="/explainable-ai" element={
                          <ErrorBoundary>
                            <ExplainableAI />
                          </ErrorBoundary>
                        } />
                        <Route path="/security" element={
                          <ErrorBoundary>
                            <SecurityDashboard />
                          </ErrorBoundary>
                        } />
                        <Route path="/advanced-ui" element={
                          <ErrorBoundary>
                            <AdvancedUI />
                          </ErrorBoundary>
                        } />
                        <Route path="/interactive-analysis" element={
                          <ErrorBoundary>
                            <InteractiveAnalysis />
                          </ErrorBoundary>
                        } />
                        <Route path="/social-trading" element={
                          <ErrorBoundary>
                            <SocialTrading />
                          </ErrorBoundary>
                        } />
                        <Route path="/blockchain-integration" element={
                          <ErrorBoundary>
                            <BlockchainIntegration />
                          </ErrorBoundary>
                        } />
                        <Route path="*" element={
                          <div className="text-center text-white p-8">
                            <h2 className="text-2xl mb-4">الصفحة غير موجودة - Page Not Found</h2>
                            <a href="/" className="text-blue-400 underline hover:text-blue-300">
                              العودة للصفحة الرئيسية
                            </a>
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
