
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  BarChart3, 
  PieChart,
  Lightbulb,
  RefreshCw,
  Download,
  Settings,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell, TreeMap } from 'recharts';
import { cn } from '@/lib/utils';
import { explainableAIService, SHAPExplanation, FeatureImportance, DecisionExplanation } from '@/services/explainableAIService';

interface ExplainableAIProps {
  lang?: 'en' | 'ar';
}

const ExplainableAI = ({ lang = 'ar' }: ExplainableAIProps) => {
  const [shapData, setShapData] = useState<SHAPExplanation | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [decisionExplanation, setDecisionExplanation] = useState<DecisionExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('LSTM_EUR_USD');

  useEffect(() => {
    loadExplanations();
  }, [selectedModel]);

  const loadExplanations = async () => {
    setLoading(true);
    try {
      const [shap, features, decision] = await Promise.all([
        explainableAIService.getSHAPExplanation(selectedModel, 'EUR/USD'),
        explainableAIService.getFeatureImportance(selectedModel),
        explainableAIService.explainDecision(selectedModel, 'BUY', 'EUR/USD')
      ]);
      
      setShapData(shap);
      setFeatureImportance(features);
      setDecisionExplanation(decision);
    } catch (error) {
      console.error('Error loading explanations:', error);
    } finally {
      setLoading(false);
    }
  };

  // بيانات للرسوم البيانية
  const featureImportanceData = featureImportance.map(item => ({
    feature: item.feature,
    importance: item.importance * 100,
    category: item.category
  }));

  const biasAnalysisData = [
    { factor: 'Gender', bias: 0.02, threshold: 0.05, status: 'safe' },
    { factor: 'Age', bias: 0.08, threshold: 0.05, status: 'warning' },
    { factor: 'Location', bias: 0.01, threshold: 0.05, status: 'safe' },
    { factor: 'Income', bias: 0.12, threshold: 0.05, status: 'critical' }
  ];

  const decisionTreeData = [
    { level: 'Root', condition: 'RSI > 70', samples: 1000, value: 0.6 },
    { level: 'Level 1', condition: 'MACD > 0', samples: 400, value: 0.8 },
    { level: 'Level 1', condition: 'MACD <= 0', samples: 600, value: 0.4 },
    { level: 'Level 2', condition: 'Volume > Avg', samples: 200, value: 0.9 },
    { level: 'Level 2', condition: 'Volume <= Avg', samples: 200, value: 0.7 }
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'الذكاء الاصطناعي التفسيري' : 'Explainable AI'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'فهم وتفسير قرارات الذكاء الاصطناعي بوضوح' : 'Understanding and explaining AI decisions clearly'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={loadExplanations}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? (lang === 'ar' ? 'جاري التحديث...' : 'Loading...') : (lang === 'ar' ? 'تحديث' : 'Refresh')}
          </Button>
          
          <Button variant="outline" className="border-trading-up text-trading-up">
            <Download className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'تصدير التقرير' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* نظرة عامة سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {shapData ? (shapData.confidence * 100).toFixed(1) : '94.2'}%
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'ثقة النموذج' : 'Model Confidence'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-trading-up" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {featureImportance.length || 12}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'العوامل المؤثرة' : 'Key Features'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-white">2</div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'تحذيرات التحيز' : 'Bias Warnings'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {decisionExplanation?.reasoning.length || 5}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'أسباب القرار' : 'Decision Reasons'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="shap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="shap">تحليل SHAP</TabsTrigger>
          <TabsTrigger value="features">أهمية العوامل</TabsTrigger>
          <TabsTrigger value="decisions">تفسير القرارات</TabsTrigger>
          <TabsTrigger value="bias">تحليل التحيز</TabsTrigger>
          <TabsTrigger value="tree">شجرة القرار</TabsTrigger>
        </TabsList>

        {/* تحليل SHAP */}
        <TabsContent value="shap" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                {lang === 'ar' ? 'تحليل SHAP للقرارات' : 'SHAP Decision Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {shapData && (
                <div className="space-y-6">
                  {/* معلومات SHAP الأساسية */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {shapData.prediction.toFixed(4)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'التوقع النهائي' : 'Final Prediction'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-trading-up">
                        +{shapData.positiveContribution.toFixed(3)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'التأثير الإيجابي' : 'Positive Impact'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-trading-down">
                        {shapData.negativeContribution.toFixed(3)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'التأثير السلبي' : 'Negative Impact'}
                      </div>
                    </div>
                  </div>

                  {/* رسم SHAP */}
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shapData.featureContributions.map(item => ({
                        feature: item.feature,
                        value: item.shapValue,
                        absValue: Math.abs(item.shapValue)
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="feature" 
                          stroke="#9CA3AF"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#3B82F6"
                          name={lang === 'ar' ? 'قيمة SHAP' : 'SHAP Value'}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* تفسير SHAP */}
                  <div className="bg-trading-secondary p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-3">
                      {lang === 'ar' ? 'تفسير قيم SHAP:' : 'SHAP Values Explanation:'}
                    </h3>
                    <div className="space-y-2">
                      {shapData.featureContributions.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{item.feature}</span>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-bold",
                              item.shapValue > 0 ? 'text-trading-up' : 'text-trading-down'
                            )}>
                              {item.shapValue > 0 ? '+' : ''}{item.shapValue.toFixed(4)}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({lang === 'ar' ? 'مساهمة' : 'contribution'})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* أهمية العوامل */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'أهمية العوامل' : 'Feature Importance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureImportanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="feature" 
                        stroke="#9CA3AF"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
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
              </CardContent>
            </Card>

            {/* توزيع العوامل */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'توزيع العوامل حسب الفئة' : 'Feature Distribution by Category'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Technical', value: featureImportance.filter(f => f.category === 'technical').length },
                          { name: 'Fundamental', value: featureImportance.filter(f => f.category === 'fundamental').length },
                          { name: 'Sentiment', value: featureImportance.filter(f => f.category === 'sentiment').length },
                          { name: 'Alternative', value: featureImportance.filter(f => f.category === 'alternative').length }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {featureImportanceData.map((entry, index) => (
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

          {/* قائمة العوامل التفصيلية */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'تفاصيل العوامل' : 'Feature Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {featureImportance.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ 
                        backgroundColor: feature.category === 'technical' ? '#22C55E' :
                                       feature.category === 'fundamental' ? '#3B82F6' :
                                       feature.category === 'sentiment' ? '#F59E0B' : '#EF4444'
                      }} />
                      <div>
                        <div className="font-medium text-white">{feature.feature}</div>
                        <div className="text-sm text-gray-400">
                          {feature.category} • Impact: {(feature.importance * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-600">
                      {(feature.importance * 100).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تفسير القرارات */}
        <TabsContent value="decisions" className="space-y-6">
          {decisionExplanation && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-trading-up" />
                  {lang === 'ar' ? 'تفسير القرار' : 'Decision Explanation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* معلومات القرار */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <Badge 
                        className={cn(
                          "text-lg px-4 py-2",
                          decisionExplanation.decision === 'BUY' ? 'bg-trading-up' :
                          decisionExplanation.decision === 'SELL' ? 'bg-trading-down' : 'bg-gray-600'
                        )}
                      >
                        {decisionExplanation.decision}
                      </Badge>
                      <div className="text-sm text-gray-400 mt-2">
                        {lang === 'ar' ? 'القرار المتخذ' : 'Decision Made'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {(decisionExplanation.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'مستوى الثقة' : 'Confidence Level'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-trading-secondary rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {decisionExplanation.reasoning.length}
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'عدد الأسباب' : 'Number of Reasons'}
                      </div>
                    </div>
                  </div>

                  {/* أسباب القرار */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">
                      {lang === 'ar' ? 'أسباب القرار:' : 'Decision Reasoning:'}
                    </h3>
                    <div className="space-y-3">
                      {decisionExplanation.reasoning.map((reason, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-trading-secondary rounded-lg">
                          <div className="w-6 h-6 bg-trading-up rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-white">{reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* العوامل المؤثرة */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">
                      {lang === 'ar' ? 'العوامل المؤثرة في القرار:' : 'Contributing Factors:'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {decisionExplanation.contributingFactors.map((factor, index) => (
                        <div key={index} className="p-3 bg-trading-secondary rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-white">{factor.factor}</span>
                            <Badge variant="outline" className="border-gray-600">
                              {(factor.weight * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-trading-up h-2 rounded-full"
                              style={{ width: `${factor.weight * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* تحليل التحيز */}
        <TabsContent value="bias" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                {lang === 'ar' ? 'تحليل التحيز في النموذج' : 'Model Bias Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {biasAnalysisData.map((item, index) => (
                  <div key={index} className="p-4 bg-trading-secondary rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-white">{item.factor}</span>
                        <Badge 
                          variant="outline"
                          className={cn(
                            item.status === 'safe' ? 'border-trading-up text-trading-up' :
                            item.status === 'warning' ? 'border-yellow-500 text-yellow-500' :
                            'border-trading-down text-trading-down'
                          )}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {(item.bias * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          Threshold: {(item.threshold * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className={cn(
                          "h-3 rounded-full",
                          item.status === 'safe' ? 'bg-trading-up' :
                          item.status === 'warning' ? 'bg-yellow-500' :
                          'bg-trading-down'
                        )}
                        style={{ width: `${(item.bias / 0.15) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                <h4 className="font-bold text-blue-300 mb-2">
                  {lang === 'ar' ? 'توصيات تقليل التحيز:' : 'Bias Reduction Recommendations:'}
                </h4>
                <ul className="space-y-1 text-blue-200 text-sm">
                  <li>• زيادة تنوع بيانات التدريب</li>
                  <li>• تطبيق تقنيات توازن البيانات</li>
                  <li>• مراجعة دورية لأداء النموذج</li>
                  <li>• استخدام معايير عدالة متعددة</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* شجرة القرار */}
        <TabsContent value="tree" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-trading-up" />
                {lang === 'ar' ? 'تصور شجرة القرار' : 'Decision Tree Visualization'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <TreeMap
                    data={decisionTreeData}
                    dataKey="samples"
                    aspectRatio={4/3}
                    stroke="#374151"
                    fill="#3B82F6"
                  />
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-white">
                    {lang === 'ar' ? 'قواعد القرار الرئيسية:' : 'Main Decision Rules:'}
                  </h4>
                  {decisionTreeData.slice(0, 3).map((node, index) => (
                    <div key={index} className="p-3 bg-trading-secondary rounded-lg">
                      <div className="font-medium text-white">{node.condition}</div>
                      <div className="text-sm text-gray-400">
                        Samples: {node.samples} | Value: {node.value.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-white">
                    {lang === 'ar' ? 'إحصائيات الشجرة:' : 'Tree Statistics:'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-trading-secondary rounded-lg text-center">
                      <div className="text-lg font-bold text-white">5</div>
                      <div className="text-xs text-gray-400">Levels</div>
                    </div>
                    <div className="p-3 bg-trading-secondary rounded-lg text-center">
                      <div className="text-lg font-bold text-white">85%</div>
                      <div className="text-xs text-gray-400">Accuracy</div>
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
