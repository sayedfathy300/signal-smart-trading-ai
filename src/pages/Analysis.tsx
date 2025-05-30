
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  BarChart3, 
  Globe,
  TrendingUp,
  Zap,
  RefreshCw,
  Building2
} from 'lucide-react';
import { FundamentalAnalysis } from '@/components/FundamentalAnalysis';
import { SentimentAnalysis } from '@/components/SentimentAnalysis';

interface AnalysisProps {
  lang?: 'en' | 'ar';
}

const Analysis = ({ lang = 'ar' }: AnalysisProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'التحليل المتقدم' : 'Advanced Analysis'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'تحليل شامل للأسواق والأصول المالية' : 'Comprehensive Market and Asset Analysis'}
          </p>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={loading}
          size="sm"
          className="bg-trading-primary hover:bg-blue-600"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? (lang === 'ar' ? 'جاري التحديث...' : 'Updating...') : (lang === 'ar' ? 'تحديث' : 'Refresh')}
        </Button>
      </div>

      {/* التحليلات */}
      <Tabs defaultValue="fundamental" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="fundamental">
            {lang === 'ar' ? 'التحليل الأساسي' : 'Fundamental'}
          </TabsTrigger>
          <TabsTrigger value="sentiment">
            {lang === 'ar' ? 'تحليل المشاعر' : 'Sentiment'}
          </TabsTrigger>
          <TabsTrigger value="technical">
            {lang === 'ar' ? 'التحليل الفني' : 'Technical'}
          </TabsTrigger>
          <TabsTrigger value="economic">
            {lang === 'ar' ? 'التحليل الاقتصادي' : 'Economic'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fundamental" className="space-y-6">
          <FundamentalAnalysis 
            symbol={selectedSymbol}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <SentimentAnalysis 
            symbol={selectedSymbol}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {lang === 'ar' ? 'التحليل الفني المتقدم' : 'Advanced Technical Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {lang === 'ar' ? 'التحليل الفني المتطور' : 'Advanced Technical Analysis'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {lang === 'ar' ? 'تحليل المؤشرات الفنية والأنماط المتقدمة' : 'Advanced technical indicators and pattern analysis'}
                </p>
                <Button className="bg-trading-primary hover:bg-blue-600">
                  <Zap className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'بدء التحليل الفني' : 'Start Technical Analysis'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economic" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {lang === 'ar' ? 'التحليل الاقتصادي العالمي' : 'Global Economic Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {lang === 'ar' ? 'المؤشرات الاقتصادية العالمية' : 'Global Economic Indicators'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {lang === 'ar' ? 'تحليل المؤشرات الاقتصادية وتأثيرها على الأسواق' : 'Analyze economic indicators and their market impact'}
                </p>
                <Button className="bg-trading-up hover:bg-green-600">
                  <Globe className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'عرض المؤشرات الاقتصادية' : 'View Economic Indicators'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;
