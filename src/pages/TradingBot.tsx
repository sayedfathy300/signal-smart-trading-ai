
import React from 'react';
import { Bot, Play, Pause, Settings, Activity, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

const TradingBot = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          روبوت التداول الذكي المتقدم
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center border border-slate-700 hover:border-blue-500 transition-colors">
            <Bot className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">حالة الروبوت</h3>
            <p className="text-2xl font-bold text-green-400">نشط</p>
            <p className="text-sm text-green-300">منذ 4 ساعات</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center border border-slate-700 hover:border-green-500 transition-colors">
            <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الصفقات اليوم</h3>
            <p className="text-2xl font-bold text-green-400">24</p>
            <p className="text-sm text-green-300">87% نجاح</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center border border-slate-700 hover:border-yellow-500 transition-colors">
            <TrendingUp className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الربح اليومي</h3>
            <p className="text-2xl font-bold text-yellow-400">+$987</p>
            <p className="text-sm text-yellow-300">+2.3% عائد</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg text-center border border-slate-700 hover:border-purple-500 transition-colors">
            <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">سرعة التنفيذ</h3>
            <p className="text-2xl font-bold text-purple-400">0.8s</p>
            <p className="text-sm text-purple-300">متوسط</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              إعدادات الروبوت
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">استراتيجية التداول</label>
                <select className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg focus:border-blue-500 transition-colors">
                  <option>Scalping المتقدم</option>
                  <option>Day Trading الذكي</option>
                  <option>Swing Trading</option>
                  <option>Mean Reversion</option>
                  <option>Momentum Trading</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">مبلغ المخاطرة لكل صفقة</label>
                <input type="number" className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg focus:border-blue-500 transition-colors" placeholder="1000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نسبة المخاطرة (%)</label>
                <input type="range" min="1" max="10" defaultValue="3" className="w-full" />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>1%</span>
                  <span>محافظ</span>
                  <span>متوسط</span>
                  <span>عدواني</span>
                  <span>10%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">الأداء الحالي</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">معدل النجاح الإجمالي</span>
                <span className="text-green-400 font-semibold">87.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">متوسط الربح لكل صفقة</span>
                <span className="text-blue-400 font-semibold">$41.25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">أكبر ربح يومي</span>
                <span className="text-green-400 font-semibold">$1,547</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">أكبر خسارة يومية</span>
                <span className="text-red-400 font-semibold">-$234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">نسبة المخاطرة/العائد</span>
                <span className="text-purple-400 font-semibold">1:2.8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">الصفقات النشطة</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded border-l-4 border-green-500">
                <div>
                  <span className="font-medium">AAPL شراء</span>
                  <p className="text-sm text-gray-400">دخل: $150.25 | هدف: $155.00</p>
                </div>
                <span className="text-green-400">+$125</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded border-l-4 border-blue-500">
                <div>
                  <span className="font-medium">TSLA بيع</span>
                  <p className="text-sm text-gray-400">دخل: $245.80 | هدف: $240.00</p>
                </div>
                <span className="text-blue-400">+$87</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded border-l-4 border-yellow-500">
                <div>
                  <span className="font-medium">BTC شراء</span>
                  <p className="text-sm text-gray-400">دخل: $45,230 | هدف: $46,500</p>
                </div>
                <span className="text-yellow-400">+$234</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              تنبيهات ومراقبة
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-green-900/30 border border-green-700 rounded">
                <p className="text-green-400 font-medium">إشارة شراء قوية - GOOGL</p>
                <p className="text-sm text-green-300">RSI في منطقة تشبع البيع</p>
              </div>
              <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded">
                <p className="text-yellow-400 font-medium">تحذير - تذبذب عالي في السوق</p>
                <p className="text-sm text-yellow-300">قد تحتاج لتعديل المخاطرة</p>
              </div>
              <div className="p-3 bg-blue-900/30 border border-blue-700 rounded">
                <p className="text-blue-400 font-medium">تحديث الاستراتيجية</p>
                <p className="text-sm text-blue-300">تم تحسين خوارزمية Scalping</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">تحكم سريع</h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              <Play className="h-4 w-4" />
              تشغيل الروبوت
            </button>
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              <Pause className="h-4 w-4" />
              إيقاف مؤقت
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
              إعدادات متقدمة
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              تقرير مفصل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingBot;
