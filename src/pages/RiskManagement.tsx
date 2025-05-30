
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import RiskManagementComponent from '@/components/RiskManagement';

interface OutletContext {
  lang: 'en' | 'ar';
}

const RiskManagement = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return <RiskManagementComponent lang={lang} />;
};

export default RiskManagement;
