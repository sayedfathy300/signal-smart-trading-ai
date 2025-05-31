
import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          لوحة التحكم
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">إجمالي الاستثمارات</h3>
            <p className="text-2xl font-bold text-green-400">$125,430</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">الربح اليومي</h3>
            <p className="text-2xl font-bold text-blue-400">+$1,245</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">عدد الصفقات</h3>
            <p className="text-2xl font-bold text-purple-400">156</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">معدل النجاح</h3>
            <p className="text-2xl font-bold text-yellow-400">87.3%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
