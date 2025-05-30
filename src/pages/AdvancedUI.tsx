import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Box,
  Mic,
  Layout,
  FileText,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import ThreeDVisualization from '@/components/advanced-ui/ThreeDVisualization';
import VoiceControl from '@/components/advanced-ui/VoiceControl';
import DragDropCustomization from '@/components/advanced-ui/DragDropCustomization';
import AdvancedExport from '@/components/advanced-ui/AdvancedExport';
import { toast } from 'sonner';

interface OutletContext {
  lang: 'en' | 'ar';
}

const AdvancedUI = () => {
  const { lang } = useOutletContext<OutletContext>();
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

  // Mock market data for 3D visualization
  const mockMarketData = React.useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      price: 50000 + Math.sin(i * 0.1) * 5000 + Math.random() * 2000,
      volume: 1000000 + Math.random() * 500000,
      timestamp: Date.now() - (50 - i) * 60000,
      signal: (['BUY', 'SELL', 'HOLD'] as const)[Math.floor(Math.random() * 3)]
    }));
  }, []);

  const handleVoiceCommand = (command: string, params?: any) => {
    console.log('Voice command received:', command, params);
    
    switch (command) {
      case 'navigate':
        toast.success(lang === 'ar' ? 'تم تنفيذ أمر التنقل' : 'Navigation command executed');
        break;
      case 'trade':
        toast.success(lang === 'ar' ? 'تم تنفيذ أمر التداول' : 'Trading command executed');
        break;
      case 'analyze':
        toast.success(lang === 'ar' ? 'تم بدء التحليل' : 'Analysis started');
        break;
      case 'portfolio':
        toast.success(lang === 'ar' ? 'تم عرض المحفظة' : 'Portfolio displayed');
        break;
      case 'export':
        toast.success(lang === 'ar' ? 'تم بدء التصدير' : 'Export started');
        break;
      case 'stop':
        toast.info(lang === 'ar' ? 'تم إيقاف العملية' : 'Operation stopped');
        break;
      default:
        toast.info(lang === 'ar' ? 'أمر غير مُعرّف' : 'Unknown command');
    }
  };

  const handleLayoutChange = (items: any[]) => {
    console.log('Layout changed:', items);
    toast.success(lang === 'ar' ? 'تم حفظ التخطيط' : 'Layout saved');
  };

  const handleExport = (options: any) => {
    console.log('Export options:', options);
    toast.success(lang === 'ar' ? 'تم تصدير البيانات' : 'Data exported');
  };

  const features = [
    {
      id: '3d-viz',
      title: lang === 'ar' ? 'التصور ثلاثي الأبعاد' : '3D Visualization',
      description: lang === 'ar' ? 'رؤية البيانات في بيئة ثلاثية الأبعاد تفاعلية' : 'Interactive 3D data visualization environment',
      icon: <Box className="h-5 w-5" />,
      status: 'completed'
    },
    {
      id: 'voice',
      title: lang === 'ar' ? 'التحكم الصوتي' : 'Voice Control',
      description: lang === 'ar' ? 'تحكم في المنصة باستخدام الأوامر الصوتية' : 'Control the platform using voice commands',
      icon: <Mic className="h-5 w-5" />,
      status: 'completed'
    },
    {
      id: 'drag-drop',
      title: lang === 'ar' ? 'التخصيص بالسحب والإفلات' : 'Drag & Drop Customization',
      description: lang === 'ar' ? 'تخصيص تخطيط لوحة التحكم بسهولة' : 'Easily customize dashboard layout',
      icon: <Layout className="h-5 w-5" />,
      status: 'completed'
    },
    {
      id: 'export',
      title: lang === 'ar' ? 'التصدير المتقدم' : 'Advanced Export',
      description: lang === 'ar' ? 'تصدير تقارير PDF متقدمة مع الرسوم البيانية' : 'Export advanced PDF reports with charts',
      icon: <FileText className="h-5 w-5" />,
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen bg-trading-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {lang === 'ar' ? 'الواجهة المتقدمة' : 'Advanced Interface'}
            </h1>
            <p className="text-gray-400">
              {lang === 'ar' ? 
                'ميزات متقدمة للتحكم والتخصيص والتصور' : 
                'Advanced features for control, customization, and visualization'
              }
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle className="h-4 w-4 mr-1" />
            {lang === 'ar' ? 'مُكتمل' : 'Completed'}
          </Badge>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  {feature.icon}
                  <span className="text-sm font-medium text-white">{feature.title}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{feature.description}</p>
                <Badge 
                  variant={feature.status === 'completed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {feature.status === 'completed' ? 
                    (lang === 'ar' ? 'مُفعّل' : 'Active') :
                    (lang === 'ar' ? 'قيد التطوير' : 'In Development')
                  }
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="3d-visualization" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-trading-card">
            <TabsTrigger value="3d-visualization" className="text-sm">
              <Box className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'ثلاثي الأبعاد' : '3D Viz'}
            </TabsTrigger>
            <TabsTrigger value="voice-control" className="text-sm">
              <Mic className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'التحكم الصوتي' : 'Voice'}
            </TabsTrigger>
            <TabsTrigger value="customization" className="text-sm">
              <Layout className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'التخصيص' : 'Layout'}
            </TabsTrigger>
            <TabsTrigger value="export" className="text-sm">
              <FileText className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'التصدير' : 'Export'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="3d-visualization" className="space-y-4">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  {lang === 'ar' ? 'التصور ثلاثي الأبعاد للبيانات' : '3D Data Visualization'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {lang === 'ar' ? 
                    'تصور البيانات المالية في بيئة ثلاثية الأبعاد تفاعلية مع إمكانية التنقل والتكبير' :
                    'Visualize financial data in an interactive 3D environment with navigation and zoom capabilities'
                  }
                </p>
                <ThreeDVisualization data={mockMarketData} lang={lang} />
                <div className="mt-4 text-sm text-gray-500">
                  {lang === 'ar' ? 
                    'استخدم الماوس للدوران والتكبير. النقاط الخضراء = شراء، الحمراء = بيع، الصفراء = انتظار' :
                    'Use mouse to rotate and zoom. Green points = Buy, Red = Sell, Yellow = Hold'
                  }
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice-control" className="space-y-4">
            <VoiceControl lang={lang} onCommand={handleVoiceCommand} />
          </TabsContent>

          <TabsContent value="customization" className="space-y-4">
            <DragDropCustomization lang={lang} onLayoutChange={handleLayoutChange} />
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <AdvancedExport lang={lang} onExport={handleExport} />
          </TabsContent>
        </Tabs>

        {/* Additional Features Preview */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {lang === 'ar' ? 'ميزات إضافية' : 'Additional Features'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  {lang === 'ar' ? 'تصور الواقع المعزز' : 'AR Visualization'}
                </h4>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'قريباً: تصور البيانات في الواقع المعزز' : 'Coming soon: AR data visualization'}
                </p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  {lang === 'ar' ? 'الذكاء الاصطناعي للصوت' : 'AI Voice Assistant'}
                </h4>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'مساعد ذكي يفهم السياق والمحادثة' : 'Context-aware conversational AI assistant'}
                </p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  {lang === 'ar' ? 'التحكم بالإيماءات' : 'Gesture Control'}
                </h4>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'التحكم في المنصة باستخدام إيماءات اليد' : 'Control platform with hand gestures'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedUI;
