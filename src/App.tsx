
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppLayout } from '@/components/AppLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import pages
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
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/charts" element={<Charts lang={lang} />} />
                        <Route path="/analysis" element={<Analysis lang={lang} />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/trading-bot" element={<TradingBot />} />
                        <Route path="/trading-platform" element={<TradingPlatform />} />
                        <Route path="/high-frequency-trading" element={<HighFrequencyTrading />} />
                        <Route path="/risk-management" element={<RiskManagement />} />
                        <Route path="/alternative-data" element={<AlternativeData />} />
                        <Route path="/ai-models" element={<AIModels />} />
                        <Route path="/continuous-learning" element={<ContinuousLearning />} />
                        <Route path="/explainable-ai" element={<ExplainableAI />} />
                        <Route path="/security" element={<SecurityDashboard />} />
                        <Route path="/advanced-ui" element={<AdvancedUI />} />
                        <Route path="/interactive-analysis" element={<InteractiveAnalysis />} />
                        <Route path="/social-trading" element={<SocialTrading />} />
                        <Route path="/blockchain-integration" element={<BlockchainIntegration />} />
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
