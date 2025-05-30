import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Settings,
  Play,
  Square,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  PieChart,
  Wallet,
  Bot,
  Globe,
  ShieldCheck,
  Lightbulb,
  Scale,
  Shuffle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { 
  explainableAIService, 
  DecisionExplanation, 
  FeatureImportance,
  BiasAnalysis,
  CounterfactualAnalysis
} from '@/services/explainableAIService';

interface ExplainableAIProps {
  lang?: 'en' | 'ar';
}

const ExplainableAI = ({ lang = 'ar' }: ExplainableAIProps) => {
  const [decision, setDecision] = useState<DecisionExplanation | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis | null>(null);
  const [counterfactual, setCounterfactual] = useState<CounterfactualAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [explanation, importance, bias, counterfactual] = await Promise.all([
        explainableAIService.explainDecision(
          { prediction: 'BUY', confidence: 0.85 },
          { price: 50000, volume: 1000000, rsi: 65, macd: 0.1 },
          'Neural Network'
        ),
        explainableAIService.getFeatureImportance('Neural Network'),
        explainableAIService.analyzeBias([], []),
        explainableAIService.generateCounterfactual(
          { price: 50000, rsi: 75 },
          'BUY'
        )
      ]);

      setDecision(explanation);
      setFeatureImportance(importance);
      setBiasAnalysis(bias);
      setCounterfactual(counterfactual);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'الذكاء الاصطناعي القابل للتفسير (XAI)' : 'Explainable AI (XAI)'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'فهم القرارات التي تتخذها نماذج الذكاء الاصطناعي' : 'Understand the decisions made by AI models'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={loadData}
            disabled={loading}
            size="sm"
            className="bg-trading-primary hover:bg-blue-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'جاري التحديث...' : 'تحديث'}
          </Button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="explanation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="explanation">شرح القرار</TabsTrigger>
          <TabsTrigger value="importance">أهمية الميزات</TabsTrigger>
          <TabsTrigger value="bias">تحليل التحيز</TabsTrigger>
          <TabsTrigger value="counterfactual">التحليل المضاد</TabsTrigger>
        </TabsList>

        {/* شرح القرار */}
        <TabsContent value="explanation" className="space-y-6">
          {decision && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  شرح تفصيلي للقرار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* القرار والثقة */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-white">
                        القرار: {decision.decision}
                      </div>
                      <div className="text-sm text-gray-400">
                        الثقة: {(decision.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <Badge 
                      variant={decision.decision === 'BUY' ? 'default' : 'destructive'}
                      className={decision.decision === 'BUY' ? 'bg-trading-up' : 'bg-trading-down'}
                    >
                      {decision.decision}
                    </Badge>
                  </div>

                  {/* عوامل القرار */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-2">العوامل المؤثرة</h3>
                    {decision.factors?.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                        <div>
                          <div className="font-medium text-white">{factor.name}</div>
                          <div className="text-sm text-gray-400">
                            القيمة: {factor.value}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "font-bold",
                            factor.impact > 0 ? 'text-trading-up' : 'text-trading-down'
                          )}>
                            {(factor.impact * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">التأثير</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* معلومات النموذج */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-trading-secondary rounded">
                      <div className="text-lg font-bold text-white">
                        {decision.model?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-400">النموذج</div>
                    </div>
                    <div className="text-center p-2 bg-trading-secondary rounded">
                      <div className="text-lg font-bold text-blue-400">
                        {decision.model?.accuracy.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">الدقة</div>
                    </div>
                  </div>

                  {/* بدائل القرار */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-2">البدائل المحتملة</h3>
                    <div className="space-y-2">
                      {decision.alternatives?.map((alt, index) => (
                        <div key={index} className="p-3 bg-trading-secondary rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-white">
                              {alt.decision}
                            </div>
                            <div className="text-sm text-gray-400">
                              {(alt.probability * 100).toFixed(1)}%
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {alt.reasoning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* رسم بياني دائري */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={decision.factors?.map(factor => ({
                            name: factor.name,
                            value: Math.abs(factor.impact)
                          })) || []}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {decision.factors?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* أهمية الميزات */}
        <TabsContent value="importance" className="space-y-6">
          {featureImportance && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Scale className="h-5 w-5 text-green-400" />
                  أهمية الميزات في النموذج
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* قائمة الميزات */}
                  <div className="space-y-3">
                    {featureImportance.map((feature, index) => (
                      <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white">{feature.name}</span>
                            <span className="text-gray-400">{(feature.importance * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                feature.direction === 'positive' ? 'bg-trading-up' : 'bg-trading-down'
                              )}
                              style={{ width: `${feature.importance * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* رسم بياني شريطي */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportance}>
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
                        <Bar 
                          key={index}
                          dataKey="importance" 
                          fill={feature.direction === 'positive' ? '#22C55E' : '#EF4444'} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* تحليل التحيز */}
        <TabsContent value="bias" className="space-y-6">
          {biasAnalysis && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  تحليل التحيز في النموذج
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* التحيز العام */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-white">
                      التحيز العام: {(biasAnalysis.overallBias * 100).toFixed(1)}%
                    </div>
                    <Badge variant="outline" className="border-orange-500 text-orange-500">
                      {biasAnalysis.overallBias > 0.1 ? 'متوسط' : 'منخفض'}
                    </Badge>
                  </div>

                  {/* عوامل التحيز */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-2">عوامل التحيز</h3>
                    <div className="space-y-2">
                      {biasAnalysis.biasFactors.map((factor, index) => (
                        <div key={index} className="p-3 bg-trading-secondary rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-white">{factor.factor}</div>
                            <div className="text-sm text-gray-400">
                              {(factor.bias * 100).toFixed(1)}%
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {factor.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* مقاييس العدالة */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-2">مقاييس العدالة</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-white">
                          {biasAnalysis.fairnessMetrics.demographicParity.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">تكافؤ ديموغرافي</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-white">
                          {biasAnalysis.fairnessMetrics.equalizedOdds.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">تكافؤ الفرص</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-white">
                          {biasAnalysis.fairnessMetrics.calibration.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">المعايرة</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* التحليل المضاد */}
        <TabsContent value="counterfactual" className="space-y-6">
          {counterfactual && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shuffle className="h-5 w-5 text-purple-400" />
                  تحليل "ماذا لو؟"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* القرارات */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-lg font-bold text-white">
                        القرار الأصلي: {counterfactual.originalDecision}
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">
                        القرار البديل: {counterfactual.alternativeDecision}
                      </div>
                    </div>
                  </div>

                  {/* التغييرات المطلوبة */}
                  <div>
                    <h3 className="text-md font-bold text-white mb-2">التغييرات المطلوبة</h3>
                    <div className="space-y-2">
                      {counterfactual.requiredChanges.map((change, index) => (
                        <div key={index} className="p-3 bg-trading-secondary rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-white">{change.feature}</div>
                            <div className="text-sm text-gray-400">
                              {change.originalValue} → {change.requiredValue}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            التأثير: {(change.impact * 100).toFixed(1)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* الثقة والجدوى */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-trading-secondary rounded">
                      <div className="text-lg font-bold text-white">
                        {counterfactual.confidence.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">الثقة</div>
                    </div>
                    <div className="text-center p-2 bg-trading-secondary rounded">
                      <div className="text-lg font-bold text-white">
                        {counterfactual.feasibility.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">الجدوى</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExplainableAI;
