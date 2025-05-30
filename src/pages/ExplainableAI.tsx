
import React from 'react';
import ExplainableAIComponent from '@/components/ExplainableAI';

const ExplainableAIPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-bg via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            الذكاء الاصطناعي التفسيري
          </h1>
          <p className="text-xl text-gray-300">
            نظام شامل لتفسير قرارات الذكاء الاصطناعي، SHAP، وتحليل أهمية الخصائص
          </p>
        </div>
        
        <ExplainableAIComponent />
      </div>
    </div>
  );
};

export default ExplainableAIPage;
