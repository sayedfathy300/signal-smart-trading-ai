
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Activity, 
  Clock, 
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw,
  AlertTriangle,
  Cpu,
  Wifi,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';
import { tradingPlatformService, HighFrequencyConfig } from '@/services/tradingPlatformService';

interface HighFrequencyTradingProps {
  lang?: 'en' | 'ar';
}

const HighFrequencyTrading = ({ lang = 'ar' }: HighFrequencyTradingProps) => {
  const [hftEnabled, setHftEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latencyData, setLatencyData] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalTrades: 15847,
    avgLatency: 12.5,
    successRate: 98.7,
    profitToday: 2845.67,
    activeStrategies: 4,
    ordersPerSecond: 245
  });

  const [hftConfig, setHftConfig] = useState<HighFrequencyConfig>({
    enabled: false,
    maxLatency: 50,
    tickSize: 0.01,
    minSpread: 0.001,
    maxPositionSize: 0.1,
    riskLimits: {
      maxDailyLoss: 0.05,
      maxOpenPositions: 10,
      maxOrderSize: 0.2
    },
    strategies: {
      marketMaking: true,
      arbitrage: true,
      meanReversion: false,
      momentum: true
    }
  });

  useEffect(() => {
    generateLatencyData();
    const interval = setInterval(generateLatencyData, 5000); // تحديث كل 5 ثواني
    return () => clearInterval(interval);
  }, []);

  const generateLatencyData = () => {
    const newData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 1000).toLocaleTimeString(),
      latency: 8 + Math.random() * 15,
      throughput: 200 + Math.random() * 100,
      errors: Math.random() * 5
    }));
    setLatencyData(newData);
  };

  const handleToggleHFT = async () => {
    setLoading(true);
    try {
      if (!hftEnabled) {
        const success = await tradingPlatformService.enableHighFrequencyTrading(hftConfig);
        if (success) {
          setHftEnabled(true);
          console.log('تم تفعيل التداول عالي التردد');
        }
      } else {
        setHftEnabled(false);
        console.log('تم إيقاف التداول عالي التردد');
      }
    } catch (error) {
      console.error('خطأ في تبديل حالة HFT:', error);
    } finally {
      setLoading(false);
    }
  };

  const strategyPerformanceData = [
    { name: 'Market Making', trades: 8456, profit: 1245.67, latency: 8.2 },
    { name: 'Arbitrage', trades: 3421, profit: 892.34, latency: 12.1 },
    { name: 'Momentum', trades: 2154, profit: 467.89, latency: 15.3 },
    { name: 'Mean Reversion', trades: 1816, profit: 239.77, latency: 18.7 }
  ];

  const getLatencyColor = (latency: number) => {
    if (latency < 10) return 'text-trading-up';
    if (latency < 20) return 'text-yellow-500';
    return 'text-trading-down';
  };

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'التداول عالي التردد' : 'High-Frequency Trading'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'تداول فائق السرعة بزمن استجابة أقل من 50ms' : 'Ultra-fast trading with sub-50ms latency'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2",
            hftEnabled 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-gray-500/20 text-gray-400'
          )}>
            <div className={cn("w-2 h-2 rounded-full", hftEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400')}></div>
            {hftEnabled ? 'نشط' : 'متوقف'}
          </div>
          
          <Button
            onClick={handleToggleHFT}
            disabled={loading}
            className={hftEnabled ? 'bg-trading-down hover:bg-red-600' : 'bg-trading-up hover:bg-green-600'}
          >
            <Zap className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'جاري التحميل...' : (hftEnabled ? 'إيقاف HFT' : 'تفعيل HFT')}
          </Button>
        </div>
      </div>

      {/* مؤشرات الأداء الرئيسية */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">زمن الاستجابة</span>
            </div>
            <div className={cn("text-xl font-bold", getLatencyColor(performanceMetrics.avgLatency))}>
              {performanceMetrics.avgLatency}ms
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-trading-up" />
              <span className="text-xs text-gray-400">معدل النجاح</span>
            </div>
            <div className="text-xl font-bold text-trading-up">
              {performanceMetrics.successRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-white" />
              <span className="text-xs text-gray-400">صفقات اليوم</span>
            </div>
            <div className="text-xl font-bold text-white">
              {performanceMetrics.totalTrades.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-trading-up" />
              <span className="text-xs text-gray-400">ربح اليوم</span>
            </div>
            <div className="text-xl font-bold text-trading-up">
              ${performanceMetrics.profitToday.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-400">أوامر/ثانية</span>
            </div>
            <div className="text-xl font-bold text-white">
              {performanceMetrics.ordersPerSecond}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-gray-400">استراتيجيات نشطة</span>
            </div>
            <div className="text-xl font-bold text-white">
              {performanceMetrics.activeStrategies}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="latency">زمن الاستجابة</TabsTrigger>
          <TabsTrigger value="strategies">الاستراتيجيات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="monitoring">المراقبة</TabsTrigger>
        </TabsList>

        {/* الأداء */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* أداء الاستراتيجيات */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">أداء الاستراتيجيات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={strategyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9CA3AF"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="profit" fill="#22C55E" name="الربح ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* إحصائيات مفصلة */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">إحصائيات الاستراتيجيات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategyPerformanceData.map((strategy, index) => (
                    <div key={index} className="p-4 bg-trading-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-white">{strategy.name}</span>
                        <Badge 
                          variant="outline"
                          className={cn(
                            strategy.latency < 10 ? 'border-trading-up text-trading-up' :
                            strategy.latency < 20 ? 'border-yellow-500 text-yellow-500' :
                            'border-trading-down text-trading-down'
                          )}
                        >
                          {strategy.latency}ms
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">الصفقات:</div>
                          <div className="text-white font-bold">{strategy.trades.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">الربح:</div>
                          <div className="text-trading-up font-bold">${strategy.profit}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* زمن الاستجابة */}
        <TabsContent value="latency" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                مراقبة زمن الاستجابة المباشرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
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
                      dataKey="latency" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="زمن الاستجابة (ms)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="throughput" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="الإنتاجية"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="الأخطاء"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* تحليل زمن الاستجابة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">متوسط زمن الاستجابة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {latencyData.length > 0 ? (latencyData.reduce((sum, d) => sum + d.latency, 0) / latencyData.length).toFixed(1) : '0'}ms
                  </div>
                  <div className="text-sm text-gray-400">آخر 20 ثانية</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">أسرع استجابة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-trading-up mb-2">
                    {latencyData.length > 0 ? Math.min(...latencyData.map(d => d.latency)).toFixed(1) : '0'}ms
                  </div>
                  <div className="text-sm text-gray-400">أفضل أداء</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">أبطأ استجابة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-trading-down mb-2">
                    {latencyData.length > 0 ? Math.max(...latencyData.map(d => d.latency)).toFixed(1) : '0'}ms
                  </div>
                  <div className="text-sm text-gray-400">أسوأ أداء</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* الاستراتيجيات */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(hftConfig.strategies).map(([strategy, enabled]) => (
              <Card key={strategy} className="bg-trading-card border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white capitalize">
                      {strategy === 'marketMaking' ? 'صناعة السوق' :
                       strategy === 'arbitrage' ? 'المراجحة' :
                       strategy === 'meanReversion' ? 'العودة للمتوسط' :
                       'الزخم'}
                    </CardTitle>
                    <Switch 
                      checked={enabled}
                      onCheckedChange={(checked) => {
                        setHftConfig(prev => ({
                          ...prev,
                          strategies: { ...prev.strategies, [strategy]: checked }
                        }));
                      }}
                      className="data-[state=checked]:bg-trading-up"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">حالة:</div>
                        <div className={cn("font-bold", enabled ? 'text-trading-up' : 'text-gray-500')}>
                          {enabled ? 'نشط' : 'متوقف'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">الأولوية:</div>
                        <div className="text-white font-bold">عالية</div>
                      </div>
                    </div>

                    <div className="p-3 bg-trading-secondary rounded-lg">
                      <div className="text-xs text-gray-400 mb-2">الوصف:</div>
                      <div className="text-sm text-gray-300">
                        {strategy === 'marketMaking' ? 'توفير السيولة من خلال وضع أوامر شراء وبيع متزامنة' :
                         strategy === 'arbitrage' ? 'استغلال فروق الأسعار بين المنصات المختلفة' :
                         strategy === 'meanReversion' ? 'التداول على افتراض عودة الأسعار للمتوسط' :
                         'اتباع اتجاه الأسعار قصير المدى'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* الإعدادات */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات التداول عالي التردد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-white font-medium mb-3 block">
                      أقصى زمن استجابة (ms): {hftConfig.maxLatency}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={hftConfig.maxLatency}
                      onChange={(e) => setHftConfig(prev => ({ ...prev, maxLatency: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-3 block">
                      أقصى حجم مركز: {(hftConfig.maxPositionSize * 100).toFixed(1)}%
                    </label>
                    <input
                      type="range"
                      min="0.01"
                      max="0.5"
                      step="0.01"
                      value={hftConfig.maxPositionSize}
                      onChange={(e) => setHftConfig(prev => ({ ...prev, maxPositionSize: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-3 block">
                      أقل فرق سعر: {(hftConfig.minSpread * 100).toFixed(3)}%
                    </label>
                    <input
                      type="range"
                      min="0.0001"
                      max="0.01"
                      step="0.0001"
                      value={hftConfig.minSpread}
                      onChange={(e) => setHftConfig(prev => ({ ...prev, minSpread: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-4">حدود المخاطر</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">أقصى خسارة يومية (%)</label>
                        <input
                          type="number"
                          value={(hftConfig.riskLimits.maxDailyLoss * 100).toFixed(1)}
                          onChange={(e) => setHftConfig(prev => ({
                            ...prev,
                            riskLimits: { ...prev.riskLimits, maxDailyLoss: Number(e.target.value) / 100 }
                          }))}
                          className="w-full mt-1 p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">أقصى عدد مراكز مفتوحة</label>
                        <input
                          type="number"
                          value={hftConfig.riskLimits.maxOpenPositions}
                          onChange={(e) => setHftConfig(prev => ({
                            ...prev,
                            riskLimits: { ...prev.riskLimits, maxOpenPositions: Number(e.target.value) }
                          }))}
                          className="w-full mt-1 p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">أقصى حجم أمر (%)</label>
                        <input
                          type="number"
                          value={(hftConfig.riskLimits.maxOrderSize * 100).toFixed(1)}
                          onChange={(e) => setHftConfig(prev => ({
                            ...prev,
                            riskLimits: { ...prev.riskLimits, maxOrderSize: Number(e.target.value) / 100 }
                          }))}
                          className="w-full mt-1 p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button className="bg-trading-up hover:bg-green-600">
                  <Settings className="h-4 w-4 mr-2" />
                  حفظ الإعدادات
                </Button>
                <Button variant="outline" className="border-gray-600">
                  إعادة تعيين
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* المراقبة */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">حالة الاتصال</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Binance', 'Coinbase', 'Kraken'].map((exchange, index) => (
                    <div key={exchange} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          index < 2 ? 'bg-trading-up animate-pulse' : 'bg-trading-down'
                        )} />
                        <span className="text-white">{exchange}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {index < 2 ? '12ms' : 'غير متصل'}
                        </div>
                        <Badge 
                          variant={index < 2 ? 'default' : 'destructive'}
                          className={index < 2 ? 'bg-trading-up' : 'bg-trading-down'}
                        >
                          {index < 2 ? 'متصل' : 'منقطع'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">تنبيهات النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <div className="flex-1">
                      <div className="text-yellow-300 text-sm font-medium">زمن استجابة مرتفع</div>
                      <div className="text-yellow-400 text-xs">Binance: 45ms</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <div className="text-green-300 text-sm font-medium">اتصال مستقر</div>
                      <div className="text-green-400 text-xs">جميع المنصات متصلة</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HighFrequencyTrading;
