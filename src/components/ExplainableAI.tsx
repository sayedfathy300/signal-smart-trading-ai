
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  Eye, 
  BarChart3, 
  TreePine,
  Scale,
  Lightbulb,
  GitBranch,
  Layers,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Treemap,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  explainableAIService,
  type ExplainabilityReport,
  type ModelExplanation,
  type FeatureImportance,
  type SHAPValue
} from '@/services/explainableAIService';
import { marketDataService } from '@/services/marketDataService';

interface ExplainableAIProps {
  lang?: 'en' | 'ar';
}

const ExplainableAI = ({ lang = 'ar' }: ExplainableAIProps) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ExplainabilityReport | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('LSTM');
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [explanationSummary, setExplanationSummary] = useState<any>(null);
  const [featureInteractions, setFeatureInteractions] = useState<any[]>([]);

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];

  useEffect(() => {
    generateExplanations();
  }, [selectedSymbol]);

  const generateExplanations = async () => {
    try {
      setLoading(true);
      console.log(`🔍 توليد تفسيرات الذكاء الاصطناعي لرمز ${selectedSymbol}...`);
      
      // محاكاة بيانات الخصائص
      const mockFeatures = {
        RSI: Math.random() * 100,
        MACD: Math.random() * 2 - 1,
        MA20: Math.random() * 200 + 100,
        MA50: Math.random() * 200 + 100,
        Volume: Math.random() * 1000000,
        News_Sentiment: Math.random() * 2 - 1,
        PE_Ratio: Math.random() * 30 + 5,
        EPS: Math.random() * 10,
        Google_Trends: Math.random() * 100
      };
      
      const explainabilityReport = await explainableAIService.generateExplainabilityReport(
        selectedSymbol,
        mockFeatures
      );
      
      const summary = await explainableAIService.generateExplanationSummary(explainabilityReport);
      const interactions = await explainableAIService.analyzeFeatureInteractions(mockFeatures);
      
      setReport(explainabilityReport);
      setExplanationSummary(summary);
      setFeatureInteractions(interactions);
      
      console.log('✅ تم توليد تفسيرات الذكاء الاصطناعي بنجاح');
    } catch (error) {
      console.error('❌ خطأ في توليد التفسيرات:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Eye className="h-16 w-16 animate-pulse mx-auto text-trading-primary" />
          <div className="space-y-2">
            <p className="text-xl font-semibold text-white">
              {lang === 'ar' ? 'جاري توليد تفسيرات الذكاء الاصطناعي...' : 'Generating AI Explanations...'}
            </p>
            <div className="space-y-1">
              <Progress value={75} className="w-64 mx-auto" />
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'تحليل SHAP وأهمية الخصائص...' : 'Analyzing SHAP and feature importance...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-gray-400">
        {lang === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available'}
      </div>
    );
  }

  const selectedModelData = report.model_explanations.find(m => m.model_name === selectedModel);

  const shapChartData = selectedModelData?.shap_values.slice(0, 10).map(shap => ({
    feature: shap.feature,
    contribution: shap.contribution,
    importance: shap.importance * 100
  })) || [];

  const featureImportanceData = report.global_feature_importance.slice(0, 12).map(f => ({
    feature: f.feature,
    importance: f.importance * 100,
    category: f.category
  }));

  const biasData = [
    { name: lang === 'ar' ? 'التكافؤ الديموغرافي' : 'Demographic Parity', value: report.bias_analysis.demographic_parity * 100 },
    { name: lang === 'ar' ? 'الاحتمالات المتساوية' : 'Equalized Odds', value: report.bias_analysis.equalized_odds * 100 },
    { name: lang === 'ar' ? 'المعايرة' : 'Calibration', value: report.bias_analysis.calibration * 100 },
    { name: lang === 'ar' ? 'نقاط العدالة' : 'Fairness Score', value: report.bias_analysis.fairness_score * 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
              >
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
              <Button onClick={generateExplanations} disabled={loading}>
                <Eye className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تحليل جديد' : 'New Analysis'}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-trading-primary">
                {lang === 'ar' ? 'نقاط التفسير:' : 'Interpretability:'} {(report.interpretability_score * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Dashboard */}
      {explanationSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {explanationSummary.model_consensus}
              </div>
              <p className="text-xs text-gray-400">
                {lang === 'ar' ? 'إجماع النماذج' : 'Model Consensus'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <Badge className={
                explanationSummary.confidence_level === 'high' ? 'bg-green-500' :
                explanationSummary.confidence_level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
              }>
                {explanationSummary.confidence_level}
              </Badge>
              <p className="text-xs text-gray-400 mt-2">
                {lang === 'ar' ? 'مستوى الثقة' : 'Confidence Level'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Lightbulb className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {explanationSummary.key_insights.length}
              </div>
              <p className="text-xs text-gray-400">
                {lang === 'ar' ? 'رؤى رئيسية' : 'Key Insights'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">
                {explanationSummary.actionable_recommendations.length}
              </div>
              <p className="text-xs text-gray-400">
                {lang === 'ar' ? 'توصيات قابلة للتنفيذ' : 'Actionable Items'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="shap" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="shap">SHAP</TabsTrigger>
          <TabsTrigger value="importance">{lang === 'ar' ? 'الأهمية' : 'Importance'}</TabsTrigger>
          <TabsTrigger value="decisions">{lang === 'ar' ? 'القرارات' : 'Decisions'}</TabsTrigger>
          <TabsTrigger value="tree">{lang === 'ar' ? 'الشجرة' : 'Tree'}</TabsTrigger>
          <TabsTrigger value="bias">{lang === 'ar' ? 'التحيز' : 'Bias'}</TabsTrigger>
        </TabsList>

        <TabsContent value="shap" className="space-y-6">
          <div className="flex gap-4 mb-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
            >
              {report.model_explanations.map(model => (
                <option key={model.model_name} value={model.model_name}>
                  {model.model_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SHAP Values Chart */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {lang === 'ar' ? 'قيم SHAP' : 'SHAP Values'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={shapChartData} layout="vertica">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="contribution" stroke="#9CA3AF" />
                    <YAxis dataKey="feature" type="category" stroke="#9CA3AF" width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="contribution" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* SHAP Summary */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'ملخص SHAP' : 'SHAP Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedModelData && (
                    <>
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">التنبؤ</span>
                          <span className="text-lg font-bold text-trading-primary">
                            {(selectedModelData.prediction * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={selectedModelData.prediction * 100} />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">أهم العوامل المؤثرة:</h4>
                        {selectedModelData.shap_values.slice(0, 5).map((shap, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                            <span className="text-sm text-gray-300">{shap.feature}</span>
                            <Badge className={shap.contribution > 0 ? 'bg-green-500' : 'bg-red-500'}>
                              {shap.contribution > 0 ? '+' : ''}{shap.contribution.toFixed(3)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="importance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Importance Chart */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {lang === 'ar' ? 'أهمية الخصائص' : 'Feature Importance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={featureImportanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="feature" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="importance" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Feature Categories */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'تصنيف الخصائص' : 'Feature Categories'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['technical', 'fundamental', 'sentiment', 'alternative'].map(category => {
                    const categoryFeatures = featureImportanceData.filter(f => f.category === category);
                    const avgImportance = categoryFeatures.reduce((sum, f) => sum + f.importance, 0) / categoryFeatures.length || 0;
                    
                    return (
                      <div key={category} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-300 capitalize">{category}</span>
                          <span className="text-sm text-trading-primary">{avgImportance.toFixed(1)}%</span>
                        </div>
                        <Progress value={avgImportance} />
                        <div className="mt-2 text-xs text-gray-400">
                          {categoryFeatures.length} {lang === 'ar' ? 'خصائص' : 'features'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Interactions */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                {lang === 'ar' ? 'تفاعلات الخصائص' : 'Feature Interactions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featureInteractions.map((interaction, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{interaction.interaction}</h4>
                      <Badge className="bg-blue-500">
                        {(interaction.strength * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={interaction.strength * 100} className="mb-2" />
                    <p className="text-xs text-gray-400">{interaction.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          {selectedModelData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Decision Explanation */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {lang === 'ar' ? 'تفسير القرار' : 'Decision Explanation'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Badge className={
                      selectedModelData.decision_explanation.decision === 'buy' ? 'bg-green-500' :
                      selectedModelData.decision_explanation.decision === 'sell' ? 'bg-red-500' : 'bg-gray-500'
                    } size="lg">
                      {selectedModelData.decision_explanation.decision.toUpperCase()}
                    </Badge>
                    <div className="mt-2">
                      <span className="text-sm text-gray-400">الثقة: </span>
                      <span className="text-trading-primary font-bold">
                        {(selectedModelData.decision_explanation.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      العوامل الرئيسية
                    </h4>
                    <div className="space-y-1">
                      {selectedModelData.decision_explanation.main_factors.map((factor, index) => (
                        <div key={index} className="text-sm text-gray-300 p-2 bg-gray-800 rounded">
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-400" />
                      الأدلة الداعمة
                    </h4>
                    <div className="space-y-1">
                      {selectedModelData.decision_explanation.supporting_evidence.map((evidence, index) => (
                        <div key={index} className="text-sm text-gray-300 p-2 bg-gray-800 rounded">
                          {evidence}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      عوامل المخاطر
                    </h4>
                    <div className="space-y-1">
                      {selectedModelData.decision_explanation.risk_factors.map((risk, index) => (
                        <div key={index} className="text-sm text-gray-300 p-2 bg-gray-800 rounded">
                          {risk}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Scenarios */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    {lang === 'ar' ? 'السيناريوهات البديلة' : 'Alternative Scenarios'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedModelData.decision_explanation.alternative_scenarios.map((scenario, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-medium">{scenario.scenario}</h4>
                          <Badge variant="outline">
                            {(scenario.probability * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={scenario.probability * 100} className="mb-2" />
                        <p className="text-sm text-gray-400">{scenario.outcome}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Counterfactual Analysis */}
              <Card className="bg-trading-card border-gray-800 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {lang === 'ar' ? 'التحليل الافتراضي' : 'Counterfactual Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-800 rounded-lg text-center">
                      <p className="text-sm text-gray-400 mb-1">التنبؤ الأصلي</p>
                      <p className="text-lg font-bold text-white">
                        {(selectedModelData.counterfactual_analysis.original_prediction * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg text-center">
                      <p className="text-sm text-gray-400 mb-1">التنبؤ الافتراضي</p>
                      <p className="text-lg font-bold text-trading-primary">
                        {(selectedModelData.counterfactual_analysis.counterfactual_prediction * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg text-center">
                      <p className="text-sm text-gray-400 mb-1">الخصائص المتغيرة</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {selectedModelData.counterfactual_analysis.changed_features.length}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                    <p className="text-gray-300">{selectedModelData.counterfactual_analysis.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tree" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                {lang === 'ar' ? 'شجرة القرار' : 'Decision Tree'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-gray-400 py-8">
                  <TreePine className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p>{lang === 'ar' ? 'تصور شجرة القرار التفاعلية' : 'Interactive Decision Tree Visualization'}</p>
                  <p className="text-sm mt-2">
                    {lang === 'ar' ? 'عرض مسار القرارات والعقد الرئيسية' : 'Showing decision paths and key nodes'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.decision_tree_visualization.nodes.slice(0, 3).map((node, index) => (
                    <div key={node.id} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={node.type === 'decision' ? 'bg-blue-500' : 'bg-green-500'}>
                          {node.type}
                        </Badge>
                        <span className="text-sm text-gray-400">{node.samples} عينة</span>
                      </div>
                      <p className="text-white font-medium mb-2">{node.condition}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">القيمة:</span>
                        <span className="text-trading-primary font-bold">{node.value.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bias" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bias Analysis Chart */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  {lang === 'ar' ? 'تحليل التحيز' : 'Bias Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={biasData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="value" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Fairness Metrics */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'مقاييس العدالة' : 'Fairness Metrics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {biasData.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{metric.name}</span>
                        <Badge className={
                          metric.value > 80 ? 'bg-green-500' :
                          metric.value > 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {metric.value.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={metric.value} />
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-white font-medium mb-2">تقييم العدالة الإجمالي</h4>
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-yellow-400" />
                      <Badge className={
                        report.bias_analysis.fairness_score > 0.8 ? 'bg-green-500' :
                        report.bias_analysis.fairness_score > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }>
                        {(report.bias_analysis.fairness_score * 100).toFixed(1)}% عادل
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                {lang === 'ar' ? 'توصيات تحسين العدالة' : 'Fairness Improvement Recommendations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">توصيات فورية:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">تنويع مصادر البيانات</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">مراجعة خوارزميات الاختيار</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">تطبيق تقنيات إزالة التحيز</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-white font-medium">توصيات طويلة المدى:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <Info className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">مراقبة مستمرة للعدالة</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <Info className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">تدريب فرق متنوعة</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <Info className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">إعادة تقييم دورية</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Section */}
      {explanationSummary && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              {lang === 'ar' ? 'الرؤى الرئيسية والتوصيات' : 'Key Insights & Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">الرؤى الرئيسية:</h4>
                <div className="space-y-2">
                  {explanationSummary.key_insights.map((insight: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">التوصيات القابلة للتنفيذ:</h4>
                <div className="space-y-2">
                  {explanationSummary.actionable_recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                      <Target className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExplainableAI;
