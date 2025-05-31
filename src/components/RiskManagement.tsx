
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Target,
  BarChart3,
  PieChart,
  Settings,
  RefreshCw,
  Brain,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { tradingPlatformService, RiskMetrics } from '@/services/tradingPlatformService';

interface RiskManagementProps {
  lang?: 'en' | 'ar';
}

const RiskManagement = ({ lang = 'ar' }: RiskManagementProps) => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRiskManagement, setAutoRiskManagement] = useState(true);
  const [riskSettings, setRiskSettings] = useState({
    maxDailyLoss: 5,
    maxPositionSize: 10,
    maxCorrelation: 70,
    riskPerTrade: 2
  });

  useEffect(() => {
    loadRiskMetrics();
    const interval = setInterval(loadRiskMetrics, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  const loadRiskMetrics = async () => {
    setLoading(true);
    try {
      const metrics = await tradingPlatformService.getRiskMetrics();
      setRiskMetrics(metrics);
    } catch (error) {
      console.error('خطأ في تحميل مؤشرات المخاطر:', error);
    } finally {
      setLoading(false);
    }
  };

  // بيانات تجريبية للرسوم البيانية
  const riskTrendData = [
    { time: '09:00', portfolioRisk: 8.5, var95: 2.1, drawdown: 3.2 },
    { time: '10:00', portfolioRisk: 12.3, var95: 2.8, drawdown: 4.1 },
    { time: '11:00', portfolioRisk: 15.7, var95: 3.2, drawdown: 5.5 },
    { time: '12:00', portfolioRisk: 11.2, var95: 2.5, drawdown: 3.8 },
    { time: '13:00', portfolioRisk: 9.8, var95: 2.2, drawdown: 2.9 },
    { time: '14:00', portfolioRisk: 13.4, var95: 3.0, drawdown: 4.2 },
    { time: '15:00', portfolioRisk: 10.1, var95: 2.3, drawdown: 3.1 }
  ];

  const riskDistributionData = [
    { name: 'BTC/USDT', risk: 35, color: '#F59E0B' },
    { name: 'ETH/USDT', risk: 25, color: '#3B82F6' },
    { name: 'BNB/USDT', risk: 20, color: '#10B981' },
    { name: 'ADA/USDT', risk: 12, color: '#8B5CF6' },
    { name: 'أخرى', risk: 8, color: '#6B7280' }
  ];

  const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#6B7280'];

  const getRiskLevelColor = (risk: number) => {
    if (risk < 5) return 'text-trading-up';
    if (risk < 15) return 'text-yellow-500';
    return 'text-trading-down';
  };

  const getRiskLevelText = (risk: number) => {
    if (risk < 5) return lang === 'ar' ? 'منخفض' : 'Low';
    if (risk < 15) return lang === 'ar' ? 'متوسط' : 'Medium';
    return lang === 'ar' ? 'مرتفع' : 'High';
  };

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'إدارة المخاطر المتقدمة' : 'Advanced Risk Management'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'مراقبة وإدارة مخاطر المحفظة في الوقت الفعلي' : 'Real-time portfolio risk monitoring and management'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={loadRiskMetrics}
            disabled={loading}
            size="sm"
            className="bg-trading-primary hover:bg-blue-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? (lang === 'ar' ? 'جاري التحديث...' : 'Updating...') : (lang === 'ar' ? 'تحديث' : 'Refresh')}
          </Button>
        </div>
      </div>

      {/* نظرة عامة على المخاطر */}
      {riskMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-400" />
                <div>
                  <div className={cn("text-2xl font-bold", getRiskLevelColor(riskMetrics.portfolioRisk * 100))}>
                    {(riskMetrics.portfolioRisk * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'مخاطر المحفظة' : 'Portfolio Risk'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRiskLevelText(riskMetrics.portfolioRisk * 100)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-8 w-8 text-trading-down" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(riskMetrics.maxDrawdown * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'أقصى انسحاب' : 'Max Drawdown'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {riskMetrics.sharpeRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'نسبة شارب' : 'Sharpe Ratio'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(riskMetrics.var95 * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {lang === 'ar' ? 'VaR 95%' : 'VaR 95%'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="realtime">المراقبة المباشرة</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="analysis">تحليل المخاطر</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
        </TabsList>

        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* اتجاه المخاطر */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">اتجاه المخاطر اليومي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="portfolioRisk" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        name="مخاطر المحفظة"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="var95" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        name="VaR 95%"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="drawdown" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        name="الانسحاب"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* توزيع المخاطر */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">توزيع المخاطر حسب الأصل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="risk"
                        label={({ name, risk }) => `${name}: ${risk}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* مؤشرات مخاطر متقدمة */}
          {riskMetrics && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">مؤشرات المخاطر المتقدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-white">نسب المخاطر المعدلة</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">نسبة سورتينو:</span>
                        <span className="text-white font-bold">{riskMetrics.sortinoRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">بيتا للسوق:</span>
                        <span className="text-white font-bold">{riskMetrics.betaToMarket.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Shortfall:</span>
                        <span className="text-white font-bold">{(riskMetrics.expectedShortfall * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-white">إدارة المراكز</h4>
                    <div className="space-y-3">
                      {Object.entries(riskMetrics.positionSizing).slice(0, 3).map(([symbol, size]) => (
                        <div key={symbol} className="flex justify-between">
                          <span className="text-gray-400">{symbol}:</span>
                          <span className="text-white font-bold">{(size * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-white">الارتباط</h4>
                    <div className="space-y-3">
                      {Object.entries(riskMetrics.correlation).slice(0, 3).map(([pair, corr]) => (
                        <div key={pair} className="flex justify-between">
                          <span className="text-gray-400">{pair}:</span>
                          <span className={cn(
                            "font-bold",
                            Math.abs(corr) > 0.7 ? 'text-trading-down' : 
                            Math.abs(corr) > 0.5 ? 'text-yellow-500' : 'text-trading-up'
                          )}>
                            {corr.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* المراقبة المباشرة */}
        <TabsContent value="realtime" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-trading-up" />
                المراقبة المباشرة للمخاطر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-trading-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-trading-up rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">الحالة</span>
                  </div>
                  <div className="text-xl font-bold text-trading-up">نشط</div>
                </div>

                <div className="p-4 bg-trading-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-400">مستوى الحماية</span>
                  </div>
                  <div className="text-xl font-bold text-white">95%</div>
                </div>

                <div className="p-4 bg-trading-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-400">تنبيهات اليوم</span>
                  </div>
                  <div className="text-xl font-bold text-white">3</div>
                </div>

                <div className="p-4 bg-trading-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-400">تقييم AI</span>
                  </div>
                  <div className="text-xl font-bold text-trading-up">آمن</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أدوات المراقبة المباشرة */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">تحديثات المخاطر المباشرة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-trading-secondary rounded-lg">
                      <div className="w-2 h-2 bg-trading-up rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-white text-sm">تحديث مستوى المخاطر لـ BTC/USDT</div>
                        <div className="text-gray-400 text-xs">منذ {i + 1} دقيقة</div>
                      </div>
                      <Badge variant="outline" className="border-trading-up text-trading-up">
                        منخفض
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">الإجراءات التلقائية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">إيقاف التداول عند المخاطر العالية</span>
                    <Switch checked={autoRiskManagement} onCheckedChange={setAutoRiskManagement} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">تقليل حجم المراكز تلقائياً</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">تنبيهات فورية</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">إعادة توازن المحفظة</span>
                    <Switch checked={false} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* إعدادات المخاطر */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات إدارة المخاطر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-white font-medium mb-3 block">
                      أقصى خسارة يومية (%): {riskSettings.maxDailyLoss}%
                    </label>
                    <Slider
                      value={[riskSettings.maxDailyLoss]}
                      onValueChange={(value) => setRiskSettings(prev => ({ ...prev, maxDailyLoss: value[0] }))}
                      max={20}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-3 block">
                      أقصى حجم مركز (%): {riskSettings.maxPositionSize}%
                    </label>
                    <Slider
                      value={[riskSettings.maxPositionSize]}
                      onValueChange={(value) => setRiskSettings(prev => ({ ...prev, maxPositionSize: value[0] }))}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-white font-medium mb-3 block">
                      أقصى ارتباط (%): {riskSettings.maxCorrelation}%
                    </label>
                    <Slider
                      value={[riskSettings.maxCorrelation]}
                      onValueChange={(value) => setRiskSettings(prev => ({ ...prev, maxCorrelation: value[0] }))}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-3 block">
                      مخاطرة لكل صفقة (%): {riskSettings.riskPerTrade}%
                    </label>
                    <Slider
                      value={[riskSettings.riskPerTrade]}
                      onValueChange={(value) => setRiskSettings(prev => ({ ...prev, riskPerTrade: value[0] }))}
                      max={10}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button className="bg-trading-up hover:bg-green-600">
                  حفظ الإعدادات
                </Button>
                <Button variant="outline" className="border-gray-600">
                  إعادة تعيين
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحليل المخاطر */}
        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">تحليل سيناريوهات المخاطر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                  <h4 className="font-bold text-red-300 mb-3">سيناريو الأزمة</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">الخسارة المتوقعة:</span>
                      <span className="text-red-400">-15.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">أقصى انسحاب:</span>
                      <span className="text-red-400">-22.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">فترة الاسترداد:</span>
                      <span className="text-gray-300">45 يوم</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                  <h4 className="font-bold text-yellow-300 mb-3">سيناريو الضغط</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">الخسارة المتوقعة:</span>
                      <span className="text-yellow-400">-8.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">أقصى انسحاب:</span>
                      <span className="text-yellow-400">-12.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">فترة الاسترداد:</span>
                      <span className="text-gray-300">18 يوم</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <h4 className="font-bold text-green-300 mb-3">السيناريو الطبيعي</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">العائد المتوقع:</span>
                      <span className="text-green-400">+12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">أقصى انسحاب:</span>
                      <span className="text-green-400">-5.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">نسبة شارب:</span>
                      <span className="text-gray-300">2.1</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التنبيهات */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">تنبيهات المخاطر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-trading-secondary rounded-lg border-l-4 border-yellow-500">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        تجاوز حد المخاطر للزوج BTC/USDT
                      </div>
                      <div className="text-sm text-gray-400">
                        منذ {i + 5} دقيقة - مستوى المخاطر: 18.5%
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      عرض التفاصيل
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskManagement;
