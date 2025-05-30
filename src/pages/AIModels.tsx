
import React from 'react';
import AdvancedAIModels from '@/components/AdvancedAIModels';

const AIModels = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-bg via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            نماذج الذكاء الاصطناعي المتقدمة
          </h1>
          <p className="text-xl text-gray-300">
            مجموعة شاملة من نماذج الذكاء الاصطناعي والتعلم العميق للتحليل المالي المتقدم
          </p>
        </div>
        
        <AdvancedAIModels />
      </div>
    </div>
  );
};

export default AIModels;
