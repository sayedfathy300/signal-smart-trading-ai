
import React from 'react';
import { Zap, Activity, Clock, Server } from 'lucide-react';

const HighFrequencyTrading = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          التداول عالي التردد
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">سرعة التنفيذ</h3>
            <p className="text-2xl font-bold text-yellow-400">0.5ms</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الصفقات اليوم</h3>
            <p className="text-2xl font-bold text-green-400">15,847</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">وقت الاستجابة</h3>
            <p className="text-2xl font-bold text-blue-400">2.1ms</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Server className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الخوادم النشطة</h3>
            <p className="text-2xl font-bold text-purple-400">8/8</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">إحصائيات التداول</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>معدل النجاح</span>
                <span className="text-green-400">87.3%</span>
              </div>
              <div className="flex justify-between">
                <span>متوسط الربح لكل صفقة</span>
                <span className="text-blue-400">$12.45</span>
              </div>
              <div className="flex justify-between">
                <span>الحد الأقصى للسحب</span>
                <span className="text-red-400">-2.1%</span>
              </div>
              <div className="flex justify-between">
                <span>نسبة شارب</span>
                <span className="text-purple-400">2.85</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">الخوارزميات النشطة</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>Market Making</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>Arbitrage Scanner</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>Momentum Trading</span>
                <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">متوقف مؤقتاً</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>Mean Reversion</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighFrequencyTrading;
