
import React from 'react';
import { Eye, FileText, BarChart3, MessageSquare } from 'lucide-react';

const ExplainableAI = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          الذكاء الاصطناعي القابل للتفسير
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Eye className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">وضوح القرارات</h3>
            <p className="text-2xl font-bold text-blue-400">98.5%</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <FileText className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">التقارير المولدة</h3>
            <p className="text-2xl font-bold text-green-400">1,247</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">العوامل المؤثرة</h3>
            <p className="text-2xl font-bold text-purple-400">15</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <MessageSquare className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">التفسيرات</h3>
            <p className="text-2xl font-bold text-yellow-400">24/7</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">تفسير القرارات الأخيرة</h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">شراء AAPL</span>
                  <span className="text-green-400">ثقة 95%</span>
                </div>
                <p className="text-sm text-gray-400">
                  القرار مبني على: تحسن الأرباح (40%)، زيادة الطلب (35%)، التحليل الفني (25%)
                </p>
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">بيع TSLA</span>
                  <span className="text-red-400">ثقة 87%</span>
                </div>
                <p className="text-sm text-gray-400">
                  القرار مبني على: تقلبات السوق (50%)، أخبار سلبية (30%)، مؤشرات فنية (20%)
                </p>
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">احتفظ بـ MSFT</span>
                  <span className="text-blue-400">ثقة 92%</span>
                </div>
                <p className="text-sm text-gray-400">
                  القرار مبني على: أداء مستقر (45%)، توقعات إيجابية (35%)، قوة السهم (20%)
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">العوامل الأكثر تأثيراً</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>التحليل الفني</span>
                  <span className="text-blue-400">35%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>تحليل المشاعر</span>
                  <span className="text-green-400">28%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '28%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>البيانات الأساسية</span>
                  <span className="text-purple-400">22%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '22%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>الأخبار والأحداث</span>
                  <span className="text-yellow-400">15%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '15%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainableAI;
