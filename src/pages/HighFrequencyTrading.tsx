
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import HighFrequencyTradingComponent from '@/components/HighFrequencyTrading';

interface OutletContext {
  lang: 'en' | 'ar';
}

const HighFrequencyTrading = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return <HighFrequencyTradingComponent lang={lang} />;
};

export default HighFrequencyTrading;
