
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Activity,
  Zap,
  RefreshCw,
  Settings
} from 'lucide-react';
import { CandlestickChart } from '@/components/CandlestickChart';

interface ChartsProps {
  lang?: 'en' | 'ar';
}

const Charts = ({ lang = 'ar' }: ChartsProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState('EUR/USD');
  const [timeframe, setTimeframe] = useState('1day');
  const [loading, setLoading] = useState(false);

  const symbols = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD',
    'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAUUSD', 'XAGUSD',
    'WTI', 'BRENT', 'BTC/USD', 'ETH/USD'
  ];

  const timeframes = [
    { value: '1min', label: lang === 'ar' ? '1 دقيقة' : '1 Minute' },
    { value: '5min', label: lang === 'ar' ? '5 دقائق' : '5 Minutes' },
    { value: '15min', label: lang === 'ar' ? '15 دقيقة' : '15 Minutes' },
    { value: '30min', label: lang === 'ar' ? '30 دقيقة' : '30 Minutes' },
    { value: '1hour', label: lang === 'ar' ? '1 ساعة' : '1 Hour' },
    { value: '4hour', label: lang === 'ar' ? '4 ساعات' : '4 Hours' },
    { value: '1day', label: lang === 'ar' ? '1 يوم' : '1 Day' },
    { value: '1week', label: lang === 'ar' ? '1 أسبوع' : '1 Week' }
  ];

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
            {lang === 'ar' ? 'الرسوم البيانية المتقدمة' : 'Advanced Charts'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'تحليل الشموع اليابانية والأنماط الفنية' : 'Japanese Candlestick and Technical Pattern Analysis'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
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
      </div>

      {/* أدوات التحكم */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {lang === 'ar' ? 'إعدادات الرسم البياني' : 'Chart Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {lang === 'ar' ? 'زوج العملات' : 'Currency Pair'}
              </label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="bg-trading-secondary border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-700">
                  {symbols.map(symbol => (
                    <SelectItem key={symbol} value={symbol} className="text-white hover:bg-gray-700">
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {lang === 'ar' ? 'الإطار الزمني' : 'Timeframe'}
              </label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-trading-secondary border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-700">
                  {timeframes.map(tf => (
                    <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-gray-700">
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleRefresh}
                className="w-full bg-trading-up hover:bg-green-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تطبيق التغييرات' : 'Apply Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الرسوم البيانية */}
      <Tabs defaultValue="candlestick" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-trading-card">
          <TabsTrigger value="candlestick">
            {lang === 'ar' ? 'الشموع اليابانية' : 'Candlesticks'}
          </TabsTrigger>
          <TabsTrigger value="technical">
            {lang === 'ar' ? 'المؤشرات الفنية' : 'Technical Indicators'}
          </TabsTrigger>
          <TabsTrigger value="patterns">
            {lang === 'ar' ? 'الأنماط الفنية' : 'Chart Patterns'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="candlestick" className="space-y-6">
          <CandlestickChart 
            symbol={selectedSymbol}
            timeframe={timeframe}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {lang === 'ar' ? 'المؤشرات الفنية المتقدمة' : 'Advanced Technical Indicators'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CandlestickChart 
                symbol={selectedSymbol}
                timeframe={timeframe}
                lang={lang}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {lang === 'ar' ? 'أنماط الرسوم البيانية' : 'Chart Patterns Recognition'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CandlestickChart 
                symbol={selectedSymbol}
                timeframe={timeframe}
                lang={lang}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Charts;
