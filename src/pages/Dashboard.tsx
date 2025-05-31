
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MarketOverview from '@/components/MarketOverview';

interface OutletContext {
  lang: 'en' | 'ar';
}

const Dashboard = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return <MarketOverview lang={lang} />;
};

export default Dashboard;
