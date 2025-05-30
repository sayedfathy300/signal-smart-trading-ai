
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveChart } from '@/components/smart-recommendations/InteractiveChart';
import { DetailedReports } from '@/components/smart-recommendations/DetailedReports';
import { RealtimeNotifications } from '@/components/smart-recommendations/RealtimeNotifications';
import { ShapExplanations } from '@/components/smart-recommendations/ShapExplanations';

interface OutletContext {
  lang: 'en' | 'ar';
}

const SmartRecommendations = () => {
  const { lang } = useOutletContext<OutletContext>();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-bg via-gray-900 to-black">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'التوصيات الذكية المتقدمة' : 'Advanced Smart Recommendations'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'رسوم تفاعلية، تقارير مفصلة، إشعارات مباشرة وتفسيرات SHAP' : 'Interactive charts, detailed reports, real-time notifications and SHAP explanations'}
          </p>
        </div>

        {/* Smart Recommendations Tools */}
        <Tabs defaultValue="interactive-charts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-trading-card">
            <TabsTrigger value="interactive-charts">
              {lang === 'ar' ? 'الرسوم التفاعلية' : 'Interactive Charts'}
            </TabsTrigger>
            <TabsTrigger value="detailed-reports">
              {lang === 'ar' ? 'التقارير المفصلة' : 'Detailed Reports'}
            </TabsTrigger>
            <TabsTrigger value="realtime-notifications">
              {lang === 'ar' ? 'الإشعارات المباشرة' : 'Real-time Notifications'}
            </TabsTrigger>
            <TabsTrigger value="shap-explanations">
              {lang === 'ar' ? 'تفسيرات SHAP' : 'SHAP Explanations'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interactive-charts" className="space-y-6">
            <InteractiveChart 
              symbol="BTCUSD"
              timeframe="1H"
              lang={lang} 
            />
          </TabsContent>

          <TabsContent value="detailed-reports" className="space-y-6">
            <DetailedReports lang={lang} />
          </TabsContent>

          <TabsContent value="realtime-notifications" className="space-y-6">
            <RealtimeNotifications lang={lang} />
          </TabsContent>

          <TabsContent value="shap-explanations" className="space-y-6">
            <ShapExplanations 
              symbol="BTCUSD"
              lang={lang} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SmartRecommendations;
