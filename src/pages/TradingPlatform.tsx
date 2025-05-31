
import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const TradingPlatform = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          منصة التداول
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">قائمة الأسعار</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span>AAPL</span>
                </div>
                <div className="text-right">
                  <div className="text-green-400">$150.25</div>
                  <div className="text-sm text-green-400">+2.15%</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-red-400" />
                  <span>TSLA</span>
                </div>
                <div className="text-right">
                  <div className="text-red-400">$245.80</div>
                  <div className="text-sm text-red-400">-1.35%</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-400" />
                  <span>GOOGL</span>
                </div>
                <div className="text-right">
                  <div className="text-blue-400">$2,750.30</div>
                  <div className="text-sm text-blue-400">+0.85%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">أوامر التداول</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">نوع الأمر</label>
                <select className="w-full p-2 bg-slate-700 border border-gray-600 rounded">
                  <option>شراء</option>
                  <option>بيع</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">الكمية</label>
                <input type="number" className="w-full p-2 bg-slate-700 border border-gray-600 rounded" placeholder="100" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">السعر</label>
                <input type="number" className="w-full p-2 bg-slate-700 border border-gray-600 rounded" placeholder="150.00" />
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                تنفيذ الأمر
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPlatform;
