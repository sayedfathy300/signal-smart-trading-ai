
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Zap, 
  Network, 
  MessageSquare, 
  Target, 
  RefreshCw, 
  Cpu, 
  Sparkles, 
  Eye,
  TrendingUp,
  BarChart3,
  Settings,
  Play,
  Pause,
  Square,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { 
  advancedAIModelsService,
  TransformerResult,
  GraphAnalysisResult,
  ReinforcementLearningResult,
  EnsembleModelResult,
  LSTMPrediction,
  CNNPatternAnalysis
} from '@/services/advancedAIModelsService';
import { continuousLearningService, ContinuousLearningMetrics, OnlineLearningState } from '@/services/continuousLearningService';
import { explainableAIService, DecisionExplanation, BiasAnalysis, FeatureImportance } from '@/services/explainableAIService';
import { generativeAIService, GeneratedScenario, GeneratedStrategy } from '@/services/generativeAIService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';

interface AdvancedAIModelsProps {
  symbol?: string;
  lang?: 'en' | 'ar';
}

const AdvancedAIModels = ({ symbol = 'AAPL', lang = 'ar' }: AdvancedAIModelsProps) => {
  // State للنماذج المختلفة
  const [transformerResult, setTransformerResult] = useState<TransformerResult | null>(null);
  const [graphResult, setGraphResult] = useState<GraphAnalysisResult | null>(null);
  const [rlResult, setRlResult] = useState<ReinforcementLearningResult | null>(null);
  const [ensembleResult, setEnsembleResult] = useState<EnsembleModelResult | null>(null);
  const [lstmResult, setLstmResult] = useState<LSTMPrediction | null>(null);
  const [cnnResult, setCnnResult] = useState<CNNPatternAnalysis | null>(null);
  
  // State للتعلم المستمر
  const [learningMetrics, setLearningMetrics] = useState<ContinuousLearningMetrics | null>(null);
  const [onlineLearningStates, setOnlineLearningStates] = useState<OnlineLearningState[]>([]);
  
  // State للذكاء الاصطناعي القابل للتفسير
  const [decisionExplanation, setDecisionExplanation] = useState<DecisionExplanation | null>(null);
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  
  // State للذكاء التوليدي
  const [generatedScenarios, setGeneratedScenarios] = useState<GeneratedScenario[]>([]);
  const [generatedStrategy, setGeneratedStrategy] = useState<GeneratedStrategy | null>(null);
  
  // State عام
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('hybrid');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  // بيانات وهمية للاختبار
  const mockMarketData = Array.from({ length: 100 }, (_, i) => ({
    timestamp: Date.now() - (100 - i) * 86400000,
    open: 150 + Math.random() * 20,
    high: 155 + Math.random() * 25,
    low: 145 + Math.random() * 15,
    close: 150 + Math.random() * 20,
    volume: 1000000 + Math.random() * 500000
  }));

  useEffect(() => {
    loadContinuousLearningMetrics();
    loadExplainableAIData();
    loadGenerativeAIData();
  }, []);

  const loadContinuousLearningMetrics = async () => {
    try {
      const [metrics, states] = await Promise.all([
        continuousLearningService.getContinuousLearningMetrics(),
        continuousLearningService.getAllOnlineLearningStates()
      ]);
      setLearningMetrics(metrics);
      setOnlineLearningStates(states);
    } catch (error) {
      console.error('Error loading continuous learning metrics:', error);
    }
  };

  const loadExplainableAIData = async () => {
    try {
      const mockPrediction = { prediction: 'BUY', confidence: 0.85 };
      const mockInput = { price: 150, volume: 1000000, rsi: 65, macd: 0.1 };
      
      const [explanation, bias, importance] = await Promise.all([
        explainableAIService.explainDecision(mockPrediction, mockInput, 'Hybrid_LSTM_CNN'),
        explainableAIService.analyzeBias([mockPrediction], [mockPrediction]),
        explainableAIService.getFeatureImportance('Hybrid_LSTM_CNN')
      ]);
      
      setDecisionExplanation(explanation);
      setBiasAnalysis(bias);
      setFeatureImportance(importance);
    } catch (error) {
      console.error('Error loading explainable AI data:', error);
    }
  };

  const loadGenerativeAIData = async () => {
    try {
      const [scenarios, strategy] = await Promise.all([
        generativeAIService.generateMarketScenarios(mockMarketData, symbol),
        generativeAIService.generateTradingStrategy(mockMarketData, { riskTolerance: 'medium' })
      ]);
      
      setGeneratedScenarios(scenarios);
      setGeneratedStrategy(strategy);
    } catch (error) {
      console.error('Error loading generative AI data:', error);
    }
  };

  const runHybridModels = async () => {
    setLoading(true);
    setTrainingStatus('training');
    
    try {
      // محاكاة التقدم
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const results = await advancedAIModelsService.runComprehensiveAIAnalysis(
        symbol, 
        mockMarketData,
        'شركة آبل تسجل أرباحاً قوية هذا الربع مع نمو في مبيعات الآيفون'
      );
      
      setTransformerResult(results.transformer);
      setGraphResult(results.graph);
      setRlResult(results.reinforcement);
      setEnsembleResult(results.ensemble);
      setLstmResult(results.lstm);
      setCnnResult(results.cnn);
      
      setTrainingStatus('completed');
    } catch (error) {
      console.error('Error running hybrid models:', error);
      setTrainingStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const runAutoMLOptimization = async () => {
    setLoading(true);
    try {
      const result = await continuousLearningService.runAutoML('market_data', 'price_direction');
      console.log('AutoML completed:', result);
      loadContinuousLearningMetrics();
    } catch (error) {
      console.error('Error running AutoML:', error);
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'نماذج الذكاء الاصطناعي المتقدمة' : 'Advanced AI Models'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'نماذج متطورة للتحليل والتنبؤ المالي باستخدام الذكاء الاصطناعي' : 'Advanced AI models for financial analysis and prediction'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hybrid">{lang === 'ar' ? 'النماذج المدمجة' : 'Hybrid Models'}</SelectItem>
              <SelectItem value="transformer">{lang === 'ar' ? 'محولات اللغة' : 'Transformers'}</SelectItem>
              <SelectItem value="reinforcement">{lang === 'ar' ? 'التعلم المعزز' : 'Reinforcement Learning'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={runHybridModels}
            disabled={loading}
            className="bg-trading-primary hover:bg-blue-600"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {loading ? (lang === 'ar' ? 'جاري التشغيل...' : 'Running...') : (lang === 'ar' ? 'تشغيل النماذج' : 'Run Models')}
          </Button>
        </div>
      </div>

      {/* شريط التقدم */}
      {trainingStatus === 'training' && (
        <Card className="bg-trading-card border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 font-medium">
                {lang === 'ar' ? 'تدريب النماذج المتقدمة...' : 'Training Advanced Models...'}
              </span>
              <span className="text-white">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="hybrid-models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 bg-trading-card">
          <TabsTrigger value="hybrid-models">
            {lang === 'ar' ? 'النماذج المدمجة' : 'Hybrid Models'}
          </TabsTrigger>
          <TabsTrigger value="graph-neural">
            {lang === 'ar' ? 'الشبكات البيانية' : 'Graph Neural'}
          </TabsTrigger>
          <TabsTrigger value="transformers">
            {lang === 'ar' ? 'محولات اللغة' : 'Transformers'}
          </TabsTrigger>
          <TabsTrigger value="reinforcement">
            {lang === 'ar' ? 'التعلم المعزز' : 'Reinforcement'}
          </TabsTrigger>
          <TabsTrigger value="continuous">
            {lang === 'ar' ? 'التعلم المستمر' : 'Continuous'}
          </TabsTrigger>
          <TabsTrigger value="automl">
            {lang === 'ar' ? 'AutoML' : 'AutoML'}
          </TabsTrigger>
          <TabsTrigger value="generative">
            {lang === 'ar' ? 'الذكاء التوليدي' : 'Generative AI'}
          </TabsTrigger>
          <TabsTrigger value="explainable">
            {lang === 'ar' ? 'الذكاء القابل للتفسير' : 'Explainable AI'}
          </TabsTrigger>
        </TabsList>

        {/* النماذج المدمجة */}
        <TabsContent value="hybrid-models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LSTM Results */}
            {lstmResult && (
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    {lang === 'ar' ? 'تنبؤات LSTM المتقدمة' : 'Advanced LSTM Predictions'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'اتجاه الترند:' : 'Trend Direction:'}</span>
                      <Badge variant={lstmResult.trend_direction === 'up' ? 'default' : lstmResult.trend_direction === 'down' ? 'destructive' : 'secondary'}>
                        {lstmResult.trend_direction === 'up' ? '↗ صاعد' : lstmResult.trend_direction === 'down' ? '↘ هابط' : '↔ جانبي'}
                      </Badge>
                    </div>
                    
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lstmResult.sequence_predictions.map((pred, i) => ({ index: i, prediction: pred }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                          <Line type="monotone" dataKey="prediction" stroke="#00FF88" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CNN Results */}
            {cnnResult && (
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Eye className="h-5 w-5" />
                    {lang === 'ar' ? 'تحليل الأنماط البصرية CNN' : 'CNN Visual Pattern Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'الأنماط المكتشفة:' : 'Detected Patterns:'}</h4>
                      <div className="space-y-2">
                        {cnnResult.detected_patterns.map((pattern, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                            <span className="text-white">{pattern.pattern}</span>
                            <Badge variant={pattern.prediction === 'bullish' ? 'default' : pattern.prediction === 'bearish' ? 'destructive' : 'secondary'}>
                              {pattern.prediction === 'bullish' ? 'صاعد' : pattern.prediction === 'bearish' ? 'هابط' : 'محايد'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ensemble Results */}
          {ensembleResult && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Network className="h-5 w-5" />
                  {lang === 'ar' ? 'نتائج النماذج المجمعة' : 'Ensemble Model Results'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge 
                    variant={ensembleResult.consensus_prediction === 'bullish' ? 'default' : ensembleResult.consensus_prediction === 'bearish' ? 'destructive' : 'secondary'}
                    className="text-lg px-4 py-2"
                  >
                    {ensembleResult.consensus_prediction === 'bullish' ? 'صاعد' : ensembleResult.consensus_prediction === 'bearish' ? 'هابط' : 'محايد'}
                  </Badge>
                  <div className="text-sm text-gray-400 mt-2">
                    {lang === 'ar' ? 'الثقة:' : 'Confidence:'} {(ensembleResult.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* الذكاء التوليدي */}
        <TabsContent value="generative" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* السيناريوهات المولدة */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5" />
                  {lang === 'ar' ? 'السيناريوهات المولدة' : 'Generated Scenarios'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedScenarios.map((scenario, index) => (
                    <div key={scenario.id} className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant={scenario.type === 'bullish' ? 'default' : scenario.type === 'bearish' ? 'destructive' : 'secondary'}>
                          {scenario.type === 'bullish' ? 'صاعد' : scenario.type === 'bearish' ? 'هابط' : 'محايد'}
                        </Badge>
                        <span className="text-sm text-gray-400">{(scenario.probability * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-white text-sm mb-2">{scenario.description}</p>
                      <div className="text-xs text-gray-400">
                        الهدف المتوقع: ${scenario.priceTargets.expected.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* الاستراتيجية المولدة */}
            {generatedStrategy && (
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="h-5 w-5" />
                    {lang === 'ar' ? 'الاستراتيجية المولدة' : 'Generated Strategy'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{generatedStrategy.name}</h3>
                      <p className="text-gray-400 text-sm">{generatedStrategy.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">{lang === 'ar' ? 'العائد المتوقع:' : 'Expected Return:'}</span>
                        <div className="text-white font-bold">{generatedStrategy.expectedReturn.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">{lang === 'ar' ? 'مستوى المخاطر:' : 'Risk Level:'}</span>
                        <Badge variant={generatedStrategy.riskLevel === 'high' ? 'destructive' : generatedStrategy.riskLevel === 'medium' ? 'secondary' : 'default'}>
                          {generatedStrategy.riskLevel === 'high' ? 'عالي' : generatedStrategy.riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* الذكاء القابل للتفسير */}
        <TabsContent value="explainable" className="space-y-6">
          {decisionExplanation && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5" />
                  {lang === 'ar' ? 'تفسير القرار' : 'Decision Explanation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{lang === 'ar' ? 'القرار:' : 'Decision:'}</span>
                    <Badge variant="default">{decisionExplanation.decision}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{lang === 'ar' ? 'مستوى الثقة:' : 'Confidence:'}</span>
                    <span className="text-white">{(decisionExplanation.confidence * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'التبرير:' : 'Reasoning:'}</h4>
                    <p className="text-white text-sm">{decisionExplanation.reasoning}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'العوامل المؤثرة:' : 'Influencing Factors:'}</h4>
                    <div className="space-y-2">
                      {decisionExplanation.factors.map((factor, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">{factor.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm">{factor.value}</span>
                            <span className="text-xs text-gray-400">{(factor.impact * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* تحليل التحيز */}
          {biasAnalysis && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5" />
                  {lang === 'ar' ? 'تحليل التحيز' : 'Bias Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{lang === 'ar' ? 'التحيز العام:' : 'Overall Bias:'}</span>
                    <span className="text-white">{(biasAnalysis.overallBias * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'عوامل التحيز:' : 'Bias Factors:'}</h4>
                    <div className="space-y-2">
                      {biasAnalysis.biasFactors.map((factor, index) => (
                        <div key={index} className="p-2 bg-gray-800/50 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white text-sm">{factor.factor}</span>
                            <Badge variant={factor.severity === 'high' ? 'destructive' : factor.severity === 'medium' ? 'secondary' : 'default'}>
                              {factor.severity === 'high' ? 'عالي' : factor.severity === 'medium' ? 'متوسط' : 'منخفض'}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-xs">{factor.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* التعلم المستمر */}
        <TabsContent value="continuous" className="space-y-6">
          {learningMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5" />
                    {lang === 'ar' ? 'معدل التعلم' : 'Learning Rate'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{learningMetrics.learning_rate.toFixed(4)}</div>
                    <div className="text-sm text-gray-400">{lang === 'ar' ? 'التحديث الحالي' : 'Current Update'}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="h-5 w-5" />
                    {lang === 'ar' ? 'دقة النموذج' : 'Model Accuracy'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{(learningMetrics.model_accuracy * 100).toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">{lang === 'ar' ? 'الأداء الحالي' : 'Current Performance'}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5" />
                    {lang === 'ar' ? 'وقت التدريب' : 'Training Time'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{learningMetrics.training_time.toFixed(1)}s</div>
                    <div className="text-sm text-gray-400">{lang === 'ar' ? 'الدورة الأخيرة' : 'Last Cycle'}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* AutoML */}
        <TabsContent value="automl" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5" />
                {lang === 'ar' ? 'تحسين AutoML' : 'AutoML Optimization'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  {lang === 'ar' ? 'يقوم AutoML بتحسين النماذج تلقائياً لتحقيق أفضل أداء ممكن.' : 'AutoML automatically optimizes models for best possible performance.'}
                </p>
                
                <Button
                  onClick={runAutoMLOptimization}
                  disabled={loading}
                  className="w-full bg-trading-primary hover:bg-blue-600"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                  {loading ? (lang === 'ar' ? 'جاري التحسين...' : 'Optimizing...') : (lang === 'ar' ? 'تشغيل AutoML' : 'Run AutoML')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* محولات اللغة */}
        <TabsContent value="transformers" className="space-y-6">
          {transformerResult && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5" />
                  {lang === 'ar' ? 'تحليل محولات اللغة' : 'Transformer Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'التوقع:' : 'Prediction:'}</h4>
                    <p className="text-white">{transformerResult.prediction}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'مستوى الثقة:' : 'Confidence:'}</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={transformerResult.confidence * 100} className="flex-1" />
                      <span className="text-white">{(transformerResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'الكلمات المفتاحية:' : 'Key Tokens:'}</h4>
                    <div className="flex flex-wrap gap-2">
                      {transformerResult.attention_scores.slice(0, 5).map((token, index) => (
                        <Badge key={index} variant="outline">
                          {token.token} ({(token.score * 100).toFixed(1)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* التعلم المعزز */}
        <TabsContent value="reinforcement" className="space-y-6">
          {rlResult && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5" />
                  {lang === 'ar' ? 'نتائج التعلم المعزز' : 'Reinforcement Learning Results'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">{lang === 'ar' ? 'الإجراء الموصى به:' : 'Recommended Action:'}</span>
                      <div className="text-white font-bold">{rlResult.recommended_action}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">{lang === 'ar' ? 'مكافأة متوقعة:' : 'Expected Reward:'}</span>
                      <div className="text-white font-bold">{rlResult.expected_reward.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'قيم الإجراءات:' : 'Action Values:'}</h4>
                    <div className="space-y-2">
                      {Object.entries(rlResult.action_values).map(([action, value]) => (
                        <div key={action} className="flex justify-between items-center">
                          <span className="text-gray-400">{action}</span>
                          <span className="text-white">{value.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* الشبكات البيانية */}
        <TabsContent value="graph-neural" className="space-y-6">
          {graphResult && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Network className="h-5 w-5" />
                  {lang === 'ar' ? 'تحليل الشبكات البيانية' : 'Graph Neural Network Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'العقد المؤثرة:' : 'Influential Nodes:'}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {graphResult.node_importance.slice(0, 4).map((node, index) => (
                        <div key={index} className="p-2 bg-gray-800/50 rounded">
                          <div className="font-medium text-white">{node.node}</div>
                          <div className="text-sm text-gray-400">تأثير: {(node.importance * 100).toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-300 text-sm mb-2">{lang === 'ar' ? 'التوقع:' : 'Prediction:'}</h4>
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {graphResult.prediction}
                    </Badge>
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

export default AdvancedAIModels;
