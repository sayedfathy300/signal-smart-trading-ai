
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AdvancedAIModels from '@/components/AdvancedAIModels';

interface OutletContext {
  lang: 'en' | 'ar';
}

const AdvancedAIModelsPage = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-bg via-gray-900 to-black">
      <AdvancedAIModels lang={lang} />
    </div>
  );
};

export default AdvancedAIModelsPage;
