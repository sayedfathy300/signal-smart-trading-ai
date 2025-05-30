
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Network, 
  Target, 
  Layers, 
  TrendingUp, 
  Eye,
  Zap,
  GitBranch,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { advancedAIModelsService } from '@/services/advancedAIModelsService';
import { marketDataService } from '@/services/marketDataService';

interface AdvancedAIModelsProps {
  lang?: 'en' | 'ar';
}

const AdvancedAIModels = ({ lang = 'ar' }: AdvancedAIModelsProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'transformer' | 'graph' | 'reinforcement' | 'ensemble' | 'lstm' | 'cnn'>('transformer');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [analysisText, setAnalysisText] = useState('Apple stock shows strong bullish momentum with positive earnings outlook.');

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'];
  
  useEffect(() => {
    runAIAnalysis();
  }, [selectedSymbol]);

  const runAIAnalysis = async () => {
    try {
      setLoading(true);
      console.log(`🤖 بدء التحليل الشامل للذكاء الاصطناعي لرمز ${selectedSymbol}...`);
      
      // الحصول على بيانات السوق
      const marketData = await marketDataService.getHistoricalData(selectedSymbol, '1h');
      
      // تشغيل جميع نماذج الذكاء الاصطناعي
      const results = await advancedAIModelsService.runComprehensiveAIAnalysis(
        selectedSymbol, 
        marketData, 
        analysisText
      );
      
      setAnalysisResults(results);
      console.log('✅ تم اكتمال التحليل الشامل بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تحليل الذكاء الاصطناعي:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Brain className="h-16 w-16 animate-pulse mx-auto text-trading-primary" />
          <div className="space-y-2">
            <p className="text-xl font-semibold text-white">
              {lang === 'ar' ? 'جاري تحليل نماذج الذكاء الاصطناعي المتقدمة...' : 'Analyzing Advanced AI Models...'}
            </p>
            <div className="space-y-1">
              <Progress value={33} className="w-64 mx-auto" />
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'معالجة النماذج العصبية والتعلم العميق...' : 'Processing neural networks and deep learning...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const modelStats = [
    { 
      icon: <Brain className="h-6 w-6 text-blue-400" />, 
      name: lang === 'ar' ? 'BERT للنصوص' : 'BERT Text Analysis', 
      accuracy: '94.2%', 
      status: 'active',
      model: 'transformer' as const
    },
    { 
      icon: <Network className="h-6 w-6 text-purple-400" />, 
      name: lang === 'ar' ? 'الشبكة البيانية' : 'Graph Neural Network', 
      accuracy: '88.7%', 
      status: 'active',
      model: 'graph' as const
    },
    { 
      icon: <Target className="h-6 w-6 text-green-400" />, 
      name: lang === 'ar' ? 'التعلم المعزز' : 'Reinforcement Learning', 
      accuracy: '91.5%', 
      status: 'training',
      model: 'reinforcement' as const
    },
    { 
      icon: <Layers className="h-6 w-6 text-yellow-400" />, 
      name: lang === 'ar' ? 'النماذج المجمعة' : 'Ensemble Models', 
      accuracy: '96.1%', 
      status: 'active',
      model: 'ensemble' as const
    },
    { 
      icon: <TrendingUp className="h-6 w-6 text-red-400" />, 
      name: lang === 'ar' ? 'LSTM/GRU' : 'LSTM/GRU', 
      accuracy: '89.3%', 
      status: 'active',
      model: 'lstm' as const
    },
    { 
      icon: <Eye className="h-6 w-6 text-orange-400" />, 
      name: lang === 'ar' ? 'CNN للأنماط' : 'CNN Pattern Recognition', 
      accuracy: '92.8%', 
      status: 'active',
      model: 'cnn' as const
    }
  ];

  const renderTransformerResults = () => {
    if (!analysisResults?.transformer) return null;
    const result = analysisResults.transformer;
    
    return (
      <div className="space-y-6">
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {lang === 'ar' ? 'تحليل النص المالي باستخدام BERT' : 'BERT Financial Text Analysis'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">
                {lang === 'ar' ? 'النص المحلل:' : 'Analyzed Text:'}
              </p>
              <p className="text-white">{result.text}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge className={
                  result.sentiment === 'positive' ? 'bg-green-500' :
                  result.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                }>
                  {result.sentiment}
                </Badge>
                <p className="text-sm text-gray-400 mt-1">
                  {lang === 'ar' ? 'المشاعر' : 'Sentiment'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-trading-primary">
                  {(result.score * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'الثقة' : 'Confidence'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {result.entities.length}
                </div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'الكيانات المكتشفة' : 'Entities Found'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">
                {lang === 'ar' ? 'الكلمات المفتاحية المالية:' : 'Financial Keywords:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline">{keyword}</Badge>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="text-white font-medium mb-2">
                {lang === 'ar' ? 'الملخص الذكي:' : 'AI Summary:'}
              </h4>
              <p className="text-gray-300">{result.summary}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGraphResults = () => {
    if (!analysisResults?.graph) return null;
    const result = analysisResults.graph;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Network className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{result.nodes.length}</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'العقد' : 'Nodes'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <GitBranch className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{result.edges.length}</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'الروابط' : 'Connections'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Layers className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{result.clusters.length}</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'المجموعات' : 'Clusters'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ar' ? 'رؤى الشبكة العصبية البيانية' : 'Graph Neural Network Insights'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderReinforcementResults = () => {
    if (!analysisResults?.reinforcement) return null;
    const result = analysisResults.reinforcement;
    
    const performanceData = [
      { metric: 'Total Return', value: result.performance_metrics.total_return, color: '#10B981' },
      { metric: 'Sharpe Ratio', value: result.performance_metrics.sharpe_ratio, color: '#3B82F6' },
      { metric: 'Max Drawdown', value: result.performance_metrics.max_drawdown, color: '#EF4444' },
      { metric: 'Win Rate', value: result.performance_metrics.win_rate * 100, color: '#F59E0B' }
    ];
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{result.action}</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'القرار' : 'Decision'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{(result.confidence * 100).toFixed(1)}%</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'الثقة' : 'Confidence'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{result.episodes_completed}</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'الحلقات' : 'Episodes'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Badge className={result.learning_phase === 'exploration' ? 'bg-yellow-500' : 'bg-green-500'}>
                {result.learning_phase}
              </Badge>
              <p className="text-sm text-gray-400 mt-2">
                {lang === 'ar' ? 'مرحلة التعلم' : 'Learning Phase'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ar' ? 'أداء وكيل التعلم المعزز' : 'Reinforcement Learning Agent Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="metric" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEnsembleResults = () => {
    if (!analysisResults?.ensemble) return null;
    const result = analysisResults.ensemble;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Badge className={
                result.consensus_prediction === 'bullish' ? 'bg-green-500' :
                result.consensus_prediction === 'bearish' ? 'bg-red-500' : 'bg-gray-500'
              }>
                {result.consensus_prediction}
              </Badge>
              <p className="text-sm text-gray-400 mt-2">
                {lang === 'ar' ? 'التنبؤ الإجماعي' : 'Consensus Prediction'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-trading-primary">
                {(result.confidence * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'ثقة النماذج' : 'Model Confidence'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {(result.volatility_forecast * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'التقلبات المتوقعة' : 'Volatility Forecast'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ar' ? 'أصوات النماذج المختلفة' : 'Individual Model Votes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.model_votes.map((vote: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{vote.model}</Badge>
                    <Badge className={
                      vote.prediction === 'bullish' ? 'bg-green-500' :
                      vote.prediction === 'bearish' ? 'bg-red-500' : 'bg-gray-500'
                    }>
                      {vote.prediction}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'الوزن:' : 'Weight:'} {(vote.weight * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-trading-primary">
                      {lang === 'ar' ? 'الدقة:' : 'Accuracy:'} {(vote.accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLSTMResults = () => {
    if (!analysisResults?.lstm) return null;
    const result = analysisResults.lstm;
    
    const chartData = result.sequence_predictions.map((price: number, index: number) => ({
      time: index + 1,
      prediction: price,
      upper: result.confidence_intervals.upper[index],
      lower: result.confidence_intervals.lower[index],
      volatility: result.volatility_forecast[index] * 100
    }));
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Badge className={
                result.trend_direction === 'up' ? 'bg-green-500' :
                result.trend_direction === 'down' ? 'bg-red-500' : 'bg-gray-500'
              }>
                {result.trend_direction}
              </Badge>
              <p className="text-sm text-gray-400 mt-2">
                {lang === 'ar' ? 'اتجاه الترند' : 'Trend Direction'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-white">
                {result.support_resistance.support_levels.length}
              </div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'مستويات الدعم' : 'Support Levels'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-white">
                {result.pattern_detected.length}
              </div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'الأنماط المكتشفة' : 'Detected Patterns'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ar' ? 'تنبؤات LSTM للأسعار' : 'LSTM Price Predictions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Area type="monotone" dataKey="upper" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} />
                <Area type="monotone" dataKey="prediction" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="lower" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ar' ? 'الأنماط المكتشفة' : 'Detected Patterns'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.pattern_detected.map((pattern: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">{pattern}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCNNResults = () => {
    if (!analysisResults?.cnn) return null;
    const result = analysisResults.cnn;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{result.detected_patterns.length}</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'الأنماط المرئية' : 'Visual Patterns'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{result.chart_features.candlestick_patterns.length}</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'أنماط الشموع' : 'Candlestick Patterns'}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{result.visual_similarity.length}</div>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'التشابه التاريخي' : 'Historical Similarity'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ar' ? 'الأنماط المرئية المكتشفة' : 'Detected Visual Patterns'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.detected_patterns.map((pattern: any, index: number) => (
                <div key={index} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{pattern.pattern}</Badge>
                    <Badge className={
                      pattern.prediction === 'bullish' ? 'bg-green-500' :
                      pattern.prediction === 'bearish' ? 'bg-red-500' : 'bg-gray-500'
                    }>
                      {pattern.prediction}
                    </Badge>
                  </div>
                  <Progress value={pattern.confidence * 100} className="mb-2" />
                  <p className="text-xs text-gray-400">
                    {lang === 'ar' ? 'الثقة:' : 'Confidence:'} {(pattern.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ar' ? 'التشابه مع الفترات التاريخية' : 'Historical Period Similarity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.visual_similarity.map((similarity: any, index: number) => (
                <div key={index} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{similarity.historical_period}</span>
                    <span className="text-sm text-trading-primary">
                      {(similarity.similarity_score * 100).toFixed(1)}% {lang === 'ar' ? 'تشابه' : 'similar'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{similarity.outcome}</p>
                  <Progress value={similarity.similarity_score * 100} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

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
              <Button onClick={runAIAnalysis} disabled={loading}>
                <Zap className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تحليل جديد' : 'New Analysis'}
              </Button>
            </div>
            <textarea
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              placeholder={lang === 'ar' ? 'أدخل نص للتحليل...' : 'Enter text for analysis...'}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg resize-none"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Model Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modelStats.map((model, index) => (
          <Card 
            key={index} 
            className={`bg-trading-card border-gray-800 cursor-pointer transition-all ${
              selectedModel === model.model ? 'border-trading-primary' : 'hover:border-gray-600'
            }`}
            onClick={() => setSelectedModel(model.model)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {model.icon}
                <div>
                  <h3 className="text-white font-medium">{model.name}</h3>
                  <Badge 
                    className={model.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}
                  >
                    {model.status}
                  </Badge>
                </div>
              </div>
              <div className="text-2xl font-bold text-trading-primary">{model.accuracy}</div>
              <p className="text-xs text-gray-400">
                {lang === 'ar' ? 'دقة النموذج' : 'Model Accuracy'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Model Results */}
      {analysisResults && (
        <Tabs value={selectedModel} onValueChange={(value) => setSelectedModel(value as any)}>
          <TabsList className="grid w-full grid-cols-6 bg-gray-800">
            <TabsTrigger value="transformer">BERT</TabsTrigger>
            <TabsTrigger value="graph">Graph</TabsTrigger>
            <TabsTrigger value="reinforcement">RL</TabsTrigger>
            <TabsTrigger value="ensemble">Ensemble</TabsTrigger>
            <TabsTrigger value="lstm">LSTM</TabsTrigger>
            <TabsTrigger value="cnn">CNN</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transformer">
            {renderTransformerResults()}
          </TabsContent>
          
          <TabsContent value="graph">
            {renderGraphResults()}
          </TabsContent>
          
          <TabsContent value="reinforcement">
            {renderReinforcementResults()}
          </TabsContent>
          
          <TabsContent value="ensemble">
            {renderEnsembleResults()}
          </TabsContent>
          
          <TabsContent value="lstm">
            {renderLSTMResults()}
          </TabsContent>
          
          <TabsContent value="cnn">
            {renderCNNResults()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedAIModels;
