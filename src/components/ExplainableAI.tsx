
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  RefreshCw,
  Lightbulb,
  Shuffle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
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
import { explainableAIService, type DecisionExplanation, type BiasAnalysis, type CounterfactualAnalysis, type FeatureImportance } from '@/services/explainableAIService';

interface ExplainableAIProps {
  lang: 'en' | 'ar';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ExplainableAI({ lang }: ExplainableAIProps) {
  const [explanation, setExplanation] = useState<DecisionExplanation | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis | null>(null);
  const [counterfactual, setCounterfactual] = useState<CounterfactualAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const text = {
    title: lang === 'ar' ? 'الذكاء الاصطناعي القابل للتفسير' : 'Explainable AI',
    subtitle: lang === 'ar' ? 'شرح وتفسير قرارات النماذج التجارية' : 'Explain and interpret trading model decisions',
    explainDecision: lang === 'ar' ? 'شرح القرار' : 'Explain Decision',
    featureAnalysis: lang === 'ar' ? 'تحليل الميزات' : 'Feature Analysis',
    biasDetection: lang === 'ar' ? 'كشف التحيز' : 'Bias Detection',
    counterfactualAnalysis: lang === 'ar' ? 'التحليل المضاد' : 'Counterfactual Analysis',
    confidence: lang === 'ar' ? 'الثقة' : 'Confidence',
    decision: lang === 'ar' ? 'القرار' : 'Decision',
    reasoning: lang === 'ar' ? 'التبرير' : 'Reasoning',
    alternatives: lang === 'ar' ? 'البدائل' : 'Alternatives',
    importance: lang === 'ar' ? 'الأهمية' : 'Importance',
    bias: lang === 'ar' ? 'التحيز' : 'Bias',
    fairness: lang === 'ar' ? 'العدالة' : 'Fairness',
    recommendation: lang === 'ar' ? 'التوصية' : 'Recommendation',
    generate: lang === 'ar' ? 'توليد' : 'Generate',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh'
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // محاكاة بيانات تداول
      const mockInput = {
        price: 50000,
        volume: 1000000,
        rsi: 65,
        macd: 0.1
      };

      const mockOutput = {
        prediction: 'BUY',
        confidence: 0.85
      };

      const [explanationData, importanceData, biasData] = await Promise.all([
        explainableAIService.explainDecision(mockOutput, mockInput, 'XGBoost'),
        explainableAIService.getFeatureImportance('XGBoost'),
        explainableAIService.analyzeBias([], [])
      ]);

      setExplanation(explanationData);
      setFeatureImportance(importanceData);
      setBiasAnalysis(biasData);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCounterfactual = async () => {
    setIsLoading(true);
    try {
      const result = await explainableAIService.generateCounterfactual(
        { rsi: 75, volume: 500000 },
        'BUY'
      );
      setCounterfactual(result);
    } catch (error) {
      console.error('خطأ في توليد التحليل المضاد:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDecisionExplanation = () => {
    if (!explanation) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {text.decision}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {explanation.decision}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {text.confidence}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(explanation.confidence * 100).toFixed(1)}%
              </div>
              <Progress value={explanation.confidence * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                النموذج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{explanation.model.name}</div>
              <div className="text-sm text-gray-500">
                دقة: {(explanation.model.accuracy * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              {text.reasoning}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{explanation.reasoning}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>العوامل المؤثرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {explanation.factors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{factor.name}</div>
                    <div className="text-sm text-gray-500">{factor.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{factor.value.toLocaleString()}</div>
                    <Progress value={factor.impact * 100} className="w-20 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>القرارات البديلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {explanation.alternatives.map((alt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <Badge variant={alt.decision === 'BUY' ? 'default' : 'secondary'}>
                      {alt.decision}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{alt.reasoning}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{(alt.probability * 100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFeatureImportance = () => {
    if (!featureImportance.length) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>أهمية الميزات</CardTitle>
            <CardDescription>
              تأثير كل ميزة على قرار النموذج
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="importance" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع الأهمية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={featureImportance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${(value * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="importance"
                >
                  {featureImportance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الميزات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureImportance.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-sm text-gray-500">{feature.description}</div>
                    <Badge 
                      variant={feature.direction === 'positive' ? 'default' : 'destructive'}
                      className="mt-2"
                    >
                      {feature.direction === 'positive' ? 'إيجابي' : 'سلبي'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {(feature.importance * 100).toFixed(1)}%
                    </div>
                    <Progress value={feature.importance * 100} className="w-20 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBiasAnalysis = () => {
    if (!biasAnalysis) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              تحليل التحيز العام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {(biasAnalysis.overallBias * 100).toFixed(1)}%
              </div>
              <Progress value={biasAnalysis.overallBias * 100} className="mb-4" />
              <Badge variant={biasAnalysis.overallBias < 0.1 ? 'default' : 'destructive'}>
                {biasAnalysis.overallBias < 0.1 ? 'مقبول' : 'يحتاج تحسين'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>عوامل التحيز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {biasAnalysis.biasFactors.map((factor, index) => (
                <Alert key={index} className={factor.severity === 'high' ? 'border-red-500' : ''}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{factor.factor}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {factor.recommendation}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          factor.severity === 'high' ? 'destructive' : 
                          factor.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {factor.severity}
                        </Badge>
                        <div className="mt-1 font-semibold">
                          {(factor.bias * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مقاييس العدالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">التكافؤ الديموغرافي</div>
                <div className="text-2xl font-bold text-blue-500 mt-2">
                  {(biasAnalysis.fairnessMetrics.demographicParity * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">الاحتمالات المتساوية</div>
                <div className="text-2xl font-bold text-green-500 mt-2">
                  {(biasAnalysis.fairnessMetrics.equalizedOdds * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">المعايرة</div>
                <div className="text-2xl font-bold text-purple-500 mt-2">
                  {(biasAnalysis.fairnessMetrics.calibration * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCounterfactualAnalysis = () => {
    if (!counterfactual) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>التحليل المضاد</CardTitle>
            <CardDescription>
              اكتشف ما يحتاج تغييره للحصول على قرار مختلف
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateCounterfactual} disabled={isLoading}>
              <Shuffle className="h-4 w-4 mr-2" />
              {text.generate}
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>نتائج التحليل المضاد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">القرار الأصلي</div>
                  <Badge variant="secondary" className="mt-1">
                    {counterfactual.originalDecision}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">القرار البديل</div>
                  <Badge variant="default" className="mt-1">
                    {counterfactual.alternativeDecision}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">الثقة</div>
                  <div className="text-xl font-bold">
                    {(counterfactual.confidence * 100).toFixed(1)}%
                  </div>
                  <Progress value={counterfactual.confidence * 100} className="mt-1" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">الجدوى</div>
                  <div className="text-xl font-bold">
                    {(counterfactual.feasibility * 100).toFixed(1)}%
                  </div>
                  <Progress value={counterfactual.feasibility * 100} className="mt-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التغييرات المطلوبة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {counterfactual.requiredChanges.map((change, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{change.feature}</div>
                    <div className="text-sm text-gray-500">
                      من {change.originalValue.toLocaleString()} إلى {change.requiredValue.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">التأثير</div>
                    <div className="font-semibold">{(change.impact * 100).toFixed(1)}%</div>
                    <Progress value={change.impact * 100} className="w-20 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-trading-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {text.title}
              </h1>
              <p className="text-gray-400">
                {text.subtitle}
              </p>
            </div>
            <Button 
              onClick={loadInitialData} 
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {text.refresh}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="decision" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="decision" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              {text.explainDecision}
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {text.featureAnalysis}
            </TabsTrigger>
            <TabsTrigger value="bias" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {text.biasDetection}
            </TabsTrigger>
            <TabsTrigger value="counterfactual" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {text.counterfactualAnalysis}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="decision">
            {renderDecisionExplanation()}
          </TabsContent>

          <TabsContent value="features">
            {renderFeatureImportance()}
          </TabsContent>

          <TabsContent value="bias">
            {renderBiasAnalysis()}
          </TabsContent>

          <TabsContent value="counterfactual">
            {renderCounterfactualAnalysis()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
