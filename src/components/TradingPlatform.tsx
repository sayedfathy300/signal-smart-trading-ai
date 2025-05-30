
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Settings,
  Play,
  Square,
  RefreshCw,
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  Wallet,
  Bot,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { tradingPlatformService, Portfolio, TradingStrategy, TradingAccount, TradingOrder } from '@/services/tradingPlatformService';
import { toast } from 'sonner';

interface TradingPlatformProps {
  lang?: 'en' | 'ar';
}

const TradingPlatform = ({ lang = 'ar' }: TradingPlatformProps) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [orders, setOrders] = useState<TradingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadInitialData();
    connectToExchanges();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [strategiesData, accountsData] = await Promise.all([
        Promise.resolve(tradingPlatformService.getAllStrategies()),
        Promise.resolve(tradingPlatformService.getAllAccounts())
      ]);
      
      setStrategies(strategiesData);
      setAccounts(accountsData);
      
      // محاولة جلب المحفظة
      if (accountsData.length > 0) {
        const portfolioData = await tradingPlatformService.getPortfolio();
        setPortfolio(portfolioData);
        setOrders(portfolioData.orders);
      }
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectToExchanges = async () => {
    const exchanges = ['binance', 'coinbase', 'kraken'];
    const status: Record<string, boolean> = {};
    
    for (const exchange of exchanges) {
      try {
        const connected = await tradingPlatformService.connectExchange(exchange);
        status[exchange] = connected;
        
        if (connected) {
          toast.success(`تم الاتصال بمنصة ${exchange} بنجاح`);
        } else {
          toast.error(`فشل الاتصال بمنصة ${exchange}`);
        }
      } catch (error) {
        status[exchange] = false;
        toast.error(`خطأ في الاتصال بمنصة ${exchange}`);
      }
    }
    
    setConnectionStatus(status);
  };

  const handleStartTrading = async () => {
    setIsTrading(true);
    await tradingPlatformService.startAutomatedTrading();
    toast.success('تم بدء التداول الآلي بنجاح! 🚀');
  };

  const handleStopTrading = () => {
    setIsTrading(false);
    toast.info('تم إيقاف التداول الآلي');
  };

  const handleStrategyToggle = (strategyId: string, enabled: boolean) => {
    tradingPlatformService.updateStrategyStatus(strategyId, enabled);
    setStrategies(prev => prev.map(s => 
      s.id === strategyId ? { ...s, enabled } : s
    ));
    
    toast.info(`تم ${enabled ? 'تفعيل' : 'إيقاف'} الاستراتيجية`);
  };

  const handleExecuteStrategy = async (strategyId: string) => {
    const success = await tradingPlatformService.executeStrategy(strategyId);
    if (success) {
      toast.success('تم تنفيذ الاستراتيجية بنجاح');
      await loadInitialData(); // تحديث البيانات
    } else {
      toast.error('فشل في تنفيذ الاستراتيجية');
    }
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  // بيانات الأداء للرسوم البيانية
  const performanceData = [
    { time: '00:00', value: 10000, pnl: 0 },
    { time: '04:00', value: 10250, pnl: 250 },
    { time: '08:00', value: 10180, pnl: 180 },
    { time: '12:00', value: 10420, pnl: 420 },
    { time: '16:00', value: 10380, pnl: 380 },
    { time: '20:00', value: 10567, pnl: 567 },
    { time: '24:00', value: 10845, pnl: 845 }
  ];

  const strategyPerformanceData = strategies.map(strategy => ({
    name: strategy.name,
    winRate: strategy.performance.winRate * 100,
    profitFactor: strategy.performance.profitFactor,
    trades: strategy.performance.totalTrades
  }));

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'منصة التداول الآلي المتكاملة' : 'Integrated Automated Trading Platform'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'تداول آلي متقدم مع ربط منصات متعددة' : 'Advanced automated trading with multi-platform integration'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            isTrading 
              ? 'bg-green-500/20 text-green-400 animate-pulse' 
              : 'bg-gray-500/20 text-gray-400'
          )}>
            {isTrading ? '● التداول نشط' : '○ التداول متوقف'}
          </div>
          
          <Button
            onClick={loadInitialData}
            disabled={loading}
            size="sm"
            className="bg-trading-primary hover:bg-blue-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'جاري التحديث...' : 'تحديث'}
          </Button>
        </div>
      </div>

      {/* حالة الاتصال بالمنصات */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'حالة الاتصال بالمنصات' : 'Exchange Connection Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(connectionStatus).map(([exchange, connected]) => (
              <div key={exchange} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    connected ? 'bg-trading-up animate-pulse' : 'bg-gray-500'
                  )} />
                  <span className="font-medium text-white capitalize">{exchange}</span>
                </div>
                <Badge 
                  variant={connected ? 'default' : 'secondary'}
                  className={connected ? 'bg-trading-up' : 'bg-gray-600'}
                >
                  {connected ? 'متصل' : 'غير متصل'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أدوات التحكم الرئيسية */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-trading-up" />
            {lang === 'ar' ? 'مركز التحكم في التداول' : 'Trading Control Center'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {!isTrading ? (
              <Button 
                onClick={handleStartTrading}
                className="bg-trading-up hover:bg-green-600 text-white flex-1 min-w-[160px]"
              >
                <Play className="ml-2 h-4 w-4" />
                {lang === 'ar' ? 'بدء التداول الآلي' : 'Start Automated Trading'}
              </Button>
            ) : (
              <Button 
                onClick={handleStopTrading}
                variant="destructive"
                className="flex-1 min-w-[160px]"
              >
                <Square className="ml-2 h-4 w-4" />
                {lang === 'ar' ? 'إيقاف التداول الآلي' : 'Stop Automated Trading'}
              </Button>
            )}
            
            <Button 
              onClick={connectToExchanges}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-1 min-w-[140px]"
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              {lang === 'ar' ? 'إعادة الاتصال' : 'Reconnect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات المحفظة */}
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-trading-up" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${portfolio.totalValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'إجمالي قيمة المحفظة' : 'Total Portfolio Value'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-trading-up" />
                <div>
                  <div className={cn(
                    "text-2xl font-bold",
                    portfolio.totalPnL >= 0 ? 'text-trading-up' : 'text-trading-down'
                  )}>
                    {portfolio.totalPnL >= 0 ? '+' : ''}${portfolio.totalPnL.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'إجمالي الأرباح/الخسائر' : 'Total P&L'}
                  </div>
                  <div className={cn(
                    "text-xs",
                    portfolio.totalPnL >= 0 ? 'text-trading-up' : 'text-trading-down'
                  )}>
                    {portfolio.totalPnL >= 0 ? '+' : ''}{portfolio.totalPnLPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{portfolio.positions.length}</div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'المراكز النشطة' : 'Active Positions'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(portfolio.performance.winRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                  </div>
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
          <TabsTrigger value="portfolio">المحفظة</TabsTrigger>
          <TabsTrigger value="orders">الأوامر</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
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
                        variant={strategy.riskLevel === 'high' ? 'destructive' : 
                                strategy.riskLevel === 'medium' ? 'default' : 'secondary'}
                        className={
                          strategy.riskLevel === 'high' ? 'bg-trading-down' :
                          strategy.riskLevel === 'medium' ? 'bg-yellow-600' : 'bg-trading-up'
                        }
                      >
                        {strategy.riskLevel === 'high' ? 'عالي المخاطر' :
                         strategy.riskLevel === 'medium' ? 'متوسط المخاطر' : 'منخفض المخاطر'}
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
                    <p className="text-gray-400 text-sm">{strategy.description}</p>
                    
                    {/* أزواج العملات */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">أزواج العملات:</div>
                      <div className="flex flex-wrap gap-2">
                        {strategy.symbols.map((symbol, index) => (
                          <Badge key={index} variant="outline" className="border-gray-600">
                            {symbol}
                          </Badge>
                        ))}
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
                        <div className="text-xs text-gray-400">إجمالي الصفقات</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-blue-400">
                          {strategy.performance.profitFactor.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">عامل الربح</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-purple-400">
                          {strategy.performance.sharpeRatio.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">نسبة شارب</div>
                      </div>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleExecuteStrategy(strategy.id)}
                        disabled={!strategy.enabled}
                        size="sm"
                        className="flex-1 bg-trading-up hover:bg-green-600"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        تنفيذ الآن
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-400"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        إعدادات
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* المحفظة */}
        <TabsContent value="portfolio" className="space-y-6">
          {portfolio && (
            <>
              {/* المراكز النشطة */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">المراكز النشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {portfolio.positions.map((position, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={position.side === 'long' ? 'default' : 'destructive'}
                            className={position.side === 'long' ? 'bg-trading-up' : 'bg-trading-down'}
                          >
                            {position.side.toUpperCase()}
                          </Badge>
                          <div>
                            <div className="font-medium text-white">{position.symbol}</div>
                            <div className="text-sm text-gray-400">
                              {position.size.toFixed(6)} @ {position.entryPrice.toFixed(4)}
                            </div>
                            <div className="text-xs text-gray-500">{position.exchange}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "font-bold",
                            position.unrealizedPnL >= 0 ? 'text-trading-up' : 'text-trading-down'
                          )}>
                            {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                          </div>
                          <div className={cn(
                            "text-xs",
                            position.unrealizedPnL >= 0 ? 'text-trading-up' : 'text-trading-down'
                          )}>
                            {position.unrealizedPnL >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* رسم الأداء */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">أداء المحفظة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
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
                          dataKey="value" 
                          stroke="#22C55E" 
                          strokeWidth={2}
                          name="قيمة المحفظة"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="pnl" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          name="الأرباح/الخسائر"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* الأوامر */}
        <TabsContent value="orders" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">الأوامر النشطة والمكتملة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.length > 0 ? orders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={order.side === 'buy' ? 'default' : 'destructive'}
                        className={order.side === 'buy' ? 'bg-trading-up' : 'bg-trading-down'}
                      >
                        {order.side.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-medium text-white">{order.symbol}</div>
                        <div className="text-sm text-gray-400">
                          {order.amount} @ {order.price?.toFixed(4)}
                        </div>
                        <div className="text-xs text-gray-500">{order.exchange}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline"
                        className={cn(
                          order.status === 'closed' ? 'border-trading-up text-trading-up' :
                          order.status === 'open' ? 'border-blue-500 text-blue-500' :
                          order.status === 'canceled' ? 'border-gray-500 text-gray-500' :
                          'border-yellow-500 text-yellow-500'
                        )}
                      >
                        {order.status}
                      </Badge>
                      <div className="text-sm text-gray-400 mt-1">
                        المملوء: {((order.filled / order.amount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Activity className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">لا توجد أوامر نشطة</h3>
                    <p className="text-gray-400">
                      ابدأ التداول الآلي لرؤية الأوامر هنا
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الأداء */}
        <TabsContent value="performance" className="space-y-6">
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
                    <Bar dataKey="winRate" fill="#22C55E" name="معدل الفوز %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الإعدادات */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات التداول المتقدمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* إعدادات إدارة المخاطر */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">إدارة المخاطر</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">الحد الأقصى للمخاطرة لكل صفقة (%)</label>
                      <input 
                        type="number" 
                        defaultValue="2" 
                        className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">الحد الأقصى للمخاطرة اليومية (%)</label>
                      <input 
                        type="number" 
                        defaultValue="10" 
                        className="w-full p-2 bg-trading-secondary border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* إعدادات التنبيهات */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">التنبيهات</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">تنبيهات الأوامر المكتملة</span>
                      <Switch defaultChecked className="data-[state=checked]:bg-trading-up" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">تنبيهات وقف الخسارة</span>
                      <Switch defaultChecked className="data-[state=checked]:bg-trading-up" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">تنبيهات فقدان الاتصال</span>
                      <Switch defaultChecked className="data-[state=checked]:bg-trading-up" />
                    </div>
                  </div>
                </div>

                {/* معلومات API */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">معلومات API</h3>
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-5 w-5 text-blue-400" />
                      <span className="font-bold text-blue-300">الأمان والخصوصية</span>
                    </div>
                    <ul className="space-y-1 text-blue-200 text-sm">
                      <li>• جميع الاتصالات مشفرة بـ SSL</li>
                      <li>• الوضع التجريبي مفعل للحماية</li>
                      <li>• لا يتم تخزين مفاتيح API</li>
                      <li>• مراقبة أمنية مستمرة</li>
                    </ul>
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

export default TradingPlatform;
