
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AttackPreventionDashboard from '@/components/AttackPreventionDashboard';

interface OutletContext {
  lang: 'en' | 'ar';
}

const AttackPrevention = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return <AttackPreventionDashboard lang={lang} />;
};

export default AttackPrevention;
