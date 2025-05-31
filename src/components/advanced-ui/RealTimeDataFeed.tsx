
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Pause, 
  Play, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  Volume2,
  Activity,
  Signal,
  Database,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { marketDataService, MarketData } from '@/services/marketDataService';
import { toast } from 'sonner';

interface RealTimeDataFeedProps {
  lang?: 'en' | 'ar';
}

interface DataPoint {
  timestamp: number;
  price: number;
  volume: number;
  symbol: string;
}

interface AlertRule {
  id: string;
  symbol: string;
  type: 'price_above' | 'price_below' | 'volume_spike' | 'change_percent';
  value: number;
  enabled: boolean;
  triggered: boolean;
}

const RealTimeDataFeed = ({ lang = 'ar' }: RealTimeDataFeedProps) => {
  const [isActive, setIsActive] = useState(true);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [currentData, setCurrentData] = useState<Record<string, MarketData>>({});
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['AAPL', 'GOOGL', 'BTCUSD']);
  const [updateFrequency, setUpdateFrequency] = useState(1000); // milliseconds
  const [maxDataPoints, setMaxDataPoints] = useState(100);

  const availableSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'BTCUSD', 'ETHUSD', 'NVDA'];

  useEffect(() => {
    initializeAlerts();
    if (isActive) {
      startDataFeed();
    }

    return () => {
      stopDataFeed();
    };
  }, [isActive, selectedSymbols]);

  const initializeAlerts = () => {
    const defaultAlerts: AlertRule[] = [
      {
        id: 'aapl_high',
        symbol: 'AAPL',
        type: 'price_above',
        value: 200,
        enabled: true,
        triggered: false
      },
      {
        id: 'btc_spike',
        symbol: 'BTCUSD',
        type: 'volume_spike',
        value: 150, // 150% من المتوسط
        enabled: true,
        triggered: false
      }
    ];
    setAlerts(defaultAlerts);
  };

  const startDataFeed = () => {
    console.log('🚀 بدء تشغيل التغذية المباشرة للبيانات');
    
    selectedSymbols.forEach(symbol => {
      // الاشتراك في البيانات المباشرة
      const callback = (data: MarketData) => {
        setCurrentData(prev => ({
          ...prev,
          [symbol]: data
        }));

        // إضافة نقطة بيانات جديدة
        const newPoint: DataPoint = {
          timestamp: data.timestamp,
          price: data.price,
          volume: data.volume,
          symbol
        };

        setDataPoints(prev => {
          const filtered = prev.filter(p => p.symbol !== symbol);
          const updated = [...filtered, newPoint]
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(-maxDataPoints);
          return updated;
        });

        // فحص التنبيهات
        checkAlerts(data);
      };

      marketDataService.subscribe(symbol, callback);
      
      // جلب البيانات الأولية
      marketDataService.getMarketData(symbol).then(data => {
        callback(data);
      });
    });
  };

  const stopDataFeed = () => {
    console.log('⏹️ إيقاف التغذية المباشرة للبيانات');
    selectedSymbols.forEach(symbol => {
      marketDataService.unsubscribe(symbol, () => {});
    });
  };

  const checkAlerts = (data: MarketData) => {
    alerts.forEach(alert => {
      if (!alert.enabled || alert.triggered || alert.symbol !== data.symbol) {
        return;
      }

      let shouldTrigger = false;
      let message = '';

      switch (alert.type) {
        case 'price_above':
          if (data.price > alert.value) {
            shouldTrigger = true;
            message = `سعر ${data.symbol} تجاوز ${alert.value}`;
          }
          break;
        case 'price_below':
          if (data.price < alert.value) {
            shouldTrigger = true;
            message = `سعر ${data.symbol} انخفض تحت ${alert.value}`;
          }
          break;
        case 'volume_spike':
          // حساب متوسط الحجم
          const symbolPoints = dataPoints.filter(p => p.symbol === data.symbol);
          if (symbolPoints.length > 10) {
            const avgVolume = symbolPoints.reduce((sum, p) => sum + p.volume, 0) / symbolPoints.length;
            if (data.volume > avgVolume * (alert.value / 100)) {
              shouldTrigger = true;
              message = `ارتفاع في حجم التداول لـ ${data.symbol}`;
            }
          }
          break;
        case 'change_percent':
          if (Math.abs(data.changePercent) > alert.value) {
            shouldTrigger = true;
            message = `تغيير كبير في سعر ${data.symbol}: ${data.changePercent.toFixed(2)}%`;
          }
          break;
      }

      if (shouldTrigger) {
        toast.warning(message, {
          description: `${data.symbol}: $${data.price.toFixed(2)}`,
          action: {
            label: 'عرض التفاصيل',
            onClick: () => console.log('عرض تفاصيل التنبيه')
          }
        });

        // تحديث حالة التنبيه
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, triggered: true } : a
        ));
      }
    });
  };

  const toggleSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(prev => prev.filter(s => s !== symbol));
    } else {
      setSelectedSymbols(prev => [...prev, symbol]);
    }
  };

  const resetAlerts = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, triggered: false })));
    toast.success('تم إعادة تعيين جميع التنبيهات');
  };

  const addCustomAlert = () => {
    const newAlert: AlertRule = {
      id: `alert_${Date.now()}`,
      symbol: selectedSymbols[0] || 'AAPL',
      type: 'price_above',
      value: 100,
      enabled: true,
      triggered: false
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  // إعداد بيانات الرسم البياني
  const chartData = dataPoints
    .filter(point => selectedSymbols.includes(point.symbol))
    .reduce((acc, point) => {
      const timeKey = new Date(point.timestamp).toLocaleTimeString();
      const existing = acc.find(item => item.time === timeKey);
      
      if (existing) {
        existing[point.symbol] = point.price;
      } else {
        acc.push({
          time: timeKey,
          timestamp: point.timestamp,
          [point.symbol]: point.price
        });
      }
      
      return acc;
    }, [] as any[])
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-50); // آخر 50 نقطة

  const volumeData = dataPoints
    .filter(point => selectedSymbols.includes(point.symbol))
    .slice(-20)
    .map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString(),
      volume: point.volume,
      symbol: point.symbol
    }));

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6 space-y-6">
      {/* أدوات التحكم */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              التغذية المباشرة للبيانات
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge 
                variant={isActive ? 'default' : 'secondary'}
                className={isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}
              >
                {isActive ? 'نشط' : 'متوقف'}
              </Badge>
              <Button
                onClick={() => setIsActive(!isActive)}
                size="sm"
                variant={isActive ? 'destructive' : 'default'}
                className={isActive ? '' : 'bg-green-600 hover:bg-green-700'}
              >
                {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isActive ? 'إيقاف' : 'تشغيل'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* اختيار الرموز */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الرموز المراقبة
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSymbols.map(symbol => (
                  <Badge
                    key={symbol}
                    variant={selectedSymbols.includes(symbol) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selectedSymbols.includes(symbol) 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'border-gray-600 hover:border-blue-500'
                    )}
                    onClick={() => toggleSymbol(symbol)}
                  >
                    {symbol}
                  </Badge>
                ))}
              </div>
            </div>

            {/* إعدادات التحديث */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  تردد التحديث (ثانية)
                </label>
                <select
                  value={updateFrequency}
                  onChange={(e) => setUpdateFrequency(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-trading-secondary border border-gray-600 rounded-md text-white"
                >
                  <option value={500}>0.5 ثانية</option>
                  <option value={1000}>1 ثانية</option>
                  <option value={2000}>2 ثانية</option>
                  <option value={5000}>5 ثوان</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  عدد النقاط المحفوظة
                </label>
                <select
                  value={maxDataPoints}
                  onChange={(e) => setMaxDataPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-trading-secondary border border-gray-600 rounded-md text-white"
                >
                  <option value={50}>50 نقطة</option>
                  <option value={100}>100 نقطة</option>
                  <option value={200}>200 نقطة</option>
                  <option value={500}>500 نقطة</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الرسوم البيانية المباشرة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* رسم الأسعار */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              الأسعار المباشرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
                  {selectedSymbols.map((symbol, index) => (
                    <Line
                      key={symbol}
                      type="monotone"
                      dataKey={symbol}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      name={symbol}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* رسم الحجم */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-blue-400" />
              حجم التداول
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData}>
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
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* البيانات الحالية */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            البيانات الحالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(currentData).map(([symbol, data]) => (
              <div key={symbol} className="p-4 bg-trading-secondary rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-white">{symbol}</div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">السعر:</span>
                    <span className="font-bold text-white">
                      ${data.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">التغيير:</span>
                    <span className={cn(
                      "font-bold",
                      data.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                    )}>
                      {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحجم:</span>
                    <span className="text-white">
                      {(data.volume / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  {data.bid && data.ask && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">الفارق:</span>
                      <span className="text-blue-400">
                        ${(data.ask - data.bid).toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* التنبيهات */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              التنبيهات الذكية
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={addCustomAlert} size="sm" variant="outline">
                إضافة تنبيه
              </Button>
              <Button onClick={resetAlerts} size="sm" variant="outline">
                إعادة تعيين
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={cn(
                "p-3 rounded-lg border",
                alert.triggered 
                  ? 'bg-orange-900/30 border-orange-500' 
                  : 'bg-trading-secondary border-gray-600'
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={(enabled) => 
                        setAlerts(prev => prev.map(a => 
                          a.id === alert.id ? { ...a, enabled } : a
                        ))
                      }
                    />
                    <div>
                      <div className="font-medium text-white">
                        {alert.symbol} - {alert.type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-400">
                        القيمة: {alert.value}
                      </div>
                    </div>
                  </div>
                  
                  {alert.triggered && (
                    <Badge variant="destructive" className="bg-orange-600">
                      تم التفعيل
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDataFeed;
