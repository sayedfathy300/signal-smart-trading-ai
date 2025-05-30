
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeatherData from '@/components/alternative-data/WeatherData';
import SupplyChainData from '@/components/alternative-data/SupplyChainData';
import PatentAnalysis from '@/components/alternative-data/PatentAnalysis';
import ExecutiveSentiment from '@/components/alternative-data/ExecutiveSentiment';
import { Cloud, Truck, FileText, User } from 'lucide-react';

interface AlternativeDataProps {
  lang?: 'en' | 'ar';
}

const AlternativeData = ({ lang = 'ar' }: AlternativeDataProps) => {
  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'مصادر البيانات البديلة' : 'Alternative Data Sources'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'تحليل شامل للبيانات غير التقليدية: الطقس، سلاسل التوريد، براءات الاختراع، والمشاعر التنفيذية'
              : 'Comprehensive analysis of non-traditional data: weather, supply chains, patents, and executive sentiment'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 rounded-lg border border-green-700">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm">
              {lang === 'ar' ? 'البيانات محدثة' : 'Data Updated'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="weather" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="weather" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            {lang === 'ar' ? 'بيانات الطقس' : 'Weather Data'}
          </TabsTrigger>
          <TabsTrigger value="supply-chain" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            {lang === 'ar' ? 'سلاسل التوريد' : 'Supply Chain'}
          </TabsTrigger>
          <TabsTrigger value="patents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {lang === 'ar' ? 'براءات الاختراع' : 'Patent Analysis'}
          </TabsTrigger>
          <TabsTrigger value="executive-sentiment" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {lang === 'ar' ? 'المشاعر التنفيذية' : 'Executive Sentiment'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weather">
          <WeatherData lang={lang} />
        </TabsContent>

        <TabsContent value="supply-chain">
          <SupplyChainData lang={lang} />
        </TabsContent>

        <TabsContent value="patents">
          <PatentAnalysis lang={lang} />
        </TabsContent>

        <TabsContent value="executive-sentiment">
          <ExecutiveSentiment lang={lang} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlternativeData;
