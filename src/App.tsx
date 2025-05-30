
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Charts from '@/pages/Charts';
import Analysis from '@/pages/Analysis';
import Portfolio from '@/pages/Portfolio';
import TradingBot from '@/pages/TradingBot';
import AlternativeData from '@/pages/AlternativeData';
import AIModels from '@/pages/AIModels';
import ContinuousLearning from '@/pages/ContinuousLearning';
import ExplainableAI from '@/pages/ExplainableAI';
import NotFound from '@/pages/NotFound';
import { AppLayout } from '@/components/AppLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="charts" element={<Charts />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="trading-bot" element={<TradingBot />} />
            <Route path="alternative-data" element={<AlternativeData />} />
            <Route path="ai-models" element={<AIModels />} />
            <Route path="continuous-learning" element={<ContinuousLearning />} />
            <Route path="explainable-ai" element={<ExplainableAI />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
