
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Wifi,
  WifiOff,
  Database,
  Globe,
  Activity,
  DollarSign,
  BarChart3,
  Volume2,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { marketDataService, MarketData, YahooFinanceData } from '@/services/marketDataService';

interface MarketOverviewProps {
  lang?: 'en' | 'ar';
}

const MarketOverview = ({ lang = 'ar' }: MarketOverviewProps) => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [yahooData, setYahooData] = useState<Record<string, YahooFinanceData>>({});
  const [loading, setLoading] = useState(false);
  const [wsStatus, setWsStatus] = useState<Record<string, boolean>>({});
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const watchedSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'BTCUSD', 'ETHUSD'];

  useEffect(() => {
    loadInitialData();
    setupRealtimeConnections();
    loadPerformanceStats();

    // تحديث الإحصائيات كل 30 ثانية
    const statsInterval = setInterval(loadPerformanceStats, 30000);

    return () => {
      clearInterval(statsInterval);
      cleanupConnections();
    };
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      console.log('📊 تحميل البيانات الأولية للأسواق...');

      const marketPromises = watchedSymbols.map(async (symbol) => {
        const data = await marketDataService.getMarketData(symbol);
        return { symbol, data };
      });

      const yahooPromises = watchedSymbols.slice(0, 5).map(async (symbol) => {
        const data = await marketDataService.getYahooFinanceData(symbol);
        return { symbol, data };
      });

      const [marketResults, yahooResults] = await Promise.all([
        Promise.all(marketPromises),
        Promise.all(yahooPromises)
      ]);

      // تحديث بيانات السوق
      const newMarketData: Record<string, MarketData> = {};
      marketResults.forEach(({ symbol, data }) => {
        newMarketData[symbol] = data;
      });
      setMarketData(newMarketData);

      // تحديث بيانات Yahoo Finance
      const newYahooData: Record<string, YahooFinanceData> = {};
      yahooResults.forEach(({ symbol, data }) => {
        if (data) {
          newYahooData[symbol] = data;
        }
      });
      setYahooData(newYahooData);

      setLastUpdate(new Date());
      console.log('✅ تم تحميل البيانات الأولية بنجاح');

    } catch (error) {
      console.error('خطأ في تحميل البيانات الأولية:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeConnections = () => {
    console.log('🔗 إعداد الاتصالات المباشرة...');

    watchedSymbols.forEach(symbol => {
      // إعداد WebSocket للرموز
      marketDataService.connectWebSocketStream(symbol, 'binance');
      
      // الاشتراك في التحديثات
      const callback = (data: MarketData) => {
        setMarketData(prev => ({
          ...prev,
          [symbol]: data
        }));
        setLastUpdate(new Date());
        
        // تحديث حالة الاتصال
        setWsStatus(prev => ({
          ...prev,
          [symbol]: true
        }));
      };

      marketDataService.subscribe(symbol, callback);

      // تحديث حالة الاتصال الأولية
      setWsStatus(prev => ({
        ...prev,
        [symbol]: true
      }));
    });
  };

  const cleanupConnections = () => {
    console.log('🧹 تنظيف الاتصالات...');
    marketDataService.cleanup();
  };

  const loadPerformanceStats = () => {
    const stats = marketDataService.getPerformanceStats();
    setPerformanceStats(stats);
  };

  const handleRefresh = async () => {
    await loadInitialData();
    loadPerformanceStats();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  // بيانات الرسم البياني للأداء
  const chartData = Object.entries(marketData).slice(0, 5).map(([symbol, data]) => ({
    symbol,
    price: data.price,
    change: data.changePercent
  }));

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'نظرة عامة على السوق' : 'Market Overview'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'بيانات مباشرة من مصادر متعددة مع تخزين محلي' : 'Live data from multiple sources with local storage'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* حالة الاتصال */}
          <div className="flex items-center gap-2">
            {Object.values(wsStatus).some(Boolean) ? (
              <Wifi className="h-5 w-5 text-green-400" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-400" />
            )}
            <span className="text-sm text-gray-400">
              {Object.values(wsStatus).filter(Boolean).length}/{watchedSymbols.length} متصل
            </span>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={loading}
            size="sm"
            className="bg-trading-primary hover:bg-blue-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* إحصائيات الأداء */}
      {performanceStats && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              إحصائيات الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-trading-secondary rounded-lg">
                <Database className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{performanceStats.cacheSize}</div>
                <div className="text-xs text-gray-400">عناصر مؤقتة</div>
              </div>
              <div className="text-center p-3 bg-trading-secondary rounded-lg">
                <Wifi className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{performanceStats.activeConnections}</div>
                <div className="text-xs text-gray-400">اتصالات نشطة</div>
              </div>
              <div className="text-center p-3 bg-trading-secondary rounded-lg">
                <Globe className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{performanceStats.totalSubscribers}</div>
                <div className="text-xs text-gray-400">مشتركين</div>
              </div>
              <div className="text-center p-3 bg-trading-secondary rounded-lg">
                <Database className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {performanceStats.dbStatus === 'connected' ? 'متصل' : 'غير متصل'}
                </div>
                <div className="text-xs text-gray-400">قاعدة البيانات</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* الرسم البياني */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">أداء الأسهم الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="symbol" stroke="#9CA3AF" />
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
                  dataKey="price" 
                  stroke="#22C55E" 
                  strokeWidth={2}
                  name="السعر"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* بيانات السوق المباشرة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* البيانات العادية */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              البيانات المباشرة (WebSocket)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(marketData).map(([symbol, data]) => (
                <div key={symbol} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full animate-pulse",
                      wsStatus[symbol] ? 'bg-green-400' : 'bg-red-400'
                    )} />
                    <div>
                      <div className="font-medium text-white">{symbol}</div>
                      <div className="text-xs text-gray-400">
                        {formatVolume(data.volume)} حجم
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">
                      {formatPrice(data.price)}
                    </div>
                    <div className={cn(
                      "text-sm flex items-center gap-1",
                      data.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                    )}>
                      {data.changePercent >= 0 ? 
                        <TrendingUp className="h-3 w-3" /> : 
                        <TrendingDown className="h-3 w-3" />
                      }
                      {data.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* بيانات Yahoo Finance */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-400" />
              بيانات Yahoo Finance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(yahooData).map(([symbol, data]) => (
                <div key={symbol} className="p-3 bg-trading-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white">{symbol}</div>
                    <Badge variant="outline" className="border-purple-500 text-purple-400">
                      Yahoo Finance
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-400">السعر</div>
                      <div className="font-bold text-white">
                        {formatPrice(data.regularMarketPrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">التغيير</div>
                      <div className={cn(
                        "font-bold",
                        data.regularMarketChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      )}>
                        {data.regularMarketChangePercent.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">القيمة السوقية</div>
                      <div className="text-white">
                        {formatVolume(data.marketCap)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">نسبة P/E</div>
                      <div className="text-white">
                        {data.peRatio.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تفاصيل المصادر */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">مصادر البيانات النشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-blue-300">WebSocket Streams</span>
              </div>
              <ul className="space-y-1 text-blue-200 text-sm">
                <li>• Binance WebSocket API</li>
                <li>• Coinbase Pro WebSocket</li>
                <li>• تحديثات مباشرة كل ثانية</li>
                <li>• إعادة اتصال تلقائي</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-900/30 border border-purple-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-purple-400" />
                <span className="font-bold text-purple-300">Yahoo Finance API</span>
              </div>
              <ul className="space-y-1 text-purple-200 text-sm">
                <li>• بيانات الأسهم الأمريكية</li>
                <li>• القيمة السوقية والنسب المالية</li>
                <li>• البيانات التاريخية</li>
                <li>• تحديث كل 15 ثانية</li>
              </ul>
            </div>

            <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-green-400" />
                <span className="font-bold text-green-300">IndexedDB Storage</span>
              </div>
              <ul className="space-y-1 text-green-200 text-sm">
                <li>• تخزين محلي للبيانات</li>
                <li>• سرعة في الوصول</li>
                <li>• عمل بدون اتصال</li>
                <li>• انتهاء صلاحية ذكي</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
