
import React, { Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';
import MarketOverview from '@/components/MarketOverview';
import LoadingSpinner from '@/components/LoadingSpinner';

interface OutletContext {
  lang: 'en' | 'ar';
}

const Dashboard = () => {
  console.log('Dashboard component rendering...');
  
  try {
    const context = useOutletContext<OutletContext>();
    const lang = context?.lang || 'ar';
    
    console.log('Dashboard context:', context, 'lang:', lang);
    
    return (
      <Suspense fallback={<LoadingSpinner text={lang === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading dashboard...'} />}>
        <MarketOverview lang={lang} />
      </Suspense>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">خطأ في لوحة التحكم</h2>
          <p className="text-gray-300">حدث خطأ أثناء تحميل لوحة التحكم</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }
};

export default Dashboard;
