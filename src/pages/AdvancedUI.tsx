
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThreeDVisualization from '@/components/advanced-ui/ThreeDVisualization';
import VoiceControl from '@/components/advanced-ui/VoiceControl';
import DragDropCustomization from '@/components/advanced-ui/DragDropCustomization';
import AdvancedExport from '@/components/advanced-ui/AdvancedExport';
import PatternRecognitionUI from '@/components/ui/pattern-recognition/PatternRecognitionUI';
import ChartExporter from '@/components/ui/export/ChartExporter';
import ReportExporter from '@/components/ui/export/ReportExporter';
import BloombergTerminalTheme from '@/components/ui/design/BloombergTerminalTheme';
import { Box, Mic, MousePointer, Download, Eye, FileImage, FileText, Monitor } from 'lucide-react';

interface MarketDataPoint {
  name: string;
  price: number;
  volume: number;
  timestamp: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
}

interface ExportOptions {
  format: string;
  data: any;
  includeCharts: boolean;
  includeStats: boolean;
  includePortfolio: boolean;
  includeTrades: boolean;
  includeAnalysis: boolean;
  dateRange: string;
  chartResolution: string;
  language: string;
}

const AdvancedUI = () => {
  const [lang] = useState<'en' | 'ar'>('ar');

  const mockData: MarketDataPoint[] = [
    { name: 'Jan', price: 400, volume: 1200, timestamp: Date.now() - 86400000 * 30, signal: 'BUY' },
    { name: 'Feb', price: 300, volume: 1100, timestamp: Date.now() - 86400000 * 25, signal: 'HOLD' },
    { name: 'Mar', price: 600, volume: 1500, timestamp: Date.now() - 86400000 * 20, signal: 'BUY' },
    { name: 'Apr', price: 800, volume: 1800, timestamp: Date.now() - 86400000 * 15, signal: 'SELL' },
    { name: 'May', price: 500, volume: 1300, timestamp: Date.now() - 86400000 * 10, signal: 'HOLD' },
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
            {lang === 'ar' ? 'الواجهة المتقدمة الكاملة' : 'Complete Advanced UI Suite'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'مجموعة شاملة من أدوات الواجهة المتقدمة مع التصور ثلاثي الأبعاد والتحكم الصوتي والتصدير المتقدم'
              : 'Complete suite of advanced UI tools with 3D visualization, voice control, and advanced export'}
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="3d-visualization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 bg-trading-card">
          <TabsTrigger value="3d-visualization" className="flex items-center gap-2 text-xs">
            <Box className="h-4 w-4" />
            {lang === 'ar' ? 'التصور 3D' : '3D Viz'}
          </TabsTrigger>
          <TabsTrigger value="voice-control" className="flex items-center gap-2 text-xs">
            <Mic className="h-4 w-4" />
            {lang === 'ar' ? 'التحكم الصوتي' : 'Voice'}
          </TabsTrigger>
          <TabsTrigger value="customization" className="flex items-center gap-2 text-xs">
            <MousePointer className="h-4 w-4" />
            {lang === 'ar' ? 'التخصيص' : 'Custom'}
          </TabsTrigger>
          <TabsTrigger value="pattern-recognition" className="flex items-center gap-2 text-xs">
            <Eye className="h-4 w-4" />
            {lang === 'ar' ? 'الأنماط' : 'Patterns'}
          </TabsTrigger>
          <TabsTrigger value="chart-export" className="flex items-center gap-2 text-xs">
            <FileImage className="h-4 w-4" />
            {lang === 'ar' ? 'تصدير الرسوم' : 'Chart Export'}
          </TabsTrigger>
          <TabsTrigger value="report-export" className="flex items-center gap-2 text-xs">
            <FileText className="h-4 w-4" />
            {lang === 'ar' ? 'تصدير التقارير' : 'Reports'}
          </TabsTrigger>
          <TabsTrigger value="bloomberg-theme" className="flex items-center gap-2 text-xs">
            <Monitor className="h-4 w-4" />
            {lang === 'ar' ? 'تصميم بلومبرغ' : 'Bloomberg'}
          </TabsTrigger>
          <TabsTrigger value="legacy-export" className="flex items-center gap-2 text-xs">
            <Download className="h-4 w-4" />
            {lang === 'ar' ? 'المتقدم القديم' : 'Legacy'}
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

        <TabsContent value="pattern-recognition">
          <PatternRecognitionUI lang={lang} data={mockData} />
        </TabsContent>

        <TabsContent value="chart-export">
          <ChartExporter lang={lang} chartTitle="Trading Chart Analysis" />
        </TabsContent>

        <TabsContent value="report-export">
          <ReportExporter lang={lang} />
        </TabsContent>

        <TabsContent value="bloomberg-theme">
          <BloombergTerminalTheme lang={lang} />
        </TabsContent>

        <TabsContent value="legacy-export">
          <AdvancedExport 
            lang={lang} 
            onExport={(options) => handleExport({
              ...options,
              data: mockData
            })} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedUI;
