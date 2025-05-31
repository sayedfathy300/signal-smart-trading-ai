
import React from 'react';
import { Brain, Cpu, Zap, Target } from 'lucide-react';

const AIModels = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          نماذج الذكاء الاصطناعي
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">النماذج النشطة</h3>
            <p className="text-2xl font-bold text-purple-400">12</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Cpu className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">معالجة GPU</h3>
            <p className="text-2xl font-bold text-blue-400">85%</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">سرعة التنبؤ</h3>
            <p className="text-2xl font-bold text-yellow-400">156ms</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">دقة النماذج</h3>
            <p className="text-2xl font-bold text-green-400">94.7%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">النماذج المدربة</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">LSTM للتنبؤ بالأسعار</p>
                  <p className="text-sm text-gray-400">دقة: 96.2%</p>
                </div>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">Transformer للمشاعر</p>
                  <p className="text-sm text-gray-400">دقة: 91.8%</p>
                </div>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">CNN للأنماط</p>
                  <p className="text-sm text-gray-400">دقة: 88.5%</p>
                </div>
                <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">تدريب</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium">GAN لمحاكاة البيانات</p>
                  <p className="text-sm text-gray-400">دقة: 93.1%</p>
                </div>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">أداء النماذج</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>دقة التنبؤات</span>
                  <span className="text-green-400">94.7%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '94.7%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>سرعة المعالجة</span>
                  <span className="text-blue-400">87.3%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '87.3%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>استهلاك الذاكرة</span>
                  <span className="text-yellow-400">65.2%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '65.2%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>معدل التحديث</span>
                  <span className="text-purple-400">92.1%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '92.1%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModels;
