
import React from 'react';

interface ChartsProps {
  lang: 'en' | 'ar';
}

const Charts = ({ lang }: ChartsProps) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {lang === 'ar' ? 'الرسوم البيانية' : 'Charts'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">مؤشر S&P 500</h2>
            <div className="h-64 bg-slate-700 rounded flex items-center justify-center">
              <p className="text-gray-400">الرسم البياني سيظهر هنا</p>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">العملات المشفرة</h2>
            <div className="h-64 bg-slate-700 rounded flex items-center justify-center">
              <p className="text-gray-400">الرسم البياني سيظهر هنا</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
