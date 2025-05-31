
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  DollarSign,
  Activity,
  RefreshCw,
  Settings,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';
import { backtestingService, BacktestConfiguration, BacktestResult, BacktestMetrics } from '@/services/backtestingService';
import { toast } from 'sonner';

interface BacktestingDashboardProps {
  lang?: 'en' | 'ar';
}

const BacktestingDashboard = ({ lang = 'ar' }: BacktestingDashboardProps) => {
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<BacktestResult | null>(null);
  const [detailedMetrics, setDetailedMetrics] = useState<BacktestMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [config, setConfig] = useState<BacktestConfiguration>({
    strategyId: 'scalping_ai_pro',
    strategy: 'AI Scalping Pro',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    initialCapital: 10000,
    commission: 0.001,
    slippage: 0.0005,
    symbol: 'BTC/USDT',
    symbols: ['BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'DOT/USDT'],
    timeframe: '15m',
    riskPerTrade: 0.02,
    maxDrawdown: 0.15,
    riskManagement: {
      maxDrawdown: 0.15,
      maxDailyLoss: 0.05,
      positionSizing: 'fixed'
    }
  });

  const strategies = [
    { id: 'scalping_ai_pro', name: 'AI Scalping Pro' },
    { id: 'trend_following_adaptive', name: 'Adaptive Trend Following' },
    { id: 'sma_crossover', name: 'SMA Crossover' },
    { id: 'rsi_oversold', name: 'RSI Strategy' },
    { id: 'bollinger_bands', name: 'Bollinger Bands' }
  ];

  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
  const symbols = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'DOT/USDT', 'MATIC/USDT', 'SOL/USDT'];

  useEffect(() => {
    loadSampleBacktests();
  }, []);

  const loadSampleBacktests = async () => {
    try {
      const sampleResults: BacktestResult[] = [
        {
          strategyId: 'scalping_ai_pro',
          strategy: 'AI Scalping Pro',
          startDate: config.startDate,
          endDate: config.endDate,
          totalReturn: 1567.89,
          totalReturnPercent: 15.67,
          annualizedReturn: 68.4,
          maxDrawdown: 8.3,
          sharpeRatio: 2.1,
          sortinoRatio: 2.5,
          winRate: 0.72,
          profitFactor: 2.15,
          totalTrades: 1567,
          winningTrades: 1128,
          losingTrades: 439,
          avgWin: 12.5,
          avgLoss: -8.2,
          largestWin: 156.7,
          largestLoss: -89.3,
          avgTradeDuration: 45.2,
          volatility: 18.5,
          calmarRatio: 1.88,
          trades: [],
          equity: [],
          equityCurve: [],
          monthlyReturns: [],
          performanceMetrics: {
            totalDays: 90,
            tradingDays: 252,
            bestDay: 5.2,
            worstDay: -3.1,
            consecutiveWins: 12,
            consecutiveLosses: 5
          }
        },
        {
          strategyId: 'trend_following_adaptive',
          strategy: 'Adaptive Trend Following',
          startDate: config.startDate,
          endDate: config.endDate,
          totalReturn: 2345.67,
          totalReturnPercent: 23.45,
          annualizedReturn: 98.7,
          maxDrawdown: 12.1,
          sharpeRatio: 1.8,
          sortinoRatio: 2.2,
          winRate: 0.68,
          profitFactor: 2.45,
          totalTrades: 234,
          winningTrades: 159,
          losingTrades: 75,
          avgWin: 28.7,
          avgLoss: -15.3,
          largestWin: 287.5,
          largestLoss: -145.2,
          avgTradeDuration: 120.5,
          volatility: 22.3,
          calmarRatio: 1.94,
          trades: [],
          equity: [],
          equityCurve: [],
          monthlyReturns: [],
          performanceMetrics: {
            totalDays: 90,
            tradingDays: 252,
            bestDay: 8.1,
            worstDay: -4.7,
            consecutiveWins: 8,
            consecutiveLosses: 3
          }
        }
      ];
      
      setBacktestResults(sampleResults);
      if (sampleResults.length > 0) {
        setSelectedResult(sampleResults[0]);
        await loadDetailedMetrics(sampleResults[0]);
      }
      
      toast.success('تم تحميل البيانات التجريبية بنجاح');
    } catch (error) {
      console.error('خطأ في تحميل البيانات التجريبية:', error);
      toast.error('فشل في تحميل البيانات التجريبية');
    }
  };

  const runBacktest = async () => {
    setLoading(true);
    try {
      console.log('🔄 بدء الباك تيست...', config);
      toast.info('جاري تشغيل الباك تيست...');
      
      const result = await backtestingService.runBacktest(config);
      const metrics = backtestingService.getDetailedMetrics(result);
      
      setBacktestResults(prev => [result, ...prev]);
      setSelectedResult(result);
      setDetailedMetrics(metrics);
      
      console.log('✅ اكتمل الباك تيست بنجاح');
      toast.success('تم تشغيل الباك تيست بنجاح');
    } catch (error) {
      console.error('❌ خطأ في الباك تيست:', error);
      toast.error('فشل في تشغيل الباك تيست');
    } finally {
      setLoading(false);
    }
  };

  const optimizeStrategy = async () => {
    if (!selectedResult) return;
    
    setOptimizing(true);
    try {
      toast.info('جاري تحسين الاستراتيجية...');
      
      const optimization = await backtestingService.optimizeStrategy(
        selectedResult.strategyId, 
        { shortPeriod: 10, longPeriod: 30 }
      );
      
      console.log('🔧 نتائج التحسين:', optimization);
      toast.success(`تم تحسين الاستراتيجية بنسبة ${optimization.improvementPercent.toFixed(1)}%`);
    } catch (error) {
      console.error('خطأ في تحسين الاستراتيجية:', error);
      toast.error('فشل في تحسين الاستراتيجية');
    } finally {
      setOptimizing(false);
    }
  };

  const loadDetailedMetrics = async (result: BacktestResult) => {
    try {
      const metrics = backtestingService.getDetailedMetrics(result);
      setDetailedMetrics(metrics);
    } catch (error) {
      console.error('خطأ في تحميل المؤشرات المفصلة:', error);
      toast.error('فشل في تحميل المؤشرات المفصلة');
    }
  };

  const handleResultSelect = (result: BacktestResult) => {
    setSelectedResult(result);
    loadDetailedMetrics(result);
  };

  const exportResults = () => {
    if (!selectedResult) return;
    
    try {
      const csvContent = [
        ['المؤشر', 'القيمة'],
        ['الاستراتيجية', selectedResult.strategy || ''],
        ['العائد الإجمالي %', selectedResult.totalReturnPercent.toFixed(2)],
        ['العائد السنوي %', selectedResult.annualizedReturn.toFixed(2)],
        ['أقصى انسحاب %', selectedResult.maxDrawdown.toFixed(2)],
        ['نسبة شارب', selectedResult.sharpeRatio.toFixed(2)],
        ['معدل الفوز %', (selectedResult.winRate * 100).toFixed(1)],
        ['عدد الصفقات', selectedResult.totalTrades.toString()],
        ['عامل الربح', selectedResult.profitFactor.toFixed(2)]
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `backtest_results_${selectedResult.strategyId}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toast.success('تم تصدير النتائج بنجاح');
    } catch (error) {
      console.error('خطأ في تصدير النتائج:', error);
      toast.error('فشل في تصدير النتائج');
    }
  };

  // توليد بيانات منحنى الأسهم
  const generateEquityData = (result: BacktestResult) => {
    const days = 90;
    const startTime = new Date(result.startDate).getTime();
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(startTime + i * 24 * 60 * 60 * 1000);
      const progress = i / (days - 1);
      const randomVariation = (Math.random() - 0.5) * 0.02;
      
      return {
        date: date.toLocaleDateString('ar-SA'),
        equity: 10000 * (1 + (result.totalReturnPercent / 100) * progress + randomVariation),
        drawdown: Math.random() * result.maxDrawdown * (1 - progress * 0.5)
      };
    });
  };

  // توليد البيانات الشهرية
  const generateMonthlyData = () => {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    return months.map(month => ({
      month,
      return: (Math.random() - 0.4) * 20,
      trades: Math.floor(Math.random() * 50) + 10
    }));
  };

  const equityData = selectedResult ? generateEquityData(selectedResult) : [];
  const monthlyData = generateMonthlyData();

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'مركز الباك تيست المتقدم' : 'Advanced Backtesting Center'}
          </h1>
          <p className="text-gray-400 mt-2">
            {lang === 'ar' ? 'اختبار وتحليل الاستراتيجيات على البيانات التاريخية مع ذكاء اصطناعي متقدم' : 'Test and analyze strategies on historical data with advanced AI'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={optimizeStrategy}
            disabled={optimizing || !selectedResult}
            variant="outline"
            className="border-trading-primary text-trading-primary hover:bg-trading-primary hover:text-white"
          >
            <Settings className={`h-4 w-4 mr-2 ${optimizing ? 'animate-spin' : ''}`} />
            {optimizing ? 'جاري التحسين...' : 'تحسين الاستراتيجية'}
          </Button>
          
          <Button
            onClick={runBacktest}
            disabled={loading}
            className="bg-trading-primary hover:bg-blue-600"
          >
            <Play className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'جاري التشغيل...' : 'تشغيل باك تيست'}
          </Button>
        </div>
      </div>

      {/* إعدادات الباك تيست */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {lang === 'ar' ? 'إعدادات الباك تيست المتقدمة' : 'Advanced Backtest Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* الإعدادات الأساسية */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">الإعدادات الأساسية</h3>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">الاستراتيجية</label>
                <select
                  value={config.strategyId}
                  onChange={(e) => {
                    const strategy = strategies.find(s => s.id === e.target.value);
                    setConfig(prev => ({ 
                      ...prev, 
                      strategyId: e.target.value, 
                      strategy: strategy?.name || e.target.value 
                    }));
                  }}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                >
                  {strategies.map(strategy => (
                    <option key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">الرمز الأساسي</label>
                <select
                  value={config.symbol}
                  onChange={(e) => setConfig(prev => ({ ...prev, symbol: e.target.value }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                >
                  {symbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">الإطار الزمني</label>
                <select
                  value={config.timeframe}
                  onChange={(e) => setConfig(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                >
                  {timeframes.map(tf => (
                    <option key={tf} value={tf}>{tf}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* إعدادات رأس المال */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">إدارة رأس المال</h3>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">رأس المال الأولي ($)</label>
                <input
                  type="number"
                  value={config.initialCapital}
                  onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                  min="1000"
                  step="1000"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">المخاطرة لكل صفقة (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.riskPerTrade * 100}
                  onChange={(e) => setConfig(prev => ({ ...prev, riskPerTrade: Number(e.target.value) / 100 }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                  min="0.1"
                  max="10"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">أقصى انسحاب مسموح (%)</label>
                <input
                  type="number"
                  value={config.riskManagement.maxDrawdown * 100}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    riskManagement: { 
                      ...prev.riskManagement, 
                      maxDrawdown: Number(e.target.value) / 100 
                    }
                  }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            {/* إعدادات التكاليف */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">تكاليف التداول</h3>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">العمولة (%)</label>
                <input
                  type="number"
                  step="0.001"
                  value={config.commission * 100}
                  onChange={(e) => setConfig(prev => ({ ...prev, commission: Number(e.target.value) / 100 }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                  min="0"
                  max="1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">الانزلاق (%)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={config.slippage * 100}
                  onChange={(e) => setConfig(prev => ({ ...prev, slippage: Number(e.target.value) / 100 }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                  min="0"
                  max="1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">أقصى خسارة يومية (%)</label>
                <input
                  type="number"
                  value={config.riskManagement.maxDailyLoss * 100}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    riskManagement: { 
                      ...prev.riskManagement, 
                      maxDailyLoss: Number(e.target.value) / 100 
                    }
                  }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                  min="1"
                  max="20"
                />
              </div>
            </div>

            {/* إعدادات التواريخ */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">فترة الاختبار</h3>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">تاريخ البداية</label>
                <input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">تاريخ النهاية</label>
                <input
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">نوع حجم المركز</label>
                <select
                  value={config.riskManagement.positionSizing}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    riskManagement: { 
                      ...prev.riskManagement, 
                      positionSizing: e.target.value 
                    }
                  }))}
                  className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                >
                  <option value="fixed">ثابت</option>
                  <option value="percentage">نسبة مئوية</option>
                  <option value="kelly">معادلة كيلي</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* النتائج */}
      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="results">النتائج الشاملة</TabsTrigger>
          <TabsTrigger value="performance">تحليل الأداء</TabsTrigger>
          <TabsTrigger value="trades">سجل الصفقات</TabsTrigger>
          <TabsTrigger value="comparison">المقارنة المتقدمة</TabsTrigger>
          <TabsTrigger value="optimization">التحسين الذكي</TabsTrigger>
        </TabsList>

        {/* النتائج الشاملة */}
        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* قائمة النتائج */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">نتائج الباك تيست</CardTitle>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {backtestResults.length} نتيجة
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {backtestResults.map((result, index) => (
                    <div
                      key={`${result.strategyId}_${index}`}
                      onClick={() => handleResultSelect(result)}
                      className={cn(
                        "p-4 rounded-lg cursor-pointer border transition-all duration-300 hover:shadow-lg",
                        selectedResult === result 
                          ? 'bg-trading-primary/20 border-trading-primary shadow-lg' 
                          : 'bg-trading-secondary border-gray-700 hover:border-gray-600'
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-white">
                          {result.strategy}
                        </span>
                        <Badge 
                          variant={result.totalReturnPercent > 0 ? 'default' : 'destructive'}
                          className={cn(
                            "font-bold",
                            result.totalReturnPercent > 0 ? 'bg-trading-up text-white' : 'bg-trading-down text-white'
                          )}
                        >
                          {result.totalReturnPercent > 0 ? '+' : ''}{result.totalReturnPercent.toFixed(2)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">صفقات:</span>
                          <span className="text-white font-medium">{result.totalTrades}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">فوز:</span>
                          <span className="text-trading-up font-medium">{(result.winRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">شارب:</span>
                          <span className="text-blue-400 font-medium">{result.sharpeRatio.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">انسحاب:</span>
                          <span className="text-trading-down font-medium">{result.maxDrawdown.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">من {result.startDate}</span>
                          <span className="text-gray-400">إلى {result.endDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {backtestResults.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">لا توجد نتائج باك تيست حتى الآن</p>
                      <p className="text-gray-500 text-sm mt-1">قم بتشغيل باك تيست لرؤية النتائج</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ملخص النتيجة المختارة */}
            {selectedResult && (
              <div className="lg:col-span-2 space-y-6">
                {/* البطاقات الرئيسية */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-trading-card border-gray-800 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-trading-up" />
                        <span className="text-xs text-gray-400">العائد الإجمالي</span>
                      </div>
                      <div className={cn(
                        "text-xl font-bold",
                        selectedResult.totalReturnPercent >= 0 ? 'text-trading-up' : 'text-trading-down'
                      )}>
                        {selectedResult.totalReturnPercent >= 0 ? '+' : ''}{selectedResult.totalReturnPercent.toFixed(2)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ${selectedResult.totalReturn.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-trading-card border-gray-800 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-gray-400">نسبة شارب</span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {selectedResult.sharpeRatio.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        سورتينو: {selectedResult.sortinoRatio.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-trading-card border-gray-800 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-gray-400">معدل الفوز</span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {(selectedResult.winRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedResult.winningTrades}/{selectedResult.totalTrades} صفقة
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-trading-card border-gray-800 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-trading-down" />
                        <span className="text-xs text-gray-400">أقصى انسحاب</span>
                      </div>
                      <div className="text-xl font-bold text-trading-down">
                        {selectedResult.maxDrawdown.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        كالمار: {selectedResult.calmarRatio.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* منحنى الأسهم */}
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">منحنى الأسهم التفاعلي</CardTitle>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={exportResults}
                        className="border-trading-primary text-trading-primary hover:bg-trading-primary hover:text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        تصدير
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={equityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF" 
                            fontSize={12}
                            tick={{ fill: '#9CA3AF' }}
                          />
                          <YAxis 
                            stroke="#9CA3AF" 
                            fontSize={12}
                            tick={{ fill: '#9CA3AF' }}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#ffffff'
                            }}
                            formatter={(value: any, name: string) => [
                              `$${Number(value).toLocaleString()}`,
                              name === 'equity' ? 'رأس المال' : 'الانسحاب'
                            ]}
                            labelFormatter={(label) => `التاريخ: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="equity" 
                            stroke="#22C55E" 
                            strokeWidth={3}
                            name="equity"
                            dot={false}
                            activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="drawdown" 
                            stroke="#EF4444" 
                            strokeWidth={2}
                            name="drawdown"
                            dot={false}
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* تحليل الأداء المفصل */}
        <TabsContent value="performance" className="space-y-6">
          {detailedMetrics && selectedResult && (
            <>
              {/* مؤشرات المخاطر والعائد */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-trading-card border-gray-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {detailedMetrics.volatility.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">التقلب السنوي</div>
                    <div className="text-xs text-gray-500 mt-1">
                      VaR 95%: {detailedMetrics.var95.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {detailedMetrics.sortinoRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">نسبة سورتينو</div>
                    <div className="text-xs text-gray-500 mt-1">
                      معدل العائد الشهري: {detailedMetrics.returnMetrics.monthlyReturn.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {detailedMetrics.calmarRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">نسبة كالمار</div>
                    <div className="text-xs text-gray-500 mt-1">
                      العائد اليومي: {detailedMetrics.returnMetrics.dailyReturn.toFixed(3)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">
                      {detailedMetrics.profitFactor.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">عامل الربح</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ES: {detailedMetrics.expectedShortfall.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* إحصائيات تفصيلية */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">إحصائيات الصفقات التفصيلية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">متوسط الربح:</span>
                          <span className="text-trading-up font-bold">${detailedMetrics.averageWin.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">متوسط الخسارة:</span>
                          <span className="text-trading-down font-bold">${detailedMetrics.averageLoss.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">أكبر ربح:</span>
                          <span className="text-trading-up font-bold">${detailedMetrics.largestWin.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">أكبر خسارة:</span>
                          <span className="text-trading-down font-bold">${detailedMetrics.largestLoss.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">انتصارات متتالية:</span>
                          <span className="text-trading-up font-bold">{detailedMetrics.consecutiveWins}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">خسائر متتالية:</span>
                          <span className="text-trading-down font-bold">{detailedMetrics.consecutiveLosses}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">متوسط مدة الصفقة:</span>
                          <span className="text-white font-bold">{detailedMetrics.tradeMetrics.avgTradeDuration.toFixed(1)}h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">نسبة المعلومات:</span>
                          <span className="text-blue-400 font-bold">{detailedMetrics.ratioMetrics.informationRatio.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <h4 className="text-white font-semibold mb-3">مؤشرات المخاطر المتقدمة</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Value at Risk (95%):</span>
                          <span className="text-red-400">{detailedMetrics.riskMetrics.valueAtRisk.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected Shortfall:</span>
                          <span className="text-red-400">{detailedMetrics.riskMetrics.expectedShortfall.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">توزيع العائدات الشهرية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#9CA3AF" 
                            fontSize={10}
                            tick={{ fill: '#9CA3AF' }}
                          />
                          <YAxis 
                            stroke="#9CA3AF" 
                            fontSize={12}
                            tick={{ fill: '#9CA3AF' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#ffffff'
                            }}
                            formatter={(value: any, name: string) => [
                              `${Number(value).toFixed(2)}%`,
                              name === 'return' ? 'العائد الشهري' : 'عدد الصفقات'
                            ]}
                          />
                          <Bar 
                            dataKey="return" 
                            fill="#22C55E"
                            name="return"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* مؤشرات الأداء الإضافية */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">مؤشرات الأداء المتقدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">مؤشرات العائد</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">العائد الإجمالي:</span>
                          <span className="text-white">{detailedMetrics.returnMetrics.totalReturn.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">العائد السنوي:</span>
                          <span className="text-white">{detailedMetrics.returnMetrics.annualizedReturn.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">العائد الشهري:</span>
                          <span className="text-white">{detailedMetrics.returnMetrics.monthlyReturn.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">العائد اليومي:</span>
                          <span className="text-white">{detailedMetrics.returnMetrics.dailyReturn.toFixed(3)}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">مؤشرات المخاطر</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">التقلب:</span>
                          <span className="text-yellow-400">{detailedMetrics.riskMetrics.volatility.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">أقصى انسحاب:</span>
                          <span className="text-red-400">{detailedMetrics.riskMetrics.maxDrawdown.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">VaR:</span>
                          <span className="text-red-400">{detailedMetrics.riskMetrics.valueAtRisk.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ES:</span>
                          <span className="text-red-400">{detailedMetrics.riskMetrics.expectedShortfall.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">نسب الأداء</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">شارب:</span>
                          <span className="text-blue-400">{detailedMetrics.ratioMetrics.sharpeRatio.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">سورتينو:</span>
                          <span className="text-purple-400">{detailedMetrics.ratioMetrics.sortinoRatio.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">كالمار:</span>
                          <span className="text-yellow-400">{detailedMetrics.ratioMetrics.calmarRatio.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">المعلومات:</span>
                          <span className="text-green-400">{detailedMetrics.ratioMetrics.informationRatio.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* سجل الصفقات */}
        <TabsContent value="trades" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">سجل الصفقات التفصيلي</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-trading-primary text-trading-primary">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    تحديث
                  </Button>
                  <Button size="sm" className="bg-trading-primary hover:bg-blue-600">
                    <Download className="h-4 w-4 mr-2" />
                    تصدير الصفقات
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">سجل الصفقات المتطور</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  سيتم عرض تفاصيل جميع الصفقات مع التحليل المتقدم والإحصائيات الشاملة بعد تشغيل الباك تيست
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-trading-up mx-auto mb-2" />
                    <div className="text-sm text-gray-400">صفقات رابحة</div>
                  </div>
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-trading-down mx-auto mb-2" />
                    <div className="text-sm text-gray-400">صفقات خاسرة</div>
                  </div>
                  <div className="text-center">
                    <Activity className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">تحليل الأداء</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* المقارنة المتقدمة */}
        <TabsContent value="comparison" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">مقارنة الاستراتيجيات المتقدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">مقارنة شاملة ومتطورة</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  قارن أداء عدة استراتيجيات جنباً إلى جنب مع تحليل متقدم للمخاطر والعوائد
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <TrendingUp className="h-8 w-8 text-trading-up mx-auto mb-2" />
                    <div className="text-sm text-gray-400">مقارنة العوائد</div>
                  </div>
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <TrendingDown className="h-8 w-8 text-trading-down mx-auto mb-2" />
                    <div className="text-sm text-gray-400">تحليل المخاطر</div>
                  </div>
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <Activity className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">نسب الأداء</div>
                  </div>
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">إحصائيات الصفقات</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التحسين الذكي */}
        <TabsContent value="optimization" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">تحسين المعاملات بالذكاء الاصطناعي</CardTitle>
                <Button 
                  onClick={optimizeStrategy}
                  disabled={optimizing || !selectedResult}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Settings className={`h-4 w-4 mr-2 ${optimizing ? 'animate-spin' : ''}`} />
                  {optimizing ? 'جاري التحسين...' : 'بدء التحسين الذكي'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">تحسين تلقائي متقدم</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  استخدم خوارزميات الذكاء الاصطناعي للعثور على أفضل معاملات للاستراتيجية وتحسين الأداء
                </p>
                
                {selectedResult && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                    <div className="text-center p-6 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        {selectedResult.sharpeRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">نسبة شارب الحالية</div>
                      <div className="text-xs text-gray-500 mt-1">قابلة للتحسين</div>
                    </div>
                    
                    <div className="text-center p-6 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-trading-up mb-2">
                        {(selectedResult.winRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">معدل الفوز الحالي</div>
                      <div className="text-xs text-gray-500 mt-1">هدف: 75%+</div>
                    </div>
                    
                    <div className="text-center p-6 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-purple-400 mb-2">
                        {selectedResult.profitFactor.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">عامل الربح الحالي</div>
                      <div className="text-xs text-gray-500 mt-1">هدف: 2.5+</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                    <Activity className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">تحسين المؤشرات</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                    <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">ضبط المعاملات</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <Settings className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">خوارزميات ML</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                    <CheckCircle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">تحقق تلقائي</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestingDashboard;
