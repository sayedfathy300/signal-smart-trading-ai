
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Activity,
  Bot,
  Brain,
  Zap,
  Target,
  Building2,
  Globe,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CandlestickChart } from '@/components/CandlestickChart';
import { CurrencyPairs } from '@/components/CurrencyPairs';
import { TradingControls } from '@/components/TradingControls';
import { FundamentalAnalysis } from '@/components/FundamentalAnalysis';
import { aiTradingService, AISignal } from '@/services/aiTradingService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [isTrading, setIsTrading] = useState(false);
  const [aiSignals, setAiSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(false);

  // إحصائيات التداول
  const tradingStats = {
    totalProfit: 15234.67,
    todayProfit: 432.18,
    successRate: 89.3,
    activeTrades: 12
  };

  useEffect(() => {
    loadLatestSignals();
  }, []);

  const loadLatestSignals = async () => {
    setLoading(true);
    try {
      const symbols = ['EURUSD', 'GBPUSD', 'USDJPY'];
      const signals = await aiTradingService.getMultipleSignals(symbols, '15min');
      setAiSignals(signals.slice(0, 3)); // أفضل 3 إشارات
    } catch (error) {
      console.error('Error loading signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrading = () => {
    setIsTrading(true);
    toast.success('تم بدء التداول الآلي بنجاح! 🚀');
  };

  const handleStopTrading = () => {
    setIsTrading(false);
    toast.info('تم إيقاف التداول الآلي');
  };

  const handleSimulate = () => {
    toast.success('بدء المحاكاة... سيتم تشغيل استراتيجيات متعددة');
  };

  const handleOpenBot = () => {
    navigate('/trading-bot');
  };

  const handleOpenPlatform = () => {
    navigate('/trading-platform');
  };

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">لوحة التحكم المتقدمة</h1>
          <p className="text-gray-400">منصة التداول بالذكاء الاصطناعي - Signal Black</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isTrading 
              ? 'bg-green-500/20 text-green-400 animate-pulse' 
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {isTrading ? '● التداول نشط' : '○ التداول متوقف'}
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-trading-up" />
              <div>
                <div className="text-2xl font-bold text-white">${tradingStats.totalProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-400">إجمالي الأرباح</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-trading-up" />
              <div>
                <div className="text-2xl font-bold text-trading-up">+${tradingStats.todayProfit}</div>
                <div className="text-sm text-gray-400">ربح اليوم</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{tradingStats.successRate}%</div>
                <div className="text-sm text-gray-400">معدل النجاح</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-white" />
              <div>
                <div className="text-2xl font-bold text-white">{tradingStats.activeTrades}</div>
                <div className="text-sm text-gray-400">صفقات نشطة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التحكم */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-trading-up" />
            مركز التحكم في التداول
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TradingControls
            onStart={handleStartTrading}
            onStop={handleStopTrading}
            onSimulate={handleSimulate}
            onOpenBot={handleOpenBot}
            onOpenPlatform={handleOpenPlatform}
            isRunning={isTrading}
            lang="ar"
          />
        </CardContent>
      </Card>

      {/* إشارات الذكاء الاصطناعي السريعة */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            إشارات الذكاء الاصطناعي المباشرة
          </CardTitle>
          <Button
            onClick={loadLatestSignals}
            disabled={loading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            {loading ? 'جاري التحديث...' : 'تحديث الإشارات'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiSignals.map((signal, index) => (
              <div key={index} className="p-4 bg-trading-secondary rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{signal.symbol}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    signal.action === 'BUY' ? 'bg-trading-up text-white' :
                    signal.action === 'SELL' ? 'bg-trading-down text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {signal.action}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">القوة:</span>
                    <span className="text-white font-bold">{signal.strength}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">الثقة:</span>
                    <span className="text-white">{(signal.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">الاتجاه:</span>
                    <span className={`${
                      signal.analysis.technical.trend === 'bullish' ? 'text-trading-up' :
                      signal.analysis.technical.trend === 'bearish' ? 'text-trading-down' :
                      'text-gray-400'
                    }`}>
                      {signal.analysis.technical.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="charts">الرسوم البيانية المتقدمة</TabsTrigger>
          <TabsTrigger value="pairs">أزواج العملات</TabsTrigger>
          <TabsTrigger value="fundamental">التحليل الأساسي</TabsTrigger>
          <TabsTrigger value="economics">المؤشرات الاقتصادية</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                الرسم البياني للشموع اليابانية - {selectedPair}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CandlestickChart 
                symbol={selectedPair}
                lang="ar"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pairs" className="space-y-6">
          <CurrencyPairs 
            lang="ar"
            onSelectPair={setSelectedPair}
          />
        </TabsContent>

        <TabsContent value="fundamental" className="space-y-6">
          <FundamentalAnalysis 
            symbol="AAPL"
            lang="ar"
          />
        </TabsContent>

        <TabsContent value="economics" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                المؤشرات الاقتصادية العالمية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">التحليل الاقتصادي المتقدم</h3>
                <p className="text-gray-400 mb-4">
                  تابع المؤشرات الاقتصادية العالمية وتأثيرها على الأسواق
                </p>
                <Button 
                  onClick={() => toast.info('سيتم إضافة المزيد من المؤشرات قريباً')}
                  className="bg-trading-primary hover:bg-blue-600"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  عرض التقويم الاقتصادي الكامل
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
