
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import TradingPlatformComponent from '@/components/TradingPlatform';

interface OutletContext {
  lang: 'en' | 'ar';
}

const TradingPlatform = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return <TradingPlatformComponent lang={lang} />;
};

export default TradingPlatform;
