
import React from 'react';
import { Shield, AlertTriangle, TrendingDown, BarChart } from 'lucide-react';

const RiskManagement = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          إدارة المخاطر
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">مستوى الأمان</h3>
            <p className="text-2xl font-bold text-green-400">عالي</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">التحذيرات</h3>
            <p className="text-2xl font-bold text-yellow-400">3</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <TrendingDown className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">VaR اليومي</h3>
            <p className="text-2xl font-bold text-red-400">$2,500</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <BarChart className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">نسبة التعرض</h3>
            <p className="text-2xl font-bold text-blue-400">65%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">حدود المخاطرة</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>التعرض الإجمالي</span>
                  <span>65% من 100%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>مخاطر الأسهم</span>
                  <span>45% من 60%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>مخاطر العملات</span>
                  <span>20% من 30%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '67%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">تنبيهات المخاطر</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />
                <div>
                  <p className="font-medium text-yellow-400">تحذير: تركيز عالي</p>
                  <p className="text-sm text-gray-300">40% من المحفظة في قطاع التكنولوجيا</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-900/30 border border-red-600 rounded">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-1" />
                <div>
                  <p className="font-medium text-red-400">تحذير: تقلبات عالية</p>
                  <p className="text-sm text-gray-300">تقلبات السوق تجاوزت 20%</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-900/30 border border-blue-600 rounded">
                <AlertTriangle className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="font-medium text-blue-400">معلومات: تحديث المخاطر</p>
                  <p className="text-sm text-gray-300">تم تحديث نماذج المخاطر بنجاح</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagement;
