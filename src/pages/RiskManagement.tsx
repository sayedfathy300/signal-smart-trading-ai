
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import CapitalManagement from '@/components/CapitalManagement';

interface OutletContext {
  lang: 'en' | 'ar';
}

const RiskManagement = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return <CapitalManagement lang={lang} />;
};

export default RiskManagement;
