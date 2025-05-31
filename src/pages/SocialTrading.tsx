
import React from 'react';
import { Users, Copy, Star, MessageCircle } from 'lucide-react';

const SocialTrading = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          التداول الاجتماعي
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">المتداولون النشطون</h3>
            <p className="text-2xl font-bold text-blue-400">1,247</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Copy className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">صفقات منسوخة</h3>
            <p className="text-2xl font-bold text-green-400">8,534</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">أفضل المتداولين</h3>
            <p className="text-2xl font-bold text-yellow-400">25</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">المناقشات</h3>
            <p className="text-2xl font-bold text-purple-400">156</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">أفضل المتداولين</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <p className="font-medium">أحمد محمد</p>
                    <p className="text-sm text-gray-400">1,250 متابع</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400">+24.7%</p>
                  <p className="text-sm text-gray-400">هذا الشهر</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    س
                  </div>
                  <div>
                    <p className="font-medium">سارة أحمد</p>
                    <p className="text-sm text-gray-400">980 متابع</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400">+19.3%</p>
                  <p className="text-sm text-gray-400">هذا الشهر</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    م
                  </div>
                  <div>
                    <p className="font-medium">محمد علي</p>
                    <p className="text-sm text-gray-400">756 متابع</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400">+15.8%</p>
                  <p className="text-sm text-gray-400">هذا الشهر</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">أحدث المناقشات</h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">تحليل السوق اليوم</span>
                  <span className="text-sm text-gray-400">منذ 10 دقائق</span>
                </div>
                <p className="text-sm text-gray-300">
                  أتوقع انتعاش قوي للأسهم التقنية هذا الأسبوع...
                </p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>15 إعجاب</span>
                  <span>8 تعليقات</span>
                </div>
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">استراتيجية جديدة</span>
                  <span className="text-sm text-gray-400">منذ 30 دقيقة</span>
                </div>
                <p className="text-sm text-gray-300">
                  شاركت استراتيجية تداول جديدة تركز على المتوسطات المتحركة...
                </p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>23 إعجاب</span>
                  <span>12 تعليق</span>
                </div>
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">تحذير من المخاطر</span>
                  <span className="text-sm text-gray-400">منذ ساعة</span>
                </div>
                <p className="text-sm text-gray-300">
                  انتبهوا للتقلبات القوية في سوق العملات المشفرة...
                </p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>31 إعجاب</span>
                  <span>18 تعليق</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialTrading;
