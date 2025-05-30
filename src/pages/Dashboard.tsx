
import React, { useState, useEffect } from 'react';
import { AdvancedChart } from '@/components/AdvancedChart';
import { MarketOverview } from '@/components/MarketOverview';
import { StatCard } from '@/components/StatCard';
import { TradingControls } from '@/components/TradingControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketDataService, MarketData } from '@/services/marketDataService';
import { technicalAnalysisService, TradingSignal } from '@/services/technicalAnalysisService';
import { ArrowUpDown, BarChart2, DollarSign, TrendingUp, Zap, Target, AlertTriangle, Lightbulb } from 'lucide-react';

export interface DashboardProps {
  lang?: 'en' | 'ar';
}

const Dashboard = ({ lang = 'en' }: DashboardProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1day');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [topSignals, setTopSignals] = useState<TradingSignal[]>([]);
  const [portfolioStats, setPortfolioStats] = useState({
    balance: 12459.32,
    activeTrades: 7,
    successRate: 94.3,
    totalProfit: 2351.22,
    dailyChange: 2.4
  });

  // رموز الأسهم والعملات للمراقبة
  const watchlist = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 
    'NVDA', 'META', 'NFLX', 'BTCUSD', 'ETHUSD'
  ];

  const timeframes = [
    { value: '1min', label: lang === 'ar' ? '1 دقيقة' : '1 Min' },
    { value: '5min', label: lang === 'ar' ? '5 دقائق' : '5 Min' },
    { value: '15min', label: lang === 'ar' ? '15 دقيقة' : '15 Min' },
    { value: '1hour', label: lang === 'ar' ? '1 ساعة' : '1 Hour' },
    { value: '1day', label: lang === 'ar' ? '1 يوم' : '1 Day' },
    { value: '1week', label: lang === 'ar' ? '1 أسبوع' : '1 Week' }
  ];

  useEffect(() => {
    loadMarketData();
    generateTopSignals();
    
    // تحديث البيانات كل 30 ثانية
    const interval = setInterval(() => {
      loadMarketData();
      generateTopSignals();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    try {
      const promises = watchlist.map(symbol => 
        marketDataService.getMarketData(symbol)
      );
      
      const results = await Promise.all(promises);
      setMarketData(results);
      
      // محاكاة تحديث إحصائيات المحفظة
      setPortfolioStats(prev => ({
        ...prev,
        balance: prev.balance + (Math.random() - 0.5) * 100,
        dailyChange: (Math.random() - 0.5) * 5
      }));
      
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  };

  const generateTopSignals = async () => {
    try {
      const signals: TradingSignal[] = [];
      
      for (const symbol of watchlist.slice(0, 5)) {
        const historicalData = await marketDataService.getHistoricalData(symbol);
        if (historicalData.length > 0) {
          const signal = technicalAnalysisService.generateTradingSignal(
            symbol, 
            historicalData, 
            timeframe
          );
          signals.push(signal);
        }
      }
      
      // ترتيب الإشارات حسب القوة والثقة
      signals.sort((a, b) => (b.strength * b.confidence) - (a.strength * a.confidence));
      setTopSignals(signals.slice(0, 3));
      
    } catch (error) {
      console.error('Error generating signals:', error);
    }
  };

  const handleStartTrading = () => {
    console.log('بدء التداول الآلي');
  };
  
  const handleStopTrading = () => {
    console.log('إيقاف التداول الآلي');
  };
  
  const handleSimulate = () => {
    console.log('محاكاة التداول');
  };
  
  const marketItems = marketData.map(data => ({
    id: data.symbol,
    name: data.symbol,
    price: `$${data.price.toFixed(2)}`,
    change: `${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`,
    isUp: data.changePercent > 0
  }));

  return (
    <div className="p-6 space-y-6 min-h-screen bg-trading-bg">
      {/* العنوان الرئيسي */}
      <div className="signal-black-gradient p-6 rounded-lg border border-gray-800">
        <h1 className={`text-3xl font-bold text-white ${lang === 'ar' ? 'rtl text-right' : ''}`}>
          {lang === 'en' ? 'Signal Black Super Trading Dashboard' : 'لوحة تداول Signal Black المتطورة'}
        </h1>
        <p className="text-gray-300 mt-2">
          {lang === 'en' ? 'AI-Powered Advanced Trading Platform with Real-time Analysis' : 'منصة تداول متقدمة تعتمد على الذكاء الاصطناعي مع التحليل المباشر'}
        </p>
      </div>
      
      {/* إحصائيات المحفظة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title={lang === 'en' ? 'Portfolio Balance' : 'رصيد المحفظة'}
          value={`$${portfolioStats.balance.toLocaleString()}`}
          change={`${portfolioStats.dailyChange.toFixed(2)}%`}
          isUp={portfolioStats.dailyChange > 0}
          icon={<DollarSign className="h-5 w-5" />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Active Trades' : 'الصفقات النشطة'}
          value={portfolioStats.activeTrades.toString()}
          icon={<ArrowUpDown className="h-5 w-5" />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Success Rate' : 'معدل النجاح'}
          value={`${portfolioStats.successRate}%`}
          change="1.2%" 
          isUp={true}
          icon={<TrendingUp className="h-5 w-5" />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Total Profit' : 'إجمالي الربح'}
          value={`$${portfolioStats.totalProfit.toLocaleString()}`}
          change="12.7%" 
          isUp={true}
          icon={<BarChart2 className="h-5 w-5" />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'AI Signals' : 'إشارات الذكاء الاصطناعي'}
          value={topSignals.length.toString()}
          icon={<Zap className="h-5 w-5" />}
          lang={lang}
        />
      </div>

      {/* أفضل الإشارات */}
      {topSignals.length > 0 && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {lang === 'ar' ? 'أفضل إشارات التداول' : 'Top Trading Signals'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topSignals.map((signal, index) => (
                <div key={signal.symbol} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{signal.symbol}</h3>
                    <Badge 
                      variant={signal.type === 'BUY' ? 'default' : signal.type === 'SELL' ? 'destructive' : 'secondary'}
                    >
                      {signal.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-trading-light">{lang === 'ar' ? 'القوة:' : 'Strength:'}</span>
                      <span className="font-semibold">{signal.strength}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trading-light">{lang === 'ar' ? 'الثقة:' : 'Confidence:'}</span>
                      <span className="font-semibold">{(signal.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trading-light">{lang === 'ar' ? 'السعر:' : 'Price:'}</span>
                      <span className="font-semibold">${signal.entry.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => setSelectedSymbol(signal.symbol)}
                  >
                    {lang === 'ar' ? 'عرض التحليل' : 'View Analysis'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* أدوات التحكم في الرسم البياني */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              {lang === 'ar' ? 'التحليل الفني المتقدم' : 'Advanced Technical Analysis'}
            </CardTitle>
            
            <div className="flex flex-col md:flex-row gap-2">
              {/* اختيار الرمز */}
              <select 
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
              >
                {watchlist.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
              
              {/* اختيار الإطار الزمني */}
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
              >
                {timeframes.map(tf => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AdvancedChart 
            symbol={selectedSymbol}
            timeframe={timeframe}
            lang={lang}
          />
        </CardContent>
      </Card>
      
      {/* الرسوم البيانية ونظرة السوق */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* يمكن إضافة رسوم بيانية إضافية هنا */}
        </div>
        <div className="lg:col-span-1">
          <MarketOverview 
            title={lang === 'en' ? 'Market Overview' : 'نظرة عامة على السوق'}
            items={marketItems}
            lang={lang}
          />
        </div>
      </div>
      
      {/* أدوات التداول */}
      <div className="mt-6">
        <TradingControls 
          onStart={handleStartTrading}
          onStop={handleStopTrading}
          onSimulate={handleSimulate}
          isRunning={false}
          lang={lang}
        />
      </div>

      {/* تحذيرات وإشعارات */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {lang === 'ar' ? 'إشعارات السوق' : 'Market Alerts'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">
                {lang === 'ar' 
                  ? 'تحذير: ارتفاع في التقلبات متوقع بسبب البيانات الاقتصادية' 
                  : 'Alert: High volatility expected due to economic data release'
                }
              </span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-500/30 rounded">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {lang === 'ar' 
                  ? 'فرصة: اكتشاف نمط صعودي قوي في AAPL' 
                  : 'Opportunity: Strong bullish pattern detected in AAPL'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
