
import React, { useState } from 'react';
import { Bot, Play, Pause, Settings, BarChart3, Shield } from 'lucide-react';

const TradingBot = () => {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          روبوت التداول الذكي
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Bot className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">حالة الروبوت</h3>
            <p className={`text-lg font-bold ${isRunning ? 'text-green-400' : 'text-red-400'}`}>
              {isRunning ? 'نشط' : 'متوقف'}
            </p>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`mt-4 px-6 py-2 rounded-md flex items-center gap-2 mx-auto ${
                isRunning 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } transition-colors`}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? 'إيقاف' : 'تشغيل'}
            </button>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <BarChart3 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">إجمالي الأرباح</h3>
            <p className="text-2xl font-bold text-green-400">+$2,850</p>
            <p className="text-sm text-gray-400 mt-2">هذا الشهر</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">مستوى المخاطرة</h3>
            <p className="text-lg font-bold text-purple-400">متوسط</p>
            <p className="text-sm text-gray-400 mt-2">2.5% خسارة قصوى</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              إعدادات الروبوت
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">استراتيجية التداول</label>
                <select className="w-full bg-slate-700 border border-gray-600 rounded-md px-3 py-2">
                  <option>المتوسط المتحرك</option>
                  <option>RSI العكسي</option>
                  <option>كسر المقاومة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">حد الخسارة (%)</label>
                <input 
                  type="number" 
                  defaultValue="2" 
                  className="w-full bg-slate-700 border border-gray-600 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">هدف الربح (%)</label>
                <input 
                  type="number" 
                  defaultValue="5" 
                  className="w-full bg-slate-700 border border-gray-600 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">آخر الصفقات</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">AAPL</p>
                  <p className="text-sm text-gray-400">شراء</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400">+$125</p>
                  <p className="text-sm text-gray-400">منذ ساعتين</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">TSLA</p>
                  <p className="text-sm text-gray-400">بيع</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400">-$45</p>
                  <p className="text-sm text-gray-400">منذ 4 ساعات</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">MSFT</p>
                  <p className="text-sm text-gray-400">شراء</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400">+$89</p>
                  <p className="text-sm text-gray-400">أمس</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingBot;
