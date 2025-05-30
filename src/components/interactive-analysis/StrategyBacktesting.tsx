
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Calendar,
  DollarSign,
  Percent,
  AlertTriangle
} from 'lucide-react';

interface StrategyBacktestingProps {
  lang: 'en' | 'ar';
}

interface BacktestConfig {
  strategyName: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  riskPerTrade: number;
  maxOpenTrades: number;
  commission: number;
  slippage: number;
}

interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  finalCapital: number;
  trades: Trade[];
  equityCurve: EquityPoint[];
  monthlyReturns: MonthlyReturn[];
}

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  commission: number;
  duration: number;
}

interface EquityPoint {
  date: string;
  equity: number;
  drawdown: number;
}

interface MonthlyReturn {
  month: string;
  return: number;
}

const StrategyBacktesting: React.FC<StrategyBacktestingProps> = ({ lang }) => {
  const [config, setConfig] = useState<BacktestConfig>({
    strategyName: 'RSI Strategy',
    symbol: 'EUR/USD',
    timeframe: '1day',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    initialCapital: 10000,
    riskPerTrade: 2,
    maxOpenTrades: 1,
    commission: 0.1,
    slippage: 0.05
  });

  const [strategy, setStrategy] = useState(`
// RSI Strategy Example
def strategy():
    if RSI(14) < 30 and close > SMA(20):
        buy()
    elif RSI(14) > 70:
        sell()
    
    # Stop Loss and Take Profit
    if position_size > 0:
        if close < entry_price * 0.98:  # 2% Stop Loss
            sell()
        elif close > entry_price * 1.04:  # 4% Take Profit
            sell()
`);

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [activeTab, setActiveTab] = useState('setup');

  const symbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAUUSD', 'BTC/USD', 'ETH/USD'];
  const timeframes = [
    { value: '1min', label: lang === 'ar' ? '1 دقيقة' : '1 Minute' },
    { value: '5min', label: lang === 'ar' ? '5 دقائق' : '5 Minutes' },
    { value: '15min', label: lang === 'ar' ? '15 دقيقة' : '15 Minutes' },
    { value: '1hour', label: lang === 'ar' ? '1 ساعة' : '1 Hour' },
    { value: '4hour', label: lang === 'ar' ? '4 ساعات' : '4 Hours' },
    { value: '1day', label: lang === 'ar' ? '1 يوم' : '1 Day' }
  ];

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsRunning(false);
            generateMockResults();
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const generateMockResults = () => {
    const mockTrades: Trade[] = Array.from({ length: 25 }, (_, i) => {
      const entryDate = new Date(2023, 0, i * 14);
      const exitDate = new Date(entryDate.getTime() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000);
      const entryPrice = 1.1000 + Math.random() * 0.1;
      const exitPrice = entryPrice * (0.98 + Math.random() * 0.06);
      const pnl = (exitPrice - entryPrice) * 10000;
      
      return {
        id: `trade_${i}`,
        symbol: config.symbol,
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        entryDate: entryDate.toISOString().split('T')[0],
        exitDate: exitDate.toISOString().split('T')[0],
        entryPrice,
        exitPrice,
        quantity: 10000,
        pnl,
        pnlPercent: (pnl / (entryPrice * 10000)) * 100,
        commission: config.commission,
        duration: Math.ceil((exitDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      };
    });

    const winningTrades = mockTrades.filter(t => t.pnl > 0);
    const losingTrades = mockTrades.filter(t => t.pnl < 0);
    const totalPnL = mockTrades.reduce((sum, t) => sum + t.pnl, 0);

    const equityCurve: EquityPoint[] = [];
    let runningEquity = config.initialCapital;
    let maxEquity = config.initialCapital;
    
    mockTrades.forEach((trade, i) => {
      runningEquity += trade.pnl;
      maxEquity = Math.max(maxEquity, runningEquity);
      const drawdown = ((maxEquity - runningEquity) / maxEquity) * 100;
      
      equityCurve.push({
        date: trade.exitDate,
        equity: runningEquity,
        drawdown
      });
    });

    const monthlyReturns: MonthlyReturn[] = [
      { month: '2023-01', return: 2.5 },
      { month: '2023-02', return: -1.2 },
      { month: '2023-03', return: 3.8 },
      { month: '2023-04', return: 1.5 },
      { month: '2023-05', return: -0.8 },
      { month: '2023-06', return: 4.2 },
      { month: '2023-07', return: 2.1 },
      { month: '2023-08', return: -1.5 },
      { month: '2023-09', return: 3.2 },
      { month: '2023-10', return: 1.8 },
      { month: '2023-11', return: -2.1 },
      { month: '2023-12', return: 2.9 }
    ];

    setResults({
      totalTrades: mockTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / mockTrades.length) * 100,
      totalReturn: (totalPnL / config.initialCapital) * 100,
      maxDrawdown: Math.max(...equityCurve.map(e => e.drawdown)),
      sharpeRatio: 1.85,
      profitFactor: Math.abs(winningTrades.reduce((sum, t) => sum + t.pnl, 0)) / 
                    Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0)),
      averageWin: winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length,
      averageLoss: losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length,
      largestWin: Math.max(...winningTrades.map(t => t.pnl)),
      largestLoss: Math.min(...losingTrades.map(t => t.pnl)),
      consecutiveWins: 5,
      consecutiveLosses: 3,
      finalCapital: config.initialCapital + totalPnL,
      trades: mockTrades,
      equityCurve,
      monthlyReturns
    });
  };

  const runBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
  };

  const stopBacktest = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const resetBacktest = () => {
    setProgress(0);
    setResults(null);
  };

  const exportResults = () => {
    if (!results) return;
    
    const data = {
      config,
      results,
      strategy
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest_${config.strategyName}_${Date.now()}.json`;
    a.click();
  };

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {lang === 'ar' ? 'اختبار الاستراتيجيات الخلفي' : 'Strategy Backtesting'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">
              {lang === 'ar' ? 'الإعداد' : 'Setup'}
            </TabsTrigger>
            <TabsTrigger value="strategy">
              {lang === 'ar' ? 'الاستراتيجية' : 'Strategy'}
            </TabsTrigger>
            <TabsTrigger value="results">
              {lang === 'ar' ? 'النتائج' : 'Results'}
            </TabsTrigger>
            <TabsTrigger value="trades">
              {lang === 'ar' ? 'الصفقات' : 'Trades'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {lang === 'ar' ? 'إعدادات الاختبار' : 'Backtest Settings'}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="strategyName" className="text-gray-400">
                      {lang === 'ar' ? 'اسم الاستراتيجية' : 'Strategy Name'}
                    </Label>
                    <Input
                      id="strategyName"
                      value={config.strategyName}
                      onChange={(e) => setConfig(prev => ({ ...prev, strategyName: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="symbol" className="text-gray-400">
                      {lang === 'ar' ? 'الرمز' : 'Symbol'}
                    </Label>
                    <Select
                      value={config.symbol}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, symbol: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {symbols.map(symbol => (
                          <SelectItem key={symbol} value={symbol} className="text-white">
                            {symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeframe" className="text-gray-400">
                      {lang === 'ar' ? 'الإطار الزمني' : 'Timeframe'}
                    </Label>
                    <Select
                      value={config.timeframe}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, timeframe: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {timeframes.map(tf => (
                          <SelectItem key={tf.value} value={tf.value} className="text-white">
                            {tf.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="startDate" className="text-gray-400">
                        {lang === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={config.startDate}
                        onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-gray-400">
                        {lang === 'ar' ? 'تاريخ النهاية' : 'End Date'}
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={config.endDate}
                        onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {lang === 'ar' ? 'إعدادات المخاطر' : 'Risk Settings'}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="initialCapital" className="text-gray-400">
                      {lang === 'ar' ? 'رأس المال الأولي ($)' : 'Initial Capital ($)'}
                    </Label>
                    <Input
                      id="initialCapital"
                      type="number"
                      value={config.initialCapital}
                      onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="riskPerTrade" className="text-gray-400">
                      {lang === 'ar' ? 'المخاطرة لكل صفقة (%)' : 'Risk Per Trade (%)'}
                    </Label>
                    <Input
                      id="riskPerTrade"
                      type="number"
                      step="0.1"
                      value={config.riskPerTrade}
                      onChange={(e) => setConfig(prev => ({ ...prev, riskPerTrade: Number(e.target.value) }))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxOpenTrades" className="text-gray-400">
                      {lang === 'ar' ? 'أقصى صفقات مفتوحة' : 'Max Open Trades'}
                    </Label>
                    <Input
                      id="maxOpenTrades"
                      type="number"
                      value={config.maxOpenTrades}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxOpenTrades: Number(e.target.value) }))}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="commission" className="text-gray-400">
                        {lang === 'ar' ? 'العمولة (%)' : 'Commission (%)'}
                      </Label>
                      <Input
                        id="commission"
                        type="number"
                        step="0.01"
                        value={config.commission}
                        onChange={(e) => setConfig(prev => ({ ...prev, commission: Number(e.target.value) }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slippage" className="text-gray-400">
                        {lang === 'ar' ? 'الانزلاق (%)' : 'Slippage (%)'}
                      </Label>
                      <Input
                        id="slippage"
                        type="number"
                        step="0.01"
                        value={config.slippage}
                        onChange={(e) => setConfig(prev => ({ ...prev, slippage: Number(e.target.value) }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={runBacktest}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تشغيل الاختبار' : 'Run Backtest'}
              </Button>

              {isRunning && (
                <Button onClick={stopBacktest} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'إيقاف' : 'Stop'}
                </Button>
              )}

              <Button onClick={resetBacktest} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </Button>

              {results && (
                <Button onClick={exportResults} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'تصدير النتائج' : 'Export Results'}
                </Button>
              )}
            </div>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {lang === 'ar' ? 'تقدم الاختبار:' : 'Backtest Progress:'}
                  </span>
                  <span className="text-white">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <div>
              <Label htmlFor="strategy" className="text-gray-400">
                {lang === 'ar' ? 'كود الاستراتيجية' : 'Strategy Code'}
              </Label>
              <Textarea
                id="strategy"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white font-mono mt-2"
                rows={20}
                placeholder={lang === 'ar' ? 'اكتب كود استراتيجيتك هنا...' : 'Write your strategy code here...'}
              />
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">
                {lang === 'ar' ? 'أمثلة على الدوال المتاحة:' : 'Available Functions:'}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-300">
                <div>
                  <code>RSI(period)</code> - {lang === 'ar' ? 'مؤشر القوة النسبية' : 'Relative Strength Index'}
                </div>
                <div>
                  <code>SMA(period)</code> - {lang === 'ar' ? 'المتوسط المتحرك البسيط' : 'Simple Moving Average'}
                </div>
                <div>
                  <code>EMA(period)</code> - {lang === 'ar' ? 'المتوسط المتحرك الأسي' : 'Exponential Moving Average'}
                </div>
                <div>
                  <code>MACD(fast, slow, signal)</code> - {lang === 'ar' ? 'مؤشر الماكد' : 'MACD Indicator'}
                </div>
                <div>
                  <code>buy()</code> - {lang === 'ar' ? 'إشارة شراء' : 'Buy Signal'}
                </div>
                <div>
                  <code>sell()</code> - {lang === 'ar' ? 'إشارة بيع' : 'Sell Signal'}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {results ? (
              <>
                {/* Performance Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <div className="text-2xl font-bold text-white">
                        {results.totalReturn.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'العائد الإجمالي' : 'Total Return'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <div className="text-2xl font-bold text-white">
                        {results.winRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <TrendingDown className="h-8 w-8 mx-auto mb-2 text-red-400" />
                      <div className="text-2xl font-bold text-white">
                        {results.maxDrawdown.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'أقصى تراجع' : 'Max Drawdown'}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      <div className="text-2xl font-bold text-white">
                        {results.sharpeRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'نسبة شارب' : 'Sharpe Ratio'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Equity Curve */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {lang === 'ar' ? 'منحنى الرأسمال' : 'Equity Curve'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={results.equityCurve}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '6px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="equity" 
                            stroke="#00FF88" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Returns */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {lang === 'ar' ? 'العوائد الشهرية' : 'Monthly Returns'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.monthlyReturns}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '6px'
                            }}
                          />
                          <Bar 
                            dataKey="return" 
                            fill={(entry: any) => entry.return >= 0 ? '#00FF88' : '#FF4444'}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">
                        {lang === 'ar' ? 'إحصائيات الصفقات' : 'Trade Statistics'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'إجمالي الصفقات:' : 'Total Trades:'}</span>
                        <span className="text-white">{results.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'الصفقات الرابحة:' : 'Winning Trades:'}</span>
                        <span className="text-green-400">{results.winningTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'الصفقات الخاسرة:' : 'Losing Trades:'}</span>
                        <span className="text-red-400">{results.losingTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'عامل الربح:' : 'Profit Factor:'}</span>
                        <span className="text-white">{results.profitFactor.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'متوسط الربح:' : 'Average Win:'}</span>
                        <span className="text-green-400">${results.averageWin.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'متوسط الخسارة:' : 'Average Loss:'}</span>
                        <span className="text-red-400">${results.averageLoss.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">
                        {lang === 'ar' ? 'إحصائيات الأداء' : 'Performance Statistics'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'أكبر ربح:' : 'Largest Win:'}</span>
                        <span className="text-green-400">${results.largestWin.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'أكبر خسارة:' : 'Largest Loss:'}</span>
                        <span className="text-red-400">${results.largestLoss.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'أرباح متتالية:' : 'Consecutive Wins:'}</span>
                        <span className="text-white">{results.consecutiveWins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'خسائر متتالية:' : 'Consecutive Losses:'}</span>
                        <span className="text-white">{results.consecutiveLosses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'رأس المال النهائي:' : 'Final Capital:'}</span>
                        <span className="text-white">${results.finalCapital.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">
                  {lang === 'ar' ? 'قم بتشغيل الاختبار لعرض النتائج' : 'Run a backtest to see results'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            {results?.trades ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">
                    {lang === 'ar' ? 'سجل الصفقات' : 'Trade Log'}
                  </h3>
                  <Badge variant="secondary">
                    {results.trades.length} {lang === 'ar' ? 'صفقة' : 'trades'}
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 px-3 text-gray-400">
                          {lang === 'ar' ? 'النوع' : 'Type'}
                        </th>
                        <th className="text-left py-2 px-3 text-gray-400">
                          {lang === 'ar' ? 'الدخول' : 'Entry'}
                        </th>
                        <th className="text-left py-2 px-3 text-gray-400">
                          {lang === 'ar' ? 'الخروج' : 'Exit'}
                        </th>
                        <th className="text-left py-2 px-3 text-gray-400">
                          {lang === 'ar' ? 'المدة' : 'Duration'}
                        </th>
                        <th className="text-left py-2 px-3 text-gray-400">
                          {lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}
                        </th>
                        <th className="text-left py-2 px-3 text-gray-400">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.trades.map(trade => (
                        <tr key={trade.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-2 px-3">
                            <Badge variant={trade.type === 'BUY' ? 'default' : 'secondary'}>
                              {trade.type}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-white">
                            {trade.entryPrice.toFixed(4)}
                            <div className="text-xs text-gray-400">{trade.entryDate}</div>
                          </td>
                          <td className="py-2 px-3 text-white">
                            {trade.exitPrice.toFixed(4)}
                            <div className="text-xs text-gray-400">{trade.exitDate}</div>
                          </td>
                          <td className="py-2 px-3 text-gray-400">
                            {trade.duration} {lang === 'ar' ? 'يوم' : 'days'}
                          </td>
                          <td className={`py-2 px-3 ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${trade.pnl.toFixed(2)}
                          </td>
                          <td className={`py-2 px-3 ${trade.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.pnlPercent.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">
                  {lang === 'ar' ? 'لا توجد صفقات للعرض' : 'No trades to display'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StrategyBacktesting;
