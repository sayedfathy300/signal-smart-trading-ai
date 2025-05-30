
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
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
import AttackPrevention from '@/pages/AttackPrevention';
import AdvancedUI from '@/pages/AdvancedUI';
import NotFound from '@/pages/NotFound';
import { AppLayout } from '@/components/AppLayout';
import InteractiveAnalysis from './pages/InteractiveAnalysis';
import SocialTrading from './pages/SocialTrading';
import BlockchainIntegration from './pages/BlockchainIntegration';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-trading-bg" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar lang={lang} />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<AppLayout lang={lang} setLang={setLang} />}>
                    <Route index element={<Index />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="charts" element={<Charts />} />
                    <Route path="analysis" element={<Analysis />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    <Route path="trading-bot" element={<TradingBot />} />
                    <Route path="trading-platform" element={<TradingPlatform />} />
                    <Route path="high-frequency-trading" element={<HighFrequencyTrading />} />
                    <Route path="risk-management" element={<RiskManagement />} />
                    <Route path="alternative-data" element={<AlternativeData lang={lang} />} />
                    <Route path="ai-models" element={<AIModels />} />
                    <Route path="continuous-learning" element={<ContinuousLearning />} />
                    <Route path="explainable-ai" element={<ExplainableAI />} />
                    <Route path="security" element={<SecurityDashboard />} />
                    <Route path="attack-prevention" element={<AttackPrevention />} />
                    <Route path="advanced-ui" element={<AdvancedUI />} />
                    <Route path="interactive-analysis" element={<InteractiveAnalysis lang={lang} />} />
                    <Route path="social-trading" element={<SocialTrading lang={lang} />} />
                    <Route path="blockchain-integration" element={<BlockchainIntegration lang={lang} />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </SidebarProvider>
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
