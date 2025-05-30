
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Activity, 
  Timer,
  Layers,
  TrendingUp,
  AlertTriangle,
  Play,
  Square,
  Settings,
  Wifi,
  Cpu,
  Network,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { cn } from '@/lib/utils';
import { 
  hftService, 
  HFTStrategy, 
  LatencyMetrics, 
  OrderBook, 
  ArbitrageOpportunity 
} from '@/services/highFrequencyTradingService';
import { toast } from 'sonner';

interface HighFrequencyTradingProps {
  lang?: 'en' | 'ar';
}

const HighFrequencyTrading = ({ lang = 'ar' }: HighFrequencyTradingProps) => {
  const [strategies, setStrategies] = useState<HFTStrategy[]>([]);
  const [latencyMetrics, setLatencyMetrics] = useState<Map<string, LatencyMetrics>>(new Map());
  const [orderBooks, setOrderBooks] = useState<Map<string, OrderBook>>(new Map());
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  useEffect(() => {
    loadData();
    
    // تحديث البيانات كل ثانية
    const interval = setInterval(() => {
      if (isActive) {
        updateRealTimeData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const loadData = () => {
    setStrategies(hftService.getStrategies());
    setLatencyMetrics(hftService.getLatencyMetrics());
    setOrderBooks(hftService.getOrderBooks());
    setArbitrageOpportunities(hftService.getArbitrageOpportunities());
    setPerformanceMetrics(hftService.getPerformanceMetrics());
  };

  const updateRealTimeData = () => {
    setLatencyMetrics(new Map(hftService.getLatencyMetrics()));
    setOrderBooks(new Map(hftService.getOrderBooks()));
    setArbitrageOpportunities([...hftService.getArbitrageOpportunities()]);
    setPerformanceMetrics(hftService.getPerformanceMetrics());
  };

  const handleStartHFT = async () => {
    setLoading(true);
    try {
      await hftService.startHFT();
      setIsActive(true);
      toast.success('تم بدء التداول عالي التردد! ⚡');
    } catch (error) {
      toast.error('فشل في بدء التداول عالي التردد');
    } finally {
      setLoading(false);
    }
  };

  const handleStopHFT = async () => {
    setLoading(true);
    try {
      await hftService.stopHFT();
      setIsActive(false);
      toast.info('تم إيقاف التداول عالي التردد');
    } catch (error) {
      toast.error('فشل في إيقاف التداول عالي التردد');
    } finally {
      setLoading(false);
    }
  };

  const handleStrategyToggle = (strategyId: string, enabled: boolean) => {
    hftService.updateStrategyStatus(strategyId, enabled);
    setStrategies(prev => prev.map(s => 
      s.id === strategyId ? { ...s, enabled } : s
    ));
    toast.info(`تم ${enabled ? 'تفعيل' : 'إيقاف'} الاستراتيجية`);
  };

  // تحويل خريطة الكمون إلى مصفوفة للرسوم البيانية
  const latencyData = Array.from(latencyMetrics.entries()).map(([exchange, metrics]) => ({
    exchange,
    latency: metrics.averageLatency,
    execution: metrics.orderExecutionTime,
    network: metrics.networkLatency,
    jitter: metrics.jitter
  }));

  // بيانات دفتر الأوامر للعرض
  const orderBookData = Array.from(orderBooks.values()).map(book => {
    const spread = book.asks[0]?.price - book.bids[0]?.price || 0;
    const midPrice = ((book.asks[0]?.price || 0) + (book.bids[0]?.price || 0)) / 2;
    
    return {
      symbol: book.symbol,
      spread,
      midPrice,
      bidVolume: book.bids.slice(0, 5).reduce((sum, level) => sum + level.size, 0),
      askVolume: book.asks.slice(0, 5).reduce((sum, level) => sum + level.size, 0),
      timestamp: book.timestamp
    };
  });

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'التداول عالي التردد (HFT)' : 'High Frequency Trading (HFT)'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'نظام تداول متقدم بسرعة البرق مع تحسين الكمون' : 'Lightning-fast advanced trading system with latency optimization'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2",
            isActive 
              ? 'bg-green-500/20 text-green-400 animate-pulse' 
              : 'bg-gray-500/20 text-gray-400'
          )}>
            <Zap className="h-4 w-4" />
            {isActive ? 'HFT نشط' : 'HFT متوقف'}
          </div>
        </div>
      </div>

      {/* أدوات التحكم */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'مركز التحكم في HFT' : 'HFT Control Center'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {!isActive ? (
              <Button 
                onClick={handleStartHFT}
                disabled={loading}
                className="bg-trading-up hover:bg-green-600 text-white flex-1 min-w-[160px]"
              >
                <Play className="ml-2 h-4 w-4" />
                {loading ? 'جاري البدء...' : 'بدء HFT'}
              </Button>
            ) : (
              <Button 
                onClick={handleStopHFT}
                disabled={loading}
                variant="destructive"
                className="flex-1 min-w-[160px]"
              >
                <Square className="ml-2 h-4 w-4" />
                {loading ? 'جاري الإيقاف...' : 'إيقاف HFT'}
              </Button>
            )}
            
            <Button 
              onClick={loadData}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-1 min-w-[120px]"
            >
              <Activity className="ml-2 h-4 w-4" />
              تحديث البيانات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* مؤشرات الأداء */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Timer className="h-8 w-8 text-trading-up" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(performanceMetrics.uptime / 60000)}م
                  </div>
                  <div className="text-sm text-gray-400">وقت التشغيل</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {performanceMetrics.totalTrades.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">إجمالي الصفقات</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-trading-up" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(performanceMetrics.avgWinRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">معدل الفوز</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Layers className="h-8 w-8 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {performanceMetrics.activeStrategies}/{performanceMetrics.totalStrategies}
                  </div>
                  <div className="text-sm text-gray-400">الاستراتيجيات النشطة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="strategies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="strategies">الاستراتيجيات</TabsTrigger>
          <TabsTrigger value="latency">الكمون</TabsTrigger>
          <TabsTrigger value="orderbook">دفتر الأوامر</TabsTrigger>
          <TabsTrigger value="arbitrage">المراجحة</TabsTrigger>
          <TabsTrigger value="monitoring">المراقبة</TabsTrigger>
        </TabsList>

        {/* إدارة الاستراتيجيات */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="bg-trading-card border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{strategy.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={strategy.type === 'arbitrage' ? 'default' : 
                                strategy.type === 'market_making' ? 'secondary' : 'outline'}
                        className={
                          strategy.type === 'arbitrage' ? 'bg-trading-up' :
                          strategy.type === 'market_making' ? 'bg-blue-600' : 'bg-purple-600'
                        }
                      >
                        {strategy.type}
                      </Badge>
                      <Switch 
                        checked={strategy.enabled}
                        onCheckedChange={(enabled) => handleStrategyToggle(strategy.id, enabled)}
                        className="data-[state=checked]:bg-trading-up"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* الأصول */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">الأصول:</div>
                      <div className="flex flex-wrap gap-2">
                        {strategy.symbols.map((symbol, index) => (
                          <Badge key={index} variant="outline" className="border-gray-600">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* إعدادات الاستراتيجية */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-white">
                          {strategy.maxOrderSize}
                        </div>
                        <div className="text-xs text-gray-400">حجم الأمر الأقصى</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-white">
                          {(strategy.minSpread * 100).toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-400">أقل فارق</div>
                      </div>
                    </div>

                    {/* مؤشرات الأداء */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-trading-up">
                          {(strategy.performance.winRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">معدل الفوز</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-white">
                          {strategy.performance.totalTrades}
                        </div>
                        <div className="text-xs text-gray-400">عدد الصفقات</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-blue-400">
                          {strategy.performance.sharpeRatio.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">نسبة شارب</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-trading-down">
                          {(strategy.performance.maxDrawdown * 100).toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-400">أقصى انخفاض</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* مراقبة الكمون */}
        <TabsContent value="latency" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-400" />
                مقاييس الكمون لكل منصة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="exchange" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="latency" fill="#3B82F6" name="الكمون الإجمالي (ms)" />
                    <Bar dataKey="execution" fill="#22C55E" name="تنفيذ الأوامر (ms)" />
                    <Bar dataKey="network" fill="#F59E0B" name="الشبكة (ms)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* جدول تفاصيل الكمون */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">تفاصيل الكمون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(latencyMetrics.entries()).map(([exchange, metrics]) => (
                  <div key={exchange} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-blue-400" />
                      <div>
                        <div className="font-medium text-white capitalize">{exchange}</div>
                        <div className="text-sm text-gray-400">
                          جودة الاتصال: {metrics.uptime.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "font-bold",
                        metrics.averageLatency < 50 ? 'text-trading-up' :
                        metrics.averageLatency < 100 ? 'text-yellow-500' : 'text-trading-down'
                      )}>
                        {metrics.averageLatency.toFixed(1)}ms
                      </div>
                      <div className="text-xs text-gray-400">
                        RTT: {metrics.roundTripTime.toFixed(1)}ms
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحليل دفتر الأوامر */}
        <TabsContent value="orderbook" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">تحليل دفتر الأوامر اللحظي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderBookData.map((book) => (
                  <div key={book.symbol} className="p-4 bg-trading-secondary rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{book.symbol}</h3>
                      <div className="text-sm text-gray-400">
                        آخر تحديث: {new Date(book.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          ${book.midPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">السعر الوسطي</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-trading-up">
                          {book.spread.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-400">الفارق</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {book.bidVolume.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">حجم الشراء</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-trading-down">
                          {book.askVolume.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">حجم البيع</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* فرص المراجحة */}
        <TabsContent value="arbitrage" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                فرص المراجحة النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {arbitrageOpportunities.length > 0 ? (
                <div className="space-y-3">
                  {arbitrageOpportunities.map((opp, index) => (
                    <div key={index} className="p-4 bg-trading-secondary rounded-lg border-l-4 border-trading-up">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-white">{opp.symbol}</h3>
                          <div className="text-sm text-gray-400">
                            {opp.exchange1} ↔ {opp.exchange2}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-trading-up">
                            +{opp.spreadPercent.toFixed(2)}%
                          </div>
                          <div className="text-sm text-gray-400">
                            ربح: ${opp.profit.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">{opp.exchange1}:</span>
                          <span className="text-white ml-2">${opp.price1.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">{opp.exchange2}:</span>
                          <span className="text-white ml-2">${opp.price2.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">لا توجد فرص مراجحة حالياً</h3>
                  <p className="text-gray-400">
                    يتم البحث عن فرص المراجحة بشكل مستمر
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* المراقبة */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">مراقبة النظام في الوقت الفعلي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* حالة Workers */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">حالة Web Workers</h3>
                  <div className="space-y-2">
                    {['orderBookAnalyzer', 'opportunityDetector', 'latencyOptimizer'].map((worker) => (
                      <div key={worker} className="flex items-center justify-between p-2 bg-trading-secondary rounded">
                        <span className="text-white">{worker}</span>
                        <Badge className="bg-trading-up">نشط</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* حالة WebSocket */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">اتصالات WebSocket</h3>
                  <div className="space-y-2">
                    {['binance', 'coinbase', 'kraken'].map((exchange) => (
                      <div key={exchange} className="flex items-center justify-between p-2 bg-trading-secondary rounded">
                        <span className="text-white capitalize">{exchange}</span>
                        <Badge className={isActive ? "bg-trading-up" : "bg-gray-600"}>
                          {isActive ? 'متصل' : 'غير متصل'}
                        </Badge>
                      </div>
                    ))}
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

export default HighFrequencyTrading;
