
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Clock,
  BarChart3,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';

interface Trade {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  entryTime: number;
  exitTime?: number;
  exitPrice?: number;
  pnl: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  stopLoss?: number;
  takeProfit?: number;
}

interface PaperAccount {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPnL: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
}

interface PaperTradingSimulatorProps {
  lang?: 'en' | 'ar';
}

const PaperTradingSimulator = ({ lang = 'ar' }: PaperTradingSimulatorProps) => {
  const [account, setAccount] = useState<PaperAccount>({
    balance: 10000,
    equity: 10000,
    margin: 0,
    freeMargin: 10000,
    marginLevel: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalPnL: 0,
    winRate: 0,
    profitFactor: 0,
    maxDrawdown: 0
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');
  const [tradeType, setTradeType] = useState<'LONG' | 'SHORT'>('LONG');
  const [quantity, setQuantity] = useState('1');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({
    'BTC/USDT': 45000,
    'ETH/USDT': 3000,
    'BNB/USDT': 300,
    'ADA/USDT': 0.5,
    'SOL/USDT': 100,
    'DOT/USDT': 7
  });

  const [performanceData, setPerformanceData] = useState([
    { time: '09:00', balance: 10000, equity: 10000 },
    { time: '10:00', balance: 10000, equity: 10150 },
    { time: '11:00', balance: 10000, equity: 9980 },
    { time: '12:00', balance: 10000, equity: 10320 },
    { time: '13:00', balance: 10000, equity: 10280 },
    { time: '14:00', balance: 10000, equity: 10450 },
    { time: '15:00', balance: 10000, equity: 10380 }
  ]);

  // محاكاة تغير الأسعار
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrices(prev => {
        const newPrices = { ...prev };
        Object.keys(newPrices).forEach(symbol => {
          const change = (Math.random() - 0.5) * 0.02; // تغيير ±1%
          newPrices[symbol] = newPrices[symbol] * (1 + change);
        });
        return newPrices;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // تحديث الصفقات المفتوحة
  useEffect(() => {
    setTrades(prevTrades => 
      prevTrades.map(trade => {
        if (trade.status === 'OPEN') {
          const currentPrice = currentPrices[trade.symbol];
          const pnl = trade.side === 'LONG' 
            ? (currentPrice - trade.entryPrice) * trade.quantity
            : (trade.entryPrice - currentPrice) * trade.quantity;
          const pnlPercent = (pnl / (trade.entryPrice * trade.quantity)) * 100;

          // فحص Stop Loss و Take Profit
          let updatedTrade = { ...trade, currentPrice, pnl, pnlPercent };
          
          if (trade.side === 'LONG') {
            if (trade.stopLoss && currentPrice <= trade.stopLoss) {
              updatedTrade = {
                ...updatedTrade,
                status: 'CLOSED' as const,
                exitPrice: trade.stopLoss,
                exitTime: Date.now(),
                pnl: (trade.stopLoss - trade.entryPrice) * trade.quantity
              };
            } else if (trade.takeProfit && currentPrice >= trade.takeProfit) {
              updatedTrade = {
                ...updatedTrade,
                status: 'CLOSED' as const,
                exitPrice: trade.takeProfit,
                exitTime: Date.now(),
                pnl: (trade.takeProfit - trade.entryPrice) * trade.quantity
              };
            }
          } else {
            if (trade.stopLoss && currentPrice >= trade.stopLoss) {
              updatedTrade = {
                ...updatedTrade,
                status: 'CLOSED' as const,
                exitPrice: trade.stopLoss,
                exitTime: Date.now(),
                pnl: (trade.entryPrice - trade.stopLoss) * trade.quantity
              };
            } else if (trade.takeProfit && currentPrice <= trade.takeProfit) {
              updatedTrade = {
                ...updatedTrade,
                status: 'CLOSED' as const,
                exitPrice: trade.takeProfit,
                exitTime: Date.now(),
                pnl: (trade.entryPrice - trade.takeProfit) * trade.quantity
              };
            }
          }

          return updatedTrade;
        }
        return trade;
      })
    );
  }, [currentPrices]);

  // تحديث إحصائيات الحساب
  useEffect(() => {
    const openTrades = trades.filter(t => t.status === 'OPEN');
    const closedTrades = trades.filter(t => t.status === 'CLOSED');
    
    const totalOpenPnL = openTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const totalClosedPnL = closedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    
    const equity = account.balance + totalOpenPnL + totalClosedPnL;
    const winningTrades = closedTrades.filter(t => t.pnl > 0).length;
    const losingTrades = closedTrades.filter(t => t.pnl <= 0).length;
    const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;

    setAccount(prev => ({
      ...prev,
      equity,
      totalTrades: trades.length,
      winningTrades,
      losingTrades,
      totalPnL: totalClosedPnL,
      winRate
    }));
  }, [trades, account.balance]);

  const openTrade = () => {
    const currentPrice = currentPrices[selectedSymbol];
    const tradeQuantity = parseFloat(quantity);
    
    if (!tradeQuantity || tradeQuantity <= 0) return;

    const newTrade: Trade = {
      id: uuidv4(),
      symbol: selectedSymbol,
      side: tradeType,
      entryPrice: currentPrice,
      currentPrice,
      quantity: tradeQuantity,
      entryTime: Date.now(),
      pnl: 0,
      pnlPercent: 0,
      status: 'OPEN',
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined
    };

    setTrades(prev => [...prev, newTrade]);
  };

  const closeTrade = (tradeId: string) => {
    setTrades(prev => prev.map(trade => {
      if (trade.id === tradeId && trade.status === 'OPEN') {
        return {
          ...trade,
          status: 'CLOSED' as const,
          exitPrice: trade.currentPrice,
          exitTime: Date.now()
        };
      }
      return trade;
    }));
  };

  const resetAccount = () => {
    setAccount({
      balance: 10000,
      equity: 10000,
      margin: 0,
      freeMargin: 10000,
      marginLevel: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalPnL: 0,
      winRate: 0,
      profitFactor: 0,
      maxDrawdown: 0
    });
    setTrades([]);
  };

  const openTrades = trades.filter(t => t.status === 'OPEN');
  const closedTrades = trades.filter(t => t.status === 'CLOSED');

  return (
    <div className="space-y-6">
      {/* إحصائيات الحساب */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-lg font-bold text-white">
                  ${account.equity.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'رصيد الحساب' : 'Account Equity'}
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
                  {account.winRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
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
                  {account.totalTrades}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'إجمالي الصفقات' : 'Total Trades'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-yellow-400" />
              <div>
                <div className={cn(
                  "text-lg font-bold",
                  account.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {account.totalPnL >= 0 ? '+' : ''}${account.totalPnL.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'إجمالي الأرباح/الخسائر' : 'Total P&L'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trading" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="trading">
            {lang === 'ar' ? 'التداول' : 'Trading'}
          </TabsTrigger>
          <TabsTrigger value="positions">
            {lang === 'ar' ? 'المراكز' : 'Positions'}
          </TabsTrigger>
          <TabsTrigger value="history">
            {lang === 'ar' ? 'التاريخ' : 'History'}
          </TabsTrigger>
          <TabsTrigger value="performance">
            {lang === 'ar' ? 'الأداء' : 'Performance'}
          </TabsTrigger>
        </TabsList>

        {/* واجهة التداول */}
        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* نموذج فتح صفقة */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'فتح صفقة جديدة' : 'Open New Trade'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'زوج العملة' : 'Symbol'}
                  </Label>
                  <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                    <SelectTrigger className="bg-trading-secondary border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-trading-secondary border-gray-600">
                      {Object.keys(currentPrices).map(symbol => (
                        <SelectItem key={symbol} value={symbol}>
                          {symbol} - ${currentPrices[symbol].toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      {lang === 'ar' ? 'نوع الصفقة' : 'Trade Type'}
                    </Label>
                    <Select 
                      value={tradeType} 
                      onValueChange={(value: string) => setTradeType(value as 'LONG' | 'SHORT')}
                    >
                      <SelectTrigger className="bg-trading-secondary border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-trading-secondary border-gray-600">
                        <SelectItem value="LONG">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            LONG
                          </div>
                        </SelectItem>
                        <SelectItem value="SHORT">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-400" />
                            SHORT
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      {lang === 'ar' ? 'الكمية' : 'Quantity'}
                    </Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="bg-trading-secondary border-gray-600"
                      placeholder="1.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      {lang === 'ar' ? 'وقف الخسارة' : 'Stop Loss'}
                    </Label>
                    <Input
                      type="number"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      className="bg-trading-secondary border-gray-600"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      {lang === 'ar' ? 'جني الأرباح' : 'Take Profit'}
                    </Label>
                    <Input
                      type="number"
                      value={takeProfit}
                      onChange={(e) => setTakeProfit(e.target.value)}
                      className="bg-trading-secondary border-gray-600"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={openTrade}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'فتح الصفقة' : 'Open Trade'}
                  </Button>
                  <Button 
                    onClick={resetAccount}
                    variant="outline"
                    className="border-gray-600"
                  >
                    {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* الأسعار الحية */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'الأسعار الحية' : 'Live Prices'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(currentPrices).map(([symbol, price]) => (
                    <div key={symbol} className="flex items-center justify-between p-2 bg-trading-secondary rounded">
                      <span className="font-medium text-white">{symbol}</span>
                      <span className="text-yellow-400">${price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* المراكز المفتوحة */}
        <TabsContent value="positions" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'المراكز المفتوحة' : 'Open Positions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {openTrades.length > 0 ? (
                <div className="space-y-3">
                  {openTrades.map((trade) => (
                    <div key={trade.id} className="p-4 bg-trading-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={trade.side === 'LONG' ? 'default' : 'destructive'}
                            className={trade.side === 'LONG' ? 'bg-green-600' : 'bg-red-600'}
                          >
                            {trade.side}
                          </Badge>
                          <span className="font-medium text-white">{trade.symbol}</span>
                          <span className="text-gray-400">x{trade.quantity}</span>
                        </div>
                        <Button
                          onClick={() => closeTrade(trade.id)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600"
                        >
                          {lang === 'ar' ? 'إغلاق' : 'Close'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'سعر الدخول' : 'Entry Price'}
                          </div>
                          <div className="text-white">${trade.entryPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'السعر الحالي' : 'Current Price'}
                          </div>
                          <div className="text-white">${trade.currentPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}
                          </div>
                          <div className={cn(
                            "font-medium",
                            trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                          )}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'النسبة المئوية' : 'Percentage'}
                          </div>
                          <div className={cn(
                            "font-medium",
                            trade.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                          )}>
                            {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {lang === 'ar' ? 'لا توجد مراكز مفتوحة' : 'No Open Positions'}
                  </h3>
                  <p className="text-gray-400">
                    {lang === 'ar' ? 'ابدأ التداول لرؤية مراكزك هنا' : 'Start trading to see your positions here'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تاريخ الصفقات */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'تاريخ الصفقات' : 'Trade History'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {closedTrades.length > 0 ? (
                <div className="space-y-3">
                  {closedTrades.slice(-10).reverse().map((trade) => (
                    <div key={trade.id} className="p-4 bg-trading-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={trade.side === 'LONG' ? 'default' : 'destructive'}
                            className={trade.side === 'LONG' ? 'bg-green-600' : 'bg-red-600'}
                          >
                            {trade.side}
                          </Badge>
                          <span className="font-medium text-white">{trade.symbol}</span>
                          <span className="text-gray-400">x{trade.quantity}</span>
                          {trade.pnl >= 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(trade.exitTime!).toLocaleString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'سعر الدخول' : 'Entry'}
                          </div>
                          <div className="text-white">${trade.entryPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'سعر الخروج' : 'Exit'}
                          </div>
                          <div className="text-white">${trade.exitPrice?.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}
                          </div>
                          <div className={cn(
                            "font-medium",
                            trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                          )}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'النسبة' : 'Percentage'}
                          </div>
                          <div className={cn(
                            "font-medium",
                            trade.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                          )}>
                            {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">
                            {lang === 'ar' ? 'المدة' : 'Duration'}
                          </div>
                          <div className="text-white">
                            {Math.round((trade.exitTime! - trade.entryTime) / 60000)}m
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {lang === 'ar' ? 'لا يوجد تاريخ صفقات' : 'No Trade History'}
                  </h3>
                  <p className="text-gray-400">
                    {lang === 'ar' ? 'أغلق بعض الصفقات لرؤية التاريخ' : 'Close some trades to see history'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* الأداء */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'أداء الحساب' : 'Account Performance'}
              </CardTitle>
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
                      dataKey="balance" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="الرصيد"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#22C55E" 
                      strokeWidth={2}
                      name="الحقوق"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaperTradingSimulator;
