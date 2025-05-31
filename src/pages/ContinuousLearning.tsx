
import React from 'react';
import { RefreshCw, BookOpen, TrendingUp, Award } from 'lucide-react';

const ContinuousLearning = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          التعلم المستمر
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <RefreshCw className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">تحديثات النموذج</h3>
            <p className="text-2xl font-bold text-blue-400">24/7</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <BookOpen className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">نقاط البيانات</h3>
            <p className="text-2xl font-bold text-green-400">2.4M</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">تحسن الأداء</h3>
            <p className="text-2xl font-bold text-purple-400">+12.3%</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">نضج النموذج</h3>
            <p className="text-2xl font-bold text-yellow-400">97.2%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">عمليات التعلم النشطة</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">تحليل الأنماط الجديدة</p>
                  <p className="text-sm text-gray-400">معالجة 1,200 نمط/ساعة</p>
                </div>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">تحديث الأوزان</p>
                  <p className="text-sm text-gray-400">كل 15 دقيقة</p>
                </div>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">تلقائي</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">التعلم من الأخطاء</p>
                  <p className="text-sm text-gray-400">تحليل 50 خطأ/يوم</p>
                </div>
                <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">مستمر</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">مقاييس التحسن</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>دقة التنبؤات</span>
                  <span className="text-green-400">+5.2%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '85.2%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>سرعة التعلم</span>
                  <span className="text-blue-400">+8.7%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '78.7%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>كفاءة الذاكرة</span>
                  <span className="text-purple-400">+3.1%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '93.1%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>تقليل الأخطاء</span>
                  <span className="text-yellow-400">+15.3%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '88.3%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinuousLearning;
