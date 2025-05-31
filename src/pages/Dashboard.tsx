
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MarketOverview from '@/components/MarketOverview';

interface OutletContext {
  lang: 'en' | 'ar';
}

const Dashboard = () => {
  console.log('Dashboard component rendering...');
  
  // استخدم fallback إذا لم يكن السياق متوفراً
  const context = useOutletContext<OutletContext>();
  const lang = context?.lang || 'ar';
  
  console.log('Dashboard context:', context, 'lang:', lang);
  
  return <MarketOverview lang={lang} />;
};

export default Dashboard;
