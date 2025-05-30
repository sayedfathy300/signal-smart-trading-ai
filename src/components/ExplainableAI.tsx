
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Search,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Cell, Treemap } from 'recharts';
import { cn } from '@/lib/utils';
import { explainableAIService, DecisionExplanation, FeatureImportance, BiasAnalysis, CounterfactualAnalysis } from '@/services/explainableAIService';
import { toast } from 'sonner';

interface ExplainableAIProps {
  lang?: 'en' | 'ar';
}

const ExplainableAI = ({ lang = 'ar' }: ExplainableAIProps) => {
  const [explanation, setExplanation] = useState<DecisionExplanation | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis | null>(null);
  const [counterfactual, setCounterfactual] = useState<CounterfactualAnalysis | null>(null);
  const [selectedModel, setSelectedModel] = useState('lstm_model');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [explanationData, featureData, biasData, counterfactualData] = await Promise.all([
        explainableAIService.explainDecision(selectedModel, { price: 50000, volume: 1000000 }),
        explainableAIService.getFeatureImportance(selectedModel),
        explainableAIService.analyzeBias(selectedModel),
        explainableAIService.generateCounterfactual(selectedModel, { price: 50000, volume: 1000000 })
      ]);
      
      setExplanation(explanationData);
      setFeatureImportance(featureData);
      setBiasAnalysis(biasData);
      setCounterfactual(counterfactualData);
    } catch (error) {
      console.error('خطأ في تحميل بيانات الذكاء الاصطناعي التفسيري:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleExplainDecision = async () => {
    setLoading(true);
    try {
      const result = await explainableAIService.explainDecision(selectedModel, { 
        price: 50000, 
        volume: 1000000,
        rsi: 65,
        macd: 0.5 
      });
      setExplanation(result);
      toast.success('تم تفسير القرار بنجاح! 🧠');
    } catch (error) {
      toast.error('فشل في تفسير القرار');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeBias = async () => {
    setLoading(true);
    try {
      const result = await explainableAIService.analyzeBias(selectedModel);
      setBiasAnalysis(result);
      toast.success('تم تحليل التحيز بنجاح! 🔍');
    } catch (error) {
      toast.error('فشل في تحليل التحيز');
    } finally {
      setLoading(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision.toLowerCase()) {
      case 'buy': return 'text-trading-up';
      case 'sell': return 'text-trading-down';
      case 'hold': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision.toLowerCase()) {
      case 'buy': return <TrendingUp className="h-5 w-5 text-trading-up" />;
      case 'sell': return <TrendingUp className="h-5 w-5 text-trading-down transform rotate-180" />;
      case 'hold': return <Target className="h-5 w-5 text-gray-400" />;
      default: return <Brain className="h-5 w-5 text-white" />;
    }
  };

  const getBiasLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-trading-up';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-trading-down';
      default: return 'text-gray-400';
    }
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'الذكاء الاصطناعي التفسيري' : 'Explainable AI'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'فهم وتفسير قرارات الذكاء الاصطناعي بشفافية كاملة' : 'Understanding AI decisions with complete transparency'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-trading-card border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="lstm_model">LSTM Model</option>
            <option value="xgboost_model">XGBoost Model</option>
            <option value="random_forest">Random Forest</option>
            <option value="neural_network">Neural Network</option>
          </select>
          
          <Button
            onClick={loadInitialData}
            disabled={loading}
            className="bg-trading-primary hover:bg-blue-600"
          >
            <Eye className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'جاري التحديث...' : 'تحديث التحليل'}
          </Button>
        </div>
      </div>

      {/* بطاقة القرار الحالي */}
      {explanation && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {getDecisionIcon(explanation.decision)}
              قرار النموذج الحالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-trading-secondary rounded-lg">
                <div className={cn("text-2xl font-bold", getDecisionColor(explanation.decision))}>
                  {explanation.decision.toUpperCase()}
                </div>
                <div className="text-sm text-gray-400">القرار</div>
              </div>
              
              <div className="text-center p-4 bg-trading-secondary rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {(explanation.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">الثقة</div>
              </div>
              
              <div className="text-center p-4 bg-trading-secondary rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {explanation.factors.length}
                </div>
                <div className="text-sm text-gray-400">العوامل المؤثرة</div>
              </div>
              
              <div className="text-center p-4 bg-trading-secondary rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {explanation.model}
                </div>
                <div className="text-sm text-gray-400">النموذج</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="decision" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-trading-card">
          <TabsTrigger value="decision">تفسير القرار</TabsTrigger>
          <TabsTrigger value="features">أهمية المتغيرات</TabsTrigger>
          <TabsTrigger value="shap">تحليل SHAP</TabsTrigger>
          <TabsTrigger value="bias">تحليل التحيز</TabsTrigger>
          <TabsTrigger value="counterfactual">التحليل المقارن</TabsTrigger>
          <TabsTrigger value="tree">شجرة القرار</TabsTrigger>
        </TabsList>

        {/* تفسير القرار */}
        <TabsContent value="decision" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  تفسير مفصل للقرار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={handleExplainDecision}
                    disabled={loading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {loading ? 'جاري التحليل...' : 'تفسير القرار'}
                  </Button>

                  {explanation && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-white">العوامل المؤثرة:</h4>
                      {explanation.factors.map((factor, idx) => (
                        <div key={idx} className="p-3 bg-trading-secondary rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{factor.name}</span>
                            <Badge 
                              variant={factor.impact > 0 ? 'default' : 'destructive'}
                              className={factor.impact > 0 ? 'bg-trading-up' : 'bg-trading-down'}
                            >
                              {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(3)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">{factor.description}</div>
                          <Progress 
                            value={Math.abs(factor.impact) * 100} 
                            className="mt-2 h-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">توزيع العوامل</CardTitle>
              </CardHeader>
              <CardContent>
                {explanation && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          {COLORS.map((color, index) => (
                            <pattern key={index} id={`pattern-${index}`} patternUnits="userSpaceOnUse" width="4" height="4">
                              <rect width="4" height="4" fill={color} />
                            </pattern>
                          ))}
                        </defs>
                        <PieChart
                          data={explanation.factors.map(factor => ({
                            name: factor.name,
                            value: Math.abs(factor.impact)
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {explanation.factors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </PieChart>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* أهمية المتغيرات */}
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                أهمية المتغيرات (Feature Importance)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="importance" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureImportance.slice(0, 3).map((feature, idx) => (
              <Card key={idx} className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-2">{feature.name}</div>
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      {(feature.importance * 100).toFixed(1)}%
                    </div>
                    <Progress value={feature.importance * 100} className="h-2" />
                    <div className="text-xs text-gray-400 mt-2">{feature.description}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* تحليل SHAP */}
        <TabsContent value="shap" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-trading-up" />
                تحليل SHAP (SHapley Additive exPlanations)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  تحليل SHAP يوضح مساهمة كل متغير في القرار النهائي بطريقة دقيقة ومفصلة
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-white">قيم SHAP للمتغيرات:</h4>
                    {featureImportance.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                        <span className="text-white">{feature.name}</span>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "font-bold",
                            feature.importance > 0.1 ? 'text-trading-up' : 
                            feature.importance > 0.05 ? 'text-yellow-400' : 'text-gray-400'
                          )}>
                            {feature.importance.toFixed(4)}
                          </div>
                          <div className={cn(
                            "w-4 h-4 rounded",
                            feature.importance > 0.1 ? 'bg-trading-up' : 
                            feature.importance > 0.05 ? 'bg-yellow-400' : 'bg-gray-400'
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="importance" fill="#22C55E" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحليل التحيز */}
        <TabsContent value="bias" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-400" />
                تحليل التحيز في النموذج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={handleAnalyzeBias}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'جاري التحليل...' : 'تحليل التحيز'}
                </Button>

                {biasAnalysis && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-trading-secondary rounded-lg">
                        <div className={cn("text-2xl font-bold", getBiasLevelColor(biasAnalysis.overallBiasLevel))}>
                          {biasAnalysis.overallBiasLevel === 'low' ? 'منخفض' :
                           biasAnalysis.overallBiasLevel === 'medium' ? 'متوسط' : 'عالي'}
                        </div>
                        <div className="text-sm text-gray-400">مستوى التحيز العام</div>
                      </div>
                      
                      <div className="text-center p-4 bg-trading-secondary rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {(biasAnalysis.fairnessScore * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">نقاط العدالة</div>
                      </div>
                      
                      <div className="text-center p-4 bg-trading-secondary rounded-lg">
                        <div className="text-2xl font-bold text-white">
                          {biasAnalysis.detectedBiases.length}
                        </div>
                        <div className="text-sm text-gray-400">أنواع التحيز المكتشفة</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-white">أنواع التحيز المكتشفة:</h4>
                      {biasAnalysis.detectedBiases.map((bias, idx) => (
                        <div key={idx} className="p-4 bg-trading-secondary rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{bias.type}</span>
                            <Badge 
                              variant={bias.severity === 'high' ? 'destructive' : 
                                      bias.severity === 'medium' ? 'default' : 'secondary'}
                              className={
                                bias.severity === 'high' ? 'bg-trading-down' :
                                bias.severity === 'medium' ? 'bg-yellow-600' : 'bg-trading-up'
                              }
                            >
                              {bias.severity === 'high' ? 'عالي' :
                               bias.severity === 'medium' ? 'متوسط' : 'منخفض'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-300 mb-2">{bias.description}</div>
                          <div className="text-xs text-blue-400">
                            التوصية: {bias.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التحليل المقارن */}
        <TabsContent value="counterfactual" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                التحليل المقارن (Counterfactual Analysis)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  يوضح كيف يمكن تغيير المدخلات للحصول على قرار مختلف
                </p>

                {counterfactual && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-white">السيناريو الحالي:</h4>
                        <div className="p-4 bg-trading-secondary rounded-lg">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(counterfactual.originalInput).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-400">{key}:</span>
                                <span className="text-white font-mono">{JSON.stringify(value)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <div className="flex justify-between">
                              <span className="text-gray-400">القرار:</span>
                              <span className={cn("font-bold", getDecisionColor(counterfactual.originalDecision))}>
                                {counterfactual.originalDecision.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-white">السيناريو البديل:</h4>
                        <div className="p-4 bg-trading-secondary rounded-lg">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(counterfactual.counterfactualInput).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-400">{key}:</span>
                                <span className="text-white font-mono">{JSON.stringify(value)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <div className="flex justify-between">
                              <span className="text-gray-400">القرار:</span>
                              <span className={cn("font-bold", getDecisionColor(counterfactual.counterfactualDecision))}>
                                {counterfactual.counterfactualDecision.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-white">التغييرات المطلوبة:</h4>
                      {counterfactual.requiredChanges.map((change, idx) => (
                        <div key={idx} className="p-3 bg-trading-secondary rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-white">{change.feature}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">
                                {change.originalValue} → {change.newValue}
                              </span>
                              <Badge variant="outline" className="border-purple-400 text-purple-400">
                                {change.changeType}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">{change.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* شجرة القرار */}
        <TabsContent value="tree" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                مخطط شجرة القرار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  تمثيل بصري لعملية اتخاذ القرار في النموذج
                </p>
                
                <div className="h-96 bg-trading-secondary rounded-lg p-4">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">شجرة القرار التفاعلية</h3>
                      <p className="text-gray-400">
                        تصور تفاعلي لمسار اتخاذ القرار في النموذج
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExplainableAI;
