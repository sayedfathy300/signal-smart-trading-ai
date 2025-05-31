
import React from 'react';
import { Bot, Play, Pause, Settings } from 'lucide-react';

const TradingBot = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          روبوت التداول
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Bot className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">حالة الروبوت</h3>
            <p className="text-2xl font-bold text-green-400">نشط</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Play className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الصفقات اليوم</h3>
            <p className="text-2xl font-bold text-green-400">24</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Settings className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الربح اليومي</h3>
            <p className="text-2xl font-bold text-yellow-400">+$987</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">إعدادات الروبوت</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">استراتيجية التداول</label>
              <select className="w-full p-2 bg-slate-700 border border-gray-600 rounded">
                <option>Scalping</option>
                <option>Day Trading</option>
                <option>Swing Trading</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">مبلغ المخاطرة</label>
              <input type="number" className="w-full p-2 bg-slate-700 border border-gray-600 rounded" placeholder="1000" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingBot;
