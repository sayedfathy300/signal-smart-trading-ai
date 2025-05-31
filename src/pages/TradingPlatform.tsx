
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Play, Pause, Settings, Zap, Target, Bot, AlertTriangle } from 'lucide-react';

const TradingPlatform = () => {
  const [isTrading, setIsTrading] = useState(false);
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState('market');
  const [orderSide, setOrderSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const tradingPairs = [
    { symbol: 'BTC/USDT', price: 45230.50, change: 2.15, volume: '2.1B' },
    { symbol: 'ETH/USDT', price: 2845.80, change: -1.35, volume: '1.8B' },
    { symbol: 'BNB/USDT', price: 245.30, change: 0.85, volume: '450M' },
    { symbol: 'ADA/USDT', price: 0.4521, change: 3.25, volume: '320M' },
    { symbol: 'DOT/USDT', price: 6.75, change: -0.45, volume: '180M' },
  ];

  const recentTrades = [
    { id: 1, pair: 'BTC/USDT', side: 'buy', price: 45230, quantity: 0.1, time: '10:30:15', status: 'filled' },
    { id: 2, pair: 'ETH/USDT', side: 'sell', price: 2850, quantity: 2.5, time: '10:28:42', status: 'filled' },
    { id: 3, pair: 'BNB/USDT', side: 'buy', price: 245, quantity: 10, time: '10:25:18', status: 'pending' },
  ];

  const activeOrders = [
    { id: 1, pair: 'BTC/USDT', side: 'buy', type: 'limit', price: 44500, quantity: 0.2, filled: 0, status: 'open' },
    { id: 2, pair: 'ETH/USDT', side: 'sell', type: 'limit', price: 2900, quantity: 1.5, filled: 0.3, status: 'partial' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          منصة التداول المتقدمة
        </h1>

        {/* Trading Controls */}
        <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              التحكم في التداول
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTrading(!isTrading)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isTrading 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isTrading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isTrading ? 'إيقاف' : 'تشغيل'} التداول الآلي
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
                <Settings className="h-4 w-4" />
                الإعدادات
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-400 mb-1">الرصيد المتاح</div>
              <div className="text-2xl font-bold text-green-400">$15,420.50</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-400 mb-1">الأرباح اليومية</div>
              <div className="text-2xl font-bold text-blue-400">+$987.25</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-400 mb-1">عدد الصفقات</div>
              <div className="text-2xl font-bold text-purple-400">24</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-400 mb-1">معدل النجاح</div>
              <div className="text-2xl font-bold text-yellow-400">87.5%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Market Watch */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              مراقبة السوق
            </h2>
            <div className="space-y-3">
              {tradingPairs.map((pair) => (
                <div 
                  key={pair.symbol} 
                  className={`flex justify-between items-center p-3 rounded cursor-pointer transition-colors ${
                    selectedPair === pair.symbol 
                      ? 'bg-blue-900/50 border border-blue-600' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  onClick={() => setSelectedPair(pair.symbol)}
                >
                  <div className="flex items-center gap-3">
                    {pair.change >= 0 ? 
                      <TrendingUp className="h-5 w-5 text-green-400" /> : 
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    }
                    <div>
                      <div className="font-medium">{pair.symbol}</div>
                      <div className="text-sm text-gray-400">Vol: {pair.volume}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${pair.price.toLocaleString()}</div>
                    <div className={`text-sm ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pair.change >= 0 ? '+' : ''}{pair.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              تنفيذ الأوامر
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">نوع الأمر</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType('market')}
                    className={`p-2 rounded font-medium transition-colors ${
                      orderType === 'market' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    السوق
                  </button>
                  <button
                    onClick={() => setOrderType('limit')}
                    className={`p-2 rounded font-medium transition-colors ${
                      orderType === 'limit' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    محدد
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">اتجاه الأمر</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderSide('buy')}
                    className={`p-2 rounded font-medium transition-colors ${
                      orderSide === 'buy' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    شراء
                  </button>
                  <button
                    onClick={() => setOrderSide('sell')}
                    className={`p-2 rounded font-medium transition-colors ${
                      orderSide === 'sell' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    بيع
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الكمية</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg focus:border-blue-500 transition-colors" 
                  placeholder="0.1" 
                />
              </div>

              {orderType === 'limit' && (
                <div>
                  <label className="block text-sm font-medium mb-2">السعر</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg focus:border-blue-500 transition-colors" 
                    placeholder="45000.00" 
                  />
                </div>
              )}

              <button 
                className={`w-full py-3 rounded-lg font-bold transition-colors ${
                  orderSide === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {orderSide === 'buy' ? 'تنفيذ أمر الشراء' : 'تنفيذ أمر البيع'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Orders */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">الأوامر النشطة</h2>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {order.pair}
                      <span className={`text-sm px-2 py-1 rounded ${
                        order.side === 'buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {order.side === 'buy' ? 'شراء' : 'بيع'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {order.type} | ${order.price} | {order.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      order.status === 'open' ? 'text-blue-400' : 
                      order.status === 'partial' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {order.status === 'open' ? 'مفتوح' : 
                       order.status === 'partial' ? 'جزئي' : 'مكتمل'}
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      إلغاء
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">الصفقات الأخيرة</h2>
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {trade.pair}
                      <span className={`text-sm px-2 py-1 rounded ${
                        trade.side === 'buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {trade.side === 'buy' ? 'شراء' : 'بيع'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      ${trade.price} | {trade.quantity} | {trade.time}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    trade.status === 'filled' ? 'text-green-400' : 
                    trade.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {trade.status === 'filled' ? 'مكتمل' : 
                     trade.status === 'pending' ? 'معلق' : 'ملغي'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Trading Signals */}
        <div className="mt-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            إشارات التداول الذكي
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-400">BTC/USDT</h3>
                <div className="text-green-400 font-bold">شراء قوي</div>
              </div>
              <p className="text-sm text-gray-300 mb-1">دخول: $45,200</p>
              <p className="text-sm text-gray-300 mb-1">هدف: $48,500</p>
              <p className="text-sm text-gray-300">وقف خسارة: $44,000</p>
              <p className="text-xs text-green-400 mt-2">دقة: 92%</p>
            </div>

            <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-red-400">ETH/USDT</h3>
                <div className="text-red-400 font-bold">بيع</div>
              </div>
              <p className="text-sm text-gray-300 mb-1">دخول: $2,850</p>
              <p className="text-sm text-gray-300 mb-1">هدف: $2,720</p>
              <p className="text-sm text-gray-300">وقف خسارة: $2,920</p>
              <p className="text-xs text-red-400 mt-2">دقة: 78%</p>
            </div>

            <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-yellow-400">BNB/USDT</h3>
                <div className="text-yellow-400 font-bold">انتظار</div>
              </div>
              <p className="text-sm text-gray-300 mb-1">مراقبة: $245</p>
              <p className="text-sm text-gray-300 mb-1">كسر علوي: $250</p>
              <p className="text-sm text-gray-300">كسر سفلي: $240</p>
              <p className="text-xs text-yellow-400 mt-2">دقة: 85%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPlatform;
