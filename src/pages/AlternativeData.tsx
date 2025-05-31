
import React from 'react';
import { Database, Satellite, TrendingUp, Globe } from 'lucide-react';

const AlternativeData = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          البيانات البديلة
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Database className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">مصادر البيانات</h3>
            <p className="text-2xl font-bold text-blue-400">127</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Satellite className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">البيانات الفضائية</h3>
            <p className="text-2xl font-bold text-green-400">نشط</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">دقة التنبؤ</h3>
            <p className="text-2xl font-bold text-purple-400">92.3%</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Globe className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">البيانات الاجتماعية</h3>
            <p className="text-2xl font-bold text-yellow-400">15M</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">مصادر البيانات النشطة</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>بيانات الأقمار الصناعية</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">متصل</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>بيانات وسائل التواصل</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">متصل</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>بيانات الطقس</span>
                <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">تأخير</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>بيانات النقل</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">متصل</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">تحليل المشاعر</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>المشاعر الإيجابية</span>
                  <span className="text-green-400">65%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>المشاعر السلبية</span>
                  <span className="text-red-400">20%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>المشاعر المحايدة</span>
                  <span className="text-gray-400">15%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gray-400 h-2 rounded-full" style={{width: '15%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeData;
