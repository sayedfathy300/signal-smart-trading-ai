
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Target, Settings, Zap, Brain } from 'lucide-react';

interface ChartsProps {
  lang: 'en' | 'ar';
}

const Charts = ({ lang }: ChartsProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [patternDetection, setPatternDetection] = useState(true);

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];
  const tradingPairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'DOT/USDT'];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {lang === 'ar' ? 'الرسوم البيانية المتقدمة' : 'Advanced Charts'}
        </h1>

        {/* Trading Controls */}
        <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {lang === 'ar' ? 'إعدادات التداول' : 'Trading Controls'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === 'ar' ? 'زوج التداول' : 'Trading Pair'}
              </label>
              <select 
                value={selectedPair} 
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg focus:border-blue-500 transition-colors"
              >
                {tradingPairs.map(pair => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === 'ar' ? 'الإطار الزمني' : 'Timeframe'}
              </label>
              <div className="flex flex-wrap gap-2">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeframe === tf 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === 'ar' ? 'كشف الأنماط' : 'Pattern Detection'}
              </label>
              <button
                onClick={() => setPatternDetection(!patternDetection)}
                className={`w-full p-3 rounded-lg font-medium transition-colors ${
                  patternDetection 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {patternDetection ? 
                  (lang === 'ar' ? 'مفعل' : 'Enabled') : 
                  (lang === 'ar' ? 'معطل' : 'Disabled')
                }
              </button>
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3 bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {selectedPair} - {selectedTimeframe}
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                  {lang === 'ar' ? 'ملء الشاشة' : 'Fullscreen'}
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                  {lang === 'ar' ? 'تصدير' : 'Export'}
                </button>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-96 bg-slate-700 rounded flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {lang === 'ar' ? 'الرسم البياني للشموع اليابانية' : 'Japanese Candlestick Chart'}
                </p>
                <p className="text-gray-500 text-sm">
                  {lang === 'ar' ? 'كشف الأنماط التلقائي مفعل' : 'Automatic Pattern Detection Enabled'}
                </p>
              </div>
            </div>

            {/* Chart Tools */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                {lang === 'ar' ? 'خط الاتجاه' : 'Trend Line'}
              </button>
              <button className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm">
                {lang === 'ar' ? 'فيبوناتشي' : 'Fibonacci'}
              </button>
              <button className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
                {lang === 'ar' ? 'مستويات الدعم والمقاومة' : 'Support/Resistance'}
              </button>
              <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm">
                {lang === 'ar' ? 'المؤشرات' : 'Indicators'}
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Market Data */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {lang === 'ar' ? 'بيانات السوق' : 'Market Data'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">{lang === 'ar' ? 'السعر' : 'Price'}:</span>
                  <span className="text-green-400 font-bold">$45,230.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{lang === 'ar' ? 'التغيير 24س' : '24h Change'}:</span>
                  <span className="text-green-400">+2.45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{lang === 'ar' ? 'الحجم' : 'Volume'}:</span>
                  <span className="text-blue-400">$2.1B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{lang === 'ar' ? 'أعلى 24س' : '24h High'}:</span>
                  <span className="text-yellow-400">$46,120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{lang === 'ar' ? 'أقل 24س' : '24h Low'}:</span>
                  <span className="text-red-400">$44,890</span>
                </div>
              </div>
            </div>

            {/* Pattern Detection */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                {lang === 'ar' ? 'كشف الأنماط' : 'Pattern Detection'}
              </h3>
              <div className="space-y-2">
                <div className="p-2 bg-green-900/30 border border-green-700 rounded">
                  <p className="text-green-400 font-medium text-sm">
                    {lang === 'ar' ? 'نمط الرأس والكتفين' : 'Head & Shoulders'}
                  </p>
                  <p className="text-green-300 text-xs">
                    {lang === 'ar' ? 'احتمالية: 87%' : 'Confidence: 87%'}
                  </p>
                </div>
                <div className="p-2 bg-blue-900/30 border border-blue-700 rounded">
                  <p className="text-blue-400 font-medium text-sm">
                    {lang === 'ar' ? 'مثلث صاعد' : 'Ascending Triangle'}
                  </p>
                  <p className="text-blue-300 text-xs">
                    {lang === 'ar' ? 'احتمالية: 72%' : 'Confidence: 72%'}
                  </p>
                </div>
                <div className="p-2 bg-yellow-900/30 border border-yellow-700 rounded">
                  <p className="text-yellow-400 font-medium text-sm">
                    {lang === 'ar' ? 'علم صاعد' : 'Bull Flag'}
                  </p>
                  <p className="text-yellow-300 text-xs">
                    {lang === 'ar' ? 'احتمالية: 65%' : 'Confidence: 65%'}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Signals */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {lang === 'ar' ? 'إشارات الذكاء الاصطناعي' : 'AI Signals'}
              </h3>
              <div className="space-y-2">
                <div className="p-2 bg-green-900/30 border border-green-700 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-medium text-sm">
                      {lang === 'ar' ? 'شراء قوي' : 'Strong Buy'}
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-green-300 text-xs">
                    {lang === 'ar' ? 'دقة النموذج: 92%' : 'Model Accuracy: 92%'}
                  </p>
                </div>
                <div className="text-center">
                  <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                    {lang === 'ar' ? 'تنفيذ الإشارة' : 'Execute Signal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-3">RSI</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">68.5</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{width: '68.5%'}}></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {lang === 'ar' ? 'قريب من منطقة الشراء المفرط' : 'Near Overbought'}
              </p>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-3">MACD</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+0.12</div>
              <p className="text-sm text-green-400">
                {lang === 'ar' ? 'إشارة صاعدة' : 'Bullish Signal'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {lang === 'ar' ? 'تقاطع إيجابي' : 'Positive Crossover'}
              </p>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-3">Bollinger Bands</h3>
            <div className="text-center">
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'العلوي' : 'Upper'}: <span className="text-red-400">$46,500</span>
              </div>
              <div className="text-lg font-bold text-blue-400 my-1">$45,230</div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'السفلي' : 'Lower'}: <span className="text-green-400">$44,200</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-3">Volume</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">High</div>
              <p className="text-sm text-purple-400">
                {lang === 'ar' ? 'حجم تداول مرتفع' : 'High Trading Volume'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {lang === 'ar' ? '+45% من المتوسط' : '+45% Above Average'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
