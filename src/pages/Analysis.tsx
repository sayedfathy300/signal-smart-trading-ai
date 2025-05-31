
import React from 'react';

interface AnalysisProps {
  lang: 'en' | 'ar';
}

const Analysis = ({ lang }: AnalysisProps) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {lang === 'ar' ? 'التحليل' : 'Analysis'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">التحليل الفني</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>RSI</span>
                <span className="text-green-400">65.2</span>
              </div>
              <div className="flex justify-between">
                <span>MACD</span>
                <span className="text-blue-400">صاعد</span>
              </div>
              <div className="flex justify-between">
                <span>المتوسط المتحرك</span>
                <span className="text-yellow-400">إيجابي</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">التحليل الأساسي</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>نسبة P/E</span>
                <span className="text-green-400">18.5</span>
              </div>
              <div className="flex justify-between">
                <span>العائد على الأسهم</span>
                <span className="text-blue-400">15.2%</span>
              </div>
              <div className="flex justify-between">
                <span>الدين/الأسهم</span>
                <span className="text-yellow-400">0.65</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
