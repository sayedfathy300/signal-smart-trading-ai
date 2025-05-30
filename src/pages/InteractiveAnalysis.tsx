
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DrawingTools from '@/components/interactive-analysis/DrawingTools';
import CustomIndicatorBuilder from '@/components/interactive-analysis/CustomIndicatorBuilder';
import StrategyBacktesting from '@/components/interactive-analysis/StrategyBacktesting';
import PaperTradingSimulator from '@/components/interactive-analysis/PaperTradingSimulator';

interface InteractiveAnalysisProps {
  lang?: 'en' | 'ar';
}

const InteractiveAnalysis = ({ lang = 'ar' }: InteractiveAnalysisProps) => {
  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {lang === 'ar' ? 'التحليل التفاعلي المتقدم' : 'Advanced Interactive Analysis'}
        </h1>
        <p className="text-gray-400">
          {lang === 'ar' ? 'أدوات الرسم، بناء المؤشرات، اختبار الاستراتيجيات والتداول الورقي' : 'Drawing tools, indicator builder, strategy backtesting and paper trading'}
        </p>
      </div>

      {/* Interactive Analysis Tools */}
      <Tabs defaultValue="drawing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="drawing">
            {lang === 'ar' ? 'أدوات الرسم' : 'Drawing Tools'}
          </TabsTrigger>
          <TabsTrigger value="indicators">
            {lang === 'ar' ? 'بناء المؤشرات' : 'Indicator Builder'}
          </TabsTrigger>
          <TabsTrigger value="backtesting">
            {lang === 'ar' ? 'اختبار الاستراتيجيات' : 'Strategy Backtesting'}
          </TabsTrigger>
          <TabsTrigger value="paper-trading">
            {lang === 'ar' ? 'التداول الورقي' : 'Paper Trading'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drawing" className="space-y-6">
          <DrawingTools lang={lang} />
        </TabsContent>

        <TabsContent value="indicators" className="space-y-6">
          <CustomIndicatorBuilder lang={lang} />
        </TabsContent>

        <TabsContent value="backtesting" className="space-y-6">
          <StrategyBacktesting lang={lang} />
        </TabsContent>

        <TabsContent value="paper-trading" className="space-y-6">
          <PaperTradingSimulator lang={lang} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveAnalysis;
