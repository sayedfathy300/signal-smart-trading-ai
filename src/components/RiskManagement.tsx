import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Percent,
  RefreshCw,
  Settings,
  Brain,
  Calculator,
  Target,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { riskManagementService, RiskMetrics, PositionSize, RiskParameters } from '@/services/riskManagementService';
import CapitalManagement from '@/components/CapitalManagement';

interface RiskManagementProps {
  lang?: 'en' | 'ar';
}

const RiskManagement = ({ lang = 'ar' }: RiskManagementProps) => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [positionSize, setPositionSize] = useState<PositionSize | null>(null);
  const [riskParams, setRiskParams] = useState<RiskParameters>({
    maxRiskPerTrade: 2,
    maxDailyRisk: 10,
    varConfidence: 95,
    maxConcentration: 25
  });
  const [positionParams, setPositionParams] = useState({
    capital: 10000,
    riskPercent: 2,
    entryPrice: 100,
    stopLoss: 95
  });
  const [loading, setLoading] = useState(false);
  const [smartAlerts, setSmartAlerts] = useState([
    {
      id: 'var_exceeded',
      title: 'تجاوز قيمة المخاطر (VaR)',
      message: 'قيمة المخاطر تجاوزت الحد المسموح به. يرجى تقليل حجم المراكز.',
      severity: 'high',
      confidence: 0.95
    },
    {
      id: 'high_correlation',
      title: 'ارتباط عالي بين الأصول',
      message: 'تم الكشف عن ارتباطات عالية بين الأصول في محفظتك. قد يزيد هذا من المخاطر.',
      severity: 'medium',
      confidence: 0.85
    },
    {
      id: 'concentration_risk',
      title: 'مخاطر التركز العالي',
      message: 'جزء كبير من رأس المال الخاص بك مركز في عدد قليل من الأصول. فكر في التنويع.',
      severity: 'medium',
      confidence: 0.75
    }
  ]);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    setLoading(true);
    try {
      const metrics = await riskManagementService.calculateRiskMetrics();
      setRiskMetrics(metrics);
    } catch (error) {
      console.error('Error loading risk data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePositionSize = async () => {
    try {
      const size = await riskManagementService.calculatePositionSize(
        positionParams.capital,
        positionParams.riskPercent,
        positionParams.entryPrice,
        positionParams.stopLoss
      );
      setPositionSize(size);
    } catch (error) {
      console.error('Error calculating position size:', error);
    }
  };

  const riskDistribution = [
    { name: 'الأسهم', value: 400 },
    { name: 'العملات الرقمية', value: 300 },
    { name: 'السندات', value: 200 },
    { name: 'السلع', value: 100 }
  ];

  const diversificationData = [
    { name: 'تنويع', value: 75 },
    { name: 'تركز', value: 25 }
  ];

  const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'إدارة المخاطر والتحكم' : 'Risk Management & Control'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'أدوات متقدمة لإدارة المخاطر وحماية رأس المال' : 'Advanced tools for risk management and capital protection'}
          </p>
        </div>
        
        <Button
          onClick={loadRiskData}
          disabled={loading}
          size="sm"
          className="bg-trading-primary hover:bg-blue-600"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'جاري التحديث...' : 'تحديث البيانات'}
        </Button>
      </div>

      {/* المؤشرات السريعة */}
      {riskMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-trading-up" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(riskMetrics.portfolioRisk * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">مخاطر المحفظة</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-8 w-8 text-trading-down" />
                <div>
                  <div className="text-2xl font-bold text-trading-down">
                    {(riskMetrics.maxDrawdown * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">أقصى انخفاض</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {riskMetrics.sharpeRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">نسبة شارب</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {(riskMetrics.winRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">معدل الفوز</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="position-sizing">حجم المراكز</TabsTrigger>
          <TabsTrigger value="capital">إدارة رأس المال</TabsTrigger>
          <TabsTrigger value="ai-risk">المخاطر الذكية</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-6">
          {/* رسم توزيع المخاطر */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">توزيع المخاطر حسب الأصول</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* مؤشرات التنويع */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">مؤشرات التنويع والتركز</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diversificationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {diversificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* تحليل VaR */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">تحليل Value at Risk (VaR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-trading-secondary rounded-lg">
                  <div className="text-2xl font-bold text-trading-down">
                    ${riskMetrics?.var95.toFixed(2) || '0'}
                  </div>
                  <div className="text-sm text-gray-400">VaR 95%</div>
                  <div className="text-xs text-gray-500">يومي</div>
                </div>
                <div className="text-center p-4 bg-trading-secondary rounded-lg">
                  <div className="text-2xl font-bold text-trading-down">
                    ${riskMetrics?.cvar95.toFixed(2) || '0'}
                  </div>
                  <div className="text-sm text-gray-400">CVaR 95%</div>
                  <div className="text-xs text-gray-500">متوقع</div>
                </div>
                <div className="text-center p-4 bg-trading-secondary rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {((riskMetrics?.var95 || 0) / 10000 * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">% من رأس المال</div>
                  <div className="text-xs text-gray-500">نسبة المخاطرة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* حجم المراكز */}
        <TabsContent value="position-sizing" className="space-y-6">
          {/* حاسبة حجم المركز */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                حاسبة حجم المركز المتقدمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      رأس المال ($)
                    </label>
                    <input
                      type="number"
                      value={positionParams.capital}
                      onChange={(e) => setPositionParams({
                        ...positionParams,
                        capital: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 bg-trading-secondary border border-gray-600 rounded-md text-white"
                      placeholder="10000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      نسبة المخاطرة (%)
                    </label>
                    <input
                      type="number"
                      value={positionParams.riskPercent}
                      onChange={(e) => setPositionParams({
                        ...positionParams,
                        riskPercent: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 bg-trading-secondary border border-gray-600 rounded-md text-white"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      سعر الدخول ($)
                    </label>
                    <input
                      type="number"
                      value={positionParams.entryPrice}
                      onChange={(e) => setPositionParams({
                        ...positionParams,
                        entryPrice: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 bg-trading-secondary border border-gray-600 rounded-md text-white"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      وقف الخسارة ($)
                    </label>
                    <input
                      type="number"
                      value={positionParams.stopLoss}
                      onChange={(e) => setPositionParams({
                        ...positionParams,
                        stopLoss: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 bg-trading-secondary border border-gray-600 rounded-md text-white"
                      placeholder="95"
                    />
                  </div>

                  <Button
                    onClick={calculatePositionSize}
                    className="w-full bg-trading-up hover:bg-green-600"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    حساب حجم المركز
                  </Button>
                </div>

                {/* النتائج */}
                {positionSize && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">نتائج الحساب</h3>
                    
                    <div className="bg-trading-secondary p-4 rounded-lg">
                      <div className="text-3xl font-bold text-trading-up mb-2">
                        {positionSize.shares.toFixed(0)} سهم
                      </div>
                      <div className="text-sm text-gray-400">حجم المركز المقترح</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-trading-secondary p-3 rounded-lg">
                        <div className="text-xl font-bold text-white">
                          ${positionSize.investmentAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">مبلغ الاستثمار</div>
                      </div>
                      
                      <div className="bg-trading-secondary p-3 rounded-lg">
                        <div className="text-xl font-bold text-trading-down">
                          ${positionSize.riskAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">مبلغ المخاطرة</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-white">التوصيات:</h4>
                      {positionSize.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm text-gray-300 flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إدارة رأس المال */}
        <TabsContent value="capital" className="space-y-6">
          <CapitalManagement lang={lang} />
        </TabsContent>

        {/* المخاطر الذكية بالذكاء الاصطناعي */}
        <TabsContent value="ai-risk" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                تحليل المخاطر بالذكاء الاصطناعي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* تنبيهات ذكية */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">تنبيهات المخاطر الذكية</h3>
                  <div className="space-y-3">
                    {smartAlerts.map((alert, index) => (
                      <div key={index} className={cn(
                        "p-4 rounded-lg border-l-4",
                        alert.severity === 'high' ? 'bg-red-900/30 border-red-500' :
                        alert.severity === 'medium' ? 'bg-yellow-900/30 border-yellow-500' :
                        'bg-blue-900/30 border-blue-500'
                      )}>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className={cn(
                            "h-5 w-5",
                            alert.severity === 'high' ? 'text-red-400' :
                            alert.severity === 'medium' ? 'text-yellow-400' :
                            'text-blue-400'
                          )} />
                          <span className="font-medium text-white">{alert.title}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{alert.message}</p>
                        <div className="mt-2 text-xs text-gray-400">
                          الثقة: {(alert.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* إعدادات التنبيهات */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">إعدادات التنبيهات</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">تنبيهات VaR</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">تنبيهات الارتباط العالي</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">تنبيهات التركز المفرط</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">تنبيهات السيولة المنخفضة</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الإعدادات */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات إدارة المخاطر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* إعدادات المخاطر العامة */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">المعايير العامة</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        الحد الأقصى للمخاطرة لكل صفقة (%)
                      </label>
                      <Slider
                        value={[riskParams.maxRiskPerTrade]}
                        onValueChange={(value) => setRiskParams({
                          ...riskParams,
                          maxRiskPerTrade: value[0]
                        })}
                        max={10}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-400 mt-1">
                        القيمة الحالية: {riskParams.maxRiskPerTrade}%
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        الحد الأقصى للمخاطرة اليومية (%)
                      </label>
                      <Slider
                        value={[riskParams.maxDailyRisk]}
                        onValueChange={(value) => setRiskParams({
                          ...riskParams,
                          maxDailyRisk: value[0]
                        })}
                        max={20}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-400 mt-1">
                        القيمة الحالية: {riskParams.maxDailyRisk}%
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        مستوى الثقة لـ VaR (%)
                      </label>
                      <Slider
                        value={[riskParams.varConfidence]}
                        onValueChange={(value) => setRiskParams({
                          ...riskParams,
                          varConfidence: value[0]
                        })}
                        min={90}
                        max={99}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-400 mt-1">
                        القيمة الحالية: {riskParams.varConfidence}%
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        الحد الأقصى للتركز في أصل واحد (%)
                      </label>
                      <Slider
                        value={[riskParams.maxConcentration]}
                        onValueChange={(value) => setRiskParams({
                          ...riskParams,
                          maxConcentration: value[0]
                        })}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-400 mt-1">
                        القيمة الحالية: {riskParams.maxConcentration}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* حفظ الإعدادات */}
                <div className="flex gap-3">
                  <Button 
                    onClick={() => console.log('حفظ الإعدادات:', riskParams)}
                    className="bg-trading-up hover:bg-green-600"
                  >
                    حفظ الإعدادات
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setRiskParams({
                      maxRiskPerTrade: 2,
                      maxDailyRisk: 10,
                      varConfidence: 95,
                      maxConcentration: 25
                    })}
                    className="border-gray-600"
                  >
                    استعادة الافتراضي
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskManagement;
