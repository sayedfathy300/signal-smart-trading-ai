
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AppLayout } from '@/components/AppLayout';
import Dashboard from '@/pages/Dashboard';
import TradingBot from '@/pages/TradingBot';
import AIModels from '@/pages/AIModels';
import Charts from '@/pages/Charts';
import Portfolio from '@/pages/Portfolio';
import Analysis from '@/pages/Analysis';
import AlternativeData from '@/pages/AlternativeData';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/alternative-data" element={<AlternativeData />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/trading-bot" element={<TradingBot />} />
            <Route path="/ai-models" element={<AIModels />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
