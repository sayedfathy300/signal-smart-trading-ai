
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  PlayCircle,
  TestTube,
  Zap
} from 'lucide-react';
import StrategyBacktesting from '@/components/interactive-analysis/StrategyBacktesting';
import BacktestingIntegration from '@/components/BacktestingIntegration';

interface BacktestingDashboardProps {
  lang?: 'en' | 'ar';
}

const BacktestingDashboard = ({ lang = 'ar' }: BacktestingDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {lang === 'ar' ? 'منصة الاختبار الخلفي المتقدمة' : 'Advanced Backtesting Platform'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'اختبر استراتيجياتك وحلل الأداء بأدوات متقدمة' 
              : 'Test your strategies and analyze performance with advanced tools'
            }
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="backtesting" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            {lang === 'ar' ? 'الاختبار الخلفي' : 'Backtesting'}
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            {lang === 'ar' ? 'اختبار التكامل' : 'Integration Test'}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {lang === 'ar' ? 'إعدادات متقدمة' : 'Advanced Settings'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  {lang === 'ar' ? 'الأداء العام' : 'Overall Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'إجمالي العائد' : 'Total Return'}
                    </span>
                    <span className="text-green-400 font-bold">+24.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'نسبة شارب' : 'Sharpe Ratio'}
                    </span>
                    <span className="text-white font-bold">1.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'أقصى سحب' : 'Max Drawdown'}
                    </span>
                    <span className="text-red-400 font-bold">-8.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  {lang === 'ar' ? 'إحصائيات التداول' : 'Trading Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'إجمالي الصفقات' : 'Total Trades'}
                    </span>
                    <span className="text-white font-bold">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                    </span>
                    <span className="text-green-400 font-bold">68.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'عامل الربح' : 'Profit Factor'}
                    </span>
                    <span className="text-white font-bold">2.12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  {lang === 'ar' ? 'أفضل الاستراتيجيات' : 'Top Strategies'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SMA Crossover</span>
                    <span className="text-green-400 font-bold">+18.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">RSI Reversal</span>
                    <span className="text-green-400 font-bold">+15.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bollinger Bands</span>
                    <span className="text-green-400 font-bold">+12.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'الميزات المتاحة' : 'Available Features'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-trading-secondary rounded-lg text-center">
                  <PlayCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white mb-1">
                    {lang === 'ar' ? 'اختبار فوري' : 'Live Testing'}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {lang === 'ar' ? 'تشغيل فوري للاستراتيجيات' : 'Instant strategy execution'}
                  </p>
                </div>
                
                <div className="p-4 bg-trading-secondary rounded-lg text-center">
                  <TestTube className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white mb-1">
                    {lang === 'ar' ? 'اختبار التكامل' : 'Integration Tests'}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {lang === 'ar' ? 'فحص شامل للنظام' : 'Comprehensive system checks'}
                  </p>
                </div>
                
                <div className="p-4 bg-trading-secondary rounded-lg text-center">
                  <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white mb-1">
                    {lang === 'ar' ? 'تحليل متقدم' : 'Advanced Analytics'}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {lang === 'ar' ? 'مؤشرات مفصلة للأداء' : 'Detailed performance metrics'}
                  </p>
                </div>
                
                <div className="p-4 bg-trading-secondary rounded-lg text-center">
                  <Settings className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white mb-1">
                    {lang === 'ar' ? 'تخصيص كامل' : 'Full Customization'}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {lang === 'ar' ? 'إعدادات قابلة للتخصيص' : 'Customizable settings'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backtesting Tab */}
        <TabsContent value="backtesting">
          <StrategyBacktesting lang={lang} />
        </TabsContent>

        {/* Integration Test Tab */}
        <TabsContent value="integration">
          <BacktestingIntegration lang={lang} />
        </TabsContent>

        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'الإعدادات المتقدمة' : 'Advanced Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {lang === 'ar' ? 'الإعدادات المتقدمة' : 'Advanced Settings'}
                </h3>
                <p className="text-gray-400">
                  {lang === 'ar' 
                    ? 'ستتم إضافة المزيد من الإعدادات المتقدمة قريباً'
                    : 'More advanced settings will be added soon'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestingDashboard;
