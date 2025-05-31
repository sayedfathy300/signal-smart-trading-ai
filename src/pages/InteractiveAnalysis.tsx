
import React from 'react';
import { MousePointer, Layers, Zap, TrendingUp } from 'lucide-react';

const InteractiveAnalysis = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          التحليل التفاعلي
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <MousePointer className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الأدوات التفاعلية</h3>
            <p className="text-2xl font-bold text-blue-400">25</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Layers className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الطبقات النشطة</h3>
            <p className="text-2xl font-bold text-green-400">8</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">التحديث المباشر</h3>
            <p className="text-2xl font-bold text-yellow-400">500ms</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">دقة التحليل</h3>
            <p className="text-2xl font-bold text-purple-400">97.8%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">أدوات التحليل</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>أدوات الرسم</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>المؤشرات المخصصة</span>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">12 مؤشر</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>تحليل الأنماط</span>
                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">AI مدعوم</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>محاكي التداول</span>
                <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">تجريبي</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">إحصائيات التفاعل</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>استخدام الأدوات</span>
                  <span className="text-green-400">85%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>سرعة الاستجابة</span>
                  <span className="text-blue-400">92%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>دقة النتائج</span>
                  <span className="text-purple-400">97.8%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '97.8%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>رضا المستخدمين</span>
                  <span className="text-yellow-400">94.5%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '94.5%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveAnalysis;
