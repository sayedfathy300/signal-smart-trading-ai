
import React from 'react';
import TradingPlatformComponent from '@/components/TradingPlatform';

const TradingPlatform = () => {
  // بدلاً من استخدام useOutletContext، سنستخدم قيمة افتراضية للغة
  const lang = 'ar'; // يمكن الحصول على هذه القيمة من مكان آخر في المستقبل
  
  return <TradingPlatformComponent lang={lang} />;
};

export default TradingPlatform;
