import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  status: 'OPEN' | 'CLOSED';
  stopLoss?: number;
  takeProfit?: number;
}

interface Portfolio {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  positions: Position[];
  totalTrades: number;
}

interface PaperTradingSimulatorProps {
  lang?: 'en' | 'ar';
}

const PaperTradingSimulator = ({ lang = 'ar' }: PaperTradingSimulatorProps) => {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    balance: 100000,
    equity: 100000,
    margin: 0,
    freeMargin: 100000,
    marginLevel: 100,
    positions: [],
    totalTrades: 0
  });

  const [symbol, setSymbol] = useState('BTCUSD');
  const [positionType, setPositionType] = useState<'LONG' | 'SHORT'>('LONG');
  const [quantity, setQuantity] = useState(1);
  const [entryPrice, setEntryPrice] = useState(30000);
  const [stopLoss, setStopLoss] = useState<number | undefined>(undefined);
  const [takeProfit, setTakeProfit] = useState<number | undefined>(undefined);

  // Mock market data (replace with real-time data)
  const [marketData, setMarketData] = useState({
    BTCUSD: 30500,
    ETHUSD: 2000,
    AAPL: 170,
    GOOG: 2500
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Simulate market data changes
      setMarketData(prev => ({
        ...prev,
        BTCUSD: prev.BTCUSD + (Math.random() * 100 - 50),
        ETHUSD: prev.ETHUSD + (Math.random() * 10 - 5),
        AAPL: prev.AAPL + (Math.random() * 2 - 1),
        GOOG: prev.GOOG + (Math.random() * 30 - 15)
      }));

      // Update P&L for open positions
      setPortfolio(prev => {
        const updatedPositions = prev.positions.map(position => {
          const currentPrice = marketData[position.symbol] || position.currentPrice;
          const pnl = (position.type === 'LONG'
            ? (currentPrice - position.entryPrice)
            : (position.entryPrice - currentPrice)) * position.quantity;
          const pnlPercent = (pnl / (position.entryPrice * position.quantity)) * 100;

          return {
            ...position,
            currentPrice,
            pnl,
            pnlPercent
          };
        });

        const equity = prev.balance + updatedPositions.reduce((acc, pos) => acc + pos.pnl, 0);
        const margin = 0; // Mock margin calculation
        const freeMargin = equity - margin;
        const marginLevel = margin > 0 ? (equity / margin) * 100 : 100;

        return {
          ...prev,
          positions: updatedPositions,
          equity,
          margin,
          freeMargin,
          marginLevel
        };
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [marketData]);

  const openPosition = () => {
    const newPosition: Position = {
      id: uuidv4(),
      symbol,
      type: positionType,
      quantity,
      entryPrice,
      currentPrice: marketData[symbol] || entryPrice,
      entryTime: new Date(),
      pnl: 0,
      pnlPercent: 0,
      status: 'OPEN',
      stopLoss,
      takeProfit
    };

    setPortfolio(prev => ({
      ...prev,
      positions: [...prev.positions, newPosition]
    }));
  };

  const closePosition = (positionId: string) => {
    setPortfolio((prev: Portfolio) => {
      const position = prev.positions.find(p => p.id === positionId);
      if (!position) return prev;

      const updatedPositions = prev.positions.map(p => 
        p.id === positionId 
          ? { ...p, status: 'CLOSED' as const }
          : p
      );

      return {
        ...prev,
        positions: updatedPositions,
        balance: prev.balance + position.pnl,
        totalTrades: prev.totalTrades + 1
      };
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        {lang === 'ar' ? 'محاكاة التداول الورقي' : 'Paper Trading Simulator'}
      </h2>

      {/* Position Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="symbol" className="text-white">
            {lang === 'ar' ? 'الرمز' : 'Symbol'}
          </Label>
          <Input
            id="symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="positionType" className="text-white">
            {lang === 'ar' ? 'نوع الصفقة' : 'Position Type'}
          </Label>
          <Select value={positionType} onValueChange={setPositionType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={lang === 'ar' ? 'اختر نوع الصفقة' : 'Select Position Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LONG">{lang === 'ar' ? 'شراء' : 'Long'}</SelectItem>
              <SelectItem value="SHORT">{lang === 'ar' ? 'بيع' : 'Short'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="quantity" className="text-white">
            {lang === 'ar' ? 'الكمية' : 'Quantity'}
          </Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="entryPrice" className="text-white">
            {lang === 'ar' ? 'سعر الدخول' : 'Entry Price'}
          </Label>
          <Input
            id="entryPrice"
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="stopLoss" className="text-white">
            {lang === 'ar' ? 'وقف الخسارة' : 'Stop Loss'}
          </Label>
          <Input
            id="stopLoss"
            type="number"
            placeholder={lang === 'ar' ? 'اختياري' : 'Optional'}
            value={stopLoss !== undefined ? stopLoss.toString() : ''}
            onChange={(e) => setStopLoss(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>

        <div>
          <Label htmlFor="takeProfit" className="text-white">
            {lang === 'ar' ? 'جني الأرباح' : 'Take Profit'}
          </Label>
          <Input
            id="takeProfit"
            type="number"
            placeholder={lang === 'ar' ? 'اختياري' : 'Optional'}
            value={takeProfit !== undefined ? takeProfit.toString() : ''}
            onChange={(e) => setTakeProfit(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
      </div>

      <Button onClick={openPosition}>
        {lang === 'ar' ? 'فتح الصفقة' : 'Open Position'}
      </Button>

      {/* Portfolio Overview */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">
          {lang === 'ar' ? 'نظرة عامة على المحفظة' : 'Portfolio Overview'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-trading-card p-4 rounded-lg">
            <p className="text-gray-400">{lang === 'ar' ? 'الرصيد' : 'Balance'}</p>
            <p className="text-white">${portfolio.balance.toFixed(2)}</p>
          </div>
          <div className="bg-trading-card p-4 rounded-lg">
            <p className="text-gray-400">{lang === 'ar' ? 'حقوق الملكية' : 'Equity'}</p>
            <p className="text-white">${portfolio.equity.toFixed(2)}</p>
          </div>
          <div className="bg-trading-card p-4 rounded-lg">
            <p className="text-gray-400">{lang === 'ar' ? 'الهامش' : 'Margin'}</p>
            <p className="text-white">${portfolio.margin.toFixed(2)}</p>
          </div>
          <div className="bg-trading-card p-4 rounded-lg">
            <p className="text-gray-400">{lang === 'ar' ? 'الهامش الحر' : 'Free Margin'}</p>
            <p className="text-white">${portfolio.freeMargin.toFixed(2)}</p>
          </div>
          <div className="bg-trading-card p-4 rounded-lg">
            <p className="text-gray-400">{lang === 'ar' ? 'مستوى الهامش' : 'Margin Level'}</p>
            <p className="text-white">{portfolio.marginLevel.toFixed(2)}%</p>
          </div>
          <div className="bg-trading-card p-4 rounded-lg">
            <p className="text-gray-400">{lang === 'ar' ? 'إجمالي الصفقات' : 'Total Trades'}</p>
            <p className="text-white">{portfolio.totalTrades}</p>
          </div>
        </div>
      </div>

      {/* Open Positions Table */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">
          {lang === 'ar' ? 'مراكز مفتوحة' : 'Open Positions'}
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>{lang === 'ar' ? 'جدول المراكز المفتوحة' : 'Table of open positions'}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{lang === 'ar' ? 'الرمز' : 'Symbol'}</TableHead>
                <TableHead>{lang === 'ar' ? 'النوع' : 'Type'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الكمية' : 'Quantity'}</TableHead>
                <TableHead>{lang === 'ar' ? 'سعر الدخول' : 'Entry Price'}</TableHead>
                <TableHead>{lang === 'ar' ? 'السعر الحالي' : 'Current Price'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}</TableHead>
                <TableHead>{lang === 'ar' ? 'العمليات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.positions.filter(pos => pos.status === 'OPEN').map(position => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.symbol}</TableCell>
                  <TableCell>{lang === 'ar' ? (position.type === 'LONG' ? 'شراء' : 'بيع') : position.type}</TableCell>
                  <TableCell>{position.quantity}</TableCell>
                  <TableCell>${position.entryPrice.toFixed(2)}</TableCell>
                  <TableCell>${position.currentPrice.toFixed(2)}</TableCell>
                  <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => closePosition(position.id)}>
                      {lang === 'ar' ? 'إغلاق' : 'Close'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PaperTradingSimulator;
