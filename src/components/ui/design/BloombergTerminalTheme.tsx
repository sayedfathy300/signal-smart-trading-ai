
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Globe,
  Zap,
  AlertTriangle,
  Clock,
  Users,
  Settings
} from 'lucide-react';

interface BloombergTerminalThemeProps {
  lang: 'en' | 'ar';
}

const BloombergTerminalTheme: React.FC<BloombergTerminalThemeProps> = ({ lang }) => {
  const [selectedAsset, setSelectedAsset] = useState('BTC-USD');
  const [viewMode, setViewMode] = useState('professional');

  // Mock market data
  const marketData = [
    { time: '09:00', price: 45000, volume: 1200, change: 2.5 },
    { time: '10:00', price: 45250, volume: 1350, change: 3.1 },
    { time: '11:00', price: 44800, volume: 1100, change: 1.8 },
    { time: '12:00', price: 45400, volume: 1500, change: 4.2 },
    { time: '13:00', price: 45600, volume: 1300, change: 4.8 },
    { time: '14:00', price: 45200, volume: 1400, change: 3.9 },
    { time: '15:00', price: 45800, volume: 1600, change: 5.2 },
    { time: '16:00', price: 46000, volume: 1700, change: 5.8 }
  ];

  const watchlistData = [
    { symbol: 'BTC-USD', price: 46000, change: 5.8, volume: '2.4B' },
    { symbol: 'ETH-USD', price: 3200, change: -2.1, volume: '1.8B' },
    { symbol: 'AAPL', price: 175.50, change: 1.2, volume: '89M' },
    { symbol: 'GOOGL', price: 2800, change: 0.8, volume: '45M' },
    { symbol: 'TSLA', price: 220, change: -1.5, volume: '78M' },
    { symbol: 'MSFT', price: 380, change: 2.3, volume: '67M' },
    { symbol: 'NVDA', price: 875, change: 4.1, volume: '120M' },
    { symbol: 'AMD', price: 165, change: -0.9, volume: '98M' }
  ];

  const newsData = [
    {
      time: '15:42',
      headline: lang === 'ar' ? 'البيتكوين يرتفع بنسبة 5.8% وسط تفاؤل المستثمرين' : 'Bitcoin Rises 5.8% Amid Investor Optimism',
      source: 'Reuters',
      importance: 'high'
    },
    {
      time: '15:35',
      headline: lang === 'ar' ? 'الاحتياطي الفيدرالي يشير إلى استقرار أسعار الفائدة' : 'Fed Signals Interest Rate Stability',
      source: 'Bloomberg',
      importance: 'medium'
    },
    {
      time: '15:28',
      headline: lang === 'ar' ? 'أرباح أبل تتجاوز التوقعات للربع الثالث' : 'Apple Earnings Beat Q3 Expectations',
      source: 'CNBC',
      importance: 'medium'
    }
  ];

  const alertsData = [
    { time: '15:45', message: lang === 'ar' ? 'BTC-USD تجاوز المقاومة عند 45,500' : 'BTC-USD Breaks Resistance at 45,500', type: 'success' },
    { time: '15:30', message: lang === 'ar' ? 'حجم التداول مرتفع للغاية' : 'Unusually High Trading Volume', type: 'warning' },
    { time: '15:15', message: lang === 'ar' ? 'تنبيه وقف الخسارة لـ ETH-USD' : 'Stop Loss Alert for ETH-USD', type: 'error' }
  ];

  return (
    <div className="min-h-screen bg-black text-orange-400 font-mono">
      {/* Bloomberg-style Header */}
      <div className="bg-orange-500 text-black px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 font-bold" />
            <span className="font-bold text-lg">SIGNAL BLACK TERMINAL</span>
          </div>
          <Badge className="bg-black text-orange-400">
            {new Date().toLocaleTimeString()}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold">
            {lang === 'ar' ? 'المحفظة: $125,000' : 'PORTFOLIO: $125,000'}
          </span>
          <span className="text-green-600 font-bold">+2.34%</span>
        </div>
      </div>

      {/* Main Terminal Layout */}
      <div className="grid grid-cols-12 gap-1 p-1 h-screen">
        {/* Left Panel - Watchlist */}
        <div className="col-span-3 bg-gray-900 border border-orange-500">
          <div className="bg-orange-500 text-black px-2 py-1 font-bold text-sm">
            {lang === 'ar' ? 'قائمة المراقبة' : 'WATCHLIST'}
          </div>
          <div className="p-2 space-y-1">
            {watchlistData.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center py-1 px-2 cursor-pointer hover:bg-gray-800 text-xs ${
                  selectedAsset === item.symbol ? 'bg-orange-900' : ''
                }`}
                onClick={() => setSelectedAsset(item.symbol)}
              >
                <span className="text-orange-400 font-bold">{item.symbol}</span>
                <div className="text-right">
                  <div className="text-white">{item.price.toLocaleString()}</div>
                  <div className={`${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Main Chart */}
        <div className="col-span-6 bg-gray-900 border border-orange-500">
          <div className="bg-orange-500 text-black px-2 py-1 font-bold text-sm flex justify-between">
            <span>{selectedAsset} - {lang === 'ar' ? 'الرسم البياني الرئيسي' : 'MAIN CHART'}</span>
            <div className="flex gap-2">
              <Badge className="bg-green-600 text-white text-xs">LIVE</Badge>
              <Badge className="bg-black text-orange-400 text-xs">1D</Badge>
            </div>
          </div>
          <div className="p-2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData}>
                <CartesianGrid strokeDasharray="1 1" stroke="#404040" />
                <XAxis 
                  dataKey="time" 
                  stroke="#FFA500"
                  fontSize={10}
                  axisLine={{ stroke: '#FFA500' }}
                />
                <YAxis 
                  stroke="#FFA500"
                  fontSize={10}
                  axisLine={{ stroke: '#FFA500' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#000',
                    border: '1px solid #FFA500',
                    borderRadius: '0',
                    color: '#FFA500',
                    fontSize: '10px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#FFA500"
                  fill="#FFA500"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trading Panel */}
          <div className="border-t border-orange-500 p-2">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <Button className="bg-green-600 hover:bg-green-700 text-white text-xs py-1">
                {lang === 'ar' ? 'شراء' : 'BUY'}
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white text-xs py-1">
                {lang === 'ar' ? 'بيع' : 'SELL'}
              </Button>
              <input 
                type="number" 
                placeholder="Quantity"
                className="bg-black border border-orange-500 text-orange-400 px-2 py-1 text-xs"
              />
              <input 
                type="number" 
                placeholder="Price"
                className="bg-black border border-orange-500 text-orange-400 px-2 py-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Market Data & News */}
        <div className="col-span-3 space-y-1">
          {/* Market Statistics */}
          <div className="bg-gray-900 border border-orange-500">
            <div className="bg-orange-500 text-black px-2 py-1 font-bold text-sm">
              {lang === 'ar' ? 'إحصائيات السوق' : 'MARKET STATS'}
            </div>
            <div className="p-2 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-orange-400">{lang === 'ar' ? 'الافتتاح:' : 'OPEN:'}</span>
                <span className="text-white">44,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">{lang === 'ar' ? 'الأعلى:' : 'HIGH:'}</span>
                <span className="text-white">46,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">{lang === 'ar' ? 'الأدنى:' : 'LOW:'}</span>
                <span className="text-white">44,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">{lang === 'ar' ? 'الحجم:' : 'VOLUME:'}</span>
                <span className="text-white">2.4B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">{lang === 'ar' ? 'رأس المال:' : 'MKT CAP:'}</span>
                <span className="text-white">890B</span>
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div className="bg-gray-900 border border-orange-500">
            <div className="bg-orange-500 text-black px-2 py-1 font-bold text-sm">
              {lang === 'ar' ? 'الأخبار العاجلة' : 'NEWS FEED'}
            </div>
            <div className="p-2 space-y-2 max-h-40 overflow-y-auto">
              {newsData.map((news, index) => (
                <div key={index} className="border-b border-gray-700 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-400 text-xs">{news.time}</span>
                    <Badge className={`text-xs ${
                      news.importance === 'high' ? 'bg-red-600' : 'bg-yellow-600'
                    } text-white`}>
                      {news.importance.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-white text-xs leading-tight">{news.headline}</div>
                  <div className="text-gray-400 text-xs">{news.source}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-gray-900 border border-orange-500">
            <div className="bg-orange-500 text-black px-2 py-1 font-bold text-sm">
              {lang === 'ar' ? 'التنبيهات' : 'ALERTS'}
            </div>
            <div className="p-2 space-y-1">
              {alertsData.map((alert, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400">{alert.time}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      alert.type === 'success' ? 'bg-green-400' :
                      alert.type === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></span>
                  </div>
                  <div className="text-white mt-1">{alert.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Panel - Order Book & Positions */}
        <div className="col-span-12 bg-gray-900 border border-orange-500">
          <Tabs defaultValue="orderbook" className="h-full">
            <TabsList className="bg-orange-500 text-black rounded-none w-full justify-start">
              <TabsTrigger value="orderbook" className="text-black data-[state=active]:bg-black data-[state=active]:text-orange-400">
                {lang === 'ar' ? 'دفتر الطلبات' : 'ORDER BOOK'}
              </TabsTrigger>
              <TabsTrigger value="positions" className="text-black data-[state=active]:bg-black data-[state=active]:text-orange-400">
                {lang === 'ar' ? 'المراكز' : 'POSITIONS'}
              </TabsTrigger>
              <TabsTrigger value="history" className="text-black data-[state=active]:bg-black data-[state=active]:text-orange-400">
                {lang === 'ar' ? 'السجل' : 'HISTORY'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orderbook" className="p-2">
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-red-400 font-bold mb-2">{lang === 'ar' ? 'عروض البيع' : 'ASKS'}</div>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span className="text-red-400">{(46000 + i * 50).toLocaleString()}</span>
                      <span className="text-white">{(Math.random() * 10).toFixed(3)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="text-orange-400 font-bold text-lg mb-2">
                    {selectedAsset}
                  </div>
                  <div className="text-white text-2xl font-bold">
                    46,000
                  </div>
                  <div className="text-green-400">+5.8%</div>
                </div>

                <div>
                  <div className="text-green-400 font-bold mb-2">{lang === 'ar' ? 'عروض الشراء' : 'BIDS'}</div>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span className="text-green-400">{(45950 - i * 50).toLocaleString()}</span>
                      <span className="text-white">{(Math.random() * 10).toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="positions" className="p-2">
              <div className="text-xs">
                <div className="grid grid-cols-7 gap-4 mb-2 font-bold text-orange-400">
                  <span>{lang === 'ar' ? 'الرمز' : 'SYMBOL'}</span>
                  <span>{lang === 'ar' ? 'الكمية' : 'QTY'}</span>
                  <span>{lang === 'ar' ? 'السعر' : 'PRICE'}</span>
                  <span>{lang === 'ar' ? 'القيمة' : 'VALUE'}</span>
                  <span>{lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}</span>
                  <span>{lang === 'ar' ? 'النسبة' : '%'}</span>
                  <span>{lang === 'ar' ? 'الإجراء' : 'ACTION'}</span>
                </div>
                {watchlistData.slice(0, 4).map((position, index) => (
                  <div key={index} className="grid grid-cols-7 gap-4 py-1 border-b border-gray-700">
                    <span className="text-orange-400">{position.symbol}</span>
                    <span className="text-white">{(Math.random() * 10).toFixed(2)}</span>
                    <span className="text-white">{position.price.toLocaleString()}</span>
                    <span className="text-white">${(position.price * Math.random() * 10).toLocaleString()}</span>
                    <span className={position.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${((position.change / 100) * position.price * Math.random() * 10).toFixed(0)}
                    </span>
                    <span className={position.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {position.change >= 0 ? '+' : ''}{position.change}%
                    </span>
                    <Button className="bg-red-600 hover:bg-red-700 text-white py-0 px-2 text-xs">
                      {lang === 'ar' ? 'إغلاق' : 'CLOSE'}
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-2">
              <div className="text-xs">
                <div className="grid grid-cols-6 gap-4 mb-2 font-bold text-orange-400">
                  <span>{lang === 'ar' ? 'الوقت' : 'TIME'}</span>
                  <span>{lang === 'ar' ? 'الرمز' : 'SYMBOL'}</span>
                  <span>{lang === 'ar' ? 'النوع' : 'TYPE'}</span>
                  <span>{lang === 'ar' ? 'الكمية' : 'QTY'}</span>
                  <span>{lang === 'ar' ? 'السعر' : 'PRICE'}</span>
                  <span>{lang === 'ar' ? 'الحالة' : 'STATUS'}</span>
                </div>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-6 gap-4 py-1 border-b border-gray-700">
                    <span className="text-white">{new Date(Date.now() - i * 3600000).toLocaleTimeString()}</span>
                    <span className="text-orange-400">{watchlistData[i % watchlistData.length].symbol}</span>
                    <span className={Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}>
                      {Math.random() > 0.5 ? 'BUY' : 'SELL'}
                    </span>
                    <span className="text-white">{(Math.random() * 10).toFixed(3)}</span>
                    <span className="text-white">{(Math.random() * 50000).toFixed(0)}</span>
                    <span className="text-green-400">FILLED</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bloomberg-style Footer */}
      <div className="bg-orange-500 text-black px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span>SIGNAL BLACK TERMINAL v2.0</span>
          <span>{lang === 'ar' ? 'متصل' : 'CONNECTED'}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>{lang === 'ar' ? 'البيانات الحية' : 'LIVE DATA'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>{lang === 'ar' ? 'زمن الخادم:' : 'SERVER TIME:'} {new Date().toLocaleTimeString()}</span>
          <span>{lang === 'ar' ? 'الكمون: 12ms' : 'LATENCY: 12ms'}</span>
        </div>
      </div>
    </div>
  );
};

export default BloombergTerminalTheme;
