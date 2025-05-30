
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SecurityDashboard from '@/components/SecurityDashboard';

interface OutletContext {
  lang: 'en' | 'ar';
}

const SecurityDashboardPage = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return <SecurityDashboard lang={lang} />;
};

export default SecurityDashboardPage;
