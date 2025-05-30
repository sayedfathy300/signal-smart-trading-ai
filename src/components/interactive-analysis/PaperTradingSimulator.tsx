
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Play, 
  Pause, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  AlertCircle,
  Clock,
  Settings,
  RefreshCw,
  Activity,
  PieChart as PieChartIcon
} from 'lucide-react';

interface PaperTradingSimulatorProps {
  lang: 'en' | 'ar';
}

interface Position {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  entryTime: Date;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
  status: 'OPEN' | 'CLOSED';
}

interface Portfolio {
  totalValue: number;
  availableCash: number;
  totalPnL: number;
  totalPnLPercent: number;
  totalTrades: number;
  winningTrades: number;
  positions: Position[];
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
}

interface TradeOrder {
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
}

const PaperTradingSimulator: React.FC<PaperTradingSimulatorProps> = ({ lang }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalValue: 100000,
    availableCash: 100000,
    totalPnL: 0,
    totalPnLPercent: 0,
    totalTrades: 0,
    winningTrades: 0,
    positions: []
  });

  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      symbol: 'EUR/USD',
      price: 1.0850,
      change: 0.0025,
      changePercent: 0.23,
      volume: 1250000,
      high24h: 1.0890,
      low24h: 1.0820
    },
    {
      symbol: 'GBP/USD',
      price: 1.2450,
      change: -0.0015,
      changePercent: -0.12,
      volume: 980000,
      high24h: 1.2480,
      low24h: 1.2420
    },
    {
      symbol: 'USD/JPY',
      price: 150.25,
      change: 0.45,
      changePercent: 0.30,
      volume: 1100000,
      high24h: 150.80,
      low24h: 149.90
    },
    {
      symbol: 'XAUUSD',
      price: 2025.50,
      change: 12.30,
      changePercent: 0.61,
      volume: 450000,
      high24h: 2035.20,
      low24h: 2010.80
    },
    {
      symbol: 'BTC/USD',
      price: 43250.00,
      change: -850.00,
      changePercent: -1.93,
      volume: 125000,
      high24h: 44200.00,
      low24h: 42800.00
    }
  ]);

  const [tradeOrder, setTradeOrder] = useState<TradeOrder>({
    symbol: 'EUR/USD',
    type: 'BUY',
    orderType: 'MARKET',
    quantity: 10000,
    price: undefined,
    stopLoss: undefined,
    takeProfit: undefined
  });

  const [performanceHistory, setPerformanceHistory] = useState<{ date: string; value: number }[]>([
    { date: '2024-01-01', value: 100000 },
    { date: '2024-01-02', value: 100250 },
    { date: '2024-01-03', value: 99800 },
    { date: '2024-01-04', value: 101200 },
    { date: '2024-01-05', value: 100950 }
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMarketData(prev => prev.map(item => {
        const volatility = 0.001;
        const priceChange = (Math.random() - 0.5) * 2 * volatility * item.price;
        const newPrice = item.price + priceChange;
        
        return {
          ...item,
          price: newPrice,
          change: priceChange,
          changePercent: (priceChange / item.price) * 100
        };
      }));

      // Update positions P&L
      setPortfolio(prev => {
        const updatedPositions = prev.positions.map(position => {
          const currentMarketData = marketData.find(m => m.symbol === position.symbol);
          if (!currentMarketData) return position;

          const currentPrice = currentMarketData.price;
          const pnl = position.type === 'LONG' 
            ? (currentPrice - position.entryPrice) * position.quantity
            : (position.entryPrice - currentPrice) * position.quantity;
          const pnlPercent = (pnl / (position.entryPrice * position.quantity)) * 100;

          return {
            ...position,
            currentPrice,
            pnl,
            pnlPercent
          };
        });

        const totalPnL = updatedPositions.reduce((sum, pos) => sum + pos.pnl, 0);
        const totalValue = prev.availableCash + totalPnL + updatedPositions.reduce((sum, pos) => sum + (pos.entryPrice * pos.quantity), 0);

        return {
          ...prev,
          positions: updatedPositions,
          totalValue,
          totalPnL,
          totalPnLPercent: ((totalValue - 100000) / 100000) * 100
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, marketData]);

  const executeOrder = () => {
    const marketPrice = marketData.find(m => m.symbol === tradeOrder.symbol)?.price;
    if (!marketPrice) return;

    const orderValue = tradeOrder.quantity * marketPrice;
    
    if (tradeOrder.type === 'BUY' && orderValue > portfolio.availableCash) {
      alert(lang === 'ar' ? 'رصيد غير كافي!' : 'Insufficient funds!');
      return;
    }

    const newPosition: Position = {
      id: `pos_${Date.now()}`,
      symbol: tradeOrder.symbol,
      type: tradeOrder.type === 'BUY' ? 'LONG' : 'SHORT',
      quantity: tradeOrder.quantity,
      entryPrice: marketPrice,
      currentPrice: marketPrice,
      entryTime: new Date(),
      pnl: 0,
      pnlPercent: 0,
      stopLoss: tradeOrder.stopLoss,
      takeProfit: tradeOrder.takeProfit,
      status: 'OPEN'
    };

    setPortfolio(prev => ({
      ...prev,
      positions: [...prev.positions, newPosition],
      availableCash: tradeOrder.type === 'BUY' 
        ? prev.availableCash - orderValue 
        : prev.availableCash + orderValue,
      totalTrades: prev.totalTrades + 1
    }));

    // Reset order form
    setTradeOrder(prev => ({
      ...prev,
      price: undefined,
      stopLoss: undefined,
      takeProfit: undefined
    }));
  };

  const closePosition = (positionId: string) => {
    setPortfolio(prev => {
      const position = prev.positions.find(p => p.id === positionId);
      if (!position) return prev;

      const closingValue = position.quantity * position.currentPrice;
      const realizedPnL = position.pnl;

      return {
        ...prev,
        positions: prev.positions.map(p => 
          p.id === positionId ? { ...p, status: 'CLOSED' } : p
        ).filter(p => p.status === 'OPEN'),
        availableCash: position.type === 'LONG' 
          ? prev.availableCash + closingValue 
          : prev.availableCash - closingValue + (2 * position.entryPrice * position.quantity),
        winningTrades: realizedPnL > 0 ? prev.winningTrades + 1 : prev.winningTrades
      };
    });
  };

  const resetSimulation = () => {
    setPortfolio({
      totalValue: 100000,
      availableCash: 100000,
      totalPnL: 0,
      totalPnLPercent: 0,
      totalTrades: 0,
      winningTrades: 0,
      positions: []
    });
    setPerformanceHistory([{ date: '2024-01-01', value: 100000 }]);
  };

  const getPositionColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const portfolioDistribution = portfolio.positions.map(pos => ({
    name: pos.symbol,
    value: Math.abs(pos.entryPrice * pos.quantity),
    fill: pos.type === 'LONG' ? '#00FF88' : '#FF4444'
  }));

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            {lang === 'ar' ? 'محاكي التداول الورقي المتقدم' : 'Advanced Paper Trading Simulator'}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              variant={isRunning ? "destructive" : "default"}
              size="sm"
            >
              {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? 
                (lang === 'ar' ? 'إيقاف' : 'Stop') : 
                (lang === 'ar' ? 'تشغيل' : 'Start')
              }
            </Button>
            <Button onClick={resetSimulation} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trading">
              {lang === 'ar' ? 'التداول' : 'Trading'}
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              {lang === 'ar' ? 'المحفظة' : 'Portfolio'}
            </TabsTrigger>
            <TabsTrigger value="positions">
              {lang === 'ar' ? 'المراكز' : 'Positions'}
            </TabsTrigger>
            <TabsTrigger value="performance">
              {lang === 'ar' ? 'الأداء' : 'Performance'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-xl font-bold text-white">
                    ${portfolio.totalValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'القيمة الإجمالية' : 'Total Value'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <div className={`text-xl font-bold ${getPositionColor(portfolio.totalPnL)}`}>
                    ${portfolio.totalPnL.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-xl font-bold text-white">
                    {portfolio.positions.length}
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'المراكز المفتوحة' : 'Open Positions'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                  <div className="text-xl font-bold text-white">
                    {portfolio.totalTrades > 0 ? 
                      ((portfolio.winningTrades / portfolio.totalTrades) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Data */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {lang === 'ar' ? 'بيانات السوق' : 'Market Data'}
                    {isRunning && (
                      <Badge variant="default" className="ml-2 animate-pulse">
                        {lang === 'ar' ? 'مباشر' : 'LIVE'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketData.map(item => (
                      <div key={item.symbol} 
                           className="flex justify-between items-center p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                           onClick={() => setTradeOrder(prev => ({ ...prev, symbol: item.symbol }))}
                      >
                        <div>
                          <div className="font-semibold text-white">{item.symbol}</div>
                          <div className="text-sm text-gray-400">
                            Vol: {item.volume.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">
                            {item.price.toFixed(item.symbol.includes('JPY') ? 2 : 4)}
                          </div>
                          <div className={`text-sm ${item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {item.changePercent >= 0 ? '+' : ''}
                            {item.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trading Panel */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {lang === 'ar' ? 'لوحة التداول' : 'Trading Panel'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-400">
                        {lang === 'ar' ? 'الرمز' : 'Symbol'}
                      </Label>
                      <Select 
                        value={tradeOrder.symbol} 
                        onValueChange={(value) => setTradeOrder(prev => ({ ...prev, symbol: value }))}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-600">
                          {marketData.map(item => (
                            <SelectItem key={item.symbol} value={item.symbol} className="text-white">
                              {item.symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-gray-400">
                        {lang === 'ar' ? 'النوع' : 'Type'}
                      </Label>
                      <Select 
                        value={tradeOrder.type} 
                        onValueChange={(value: 'BUY' | 'SELL') => setTradeOrder(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-600">
                          <SelectItem value="BUY" className="text-white">
                            {lang === 'ar' ? 'شراء' : 'BUY'}
                          </SelectItem>
                          <SelectItem value="SELL" className="text-white">
                            {lang === 'ar' ? 'بيع' : 'SELL'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-400">
                      {lang === 'ar' ? 'الكمية' : 'Quantity'}
                    </Label>
                    <Input
                      type="number"
                      value={tradeOrder.quantity}
                      onChange={(e) => setTradeOrder(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      className="bg-gray-900 border-gray-600 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-400">
                        {lang === 'ar' ? 'وقف الخسارة' : 'Stop Loss'}
                      </Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={tradeOrder.stopLoss || ''}
                        onChange={(e) => setTradeOrder(prev => ({ ...prev, stopLoss: Number(e.target.value) || undefined }))}
                        className="bg-gray-900 border-gray-600 text-white"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-400">
                        {lang === 'ar' ? 'جني الأرباح' : 'Take Profit'}
                      </Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={tradeOrder.takeProfit || ''}
                        onChange={(e) => setTradeOrder(prev => ({ ...prev, takeProfit: Number(e.target.value) || undefined }))}
                        className="bg-gray-900 border-gray-600 text-white"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <div className="text-sm text-blue-300">
                      <div className="flex justify-between">
                        <span>{lang === 'ar' ? 'السعر الحالي:' : 'Current Price:'}</span>
                        <span>{marketData.find(m => m.symbol === tradeOrder.symbol)?.price.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === 'ar' ? 'قيمة الطلب:' : 'Order Value:'}</span>
                        <span>${(tradeOrder.quantity * (marketData.find(m => m.symbol === tradeOrder.symbol)?.price || 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === 'ar' ? 'الرصيد المتاح:' : 'Available Cash:'}</span>
                        <span>${portfolio.availableCash.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={executeOrder} 
                    className={`w-full ${tradeOrder.type === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    disabled={!isRunning}
                  >
                    {tradeOrder.type === 'BUY' ? 
                      (lang === 'ar' ? 'شراء' : 'BUY') : 
                      (lang === 'ar' ? 'بيع' : 'SELL')
                    } {tradeOrder.symbol}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Performance Chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {lang === 'ar' ? 'أداء المحفظة' : 'Portfolio Performance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceHistory}>
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
                          dataKey="value" 
                          stroke="#00FF88" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Distribution */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    {lang === 'ar' ? 'توزيع المحفظة' : 'Portfolio Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolioDistribution.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={portfolioDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {portfolioDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '6px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      {lang === 'ar' ? 'لا توجد مراكز مفتوحة' : 'No open positions'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Statistics */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'إحصائيات المحفظة' : 'Portfolio Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      ${portfolio.availableCash.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'النقد المتاح' : 'Available Cash'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {portfolio.totalTrades}
                    </div>
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'إجمالي الصفقات' : 'Total Trades'}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {portfolio.winningTrades}
                    </div>
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'الصفقات الرابحة' : 'Winning Trades'}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getPositionColor(portfolio.totalPnLPercent)}`}>
                      {portfolio.totalPnLPercent.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'العائد الإجمالي' : 'Total Return'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="positions" className="space-y-4">
            {portfolio.positions.length > 0 ? (
              <div className="space-y-4">
                {portfolio.positions.map(position => (
                  <Card key={position.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold text-white">
                                {position.symbol}
                              </span>
                              <Badge variant={position.type === 'LONG' ? 'default' : 'secondary'}>
                                {position.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-400">
                              {position.quantity.toLocaleString()} units @ {position.entryPrice.toFixed(4)}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm text-gray-400">
                              {lang === 'ar' ? 'السعر الحالي' : 'Current Price'}
                            </div>
                            <div className="font-semibold text-white">
                              {position.currentPrice.toFixed(4)}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm text-gray-400">
                              {lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}
                            </div>
                            <div className={`font-semibold ${getPositionColor(position.pnl)}`}>
                              ${position.pnl.toFixed(2)}
                            </div>
                            <div className={`text-sm ${getPositionColor(position.pnl)}`}>
                              ({position.pnlPercent.toFixed(2)}%)
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm text-gray-400">
                              {lang === 'ar' ? 'المدة' : 'Duration'}
                            </div>
                            <div className="text-white">
                              {Math.floor((Date.now() - position.entryTime.getTime()) / (1000 * 60 * 60 * 24))}d
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => closePosition(position.id)}
                          variant="outline"
                          size="sm"
                        >
                          {lang === 'ar' ? 'إغلاق' : 'Close'}
                        </Button>
                      </div>

                      {(position.stopLoss || position.takeProfit) && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <div className="flex gap-4 text-sm">
                            {position.stopLoss && (
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <span className="text-gray-400">SL:</span>
                                <span className="text-red-400">{position.stopLoss.toFixed(4)}</span>
                              </div>
                            )}
                            {position.takeProfit && (
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-green-400" />
                                <span className="text-gray-400">TP:</span>
                                <span className="text-green-400">{position.takeProfit.toFixed(4)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">
                  {lang === 'ar' ? 'لا توجد مراكز مفتوحة' : 'No open positions'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-white">
                    {portfolio.totalTrades > 0 ? 
                      ((portfolio.winningTrades / portfolio.totalTrades) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'معدل النجاح' : 'Success Rate'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                  <div className={`text-2xl font-bold ${getPositionColor(portfolio.totalPnL)}`}>
                    ${Math.abs(portfolio.totalPnL).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {portfolio.totalPnL >= 0 ? 
                      (lang === 'ar' ? 'إجمالي الأرباح' : 'Total Profit') :
                      (lang === 'ar' ? 'إجمالي الخسائر' : 'Total Loss')
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-white">
                    {portfolio.positions.length > 0 ? 
                      Math.round(portfolio.positions.reduce((sum, pos) => 
                        sum + (Date.now() - pos.entryTime.getTime()), 0) / 
                        (portfolio.positions.length * 1000 * 60 * 60 * 24)) : 0}d
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'متوسط مدة المركز' : 'Avg. Position Duration'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Insights */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'رؤى الأداء' : 'Performance Insights'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <h4 className="text-blue-400 font-medium mb-2">
                      {lang === 'ar' ? 'نقاط القوة:' : 'Strengths:'}
                    </h4>
                    <ul className="text-blue-300 text-sm space-y-1">
                      <li>• {lang === 'ar' ? 'إدارة مخاطر جيدة مع استخدام وقف الخسارة' : 'Good risk management with stop losses'}</li>
                      <li>• {lang === 'ar' ? 'تنويع جيد عبر أزواج العملات المختلفة' : 'Good diversification across different currency pairs'}</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <h4 className="text-yellow-400 font-medium mb-2">
                      {lang === 'ar' ? 'التحسينات المقترحة:' : 'Suggested Improvements:'}
                    </h4>
                    <ul className="text-yellow-300 text-sm space-y-1">
                      <li>• {lang === 'ar' ? 'فكر في زيادة حجم المراكز الرابحة' : 'Consider increasing position sizes on winning trades'}</li>
                      <li>• {lang === 'ar' ? 'راقب الارتباط بين المراكز المفتوحة' : 'Monitor correlation between open positions'}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaperTradingSimulator;
