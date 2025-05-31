
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
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';
import { backtestingService, BacktestConfiguration, BacktestResult, BacktestMetrics } from '@/services/backtestingService';

interface BacktestingDashboardProps {
  lang?: 'en' | 'ar';
}

const BacktestingDashboard = ({ lang = 'ar' }: BacktestingDashboardProps) => {
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<BacktestResult | null>(null);
  const [detailedMetrics, setDetailedMetrics] = useState<BacktestMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<BacktestConfiguration>({
    strategyId: 'scalping_ai_pro',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    endDate: new Date(),
    initialCapital: 10000,
    commission: 0.001,
    slippage: 0.0005,
    symbols: ['BTC/USDT', 'ETH/USDT'],
    timeframe: '15m',
    riskManagement: {
      maxDrawdown: 0.15,
      maxDailyLoss: 0.05,
      positionSizing: 'fixed'
    }
  });

  const strategies = [
    { id: 'scalping_ai_pro', name: 'AI Scalping Pro' },
    { id: 'trend_following_adaptive', name: 'Adaptive Trend Following' },
    { id: 'mean_reversion_ml', name: 'ML Mean Reversion' },
    { id: 'arbitrage_ai_hunter', name: 'AI Arbitrage Hunter' }
  ];

  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

  useEffect(() => {
    loadSampleBacktests();
  }, []);

  const loadSampleBacktests = async () => {
    // تحميل باك تيستات تجريبية
    const sampleResults: BacktestResult[] = [
      {
        strategyId: 'scalping_ai_pro',
        startDate: config.startDate.getTime(),
        endDate: config.endDate.getTime(),
        totalReturn: 15.67,
        annualizedReturn: 68.4,
        maxDrawdown: 8.3,
        sharpeRatio: 2.1,
        winRate: 0.72,
        totalTrades: 1567,
        profitFactor: 2.15,
        trades: [],
        equity: [],
        monthlyReturns: []
      },
      {
        strategyId: 'trend_following_adaptive',
        startDate: config.startDate.getTime(),
        endDate: config.endDate.getTime(),
        totalReturn: 23.45,
        annualizedReturn: 98.7,
        maxDrawdown: 12.1,
        sharpeRatio: 1.8,
        winRate: 0.68,
        totalTrades: 234,
        profitFactor: 2.45,
        trades: [],
        equity: [],
        monthlyReturns: []
      }
    ];
    
    setBacktestResults(sampleResults);
    if (sampleResults.length > 0) {
      setSelectedResult(sampleResults[0]);
    }
  };

  const runBacktest = async () => {
    setLoading(true);
    try {
      console.log('🔄 بدء الباك تيست...', config);
      
      const result = await backtestingService.runBacktest(config);
      const metrics = await backtestingService.getDetailedMetrics(result);
      
      setBacktestResults(prev => [result, ...prev]);
      setSelectedResult(result);
      setDetailedMetrics(metrics);
      
      console.log('✅ اكتمل الباك تيست بنجاح');
    } catch (error) {
      console.error('❌ خطأ في الباك تيست:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDetailedMetrics = async (result: BacktestResult) => {
    try {
      const metrics = await backtestingService.getDetailedMetrics(result);
      setDetailedMetrics(metrics);
    } catch (error) {
      console.error('خطأ في تحميل المؤشرات المفصلة:', error);
    }
  };

  const handleResultSelect = (result: BacktestResult) => {
    setSelectedResult(result);
    loadDetailedMetrics(result);
  };

  // بيانات الأسهم المحاكاة
  const equityData = selectedResult ? Array.from({ length: 90 }, (_, i) => ({
    date: new Date(selectedResult.startDate + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    equity: 10000 * (1 + (selectedResult.totalReturn / 100) * (i / 90) + (Math.random() - 0.5) * 0.02),
    drawdown: Math.random() * selectedResult.maxDrawdown
  })) : [];

  const monthlyData = selectedResult?.monthlyReturns.map(mr => ({
    month: mr.month,
    return: mr.return,
    trades: mr.trades
  })) || [];

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'مركز الباك تيست المتقدم' : 'Advanced Backtesting Center'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'اختبار وتحليل الاستراتيجيات على البيانات التاريخية' : 'Test and analyze strategies on historical data'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={runBacktest}
            disabled={loading}
            className="bg-trading-primary hover:bg-blue-600"
          >
            <Play className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? (lang === 'ar' ? 'جاري التشغيل...' : 'Running...') : (lang === 'ar' ? 'تشغيل باك تيست' : 'Run Backtest')}
          </Button>
        </div>
      </div>

      {/* إعدادات الباك تيست */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {lang === 'ar' ? 'إعدادات الباك تيست' : 'Backtest Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">الاستراتيجية</label>
              <select
                value={config.strategyId}
                onChange={(e) => setConfig(prev => ({ ...prev, strategyId: e.target.value }))}
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

            <div>
              <label className="text-sm text-gray-400 mb-2 block">رأس المال الأولي</label>
              <input
                type="number"
                value={config.initialCapital}
                onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">العمولة (%)</label>
              <input
                type="number"
                step="0.001"
                value={config.commission * 100}
                onChange={(e) => setConfig(prev => ({ ...prev, commission: Number(e.target.value) / 100 }))}
                className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
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
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">أقصى انسحاب (%)</label>
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
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* النتائج */}
      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="results">النتائج</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="trades">الصفقات</TabsTrigger>
          <TabsTrigger value="comparison">المقارنة</TabsTrigger>
          <TabsTrigger value="optimization">التحسين</TabsTrigger>
        </TabsList>

        {/* النتائج */}
        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* قائمة النتائج */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">نتائج الباك تيست</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {backtestResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleResultSelect(result)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer border transition-colors",
                        selectedResult === result 
                          ? 'bg-trading-primary/20 border-trading-primary' 
                          : 'bg-trading-secondary border-gray-700 hover:border-gray-600'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {strategies.find(s => s.id === result.strategyId)?.name}
                        </span>
                        <Badge 
                          variant={result.totalReturn > 0 ? 'default' : 'destructive'}
                          className={result.totalReturn > 0 ? 'bg-trading-up' : 'bg-trading-down'}
                        >
                          {result.totalReturn > 0 ? '+' : ''}{result.totalReturn.toFixed(2)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <div>صفقات: {result.totalTrades}</div>
                        <div>فوز: {(result.winRate * 100).toFixed(1)}%</div>
                        <div>شارب: {result.sharpeRatio.toFixed(2)}</div>
                        <div>انسحاب: {result.maxDrawdown.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ملخص النتيجة المختارة */}
            {selectedResult && (
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-trading-card border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-trading-up" />
                        <span className="text-xs text-gray-400">العائد الإجمالي</span>
                      </div>
                      <div className={cn(
                        "text-xl font-bold",
                        selectedResult.totalReturn >= 0 ? 'text-trading-up' : 'text-trading-down'
                      )}>
                        {selectedResult.totalReturn >= 0 ? '+' : ''}{selectedResult.totalReturn.toFixed(2)}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-trading-card border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-gray-400">نسبة شارب</span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {selectedResult.sharpeRatio.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-trading-card border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-gray-400">معدل الفوز</span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {(selectedResult.winRate * 100).toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-trading-card border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-trading-down" />
                        <span className="text-xs text-gray-400">أقصى انسحاب</span>
                      </div>
                      <div className="text-xl font-bold text-trading-down">
                        {selectedResult.maxDrawdown.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* منحنى الأسهم */}
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">منحنى الأسهم</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={equityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="equity" 
                            stroke="#22C55E" 
                            strokeWidth={2}
                            name="الأسهم"
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

        {/* الأداء المفصل */}
        <TabsContent value="performance" className="space-y-6">
          {detailedMetrics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-trading-card border-gray-800">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {detailedMetrics.volatility.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">التقلب السنوي</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {detailedMetrics.sortinoRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">نسبة سورتينو</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {detailedMetrics.calmarRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">نسبة كالمار</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {detailedMetrics.profitFactor.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">عامل الربح</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">إحصائيات الصفقات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">متوسط الربح:</span>
                          <span className="text-trading-up">${detailedMetrics.averageWin.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">متوسط الخسارة:</span>
                          <span className="text-trading-down">${detailedMetrics.averageLoss.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">أكبر ربح:</span>
                          <span className="text-trading-up">${detailedMetrics.largestWin.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">أكبر خسارة:</span>
                          <span className="text-trading-down">${detailedMetrics.largestLoss.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">انتصارات متتالية:</span>
                          <span className="text-white">{detailedMetrics.consecutiveWins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">خسائر متتالية:</span>
                          <span className="text-white">{detailedMetrics.consecutiveLosses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">VaR 95%:</span>
                          <span className="text-white">{(detailedMetrics.var95 * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected Shortfall:</span>
                          <span className="text-white">{(detailedMetrics.expectedShortfall * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">العائدات الشهرية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar 
                            dataKey="return" 
                            fill="#22C55E"
                            name="العائد الشهري"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* قائمة الصفقات */}
        <TabsContent value="trades" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">سجل الصفقات</CardTitle>
                <Button size="sm" className="bg-trading-primary hover:bg-blue-600">
                  <Download className="h-4 w-4 mr-2" />
                  تصدير CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">قائمة الصفقات</h3>
                <p className="text-gray-400">
                  سيتم عرض تفاصيل جميع الصفقات هنا بعد تشغيل الباك تيست
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* مقارنة الاستراتيجيات */}
        <TabsContent value="comparison" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">مقارنة الاستراتيجيات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">مقارنة شاملة</h3>
                <p className="text-gray-400">
                  قارن أداء استراتيجيات متعددة جنباً إلى جنب
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحسين الاستراتيجيات */}
        <TabsContent value="optimization" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">تحسين المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">تحسين تلقائي</h3>
                <p className="text-gray-400">
                  العثور على أفضل معاملات للاستراتيجية باستخدام خوارزميات التحسين
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestingDashboard;
