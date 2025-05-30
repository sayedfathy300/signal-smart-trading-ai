
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlternativeDataDashboard from '@/components/AlternativeDataDashboard';
import CrossDataAnalytics from '@/components/CrossDataAnalytics';
import { Database, TrendingUp } from 'lucide-react';

interface AlternativeDataProps {
  lang?: 'en' | 'ar';
}

const AlternativeData = ({ lang = 'ar' }: AlternativeDataProps) => {
  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          {lang === 'ar' ? 'البيانات البديلة المتقدمة' : 'Advanced Alternative Data'}
        </h1>
        <p className="text-gray-400">
          {lang === 'ar' 
            ? 'تحليل شامل للبيانات غير التقليدية من الأقمار الصناعية وإنترنت الأشياء والبلوك تشين والعقود الآجلة مع التحليل المتقاطع المتقدم'
            : 'Comprehensive analysis of non-traditional data from satellites, IoT, blockchain, and futures with advanced cross-analytics'
          }
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-trading-card">
          <TabsTrigger value="dashboard">
            <Database className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'لوحة البيانات' : 'Data Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'التحليل المتقاطع' : 'Cross Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AlternativeDataDashboard lang={lang} />
        </TabsContent>

        <TabsContent value="analytics">
          <CrossDataAnalytics lang={lang} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlternativeData;
