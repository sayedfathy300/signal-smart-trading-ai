
import React from 'react';
import ContinuousLearningComponent from '@/components/ContinuousLearning';

const ContinuousLearningPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-bg via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            نظام التعلم المستمر المتقدم
          </h1>
          <p className="text-xl text-gray-300">
            نظام ذكي للتعلم التلقائي، التكيف المستمر، واختيار النماذج الأمثل
          </p>
        </div>
        
        <ContinuousLearningComponent />
      </div>
    </div>
  );
};

export default ContinuousLearningPage;
