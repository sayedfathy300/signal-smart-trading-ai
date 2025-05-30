
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Square, 
  BarChart3, 
  TrendingUp, 
  Target,
  Calendar,
  DollarSign,
  Activity,
  Zap,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { cn } from '@/lib/utils';

interface BacktestResult {
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  recoveryFactor: number;
  calmarRatio: number;
}

interface Trade {
  date: string;
  entry: number;
  exit: number;
  pnl: number;
  type: 'BUY' | 'SELL';
  duration: number;
}

interface StrategyBacktestingProps {
  lang?: 'en' | 'ar';
}

const StrategyBacktesting = ({ lang = 'ar' }: StrategyBacktestingProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [strategy, setStrategy] = useState('sma_crossover');
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1h');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [initialCapital, setInitialCapital] = useState(10000);
  const [riskPerTrade, setRiskPerTrade] = useState([2]);
  
  // معايير الاستراتيجية
  const [fastMA, setFastMA] = useState([10]);
  const [slowMA, setSlowMA] = useState([30]);
  const [rsiPeriod, setRsiPeriod] = useState([14]);
  const [rsiOverbought, setRsiOverbought] = useState([70]);
  const [rsiOversold, setRsiOversold] = useState([30]);

  const [results, setResults] = useState<BacktestResult | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [equityCurve, setEquityCurve] = useState<Array<{date: string, value: number}>>([]);
  const [drawdownData, setDrawdownData] = useState<Array<{date: string, drawdown: number}>>([]);

  const strategies = [
    { id: 'sma_crossover', name: 'SMA Crossover', nameAr: 'تقاطع المتوسطات البسيطة' },
    { id: 'rsi_reversal', name: 'RSI Reversal', nameAr: 'انعكاس RSI' },
    { id: 'bollinger_bands', name: 'Bollinger Bands', nameAr: 'بولينجر باندز' },
    { id: 'macd_signal', name: 'MACD Signal', nameAr: 'إشارة MACD' },
    { id: 'golden_cross', name: 'Golden Cross', nameAr: 'التقاطع الذهبي' },
    { id: 'momentum', name: 'Momentum', nameAr: 'الزخم' }
  ];

  const symbols = [
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT', 'DOT/USDT',
    'LINK/USDT', 'AVAX/USDT', 'MATIC/USDT', 'UNI/USDT'
  ];

  const timeframes = [
    { id: '1m', name: '1 Minute', nameAr: '1 دقيقة' },
    { id: '5m', name: '5 Minutes', nameAr: '5 دقائق' },
    { id: '15m', name: '15 Minutes', nameAr: '15 دقيقة' },
    { id: '1h', name: '1 Hour', nameAr: '1 ساعة' },
    { id: '4h', name: '4 Hours', nameAr: '4 ساعات' },
    { id: '1d', name: '1 Day', nameAr: '1 يوم' },
    { id: '1w', name: '1 Week', nameAr: '1 أسبوع' }
  ];

  // محاكاة تشغيل الاختبار الخلفي
  const runBacktest = async () => {
    setIsRunning(true);
    
    // محاكاة وقت المعالجة
    await new Promise(resolve => setTimeout(resolve, 3000));

    // توليد نتائج وهمية للاختبار
    const mockResults: BacktestResult = {
      totalReturn: 45.67,
      annualizedReturn: 23.45,
      maxDrawdown: -12.34,
      sharpeRatio: 1.87,
      sortinoRatio: 2.34,
      winRate: 65.4,
      profitFactor: 1.89,
      totalTrades: 127,
      averageWin: 3.45,
      averageLoss: -1.87,
      largestWin: 15.67,
      largestLoss: -8.45,
      consecutiveWins: 7,
      consecutiveLosses: 4,
      recoveryFactor: 3.71,
      calmarRatio: 1.90
    };

    // توليد منحنى الأرباح
    const mockEquityCurve = [];
    let value = initialCapital;
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    const days = Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= days; i += 7) {
      const date = new Date(startTime + i * 24 * 60 * 60 * 1000);
      value += (Math.random() - 0.4) * value * 0.02; // تقلب عشوائي
      mockEquityCurve.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value)
      });
    }

    // توليد بيانات السحب
    const mockDrawdownData = mockEquityCurve.map((point, index) => {
      const maxValue = Math.max(...mockEquityCurve.slice(0, index + 1).map(p => p.value));
      const drawdown = ((point.value - maxValue) / maxValue) * 100;
      return {
        date: point.date,
        drawdown: Math.min(drawdown, 0)
      };
    });

    // توليد صفقات وهمية
    const mockTrades: Trade[] = [];
    for (let i = 0; i < mockResults.totalTrades; i++) {
      const isWin = Math.random() < (mockResults.winRate / 100);
      const pnl = isWin 
        ? Math.random() * mockResults.largestWin
        : -Math.random() * Math.abs(mockResults.largestLoss);
      
      mockTrades.push({
        date: new Date(startTime + Math.random() * (endTime - startTime)).toISOString().split('T')[0],
        entry: 40000 + Math.random() * 20000,
        exit: 40000 + Math.random() * 20000,
        pnl,
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        duration: Math.floor(Math.random() * 72) + 1 // 1-72 ساعة
      });
    }

    setResults(mockResults);
    setEquityCurve(mockEquityCurve);
    setDrawdownData(mockDrawdownData);
    setTrades(mockTrades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setIsRunning(false);
  };

  const stopBacktest = () => {
    setIsRunning(false);
  };

  const exportResults = () => {
    if (!results) return;
    
    const data = {
      strategy,
      symbol,
      timeframe,
      period: `${startDate} to ${endDate}`,
      results,
      trades,
      equityCurve
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest_${strategy}_${symbol}_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* إعدادات الاختبار */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'إعدادات الاختبار الخلفي' : 'Backtest Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'الاستراتيجية' : 'Strategy'}
              </Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {strategies.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {lang === 'ar' ? s.nameAr : s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'زوج العملة' : 'Symbol'}
              </Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {symbols.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'الفترة الزمنية' : 'Timeframe'}
              </Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {timeframes.map(tf => (
                    <SelectItem key={tf.id} value={tf.id}>
                      {lang === 'ar' ? tf.nameAr : tf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'تاريخ البداية' : 'Start Date'}
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-trading-secondary border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'تاريخ النهاية' : 'End Date'}
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-trading-secondary border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'رأس المال الأولي' : 'Initial Capital'}
              </Label>
              <Input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="bg-trading-secondary border-gray-600"
              />
            </div>
          </div>

          {/* معايير الاستراتيجية */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'معايير الاستراتيجية' : 'Strategy Parameters'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategy === 'sma_crossover' && (
                <>
                  <div className="space-y-3">
                    <Label className="text-gray-300">
                      {lang === 'ar' ? 'المتوسط السريع' : 'Fast MA'}: {fastMA[0]}
                    </Label>
                    <Slider
                      value={fastMA}
                      onValueChange={setFastMA}
                      max={50}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-300">
                      {lang === 'ar' ? 'المتوسط البطيء' : 'Slow MA'}: {slowMA[0]}
                    </Label>
                    <Slider
                      value={slowMA}
                      onValueChange={setSlowMA}
                      max={200}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {strategy === 'rsi_reversal' && (
                <>
                  <div className="space-y-3">
                    <Label className="text-gray-300">
                      {lang === 'ar' ? 'فترة RSI' : 'RSI Period'}: {rsiPeriod[0]}
                    </Label>
                    <Slider
                      value={rsiPeriod}
                      onValueChange={setRsiPeriod}
                      max={50}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-300">
                      {lang === 'ar' ? 'مستوى الشراء المفرط' : 'Overbought'}: {rsiOverbought[0]}
                    </Label>
                    <Slider
                      value={rsiOverbought}
                      onValueChange={setRsiOverbought}
                      max={95}
                      min={60}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <div className="space-y-3">
                <Label className="text-gray-300">
                  {lang === 'ar' ? 'المخاطرة لكل صفقة' : 'Risk Per Trade'}: {riskPerTrade[0]}%
                </Label>
                <Slider
                  value={riskPerTrade}
                  onValueChange={setRiskPerTrade}
                  max={10}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-4">
            {!isRunning ? (
              <Button 
                onClick={runBacktest}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تشغيل الاختبار' : 'Run Backtest'}
              </Button>
            ) : (
              <Button 
                onClick={stopBacktest}
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'إيقاف الاختبار' : 'Stop Backtest'}
              </Button>
            )}

            {results && (
              <Button 
                onClick={exportResults}
                variant="outline"
                className="border-gray-600"
              >
                <Download className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تصدير النتائج' : 'Export Results'}
              </Button>
            )}

            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
            </Button>
          </div>

          {/* مؤشر التحميل */}
          {isRunning && (
            <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                <span className="text-blue-300">
                  {lang === 'ar' ? 'جاري تشغيل الاختبار الخلفي...' : 'Running backtest...'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* النتائج */}
      {results && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-trading-card">
            <TabsTrigger value="overview">
              {lang === 'ar' ? 'النظرة العامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="performance">
              {lang === 'ar' ? 'الأداء' : 'Performance'}
            </TabsTrigger>
            <TabsTrigger value="trades">
              {lang === 'ar' ? 'الصفقات' : 'Trades'}
            </TabsTrigger>
            <TabsTrigger value="analysis">
              {lang === 'ar' ? 'التحليل' : 'Analysis'}
            </TabsTrigger>
          </TabsList>

          {/* نظرة عامة على النتائج */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-400" />
                    <div>
                      <div className="text-lg font-bold text-white">
                        {results.totalReturn.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'إجمالي العائد' : 'Total Return'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-blue-400" />
                    <div>
                      <div className="text-lg font-bold text-white">
                        {results.sharpeRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'نسبة شارب' : 'Sharpe Ratio'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-red-400" />
                    <div>
                      <div className="text-lg font-bold text-white">
                        {results.maxDrawdown.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'أقصى سحب' : 'Max Drawdown'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-purple-400" />
                    <div>
                      <div className="text-lg font-bold text-white">
                        {results.winRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الإحصائيات المفصلة */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'الإحصائيات المفصلة' : 'Detailed Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-bold text-white">
                      {lang === 'ar' ? 'إحصائيات العائد' : 'Return Statistics'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'العائد السنوي' : 'Annualized Return'}
                        </span>
                        <span className="text-white">{results.annualizedReturn.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'عامل الربح' : 'Profit Factor'}
                        </span>
                        <span className="text-white">{results.profitFactor.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'نسبة كالمار' : 'Calmar Ratio'}
                        </span>
                        <span className="text-white">{results.calmarRatio.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-white">
                      {lang === 'ar' ? 'إحصائيات الصفقات' : 'Trade Statistics'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'إجمالي الصفقات' : 'Total Trades'}
                        </span>
                        <span className="text-white">{results.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'متوسط الربح' : 'Average Win'}
                        </span>
                        <span className="text-green-400">{results.averageWin.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'متوسط الخسارة' : 'Average Loss'}
                        </span>
                        <span className="text-red-400">{results.averageLoss.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-white">
                      {lang === 'ar' ? 'إحصائيات المخاطر' : 'Risk Statistics'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'نسبة سورتينو' : 'Sortino Ratio'}
                        </span>
                        <span className="text-white">{results.sortinoRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'عامل التعافي' : 'Recovery Factor'}
                        </span>
                        <span className="text-white">{results.recoveryFactor.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'أكبر ربح' : 'Largest Win'}
                        </span>
                        <span className="text-green-400">{results.largestWin.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الأداء */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* منحنى الأرباح */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    {lang === 'ar' ? 'منحنى الأرباح' : 'Equity Curve'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={equityCurve}>
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
                          dataKey="value" 
                          stroke="#22C55E" 
                          strokeWidth={2}
                          name="قيمة الحساب"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* منحنى السحب */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    {lang === 'ar' ? 'منحنى السحب' : 'Drawdown Curve'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={drawdownData}>
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
                          dataKey="drawdown" 
                          stroke="#EF4444" 
                          strokeWidth={2}
                          name="السحب %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* الصفقات */}
          <TabsContent value="trades" className="space-y-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'تفاصيل الصفقات' : 'Trade Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {trades.slice(-20).map((trade, index) => (
                    <div key={index} className="p-3 bg-trading-secondary rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={trade.type === 'BUY' ? 'default' : 'destructive'}
                            className={trade.type === 'BUY' ? 'bg-green-600' : 'bg-red-600'}
                          >
                            {trade.type}
                          </Badge>
                          <span className="text-white">{trade.date}</span>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "font-bold",
                            trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                          )}>
                            {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            {trade.duration}h
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التحليل */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'تحليل متقدم' : 'Advanced Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Zap className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {lang === 'ar' ? 'التحليل المتقدم' : 'Advanced Analysis'}
                  </h3>
                  <p className="text-gray-400">
                    {lang === 'ar' 
                      ? 'سيتم إضافة المزيد من أدوات التحليل المتقدم قريباً'
                      : 'More advanced analysis tools will be added soon'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default StrategyBacktesting;
