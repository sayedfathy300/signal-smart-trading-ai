import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';
import { ArrowRight, Download, RefreshCw } from 'lucide-react';

interface StrategyBacktestingProps {
  lang?: 'en' | 'ar';
}

interface BacktestResults {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  netProfit: number;
  equity: number[];
  trades: {
    date: string;
    pnl: number;
    type: 'LONG' | 'SHORT';
    symbol: string;
  }[];
}

const StrategyBacktesting = ({ lang = 'ar' }: StrategyBacktestingProps) => {
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResults | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [initialCapital, setInitialCapital] = useState(10000);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [useStopLoss, setUseStopLoss] = useState(true);
  const [useTakeProfit, setUseTakeProfit] = useState(true);
  const [stopLossPercent, setStopLossPercent] = useState(2);
  const [takeProfitPercent, setTakeProfitPercent] = useState(4);

  const runBacktest = () => {
    setIsBacktesting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock backtest results
      const mockResults: BacktestResults = {
        totalTrades: 124,
        winRate: 62.5,
        profitFactor: 1.87,
        sharpeRatio: 1.34,
        maxDrawdown: 12.8,
        netProfit: 3245.78,
        equity: Array(100).fill(0).map((_, i) => ({
          date: `2023-${Math.floor(i / 8) + 1}-${(i % 8) * 4 + 1}`,
          value: initialCapital * (1 + (Math.sin(i / 10) * 0.1) + (i / 100))
        })),
        trades: Array(20).fill(0).map((_, i) => ({
          date: `2023-${Math.floor(i / 2) + 1}-${(i % 4) * 7 + 1}`,
          pnl: Math.random() > 0.4 ? Math.random() * 500 : -Math.random() * 300,
          type: Math.random() > 0.5 ? 'LONG' : 'SHORT',
          symbol: selectedSymbol
        }))
      };
      
      setBacktestResults(mockResults);
      setIsBacktesting(false);
    }, 2000);
  };

  const downloadResults = () => {
    if (!backtestResults) return;
    
    const jsonString = JSON.stringify(backtestResults, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = `backtest-${selectedSymbol}-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            {lang === 'ar' ? 'إعدادات اختبار الاستراتيجية' : 'Strategy Backtest Settings'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {lang === 'ar' ? 'قم بتكوين معلمات الاختبار الخلفي لاستراتيجيتك' : 'Configure the backtest parameters for your strategy'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symbol" className="text-gray-300">
                  {lang === 'ar' ? 'الرمز' : 'Symbol'}
                </Label>
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger id="symbol" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder={lang === 'ar' ? 'اختر الرمز' : 'Select symbol'} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                    <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                    <SelectItem value="BNBUSDT">BNB/USDT</SelectItem>
                    <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
                    <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeframe" className="text-gray-300">
                  {lang === 'ar' ? 'الإطار الزمني' : 'Timeframe'}
                </Label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger id="timeframe" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder={lang === 'ar' ? 'اختر الإطار الزمني' : 'Select timeframe'} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="1m">1m</SelectItem>
                    <SelectItem value="5m">5m</SelectItem>
                    <SelectItem value="15m">15m</SelectItem>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="4h">4h</SelectItem>
                    <SelectItem value="1d">1d</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-300">
                    {lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-300">
                    {lang === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="initialCapital" className="text-gray-300">
                  {lang === 'ar' ? 'رأس المال الأولي' : 'Initial Capital'} (USDT)
                </Label>
                <Input
                  id="initialCapital"
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {lang === 'ar' ? 'المخاطرة لكل صفقة' : 'Risk Per Trade'} ({riskPerTrade}%)
                </Label>
                <Slider
                  value={[riskPerTrade]}
                  min={0.1}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => setRiskPerTrade(value[0])}
                  className="py-4"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useStopLoss"
                    checked={useStopLoss}
                    onCheckedChange={setUseStopLoss}
                  />
                  <Label htmlFor="useStopLoss" className="text-gray-300">
                    {lang === 'ar' ? 'وقف الخسارة' : 'Stop Loss'}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useTakeProfit"
                    checked={useTakeProfit}
                    onCheckedChange={setUseTakeProfit}
                  />
                  <Label htmlFor="useTakeProfit" className="text-gray-300">
                    {lang === 'ar' ? 'جني الأرباح' : 'Take Profit'}
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'نسبة وقف الخسارة' : 'Stop Loss %'} ({stopLossPercent}%)
                  </Label>
                  <Slider
                    disabled={!useStopLoss}
                    value={[stopLossPercent]}
                    min={0.5}
                    max={10}
                    step={0.5}
                    onValueChange={(value) => setStopLossPercent(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'نسبة جني الأرباح' : 'Take Profit %'} ({takeProfitPercent}%)
                  </Label>
                  <Slider
                    disabled={!useTakeProfit}
                    value={[takeProfitPercent]}
                    min={0.5}
                    max={20}
                    step={0.5}
                    onValueChange={(value) => setTakeProfitPercent(value[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={runBacktest}
              disabled={isBacktesting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isBacktesting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {lang === 'ar' ? 'جاري الاختبار...' : 'Running Backtest...'}
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  {lang === 'ar' ? 'تشغيل الاختبار' : 'Run Backtest'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {backtestResults && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'نتائج الاختبار' : 'Backtest Results'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {lang === 'ar' ? `${selectedSymbol} على إطار ${selectedTimeframe}` : `${selectedSymbol} on ${selectedTimeframe} timeframe`}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadResults}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Download className="mr-2 h-4 w-4" />
              {lang === 'ar' ? 'تنزيل النتائج' : 'Download Results'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'إجمالي الصفقات' : 'Total Trades'}
                </div>
                <div className="text-white text-2xl font-bold">
                  {backtestResults.totalTrades}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'معدل الربح' : 'Win Rate'}
                </div>
                <div className="text-white text-2xl font-bold">
                  {backtestResults.winRate}%
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'عامل الربح' : 'Profit Factor'}
                </div>
                <div className="text-white text-2xl font-bold">
                  {backtestResults.profitFactor}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'نسبة شارب' : 'Sharpe Ratio'}
                </div>
                <div className="text-white text-2xl font-bold">
                  {backtestResults.sharpeRatio}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'أقصى انخفاض' : 'Max Drawdown'}
                </div>
                <div className="text-white text-2xl font-bold">
                  {backtestResults.maxDrawdown}%
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'صافي الربح' : 'Net Profit'}
                </div>
                <div className={`text-2xl font-bold ${backtestResults.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {backtestResults.netProfit >= 0 ? '+' : ''}{backtestResults.netProfit.toFixed(2)} USDT
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'العائد' : 'Return'}
                </div>
                <div className={`text-2xl font-bold ${backtestResults.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {backtestResults.netProfit >= 0 ? '+' : ''}{((backtestResults.netProfit / initialCapital) * 100).toFixed(2)}%
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="equity" className="w-full">
              <TabsList className="bg-gray-800 border-gray-700">
                <TabsTrigger value="equity">
                  {lang === 'ar' ? 'منحنى الأسهم' : 'Equity Curve'}
                </TabsTrigger>
                <TabsTrigger value="trades">
                  {lang === 'ar' ? 'الصفقات' : 'Trades'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="equity" className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={backtestResults.equity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      dot={false}
                      name={lang === 'ar' ? 'قيمة المحفظة' : 'Portfolio Value'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="trades" className="pt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={backtestResults?.trades || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar 
                      dataKey="pnl" 
                      name={lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}
                    >
                      {(backtestResults?.trades || []).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.pnl > 0 ? "#00FF88" : "#FF4444"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrategyBacktesting;
