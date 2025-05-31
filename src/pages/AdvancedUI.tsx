
import React from 'react';
import { Palette, Monitor, Smartphone, Tablet } from 'lucide-react';

const AdvancedUI = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          الواجهة المتقدمة
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Palette className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">السمات</h3>
            <p className="text-2xl font-bold text-purple-400">12</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Monitor className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">سطح المكتب</h3>
            <p className="text-2xl font-bold text-blue-400">محسن</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Tablet className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الأجهزة اللوحية</h3>
            <p className="text-2xl font-bold text-green-400">متوافق</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Smartphone className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الهواتف الذكية</h3>
            <p className="text-2xl font-bold text-yellow-400">مُحسن</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">مميزات الواجهة</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>التصميم المتجاوب</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">مُفعل</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>الوضع الليلي</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>الرسوم المتحركة</span>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">متطور</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>إمكانية الوصول</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">مُحسن</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">إحصائيات الأداء</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>سرعة التحميل</span>
                  <span className="text-green-400">1.2s</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>التفاعلية</span>
                  <span className="text-blue-400">0.8s</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>استقرار التصميم</span>
                  <span className="text-purple-400">0.1</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '98%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>نقاط الأداء</span>
                  <span className="text-yellow-400">96/100</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '96%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedUI;
