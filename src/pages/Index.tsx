
import React from 'react';

console.log('=== INDEX.TSX LOADING ===');

const Index = () => {
  console.log('Index component rendering...');

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: '#f8fafc', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            منصة التداول الذكي
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            منصة تداول متقدمة مدعومة بالذكاء الاصطناعي لتحليل الأسواق والتداول الآلي
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div style={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.8)', 
            borderColor: '#374151',
            border: '1px solid #374151',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3 className="text-white text-lg font-semibold mb-2">التحليل المتقدم</h3>
            <p className="text-gray-300">
              تحليل فني ومالي متقدم باستخدام خوارزميات الذكاء الاصطناعي
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.8)', 
            borderColor: '#374151',
            border: '1px solid #374151',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3 className="text-white text-lg font-semibold mb-2">الرسوم البيانية</h3>
            <p className="text-gray-300">
              رسوم بيانية تفاعلية متقدمة لمتابعة الأسواق المالية
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.8)', 
            borderColor: '#374151',
            border: '1px solid #374151',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h3 className="text-white text-lg font-semibold mb-2">الذكاء الاصطناعي</h3>
            <p className="text-gray-300">
              نماذج ذكاء اصطناعي متطورة للتنبؤ بحركة الأسواق
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div style={{ 
            backgroundColor: 'rgba(51, 65, 85, 0.6)', 
            padding: '1rem', 
            borderRadius: '0.5rem' 
          }} className="text-center">
            <div className="text-2xl font-bold text-blue-400">25+</div>
            <div className="text-sm text-gray-400">استراتيجية تداول</div>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(51, 65, 85, 0.6)', 
            padding: '1rem', 
            borderRadius: '0.5rem' 
          }} className="text-center">
            <div className="text-2xl font-bold text-green-400">50+</div>
            <div className="text-sm text-gray-400">مؤشر فني</div>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(51, 65, 85, 0.6)', 
            padding: '1rem', 
            borderRadius: '0.5rem' 
          }} className="text-center">
            <div className="text-2xl font-bold text-purple-400">10+</div>
            <div className="text-sm text-gray-400">نموذج ذكاء اصطناعي</div>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(51, 65, 85, 0.6)', 
            padding: '1rem', 
            borderRadius: '0.5rem' 
          }} className="text-center">
            <div className="text-2xl font-bold text-yellow-400">24/7</div>
            <div className="text-sm text-gray-400">مراقبة الأسواق</div>
          </div>
        </div>
      </div>
    </div>
  );
};

console.log('Index component defined successfully');

export default Index;
