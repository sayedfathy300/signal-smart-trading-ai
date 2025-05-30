
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
      // تحديث الواجهة مع النتائج
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
            {lang === 'ar' ? 'التعلم المستمر' : 'Continuous'
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
            {/* LSTM + CNN Results */}
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{lstmResult.support_resistance.support_levels.length}</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'مستويات الدعم' : 'Support Levels'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{lstmResult.support_resistance.resistance_levels.length}</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'مستويات المقاومة' : 'Resistance Levels'}</div>
                      </div>
                    </div>
                    
                    {lstmResult.pattern_detected.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'الأنماط المكتشفة:' : 'Detected Patterns:'}</h4>
                        <div className="flex flex-wrap gap-2">
                          {lstmResult.pattern_detected.map((pattern, index) => (
                            <Badge key={index} variant="outline">{pattern}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CNN Pattern Analysis */}
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
                            <div className="flex items-center gap-2">
                              <Badge variant={pattern.prediction === 'bullish' ? 'default' : pattern.prediction === 'bearish' ? 'destructive' : 'secondary'}>
                                {pattern.prediction === 'bullish' ? 'صاعد' : pattern.prediction === 'bearish' ? 'هابط' : 'محايد'}
                              </Badge>
                              <span className="text-sm text-gray-400">{(pattern.confidence * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'أنماط الشموع:' : 'Candlestick Patterns:'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {cnnResult.chart_features.candlestick_patterns.map((pattern, index) => (
                          <Badge key={index} variant="outline">{pattern}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    {cnnResult.visual_similarity.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'التشابه التاريخي:' : 'Historical Similarity:'}</h4>
                        <div className="space-y-2">
                          {cnnResult.visual_similarity.map((sim, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">{sim.historical_period}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white">{(sim.similarity_score * 100).toFixed(1)}%</span>
                                <span className="text-gray-400">{sim.outcome}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {ensembleResult.consensus_prediction === 'bullish' ? '↗' : ensembleResult.consensus_prediction === 'bearish' ? '↘' : '↔'}
                      </div>
                      <Badge 
                        variant={ensembleResult.consensus_prediction === 'bullish' ? 'default' : ensembleResult.consensus_prediction === 'bearish' ? 'destructive' : 'secondary'}
                        className="text-lg px-4 py-2"
                      >
                        {ensembleResult.consensus_prediction === 'bullish' ? 'صاعد' : ensembleResult.consensus_prediction === 'bearish' ? 'هابط' : 'محايد'}
                      </Badge>
                      <div className="text-sm text-gray-400 mt-2">
                        {lang === 'ar' ? 'الإجماع:' : 'Consensus:'} {(ensembleResult.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'عدم اليقين:' : 'Uncertainty:'}</span>
                        <span className="text-white">{(ensembleResult.uncertainty * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'التقلب المتوقع:' : 'Volatility Forecast:'}</span>
                        <span className="text-white">{(ensembleResult.volatility_forecast * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">{lang === 'ar' ? 'أصوات النماذج:' : 'Model Votes:'}</h4>
                    <div className="space-y-2">
                      {ensembleResult.model_votes.map((vote, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">{vote.model}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{vote.prediction}</Badge>
                            <span className="text-xs text-gray-500">{(vote.accuracy * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">{lang === 'ar' ? 'أهداف الأسعار:' : 'Price Targets:'}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-400">{lang === 'ar' ? 'صاعد:' : 'Bullish:'}</span>
                        <span className="text-white">${ensembleResult.price_targets.bullish.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-400">{lang === 'ar' ? 'هابط:' : 'Bearish:'}</span>
                        <span className="text-white">${ensembleResult.price_targets.bearish.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'محايد:' : 'Neutral:'}</span>
                        <span className="text-white">${ensembleResult.price_targets.neutral.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Graph Neural Networks */}
        <TabsContent value="graph-neural" className="space-y-6">
          {graphResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Network className="h-5 w-5" />
                    {lang === 'ar' ? 'تحليل الشبكة البيانية' : 'Graph Network Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{graphResult.nodes.length}</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'العقد' : 'Nodes'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{graphResult.edges.length}</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'الروابط' : 'Edges'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'العقد الرئيسية:' : 'Key Nodes:'}</h4>
                      <div className="space-y-2">
                        {graphResult.nodes.slice(0, 5).map((node, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-white">{node.label}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{node.type}</Badge>
                              <span className="text-sm text-gray-400">{node.connections} روابط</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="h-5 w-5" />
                    {lang === 'ar' ? 'المجموعات والرؤى' : 'Clusters & Insights'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'المجموعات:' : 'Clusters:'}</h4>
                      <div className="space-y-2">
                        {graphResult.clusters.map((cluster, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                            <span className="text-white">{cluster.id}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={cluster.risk_level === 'high' ? 'destructive' : cluster.risk_level === 'medium' ? 'secondary' : 'default'}>
                                {cluster.risk_level === 'high' ? 'عالي' : cluster.risk_level === 'medium' ? 'متوسط' : 'منخفض'}
                              </Badge>
                              <span className="text-sm text-gray-400">{cluster.members.length} أعضاء</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'الرؤى:' : 'Insights:'}</h4>
                      <div className="space-y-2">
                        {graphResult.insights.map((insight, index) => (
                          <div key={index} className="text-sm text-gray-300 p-2 bg-gray-800/30 rounded">
                            {insight}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Transformers */}
        <TabsContent value="transformers" className="space-y-6">
          {transformerResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MessageSquare className="h-5 w-5" />
                    {lang === 'ar' ? 'تحليل النصوص المالية' : 'Financial Text Analysis'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{lang === 'ar' ? 'المشاعر العامة:' : 'Overall Sentiment:'}</span>
                      <Badge 
                        variant={transformerResult.sentiment === 'positive' ? 'default' : transformerResult.sentiment === 'negative' ? 'destructive' : 'secondary'}
                      >
                        {transformerResult.sentiment === 'positive' ? 'إيجابي' : transformerResult.sentiment === 'negative' ? 'سلبي' : 'محايد'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'درجة الثقة:' : 'Confidence Score:'}</span>
                      <span className="text-white">{(transformerResult.score * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'الكيانات المكتشفة:' : 'Detected Entities:'}</h4>
                      <div className="space-y-2">
                        {transformerResult.entities.slice(0, 5).map((entity, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-white">{entity.entity}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{entity.label}</Badge>
                              <span className="text-sm text-gray-400">{(entity.confidence * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'الكلمات المفتاحية:' : 'Keywords:'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {transformerResult.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="h-5 w-5" />
                    {lang === 'ar' ? 'ملخص النص' : 'Text Summary'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-gray-300">{transformerResult.summary}</p>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'النص الأصلي:' : 'Original Text:'}
                    </div>
                    <div className="p-4 bg-gray-800/30 rounded-lg max-h-32 overflow-y-auto">
                      <p className="text-gray-400 text-sm">{transformerResult.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Reinforcement Learning */}
        <TabsContent value="reinforcement" className="space-y-6">
          {rlResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="h-5 w-5" />
                    {lang === 'ar' ? 'قرار التعلم المعزز' : 'Reinforcement Learning Decision'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {rlResult.action === 'BUY' ? '📈' : rlResult.action === 'SELL' ? '📉' : '⏸️'}
                      </div>
                      <Badge 
                        variant={rlResult.action === 'BUY' ? 'default' : rlResult.action === 'SELL' ? 'destructive' : 'secondary'}
                        className="text-lg px-4 py-2"
                      >
                        {rlResult.action === 'BUY' ? 'شراء' : rlResult.action === 'SELL' ? 'بيع' : 'انتظار'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{(rlResult.confidence * 100).toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'الثقة' : 'Confidence'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{rlResult.expected_reward.toFixed(2)}%</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'العائد المتوقع' : 'Expected Reward'}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'تقييم المخاطر:' : 'Risk Assessment:'}</span>
                        <span className="text-white">{(rlResult.risk_assessment * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'مرحلة التعلم:' : 'Learning Phase:'}</span>
                        <Badge variant="outline">
                          {rlResult.learning_phase === 'exploration' ? 'استكشاف' : 'استغلال'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'الحلقات المكتملة:' : 'Episodes Completed:'}</span>
                        <span className="text-white">{rlResult.episodes_completed}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    {lang === 'ar' ? 'مؤشرات الأداء' : 'Performance Metrics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-800/50 rounded">
                        <div className="text-lg font-bold text-white">{rlResult.performance_metrics.total_return.toFixed(2)}%</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'العائد الكلي' : 'Total Return'}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded">
                        <div className="text-lg font-bold text-white">{rlResult.performance_metrics.sharpe_ratio.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'نسبة شارب' : 'Sharpe Ratio'}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-800/50 rounded">
                        <div className="text-lg font-bold text-white">{(rlResult.performance_metrics.max_drawdown * 100).toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'أقصى انخفاض' : 'Max Drawdown'}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-800/50 rounded">
                        <div className="text-lg font-bold text-white">{(rlResult.performance_metrics.win_rate * 100).toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">{lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30">
                      <div className="text-sm text-blue-400 mb-1">{lang === 'ar' ? 'الاستراتيجية:' : 'Strategy:'}</div>
                      <div className="text-white">{rlResult.strategy}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Continuous Learning */}
        <TabsContent value="continuous" className="space-y-6">
          {learningMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5" />
                    {lang === 'ar' ? 'مؤشرات النظام' : 'System Metrics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'إجمالي النماذج:' : 'Total Models:'}</span>
                      <span className="text-white font-bold">{learningMetrics.totalModels}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'النماذج النشطة:' : 'Active Models:'}</span>
                      <span className="text-white font-bold">{learningMetrics.activeModels}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'متوسط الدقة:' : 'Average Accuracy:'}</span>
                      <span className="text-white font-bold">{(learningMetrics.averageAccuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'البيانات المعالجة:' : 'Data Processed:'}</span>
                      <span className="text-white font-bold">{learningMetrics.totalDataProcessed.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">{lang === 'ar' ? 'صحة النظام:' : 'System Health:'}</span>
                        <Badge variant={learningMetrics.systemHealth === 'excellent' ? 'default' : learningMetrics.systemHealth === 'good' ? 'secondary' : 'destructive'}>
                          {learningMetrics.systemHealth === 'excellent' ? 'ممتاز' : 
                           learningMetrics.systemHealth === 'good' ? 'جيد' : 
                           learningMetrics.systemHealth === 'warning' ? 'تحذير' : 'خطر'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Cpu className="h-5 w-5" />
                    {lang === 'ar' ? 'استخدام الموارد' : 'Resource Usage'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">CPU</span>
                        <span className="text-white">{learningMetrics.resourceUsage.cpu}%</span>
                      </div>
                      <Progress value={learningMetrics.resourceUsage.cpu} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">{lang === 'ar' ? 'الذاكرة' : 'Memory'}</span>
                        <span className="text-white">{learningMetrics.resourceUsage.memory}%</span>
                      </div>
                      <Progress value={learningMetrics.resourceUsage.memory} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">GPU</span>
                        <span className="text-white">{learningMetrics.resourceUsage.gpu}%</span>
                      </div>
                      <Progress value={learningMetrics.resourceUsage.gpu} className="h-2" />
                    </div>
                    
                    <div className="pt-2 text-sm text-gray-400">
                      {lang === 'ar' ? 'آخر تحسين:' : 'Last Optimization:'} {new Date(learningMetrics.lastOptimization).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    {lang === 'ar' ? 'اتجاه الأداء' : 'Performance Trend'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={learningMetrics.performanceTrend.accuracy.map((acc, i) => ({
                        time: i,
                        accuracy: acc * 100,
                        speed: learningMetrics.performanceTrend.speed[i]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Line type="monotone" dataKey="accuracy" stroke="#00FF88" strokeWidth={2} name="Accuracy %" />
                        <Line type="monotone" dataKey="speed" stroke="#60A5FA" strokeWidth={2} name="Speed" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Online Learning States */}
          {onlineLearningStates.length > 0 && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <RefreshCw className="h-5 w-5" />
                  {lang === 'ar' ? 'حالة التعلم المستمر' : 'Online Learning States'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onlineLearningStates.map((state, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-white">{state.modelName}</h4>
                        <div className="flex items-center gap-2">
                          {state.driftDetected && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {lang === 'ar' ? 'انحراف مكتشف' : 'Drift Detected'}
                            </Badge>
                          )}
                          <Badge variant={state.performanceTrend === 'improving' ? 'default' : state.performanceTrend === 'declining' ? 'destructive' : 'secondary'}>
                            {state.performanceTrend === 'improving' ? 'تحسن' : state.performanceTrend === 'declining' ? 'تراجع' : 'مستقر'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">{lang === 'ar' ? 'الدقة' : 'Accuracy'}</div>
                          <div className="text-white font-medium">{(state.accuracy * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">{lang === 'ar' ? 'البيانات المعالجة' : 'Data Processed'}</div>
                          <div className="text-white font-medium">{state.dataProcessed.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">{lang === 'ar' ? 'معدل التكيف' : 'Adaptation Rate'}</div>
                          <div className="text-white font-medium">{(state.adaptationRate * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">{lang === 'ar' ? 'استخدام الذاكرة' : 'Memory Usage'}</div>
                          <div className="text-white font-medium">{state.memoryUsage}MB</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-400">
                        {lang === 'ar' ? 'آخر تحديث:' : 'Last Update:'} {new Date(state.lastUpdate).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AutoML */}
        <TabsContent value="automl" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  {lang === 'ar' ? 'تحسين AutoML' : 'AutoML Optimization'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={runAutoMLOptimization}
                    disabled={loading}
                    className="w-full bg-trading-primary hover:bg-blue-600"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                    {loading ? (lang === 'ar' ? 'جاري التحسين...' : 'Optimizing...') : (lang === 'ar' ? 'تشغيل AutoML' : 'Run AutoML')}
                  </Button>
                  
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'معايير التحسين:' : 'Optimization Criteria:'}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'الدقة:' : 'Accuracy:'}</span>
                        <span className="text-white">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'السرعة:' : 'Speed:'}</span>
                        <span className="text-white">80%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'كفاءة الذاكرة:' : 'Memory Efficiency:'}</span>
                        <span className="text-white">75%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'المتانة:' : 'Robustness:'}</span>
                        <span className="text-white">90%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">{lang === 'ar' ? 'خوارزميات التحسين المتاحة:' : 'Available Optimization Algorithms:'}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-gray-300">Bayesian Optimization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-gray-300">Grid Search</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-gray-300">Random Search</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-gray-300">Genetic Algorithm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5" />
                  {lang === 'ar' ? 'اختيار النماذج' : 'Model Selection'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-green-400 font-medium">{lang === 'ar' ? 'النموذج المختار:' : 'Selected Model:'}</span>
                      <Badge variant="default">Ensemble_LSTM_XGBoost</Badge>
                    </div>
                    <div className="text-sm text-gray-300">
                      {lang === 'ar' ? 'نموذج مجمع يجمع بين LSTM و XGBoost لأفضل أداء' : 'Ensemble model combining LSTM and XGBoost for optimal performance'}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">{lang === 'ar' ? 'البدائل المتاحة:' : 'Available Alternatives:'}</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                        <span className="text-white">Pure_LSTM</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">88.7%</span>
                          <Badge variant="outline">سريع</Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                        <span className="text-white">Pure_XGBoost</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">90.1%</span>
                          <Badge variant="outline">دقيق</Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                        <span className="text-white">CNN_Hybrid</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">89.5%</span>
                          <Badge variant="outline">بصري</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm text-gray-400 mb-2">{lang === 'ar' ? 'أسباب الاختيار:' : 'Selection Reasons:'}</div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• {lang === 'ar' ? 'أفضل أداء على البيانات التاريخية' : 'Best performance on historical data'}</li>
                      <li>• {lang === 'ar' ? 'مقاومة عالية للتشويش' : 'High noise resistance'}</li>
                      <li>• {lang === 'ar' ? 'سرعة تنفيذ مقبولة' : 'Acceptable execution speed'}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Hyperparameter Optimization */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5" />
                {lang === 'ar' ? 'تحسين المعاملات الفائقة' : 'Hyperparameter Optimization'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">{lang === 'ar' ? 'أفضل المعاملات:' : 'Best Parameters:'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">learning_rate:</span>
                      <span className="text-white">0.08</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">n_estimators:</span>
                      <span className="text-white">175</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">max_depth:</span>
                      <span className="text-white">9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">subsample:</span>
                      <span className="text-white">0.85</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">{lang === 'ar' ? 'نتائج التحسين:' : 'Optimization Results:'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'أفضل نتيجة:' : 'Best Score:'}</span>
                      <span className="text-white">94.6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'التكرارات:' : 'Iterations:'}</span>
                      <span className="text-white">150</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'الوقت المستغرق:' : 'Time Elapsed:'}</span>
                      <span className="text-white">47m 27s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'حالة التقارب:' : 'Convergence:'}</span>
                      <Badge variant="default">متقارب</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">{lang === 'ar' ? 'تاريخ التحسن:' : 'Improvement History:'}</h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { iteration: 1, score: 85.6 },
                        { iteration: 25, score: 89.1 },
                        { iteration: 50, score: 92.3 },
                        { iteration: 100, score: 94.1 },
                        { iteration: 150, score: 94.6 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="iteration" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Line type="monotone" dataKey="score" stroke="#00FF88" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generative AI */}
        <TabsContent value="generative" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5" />
                  {lang === 'ar' ? 'توليد السيناريوهات' : 'Scenario Generation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30">
                    <h4 className="text-purple-400 font-medium mb-2">{lang === 'ar' ? 'سيناريو محاكي متقدم' : 'Advanced Simulated Scenario'}</h4>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'بناءً على البيانات الحالية، يتوقع النموذج التوليدي ارتفاعاً تدريجياً في السعر خلال الـ 5 أيام القادمة مع زيادة في الحجم وتحسن في المؤشرات الفنية.'
                        : 'Based on current data, the generative model predicts a gradual price increase over the next 5 days with increased volume and improved technical indicators.'
                      }
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300">{lang === 'ar' ? 'السيناريوهات المولدة:' : 'Generated Scenarios:'}</h4>
                    
                    <div className="space-y-2">
                      <div className="p-3 bg-green-900/20 rounded border border-green-500/30">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-green-400 font-medium">{lang === 'ar' ? 'سيناريو صعودي' : 'Bullish Scenario'}</span>
                          <Badge variant="default">70%</Badge>
                        </div>
                        <p className="text-sm text-gray-300">
                          {lang === 'ar' ? 'اختراق مستوى المقاومة عند $155 مع حجم عالي' : 'Breakthrough resistance at $155 with high volume'}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-yellow-400 font-medium">{lang === 'ar' ? 'سيناريو جانبي' : 'Sideways Scenario'}</span>
                          <Badge variant="secondary">25%</Badge>
                        </div>
                        <p className="text-sm text-gray-300">
                          {lang === 'ar' ? 'تذبذب بين $148-$152 لفترة توطيد' : 'Fluctuation between $148-$152 for consolidation'}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-red-900/20 rounded border border-red-500/30">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-red-400 font-medium">{lang === 'ar' ? 'سيناريو هبوطي' : 'Bearish Scenario'}</span>
                          <Badge variant="destructive">5%</Badge>
                        </div>
                        <p className="text-sm text-gray-300">
                          {lang === 'ar' ? 'كسر مستوى الدعم عند $145' : 'Breaking support level at $145'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5" />
                  {lang === 'ar' ? 'توليد الاستراتيجيات' : 'Strategy Generation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/30">
                    <h4 className="text-blue-400 font-medium mb-2">{lang === 'ar' ? 'استراتيجية مولدة ذكياً' : 'AI-Generated Strategy'}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'نوع الاستراتيجية:' : 'Strategy Type:'}</span>
                        <span className="text-white">Momentum Breakout</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'الإطار الزمني:' : 'Time Frame:'}</span>
                        <span className="text-white">4H</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'نقطة الدخول:' : 'Entry Point:'}</span>
                        <span className="text-white">$154.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'إيقاف الخسارة:' : 'Stop Loss:'}</span>
                        <span className="text-white">$150.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{lang === 'ar' ? 'جني الأرباح:' : 'Take Profit:'}</span>
                        <span className="text-white">$162.00</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'المبررات:' : 'Rationale:'}</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• {lang === 'ar' ? 'RSI يظهر زخم صعودي قوي' : 'RSI shows strong bullish momentum'}</li>
                      <li>• {lang === 'ar' ? 'كسر خط الاتجاه الهبوطي' : 'Breaking bearish trend line'}</li>
                      <li>• {lang === 'ar' ? 'حجم التداول في ازدياد' : 'Trading volume increasing'}</li>
                      <li>• {lang === 'ar' ? 'دعم قوي عند $150' : 'Strong support at $150'}</li>
                    </ul>
                  </div>
                  
                  <div className="pt-2">
                    <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      {lang === 'ar' ? 'توليد استراتيجية جديدة' : 'Generate New Strategy'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Synthetic Data Generation */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5" />
                {lang === 'ar' ? 'توليد البيانات الاصطناعية' : 'Synthetic Data Generation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">{lang === 'ar' ? 'البيانات المولدة:' : 'Generated Data:'}</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Array.from({ length: 30 }, (_, i) => ({
                        day: i + 1,
                        original: 150 + Math.sin(i * 0.2) * 10 + Math.random() * 5,
                        synthetic: 150 + Math.sin(i * 0.2) * 10 + Math.random() * 5 + 2
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Line type="monotone" dataKey="original" stroke="#60A5FA" strokeWidth={2} name="Original" />
                        <Line type="monotone" dataKey="synthetic" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Synthetic" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">{lang === 'ar' ? 'إحصائيات التوليد:' : 'Generation Statistics:'}</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-800/50 rounded">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">{lang === 'ar' ? 'جودة البيانات:' : 'Data Quality:'}</span>
                        <span className="text-white">94.2%</span>
                      </div>
                      <Progress value={94.2} className="h-2" />
                    </div>
                    
                    <div className="p-3 bg-gray-800/50 rounded">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">{lang === 'ar' ? 'التنوع:' : 'Diversity:'}</span>
                        <span className="text-white">87.8%</span>
                      </div>
                      <Progress value={87.8} className="h-2" />
                    </div>
                    
                    <div className="p-3 bg-gray-800/50 rounded">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">{lang === 'ar' ? 'الواقعية:' : 'Realism:'}</span>
                        <span className="text-white">91.5%</span>
                      </div>
                      <Progress value={91.5} className="h-2" />
                    </div>
                    
                    <div className="text-sm text-gray-400 pt-2">
                      {lang === 'ar' ? 'تم توليد 10,000 نقطة بيانات في 2.3 ثانية' : 'Generated 10,000 data points in 2.3 seconds'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Explainable AI */}
        <TabsContent value="explainable" className="space-y-6">
          {decisionExplanation && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Eye className="h-5 w-5" />
                    {lang === 'ar' ? 'شرح القرار' : 'Decision Explanation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {decisionExplanation.decision === 'BUY' ? '📈' : decisionExplanation.decision === 'SELL' ? '📉' : '⏸️'}
                      </div>
                      <Badge 
                        variant={decisionExplanation.decision === 'BUY' ? 'default' : decisionExplanation.decision === 'SELL' ? 'destructive' : 'secondary'}
                        className="text-lg px-4 py-2"
                      >
                        {decisionExplanation.decision === 'BUY' ? 'شراء' : decisionExplanation.decision === 'SELL' ? 'بيع' : 'انتظار'}
                      </Badge>
                      <div className="text-sm text-gray-400 mt-2">
                        {lang === 'ar' ? 'الثقة:' : 'Confidence:'} {(decisionExplanation.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'التفسير:' : 'Reasoning:'}</h4>
                      <p className="text-gray-300">{decisionExplanation.reasoning}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'العوامل المؤثرة:' : 'Influencing Factors:'}</h4>
                      <div className="space-y-2">
                        {decisionExplanation.factors.map((factor, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-white">{factor.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">{factor.value.toFixed(2)}</span>
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${factor.impact * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-900/20 rounded border border-blue-500/30">
                      <h4 className="text-blue-400 text-sm font-medium mb-1">{lang === 'ar' ? 'معلومات النموذج:' : 'Model Info:'}</h4>
                      <div className="text-sm text-gray-300">
                        {decisionExplanation.model.name} v{decisionExplanation.model.version} 
                        ({(decisionExplanation.model.accuracy * 100).toFixed(1)}% {lang === 'ar' ? 'دقة' : 'accuracy'})
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    {lang === 'ar' ? 'أهمية الميزات' : 'Feature Importance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={featureImportance} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis type="number" stroke="#9CA3AF" />
                          <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                          <Bar dataKey="importance" fill="#60A5FA" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'تفاصيل الميزات:' : 'Feature Details:'}</h4>
                      <div className="space-y-2">
                        {featureImportance.map((feature, index) => (
                          <div key={index} className="p-2 bg-gray-800/50 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white font-medium">{feature.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant={feature.direction === 'positive' ? 'default' : 'destructive'}>
                                  {feature.direction === 'positive' ? '↗' : '↘'}
                                </Badge>
                                <span className="text-sm text-gray-400">{(feature.importance * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Bias Analysis */}
          {biasAnalysis && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5" />
                  {lang === 'ar' ? 'تحليل التحيز' : 'Bias Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-white">{(biasAnalysis.overallBias * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-400">{lang === 'ar' ? 'التحيز العام' : 'Overall Bias'}</div>
                      <Progress value={biasAnalysis.overallBias * 100} className="h-2 mt-2" />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">{lang === 'ar' ? 'عوامل التحيز:' : 'Bias Factors:'}</h4>
                      <div className="space-y-3">
                        {biasAnalysis.biasFactors.map((factor, index) => (
                          <div key={index} className="p-3 bg-gray-800/50 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white">{factor.factor}</span>
                              <Badge variant={factor.severity === 'high' ? 'destructive' : factor.severity === 'medium' ? 'secondary' : 'default'}>
                                {factor.severity === 'high' ? 'عالي' : factor.severity === 'medium' ? 'متوسط' : 'منخفض'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">{lang === 'ar' ? 'درجة التحيز:' : 'Bias Level:'}</span>
                              <span className="text-white">{(factor.bias * 100).toFixed(1)}%</span>
                            </div>
                            <p className="text-xs text-gray-400">{factor.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">{lang === 'ar' ? 'مقاييس العدالة:' : 'Fairness Metrics:'}</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">{lang === 'ar' ? 'التكافؤ الديموغرافي:' : 'Demographic Parity:'}</span>
                          <span className="text-white">{(biasAnalysis.fairnessMetrics.demographicParity * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={biasAnalysis.fairnessMetrics.demographicParity * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">{lang === 'ar' ? 'تكافؤ الفرص:' : 'Equalized Odds:'}</span>
                          <span className="text-white">{(biasAnalysis.fairnessMetrics.equalizedOdds * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={biasAnalysis.fairnessMetrics.equalizedOdds * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">{lang === 'ar' ? 'المعايرة:' : 'Calibration:'}</span>
                          <span className="text-white">{(biasAnalysis.fairnessMetrics.calibration * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={biasAnalysis.fairnessMetrics.calibration * 100} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-900/20 rounded border border-green-500/30">
                      <h4 className="text-green-400 text-sm font-medium mb-2">{lang === 'ar' ? 'توصيات التحسين:' : 'Improvement Recommendations:'}</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• {lang === 'ar' ? 'تنويع مصادر البيانات' : 'Diversify data sources'}</li>
                        <li>• {lang === 'ar' ? 'تطبيق تقنيات إزالة التحيز' : 'Apply bias removal techniques'}</li>
                        <li>• {lang === 'ar' ? 'مراقبة مستمرة للأداء' : 'Continuous performance monitoring'}</li>
                        <li>• {lang === 'ar' ? 'تدقيق دوري للنتائج' : 'Regular result auditing'}</li>
                      </ul>
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

export default AdvancedAIModels;
