
import React from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart } from 'lucide-react';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          إدارة المحفظة الاستثمارية
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">إجمالي الأصول</p>
                <p className="text-2xl font-bold text-green-400">$125,430</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">الربح اليومي</p>
                <p className="text-2xl font-bold text-blue-400">+$1,245</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">عدد الأسهم</p>
                <p className="text-2xl font-bold text-purple-400">24</p>
              </div>
              <PieChart className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">العائد السنوي</p>
                <p className="text-2xl font-bold text-yellow-400">+15.2%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">توزيع المحفظة</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>الأسهم الأمريكية</span>
                <span className="text-green-400">60%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>العملات المشفرة</span>
                <span className="text-blue-400">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>السندات</span>
                <span className="text-purple-400">10%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>السلع</span>
                <span className="text-yellow-400">5%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">أفضل الأداء</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>AAPL</span>
                <span className="text-green-400">+8.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>TSLA</span>
                <span className="text-green-400">+12.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>BTC</span>
                <span className="text-red-400">-2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>GOLD</span>
                <span className="text-green-400">+3.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
