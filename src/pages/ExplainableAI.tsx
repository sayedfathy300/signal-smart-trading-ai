
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ExplainableAI from '@/components/ExplainableAI';

interface OutletContext {
  lang: 'en' | 'ar';
}

const ExplainableAIPage = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return <ExplainableAI lang={lang} />;
};

export default ExplainableAIPage;
