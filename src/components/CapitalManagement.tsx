
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Calculator, 
  BarChart3, 
  Activity,
  AlertTriangle,
  Shield,
  Zap,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  capitalManagementService,
  FixedFractionalStrategy,
  KellyCriterionResult,
  SharpeResult,
  MonteCarloSimulation,
  CapitalManagementMetrics
} from '@/services/capitalManagementService';

interface CapitalManagementProps {
  lang: 'en' | 'ar';
}

const CapitalManagement = ({ lang }: CapitalManagementProps) => {
  // Fixed Fractional State
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [riskPercentage, setRiskPercentage] = useState(2);
  const [stopLossPercentage, setStopLossPercentage] = useState(5);
  const [fixedFractionalResult, setFixedFractionalResult] = useState<FixedFractionalStrategy | null>(null);

  // Kelly Criterion State
  const [winRate, setWinRate] = useState(0.6);
  const [avgWin, setAvgWin] = useState(0.03);
  const [avgLoss, setAvgLoss] = useState(-0.015);
  const [confidenceLevel, setConfidenceLevel] = useState(0.8);
  const [kellyResult, setKellyResult] = useState<KellyCriterionResult | null>(null);

  // Sharpe Ratios State
  const [sharpeResult, setSharpeResult] = useState<SharpeResult | null>(null);

  // Monte Carlo State
  const [mcInitialCapital, setMcInitialCapital] = useState(100000);
  const [mcExpectedReturn, setMcExpectedReturn] = useState(0.12);
  const [mcVolatility, setMcVolatility] = useState(0.2);
  const [mcTimeHorizon, setMcTimeHorizon] = useState(252);
  const [mcSimulations, setMcSimulations] = useState(5000);
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloSimulation | null>(null);

  // Capital Management Metrics
  const [capitalMetrics, setCapitalMetrics] = useState<CapitalManagementMetrics | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        calculateFixedFractional(),
        calculateKelly(),
        calculateSharpeRatios(),
        loadCapitalMetrics()
      ]);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFixedFractional = async () => {
    try {
      const result = await capitalManagementService.calculateFixedFractional(
        portfolioValue,
        riskPercentage,
        stopLossPercentage
      );
      setFixedFractionalResult(result);
    } catch (error) {
      console.error('خطأ في حساب الكسر الثابت:', error);
    }
  };

  const calculateKelly = async () => {
    try {
      const result = await capitalManagementService.calculateKellyCriterion(
        winRate,
        avgWin,
        avgLoss,
        confidenceLevel
      );
      setKellyResult(result);
    } catch (error) {
      console.error('خطأ في حساب معيار كيلي:', error);
    }
  };

  const calculateSharpeRatios = async () => {
    try {
      // توليد عوائد تجريبية
      const portfolioReturns = Array.from({ length: 252 }, () => (Math.random() - 0.48) * 0.03);
      const benchmarkReturns = Array.from({ length: 252 }, () => (Math.random() - 0.49) * 0.02);
      
      const result = await capitalManagementService.calculateSharpeRatios(portfolioReturns, benchmarkReturns);
      setSharpeResult(result);
    } catch (error) {
      console.error('خطأ في حساب نسب شارب:', error);
    }
  };

  const runMonteCarloSimulation = async () => {
    setLoading(true);
    try {
      const result = await capitalManagementService.runMonteCarloSimulation(
        mcInitialCapital,
        mcExpectedReturn,
        mcVolatility,
        mcTimeHorizon,
        mcSimulations
      );
      setMonteCarloResult(result);
    } catch (error) {
      console.error('خطأ في محاكاة مونت كارلو:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCapitalMetrics = async () => {
    try {
      const positions = [
        { value: 40000, asset: 'BTC', liquidity: 0.9 },
        { value: 30000, asset: 'ETH', liquidity: 0.85 },
        { value: 20000, asset: 'Stocks', liquidity: 0.7 },
        { value: 10000, asset: 'Bonds', liquidity: 0.6 }
      ];
      
      const result = await capitalManagementService.getCapitalManagementMetrics(positions);
      setCapitalMetrics(result);
    } catch (error) {
      console.error('خطأ في تحميل مؤشرات رأس المال:', error);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'conservative': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'aggressive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <div className="space-y-6 p-6 bg-trading-dark min-h-screen text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-500" />
          {lang === 'ar' ? 'إدارة رأس المال والمخاطر' : 'Capital & Risk Management'}
        </h1>
        <Button
          onClick={loadInitialData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {lang === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">{lang === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="fixed-fractional">{lang === 'ar' ? 'الكسر الثابت' : 'Fixed Fractional'}</TabsTrigger>
          <TabsTrigger value="kelly">{lang === 'ar' ? 'معيار كيلي' : 'Kelly Criterion'}</TabsTrigger>
          <TabsTrigger value="ratios">{lang === 'ar' ? 'نسب الأداء' : 'Performance Ratios'}</TabsTrigger>
          <TabsTrigger value="monte-carlo">{lang === 'ar' ? 'مونت كارلو' : 'Monte Carlo'}</TabsTrigger>
        </TabsList>

        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-6">
          {capitalMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">إجمالي رأس المال</p>
                      <p className="text-2xl font-bold text-green-400">
                        {formatCurrency(capitalMetrics.totalCapital)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">معدل الاستخدام</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {formatPercentage(capitalMetrics.utilizationRate)}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">نسبة التنويع</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {formatPercentage(capitalMetrics.diversificationRatio)}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">نقاط السيولة</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {(capitalMetrics.liquidityScore * 100).toFixed(1)}
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ملخص النتائج */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fixedFractionalResult && (
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    استراتيجية الكسر الثابت
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">حجم المركز المقترح:</span>
                      <span className="text-white font-bold">
                        {formatPercentage(fixedFractionalResult.fraction)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">العائد المتوقع:</span>
                      <span className="text-green-400 font-bold">
                        {formatPercentage(fixedFractionalResult.expectedReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">أقصى انخفاض:</span>
                      <span className="text-red-400 font-bold">
                        {formatPercentage(fixedFractionalResult.riskMetrics.maxDrawdown)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {kellyResult && (
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-500" />
                    معيار كيلي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">الكسر الأمثل:</span>
                      <span className="text-white font-bold">
                        {formatPercentage(kellyResult.optimalFraction)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">مستوى المخاطر:</span>
                      <Badge className={getRiskLevelColor(kellyResult.riskLevel)}>
                        {kellyResult.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">العائد المتوقع:</span>
                      <span className="text-green-400 font-bold">
                        {formatPercentage(kellyResult.expectedReturn)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* استراتيجية الكسر الثابت */}
        <TabsContent value="fixed-fractional" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                إعدادات الكسر الثابت
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio-value">قيمة المحفظة ($)</Label>
                  <Input
                    id="portfolio-value"
                    type="number"
                    value={portfolioValue}
                    onChange={(e) => setPortfolioValue(Number(e.target.value))}
                    className="bg-trading-secondary border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk-percentage">نسبة المخاطر (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[riskPercentage]}
                      onValueChange={(value) => setRiskPercentage(value[0])}
                      max={10}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {riskPercentage}%
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">وقف الخسارة (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[stopLossPercentage]}
                      onValueChange={(value) => setStopLossPercentage(value[0])}
                      max={20}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {stopLossPercentage}%
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={calculateFixedFractional}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Calculator className="h-4 w-4 mr-2" />
                حساب حجم المركز
              </Button>
            </CardContent>
          </Card>

          {fixedFractionalResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">النتائج</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {formatPercentage(fixedFractionalResult.fraction)}
                      </div>
                      <div className="text-sm text-gray-400">حجم المركز</div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {formatCurrency(portfolioValue * fixedFractionalResult.fraction)}
                      </div>
                      <div className="text-sm text-gray-400">المبلغ المستثمر</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">مؤشرات المخاطر:</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">التقلبات:</span>
                        <span className="text-white ml-2">
                          {formatPercentage(fixedFractionalResult.riskMetrics.volatility)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">أقصى انخفاض:</span>
                        <span className="text-red-400 ml-2">
                          {formatPercentage(fixedFractionalResult.riskMetrics.maxDrawdown)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">معدل الفوز:</span>
                        <span className="text-green-400 ml-2">
                          {formatPercentage(fixedFractionalResult.riskMetrics.winRate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">التوصيات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fixedFractionalResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* معيار كيلي */}
        <TabsContent value="kelly" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-500" />
                إعدادات معيار كيلي
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>معدل الفوز</Label>
                  <div className="px-3">
                    <Slider
                      value={[winRate]}
                      onValueChange={(value) => setWinRate(value[0])}
                      max={0.95}
                      min={0.05}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {formatPercentage(winRate)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>متوسط الربح</Label>
                  <div className="px-3">
                    <Slider
                      value={[avgWin]}
                      onValueChange={(value) => setAvgWin(value[0])}
                      max={0.1}
                      min={0.01}
                      step={0.001}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {formatPercentage(avgWin)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>متوسط الخسارة</Label>
                  <div className="px-3">
                    <Slider
                      value={[Math.abs(avgLoss)]}
                      onValueChange={(value) => setAvgLoss(-value[0])}
                      max={0.1}
                      min={0.005}
                      step={0.001}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {formatPercentage(avgLoss)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>مستوى الثقة</Label>
                  <div className="px-3">
                    <Slider
                      value={[confidenceLevel]}
                      onValueChange={(value) => setConfidenceLevel(value[0])}
                      max={1}
                      min={0.1}
                      step={0.05}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {formatPercentage(confidenceLevel)}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={calculateKelly}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Calculator className="h-4 w-4 mr-2" />
                حساب معيار كيلي
              </Button>
            </CardContent>
          </Card>

          {kellyResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">نتائج كيلي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {formatPercentage(kellyResult.kellyCriterion)}
                      </div>
                      <div className="text-sm text-gray-400">كيلي الأصلي</div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {formatPercentage(kellyResult.optimalFraction)}
                      </div>
                      <div className="text-sm text-gray-400">كيلي المعدل</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">العائد المتوقع:</span>
                      <span className="text-green-400 font-bold">
                        {formatPercentage(kellyResult.expectedReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">أقصى انخفاض متوقع:</span>
                      <span className="text-red-400 font-bold">
                        {formatPercentage(kellyResult.maxDrawdownEstimate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">مستوى المخاطر:</span>
                      <Badge className={getRiskLevelColor(kellyResult.riskLevel)}>
                        {kellyResult.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">التوصية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <p className="text-blue-200">{kellyResult.recommendation}</p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="font-bold text-white">معلومات إضافية:</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">احتمالية الفوز:</span>
                        <span className="text-white">{formatPercentage(kellyResult.winProbability)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">متوسط الربح:</span>
                        <span className="text-green-400">{formatPercentage(kellyResult.avgWin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">متوسط الخسارة:</span>
                        <span className="text-red-400">{formatPercentage(kellyResult.avgLoss)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* نسب الأداء */}
        <TabsContent value="ratios" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                نسب الأداء المعدلة للمخاطر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={calculateSharpeRatios}
                className="mb-4 bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة حساب النسب
              </Button>
              
              {sharpeResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {sharpeResult.sharpeRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">نسبة شارب</div>
                  </div>
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {sharpeResult.sortinoRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">نسبة سورتينو</div>
                  </div>
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {sharpeResult.calmarRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">نسبة كالمار</div>
                  </div>
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">
                      {sharpeResult.treynorRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">نسبة ترينور</div>
                  </div>
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <div className="text-2xl font-bold text-red-400">
                      {sharpeResult.informationRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">نسبة المعلومات</div>
                  </div>
                  <div className="text-center p-4 bg-trading-secondary rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">
                      {formatPercentage(sharpeResult.averageReturn)}
                    </div>
                    <div className="text-sm text-gray-400">العائد المتوسط</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {sharpeResult && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">مقارنة مع المؤشر المرجعي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'المحفظة', return: sharpeResult.averageReturn * 100, volatility: sharpeResult.volatility * 100, sharpe: sharpeResult.sharpeRatio },
                      { name: 'المؤشر المرجعي', return: sharpeResult.benchmark.return * 100, volatility: sharpeResult.benchmark.volatility * 100, sharpe: sharpeResult.benchmark.sharpe }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="return" fill="#10B981" name="العائد %" />
                      <Bar dataKey="volatility" fill="#EF4444" name="التقلبات %" />
                      <Bar dataKey="sharpe" fill="#8B5CF6" name="نسبة شارب" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* محاكاة مونت كارلو */}
        <TabsContent value="monte-carlo" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                إعدادات محاكاة مونت كارلو
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>رأس المال الابتدائي ($)</Label>
                  <Input
                    type="number"
                    value={mcInitialCapital}
                    onChange={(e) => setMcInitialCapital(Number(e.target.value))}
                    className="bg-trading-secondary border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label>العائد المتوقع (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[mcExpectedReturn]}
                      onValueChange={(value) => setMcExpectedReturn(value[0])}
                      max={0.3}
                      min={-0.1}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {formatPercentage(mcExpectedReturn)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>التقلبات (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[mcVolatility]}
                      onValueChange={(value) => setMcVolatility(value[0])}
                      max={0.5}
                      min={0.05}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {formatPercentage(mcVolatility)}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الأفق الزمني (أيام)</Label>
                  <Input
                    type="number"
                    value={mcTimeHorizon}
                    onChange={(e) => setMcTimeHorizon(Number(e.target.value))}
                    className="bg-trading-secondary border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label>عدد المحاكاة</Label>
                  <Input
                    type="number"
                    value={mcSimulations}
                    onChange={(e) => setMcSimulations(Number(e.target.value))}
                    className="bg-trading-secondary border-gray-600"
                  />
                </div>
              </div>
              
              <Button 
                onClick={runMonteCarloSimulation}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                تشغيل المحاكاة
              </Button>
            </CardContent>
          </Card>

          {monteCarloResult && (
            <div className="space-y-6">
              {/* النتائج الرئيسية */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">نتائج المحاكاة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-xl font-bold text-green-400">
                        {formatCurrency(monteCarloResult.percentiles.p50)}
                      </div>
                      <div className="text-sm text-gray-400">الوسيط (50%)</div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-xl font-bold text-blue-400">
                        {formatCurrency(monteCarloResult.expectedValue)}
                      </div>
                      <div className="text-sm text-gray-400">القيمة المتوقعة</div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-xl font-bold text-red-400">
                        {formatPercentage(monteCarloResult.probabilityOfLoss)}
                      </div>
                      <div className="text-sm text-gray-400">احتمال الخسارة</div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-xl font-bold text-yellow-400">
                        {formatCurrency(monteCarloResult.riskMetrics.var95)}
                      </div>
                      <div className="text-sm text-gray-400">VaR 95%</div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-xl font-bold text-purple-400">
                        {formatCurrency(monteCarloResult.riskMetrics.cvar95)}
                      </div>
                      <div className="text-sm text-gray-400">CVaR 95%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* توزيع النتائج */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">توزيع النتائج النهائية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={
                        Array.from({ length: 50 }, (_, i) => {
                          const percentile = (i + 1) * 2;
                          const index = Math.floor(monteCarloResult.finalValues.length * percentile / 100);
                          return {
                            percentile,
                            value: monteCarloResult.finalValues[index] || 0
                          };
                        })
                      }>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="percentile" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => [formatCurrency(value), 'القيمة']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8B5CF6" 
                          fill="#8B5CF6" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* المئوية */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">المئويات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-red-900/30 border border-red-700 rounded-lg">
                      <div className="text-lg font-bold text-red-400">
                        {formatCurrency(monteCarloResult.percentiles.p5)}
                      </div>
                      <div className="text-sm text-gray-400">5%</div>
                    </div>
                    <div className="text-center p-3 bg-orange-900/30 border border-orange-700 rounded-lg">
                      <div className="text-lg font-bold text-orange-400">
                        {formatCurrency(monteCarloResult.percentiles.p25)}
                      </div>
                      <div className="text-sm text-gray-400">25%</div>
                    </div>
                    <div className="text-center p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">
                        {formatCurrency(monteCarloResult.percentiles.p50)}
                      </div>
                      <div className="text-sm text-gray-400">50%</div>
                    </div>
                    <div className="text-center p-3 bg-green-900/30 border border-green-700 rounded-lg">
                      <div className="text-lg font-bold text-green-400">
                        {formatCurrency(monteCarloResult.percentiles.p75)}
                      </div>
                      <div className="text-sm text-gray-400">75%</div>
                    </div>
                    <div className="text-center p-3 bg-emerald-900/30 border border-emerald-700 rounded-lg">
                      <div className="text-lg font-bold text-emerald-400">
                        {formatCurrency(monteCarloResult.percentiles.p95)}
                      </div>
                      <div className="text-sm text-gray-400">95%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CapitalManagement;
