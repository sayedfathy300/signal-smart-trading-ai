
import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

const SecurityDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          لوحة الأمان
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">مستوى الأمان</h3>
            <p className="text-2xl font-bold text-green-400">عالي</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Lock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">التشفير</h3>
            <p className="text-2xl font-bold text-blue-400">AES-256</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">التهديدات</h3>
            <p className="text-2xl font-bold text-yellow-400">0</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الامتثال</h3>
            <p className="text-2xl font-bold text-green-400">100%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">حالة الأمان</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>جدار الحماية</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>كشف التطفل</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">نشط</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>التشفير المتقدم</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">مُفعل</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <span>المصادقة الثنائية</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">إجباري</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">سجل الأمان</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-900/30 border border-green-600 rounded">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <p className="font-medium text-green-400">تسجيل دخول آمن</p>
                  <p className="text-sm text-gray-300">تم بنجاح من IP: 192.168.1.100</p>
                  <p className="text-xs text-gray-400">منذ 5 دقائق</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-900/30 border border-blue-600 rounded">
                <Shield className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="font-medium text-blue-400">تحديث أمني</p>
                  <p className="text-sm text-gray-300">تم تطبيق التصحيحات الأمنية</p>
                  <p className="text-xs text-gray-400">منذ ساعة</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-900/30 border border-yellow-600 rounded">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />
                <div>
                  <p className="font-medium text-yellow-400">محاولة وصول مشبوهة</p>
                  <p className="text-sm text-gray-300">تم حجبها تلقائياً</p>
                  <p className="text-xs text-gray-400">منذ 3 ساعات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
