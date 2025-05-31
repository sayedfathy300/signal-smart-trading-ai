
import React from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, Target, Shield, Zap } from 'lucide-react';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          إدارة المحفظة الاستثمارية الذكية
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-green-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">إجمالي الأصول</p>
                <p className="text-2xl font-bold text-green-400">$125,430</p>
                <p className="text-sm text-green-300">+15.2% هذا الشهر</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">الربح اليومي</p>
                <p className="text-2xl font-bold text-blue-400">+$1,245</p>
                <p className="text-sm text-blue-300">+0.99% اليوم</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">عدد الأسهم</p>
                <p className="text-2xl font-bold text-purple-400">24</p>
                <p className="text-sm text-purple-300">في 8 قطاعات</p>
              </div>
              <PieChart className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-yellow-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">العائد السنوي</p>
                <p className="text-2xl font-bold text-yellow-400">+15.2%</p>
                <p className="text-sm text-yellow-300">فوق المتوسط</p>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              توزيع المحفظة
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>الأسهم الأمريكية</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <span className="text-green-400 w-10">60%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>العملات المشفرة</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <span className="text-blue-400 w-10">25%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>السندات</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{width: '10%'}}></div>
                  </div>
                  <span className="text-purple-400 w-10">10%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>السلع</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{width: '5%'}}></div>
                  </div>
                  <span className="text-yellow-400 w-10">5%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              أفضل الأداء
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <span className="font-medium">AAPL</span>
                  <p className="text-sm text-gray-400">Apple Inc.</p>
                </div>
                <span className="text-green-400 font-bold">+8.5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <span className="font-medium">TSLA</span>
                  <p className="text-sm text-gray-400">Tesla Inc.</p>
                </div>
                <span className="text-green-400 font-bold">+12.3%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <span className="font-medium">BTC</span>
                  <p className="text-sm text-gray-400">Bitcoin</p>
                </div>
                <span className="text-red-400 font-bold">-2.1%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <span className="font-medium">GOLD</span>
                  <p className="text-sm text-gray-400">Gold Futures</p>
                </div>
                <span className="text-green-400 font-bold">+3.7%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              إدارة المخاطر
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">مستوى المخاطر</span>
                <span className="text-yellow-400 font-semibold">متوسط</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">نسبة شارب</span>
                <span className="text-green-400 font-semibold">2.15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">الحد الأقصى للسحب</span>
                <span className="text-red-400 font-semibold">-8.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">تنويع المحفظة</span>
                <span className="text-blue-400 font-semibold">ممتاز</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              إعادة توازن المحفظة
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              تحليل الأداء
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              تصدير التقرير
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
