
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import AIModels from "@/pages/AIModels";
import TradingBot from "@/pages/TradingBot";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/charts" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/analysis" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/trading" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/portfolio" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/ai-models" element={
              <AppLayout>
                <AIModels />
              </AppLayout>
            } />
            <Route path="/neural-networks" element={
              <AppLayout>
                <AIModels />
              </AppLayout>
            } />
            <Route path="/trading-bot" element={
              <AppLayout>
                <TradingBot />
              </AppLayout>
            } />
            <Route path="/market-prediction" element={
              <AppLayout>
                <AIModels />
              </AppLayout>
            } />
            <Route path="/settings" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/help" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
