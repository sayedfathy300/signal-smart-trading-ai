
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThreeDVisualization from '@/components/advanced-ui/ThreeDVisualization';
import VoiceControl from '@/components/advanced-ui/VoiceControl';
import DragDropCustomization from '@/components/advanced-ui/DragDropCustomization';
import AdvancedExport from '@/components/advanced-ui/AdvancedExport';
import { Box, Mic, MousePointer, Download } from 'lucide-react';

interface MarketDataPoint {
  name: string;
  price: number;
  volume: number;
  timestamp: string;
  signal: 'buy' | 'sell' | 'hold';
}

interface ExportOptions {
  format: string;
  data: any;
}

const AdvancedUI = () => {
  const [lang] = useState<'en' | 'ar'>('ar');

  const mockData: MarketDataPoint[] = [
    { name: 'Jan', price: 400, volume: 1200, timestamp: '2024-01-01', signal: 'buy' },
    { name: 'Feb', price: 300, volume: 1100, timestamp: '2024-02-01', signal: 'hold' },
    { name: 'Mar', price: 600, volume: 1500, timestamp: '2024-03-01', signal: 'buy' },
    { name: 'Apr', price: 800, volume: 1800, timestamp: '2024-04-01', signal: 'sell' },
    { name: 'May', price: 500, volume: 1300, timestamp: '2024-05-01', signal: 'hold' },
  ];

  const handleExport = (options: ExportOptions) => {
    console.log('Exporting data:', options.format, options.data);
  };

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'الواجهة المتقدمة' : 'Advanced UI'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'تجربة تفاعلية متطورة مع تقنيات حديثة'
              : 'Advanced interactive experience with modern technologies'}
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="3d-visualization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="3d-visualization" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            {lang === 'ar' ? 'التصور ثلاثي الأبعاد' : '3D Visualization'}
          </TabsTrigger>
          <TabsTrigger value="voice-control" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            {lang === 'ar' ? 'التحكم الصوتي' : 'Voice Control'}
          </TabsTrigger>
          <TabsTrigger value="customization" className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            {lang === 'ar' ? 'التخصيص' : 'Customization'}
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {lang === 'ar' ? 'التصدير المتقدم' : 'Advanced Export'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="3d-visualization">
          <ThreeDVisualization lang={lang} data={mockData} />
        </TabsContent>

        <TabsContent value="voice-control">
          <VoiceControl lang={lang} />
        </TabsContent>

        <TabsContent value="customization">
          <DragDropCustomization lang={lang} />
        </TabsContent>

        <TabsContent value="export">
          <AdvancedExport lang={lang} onExport={handleExport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedUI;
