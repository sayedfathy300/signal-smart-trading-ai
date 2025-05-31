
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          لوحة التحكم الذكية
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-green-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">إجمالي الاستثمارات</h3>
                <p className="text-2xl font-bold text-green-400">$125,430</p>
                <p className="text-sm text-green-300">+12.5% هذا الأسبوع</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">الربح اليومي</h3>
                <p className="text-2xl font-bold text-blue-400">+$1,245</p>
                <p className="text-sm text-blue-300">+3.2% من أمس</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">عدد الصفقات</h3>
                <p className="text-2xl font-bold text-purple-400">156</p>
                <p className="text-sm text-purple-300">24 نشطة الآن</p>
              </div>
              <Activity className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-yellow-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">معدل النجاح</h3>
                <p className="text-2xl font-bold text-yellow-400">87.3%</p>
                <p className="text-sm text-yellow-300">أعلى من المتوسط</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-white">الأداء الأخير</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <span className="text-white font-medium">AAPL</span>
                  <p className="text-sm text-gray-400">Apple Inc.</p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold">+5.2%</span>
                  <p className="text-sm text-gray-400">$150.25</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <span className="text-white font-medium">TSLA</span>
                  <p className="text-sm text-gray-400">Tesla Inc.</p>
                </div>
                <div className="text-right">
                  <span className="text-red-400 font-bold">-2.1%</span>
                  <p className="text-sm text-gray-400">$245.80</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <span className="text-white font-medium">BTC</span>
                  <p className="text-sm text-gray-400">Bitcoin</p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold">+8.7%</span>
                  <p className="text-sm text-gray-400">$45,230</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-white">التحليلات السريعة</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">RSI المتوسط</span>
                <span className="text-blue-400 font-semibold">65.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">اتجاه السوق</span>
                <span className="text-green-400 font-semibold">صاعد</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">مؤشر الخوف والطمع</span>
                <span className="text-yellow-400 font-semibold">72 - طمع</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">حجم التداول</span>
                <span className="text-purple-400 font-semibold">عالي</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-white">الأخبار العاجلة</h2>
          <div className="space-y-3">
            <div className="p-3 bg-slate-700 rounded border-l-4 border-green-500">
              <p className="text-white font-medium">ارتفاع مؤشرات الأسهم الأمريكية</p>
              <p className="text-sm text-gray-400">منذ 15 دقيقة</p>
            </div>
            <div className="p-3 bg-slate-700 rounded border-l-4 border-blue-500">
              <p className="text-white font-medium">إعلان نتائج أرباح شركة Apple</p>
              <p className="text-sm text-gray-400">منذ ساعة</p>
            </div>
            <div className="p-3 bg-slate-700 rounded border-l-4 border-yellow-500">
              <p className="text-white font-medium">تحديث على أسعار النفط</p>
              <p className="text-sm text-gray-400">منذ ساعتين</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
