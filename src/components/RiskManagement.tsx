import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Zap,
  Calculator,
  Scale,
  TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { 
  riskManagementService,
  KellyCriterionResult,
  PortfolioOptimizationResult,
  RiskParityStrategy,
  DrawdownManagement,
  RiskManagementMetrics
} from '@/services/riskManagementService';
import { toast } from 'sonner';

interface RiskManagementProps {
  lang?: 'en' | 'ar';
}

const RiskManagement = ({ lang = 'ar' }: RiskManagementProps) => {
  const [kellyResults, setKellyResults] = useState<Record<string, KellyCriterionResult>>({});
  const [portfolioOptimization, setPortfolioOptimization] = useState<PortfolioOptimizationResult | null>(null);
  const [riskParityStrategies, setRiskParityStrategies] = useState<RiskParityStrategy[]>([]);
  const [drawdownAnalysis, setDrawdownAnalysis] = useState<DrawdownManagement | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<RiskManagementMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const assets = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'DOT/USDT', 'LINK/USDT'];

  useEffect(() => {
    loadRiskManagementData();
  }, []);

  const loadRiskManagementData = async () => {
    setLoading(true);
    try {
      // تحميل جميع بيانات إدارة المخاطر
      await Promise.all([
        loadKellyResults(),
        loadPortfolioOptimization(),
        loadRiskParityStrategies(),
        loadDrawdownAnalysis(),
        loadRiskMetrics()
      ]);
    } catch (error) {
      console.error('خطأ في تحميل بيانات إدارة المخاطر:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const loadKellyResults = async () => {
    const results: Record<string, KellyCriterionResult> = {};
    for (const asset of assets) {
      const winRate = 0.6 + Math.random() * 0.2; // 60-80%
      const avgWin = 0.02 + Math.random() * 0.03; // 2-5%
      const avgLoss = -(0.01 + Math.random() * 0.02); // -1 إلى -3%
      
      results[asset] = await riskManagementService.calculateKellyCriterion(
        asset, winRate, avgWin, avgLoss
      );
    }
    setKellyResults(results);
  };

  const loadPortfolioOptimization = async () => {
    const expectedReturns = assets.map(() => 0.1 + Math.random() * 0.2); // 10-30%
    const result = await riskManagementService.optimizePortfolio(
      assets, expectedReturns, 0.5
    );
    setPortfolioOptimization(result);
  };

  const loadRiskParityStrategies = async () => {
    const strategies = await riskManagementService.calculateRiskParity(assets);
    setRiskParityStrategies(strategies);
  };

  const loadDrawdownAnalysis = async () => {
    // توليد بيانات تاريخية محاكاة للمحفظة
    const portfolioHistory = Array.from({ length: 252 }, (_, i) => ({
      date: Date.now() - (252 - i) * 24 * 60 * 60 * 1000,
      value: 100000 * (1 + (Math.random() - 0.45) * 0.1) ** i
    }));

    const analysis = await riskManagementService.analyzeDrawdown(portfolioHistory);
    setDrawdownAnalysis(analysis);
  };

  const loadRiskMetrics = async () => {
    const metrics = await riskManagementService.calculateRiskMetrics({});
    setRiskMetrics(metrics);
  };

  const handleOptimizePortfolio = async () => {
    setLoading(true);
    try {
      await loadPortfolioOptimization();
      toast.success('تم تحسين المحفظة بنجاح! 📊');
    } catch (error) {
      toast.error('فشل في تحسين المحفظة');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateKelly = async () => {
    setLoading(true);
    try {
      await loadKellyResults();
      toast.success('تم حساب معيار كيلي بنجاح! 🎯');
    } catch (error) {
      toast.error('فشل في حساب معيار كيلي');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': case 'safe': case 'conservative': return 'text-trading-up';
      case 'medium': case 'warning': case 'moderate': return 'text-yellow-400';
      case 'high': case 'danger': case 'aggressive': return 'text-trading-down';
      case 'extreme': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskLevelBg = (level: string) => {
    switch (level) {
      case 'low': case 'safe': case 'conservative': return 'bg-trading-up';
      case 'medium': case 'warning': case 'moderate': return 'bg-yellow-600';
      case 'high': case 'danger': case 'aggressive': return 'bg-trading-down';
      case 'extreme': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'إدارة المخاطر المتقدمة' : 'Advanced Risk Management'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'نظام شامل لإدارة وتحليل المخاطر المالية' : 'Comprehensive financial risk management system'}
          </p>
        </div>
        
        <Button
          onClick={loadRiskManagementData}
          disabled={loading}
          className="bg-trading-primary hover:bg-blue-600"
        >
          <Shield className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'جاري التحديث...' : 'تحديث البيانات'}
        </Button>
      </div>

      {/* مؤشرات المخاطر العامة */}
      {riskMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-lg font-bold text-white">
                    {(riskMetrics.totalRisk * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">إجمالي المخاطر</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-trading-up" />
                <div>
                  <div className="text-lg font-bold text-white">
                    {(riskMetrics.sharpeRatio || 0).toFixed(2)}
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
                  <div className="text-lg font-bold text-white">
                    {riskMetrics.sortinoRatio?.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">نسبة سورتينو</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-yellow-400" />
                <div>
                  <div className="text-lg font-bold text-white">
                    {riskMetrics.calmarRatio?.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">نسبة كالمار</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className={cn("h-8 w-8", getRiskLevelColor(riskMetrics.overallRiskScore))} />
                <div>
                  <div className={cn("text-lg font-bold", getRiskLevelColor(riskMetrics.overallRiskScore))}>
                    {riskMetrics.overallRiskScore === 'low' ? 'منخفض' :
                     riskMetrics.overallRiskScore === 'medium' ? 'متوسط' :
                     riskMetrics.overallRiskScore === 'high' ? 'عالي' : 'خطير'}
                  </div>
                  <div className="text-sm text-gray-400">مستوى المخاطر</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="kelly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="kelly">معيار كيلي</TabsTrigger>
          <TabsTrigger value="portfolio">تحسين المحفظة</TabsTrigger>
          <TabsTrigger value="risk-parity">Risk Parity</TabsTrigger>
          <TabsTrigger value="drawdown">إدارة الانخفاض</TabsTrigger>
          <TabsTrigger value="metrics">مقاييس المخاطر</TabsTrigger>
        </TabsList>

        {/* معيار كيلي */}
        <TabsContent value="kelly" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-trading-up" />
                معيار كيلي لتحديد حجم المراكز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleCalculateKelly}
                    disabled={loading}
                    className="bg-trading-up hover:bg-green-600"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    {loading ? 'جاري الحساب...' : 'حساب معيار كيلي'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(kellyResults).map(([asset, result]) => (
                    <Card key={asset} className="bg-trading-secondary border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{asset}</CardTitle>
                          <Badge 
                            className={getRiskLevelBg(result.riskLevel)}
                          >
                            {result.riskLevel === 'conservative' ? 'محافظ' :
                             result.riskLevel === 'moderate' ? 'متوازن' : 'عدواني'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-trading-bg rounded">
                              <div className="text-xl font-bold text-trading-up">
                                {(result.optimalFraction * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-400">الحجم الأمثل</div>
                            </div>
                            <div className="text-center p-3 bg-trading-bg rounded">
                              <div className="text-xl font-bold text-white">
                                {(result.winProbability * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-400">معدل الفوز</div>
                            </div>
                            <div className="text-center p-3 bg-trading-bg rounded">
                              <div className="text-xl font-bold text-blue-400">
                                {(result.expectedReturn * 100).toFixed(2)}%
                              </div>
                              <div className="text-xs text-gray-400">العائد المتوقع</div>
                            </div>
                            <div className="text-center p-3 bg-trading-bg rounded">
                              <div className="text-xl font-bold text-red-400">
                                {(result.maxDrawdownEstimate * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-400">أقصى انخفاض متوقع</div>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-blue-900/30 border border-blue-700 rounded">
                            <div className="text-sm text-blue-200">{result.recommendation}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحسين المحفظة */}
        <TabsContent value="portfolio" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-400" />
                تحسين المحفظة (Modern Portfolio Theory)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Button 
                  onClick={handleOptimizePortfolio}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Target className="h-4 w-4 mr-2" />
                  {loading ? 'جاري التحسين...' : 'تحسين المحفظة'}
                </Button>

                {portfolioOptimization && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-trading-secondary rounded-lg">
                        <div className="text-2xl font-bold text-trading-up">
                          {(portfolioOptimization.expectedReturn * 100).toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-400">العائد المتوقع</div>
                      </div>
                      
                      <div className="text-center p-4 bg-trading-secondary rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">
                          {(portfolioOptimization.expectedVolatility * 100).toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-400">التقلبات المتوقعة</div>
                      </div>
                      
                      <div className="text-center p-4 bg-trading-secondary rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {portfolioOptimization.sharpeRatio.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">نسبة شارب</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* الأوزان المثلى */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-white">الأوزان المثلى:</h4>
                        {Object.entries(portfolioOptimization.optimalWeights).map(([asset, weight]) => (
                          <div key={asset} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                            <span className="text-white">{asset}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">{(weight * 100).toFixed(1)}%</span>
                              <Progress value={weight * 100} className="w-20 h-2" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* الحدود الكفؤة */}
                      <div className="h-80">
                        <h4 className="font-bold text-white mb-4">الحدود الكفؤة:</h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={portfolioOptimization.efficientFrontier}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="risk" 
                              stroke="#9CA3AF"
                              label={{ value: 'المخاطر', position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis 
                              dataKey="return" 
                              stroke="#9CA3AF"
                              label={{ value: 'العائد', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="return" 
                              stroke="#3B82F6" 
                              strokeWidth={3}
                              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-white">التوصيات:</h4>
                      <ul className="space-y-1">
                        {portfolioOptimization.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Parity */}
        <TabsContent value="risk-parity" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Scale className="h-5 w-5 text-purple-400" />
                استراتيجية Risk Parity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  توزيع المخاطر بالتساوي عبر جميع الأصول بدلاً من توزيع رؤوس الأموال
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {riskParityStrategies.map((strategy, idx) => (
                    <div key={idx} className="p-4 bg-trading-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-white text-lg">{strategy.asset}</span>
                        <Badge variant="outline" className="border-purple-400 text-purple-400">
                          التقلبات: {(strategy.volatility * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-300">
                            {(strategy.currentWeight * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">الوزن الحالي</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {(strategy.adjustedWeight * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">الوزن المعدل</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {(strategy.riskContribution * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">مساهمة المخاطر</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-trading-up">
                            {(strategy.targetRiskContribution * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">المخاطر المستهدفة</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">تقدم التعديل</span>
                          <span className="text-white">
                            {Math.abs(strategy.adjustedWeight - strategy.currentWeight) < 0.05 ? 'مكتمل' : 'يحتاج تعديل'}
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(100, (1 - Math.abs(strategy.adjustedWeight - strategy.currentWeight) / 0.1) * 100)} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إدارة الانخفاض */}
        <TabsContent value="drawdown" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-trading-down" />
                إدارة الانخفاض (Drawdown Management)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {drawdownAnalysis && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-trading-down">
                        {(Math.abs(drawdownAnalysis.currentDrawdown) * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">الانخفاض الحالي</div>
                    </div>
                    
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-red-400">
                        {(Math.abs(drawdownAnalysis.maxDrawdown) * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">أقصى انخفاض</div>
                    </div>
                    
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">
                        {drawdownAnalysis.drawdownDuration}
                      </div>
                      <div className="text-sm text-gray-400">مدة الانخفاض (أيام)</div>
                    </div>
                    
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {drawdownAnalysis.recoveryTime}
                      </div>
                      <div className="text-sm text-gray-400">وقت التعافي (أيام)</div>
                    </div>
                  </div>

                  {/* مخطط الانخفاض */}
                  <div className="h-80">
                    <h4 className="font-bold text-white mb-4">تاريخ الانخفاض:</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={drawdownAnalysis.drawdownHistory.slice(-50)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="drawdown" 
                          stroke="#EF4444" 
                          fill="#EF4444"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* مقاييس المخاطر */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-white">Value at Risk (VaR):</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-trading-secondary rounded">
                          <span className="text-gray-400">VaR 95%:</span>
                          <span className="text-red-400 font-bold">
                            {(drawdownAnalysis.riskMetrics.var95 * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-trading-secondary rounded">
                          <span className="text-gray-400">VaR 99%:</span>
                          <span className="text-red-400 font-bold">
                            {(drawdownAnalysis.riskMetrics.var99 * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-white">Conditional VaR (CVaR):</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-trading-secondary rounded">
                          <span className="text-gray-400">CVaR 95%:</span>
                          <span className="text-red-400 font-bold">
                            {(drawdownAnalysis.riskMetrics.cvar95 * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-trading-secondary rounded">
                          <span className="text-gray-400">CVaR 99%:</span>
                          <span className="text-red-400 font-bold">
                            {(drawdownAnalysis.riskMetrics.cvar99 * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-white">التوصيات:</h4>
                    <ul className="space-y-1">
                      {drawdownAnalysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* مقاييس المخاطر */}
        <TabsContent value="metrics" className="space-y-6">
          {riskMetrics && (
            <>
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-yellow-400" />
                    توزيع المخاطر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">مخاطر التركز:</span>
                          <span className="text-white font-bold">
                            {(riskMetrics.concentrationRisk * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={riskMetrics.concentrationRisk * 100} className="h-3" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">مخاطر السيولة:</span>
                          <span className="text-white font-bold">
                            {(riskMetrics.liquidityRisk * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={riskMetrics.liquidityRisk * 100} className="h-3" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">مخاطر السوق:</span>
                          <span className="text-white font-bold">
                            {(riskMetrics.marketRisk * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={riskMetrics.marketRisk * 100} className="h-3" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">المخاطر التشغيلية:</span>
                          <span className="text-white font-bold">
                            {(riskMetrics.operationalRisk * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={riskMetrics.operationalRisk * 100} className="h-3" />
                      </div>
                    </div>

                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <defs>
                            {COLORS.map((color, index) => (
                              <pattern key={index} id={`pattern-${index}`} patternUnits="userSpaceOnUse" width="4" height="4">
                                <rect width="4" height="4" fill={color} />
                              </pattern>
                            ))}
                          </defs>
                          <PieChart
                            data={[
                              { name: 'مخاطر التركز', value: riskMetrics.concentrationRisk * 100 },
                              { name: 'مخاطر السيولة', value: riskMetrics.liquidityRisk * 100 },
                              { name: 'مخاطر السوق', value: riskMetrics.marketRisk * 100 },
                              { name: 'المخاطر التشغيلية', value: riskMetrics.operationalRisk * 100 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </PieChart>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">المؤشرات المعدلة للمخاطر</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-trading-up">
                        {riskMetrics.riskAdjustedReturn.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">العائد المعدل للمخاطر</div>
                    </div>
                    
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {riskMetrics.informationRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">نسبة المعلومات</div>
                    </div>
                    
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">
                        {riskMetrics.calmarRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">نسبة كالمار</div>
                    </div>
                    
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">
                        {riskMetrics.sortinoRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">نسبة سورتينو</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskManagement;
