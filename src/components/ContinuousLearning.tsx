
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Target, 
  Settings, 
  TrendingUp,
  Activity,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Cpu,
  Database,
  GitBranch
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  continuousLearningService,
  type AutoMLResult,
  type OnlineLearningState,
  type ModelSelectionResult,
  type HyperparameterOptimization,
  type ContinuousLearningMetrics
} from '@/services/continuousLearningService';

interface ContinuousLearningProps {
  lang?: 'en' | 'ar';
}

const ContinuousLearning = ({ lang = 'ar' }: ContinuousLearningProps) => {
  const [metrics, setMetrics] = useState<ContinuousLearningMetrics | null>(null);
  const [onlineLearningStates, setOnlineLearningStates] = useState<Map<string, OnlineLearningState>>(new Map());
  const [autoMLResult, setAutoMLResult] = useState<AutoMLResult | null>(null);
  const [modelSelection, setModelSelection] = useState<ModelSelectionResult | null>(null);
  const [hyperparameterOpt, setHyperparameterOpt] = useState<HyperparameterOptimization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadContinuousLearningData();
    
    // تحديث البيانات كل 30 ثانية
    const interval = setInterval(loadContinuousLearningData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadContinuousLearningData = async () => {
    try {
      setLoading(true);
      console.log('🧠 تحميل بيانات التعلم المستمر...');
      
      const [metricsData, statesData] = await Promise.all([
        continuousLearningService.getContinuousLearningMetrics(),
        continuousLearningService.getAllOnlineLearningStates()
      ]);
      
      setMetrics(metricsData);
      setOnlineLearningStates(statesData);
      
    } catch (error) {
      console.error('خطأ في تحميل بيانات التعلم المستمر:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAutoML = async () => {
    try {
      console.log('🤖 بدء AutoML...');
      
      // بيانات تجريبية للتدريب
      const mockDataset = Array.from({ length: 1000 }, (_, i) => ({
        feature1: Math.random() * 100,
        feature2: Math.random() * 50,
        feature3: Math.random() * 200,
        target: Math.random() > 0.5 ? 1 : 0
      }));
      
      const result = await continuousLearningService.runAutoML(mockDataset, 'target');
      setAutoMLResult(result);
      
    } catch (error) {
      console.error('خطأ في AutoML:', error);
    }
  };

  const runModelSelection = async () => {
    try {
      console.log('🎯 بدء اختيار النموذج...');
      
      const candidateModels = Array.from(onlineLearningStates.keys());
      const result = await continuousLearningService.selectOptimalModel(candidateModels);
      setModelSelection(result);
      
    } catch (error) {
      console.error('خطأ في اختيار النموذج:', error);
    }
  };

  const runHyperparameterOptimization = async () => {
    try {
      console.log('⚙️ بدء تحسين المعاملات الفائقة...');
      
      const mockDataset = Array.from({ length: 500 }, () => ({
        x: Math.random(),
        y: Math.random()
      }));
      
      const result = await continuousLearningService.optimizeHyperparameters(
        'LSTM',
        mockDataset,
        'bayesian'
      );
      setHyperparameterOpt(result);
      
    } catch (error) {
      console.error('خطأ في تحسين المعاملات:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-pulse mx-auto mb-2 text-trading-primary" />
          <p className="text-gray-400">
            {lang === 'ar' ? 'جاري تحميل نظام التعلم المستمر...' : 'Loading continuous learning system...'}
          </p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-gray-400">
        {lang === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available'}
      </div>
    );
  }

  // إعداد بيانات الرسوم البيانية
  const performanceTrendsData = metrics.performance_trends.slice(-20).map((trend, index) => ({
    time: index + 1,
    accuracy: trend.accuracy * 100,
    latency: trend.latency,
    throughput: trend.throughput / 1000,
    memory: trend.memory_usage * 100
  }));

  const systemHealthData = [
    { name: lang === 'ar' ? 'حداثة النماذج' : 'Model Freshness', value: metrics.system_health.model_freshness * 100, color: '#10B981' },
    { name: lang === 'ar' ? 'دقة التنبؤ' : 'Prediction Accuracy', value: metrics.system_health.prediction_accuracy * 100, color: '#3B82F6' },
    { name: lang === 'ar' ? 'سرعة التكيف' : 'Adaptation Speed', value: metrics.system_health.adaptation_speed * 100, color: '#8B5CF6' },
    { name: lang === 'ar' ? 'استخدام الموارد' : 'Resource Usage', value: metrics.system_health.resource_usage * 100, color: '#F59E0B' }
  ];

  const onlineLearningData = Array.from(onlineLearningStates.entries()).map(([modelId, state]) => ({
    model: modelId.split('_')[0].toUpperCase(),
    accuracy: state.performance_metrics.current_accuracy * 100,
    samples: state.samples_processed,
    driftScore: state.performance_metrics.drift_score * 100,
    adaptationRate: state.adaptation_rate * 100
  }));

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'النماذج المدربة' : 'Models Trained'}
                </p>
                <p className="text-xl font-bold text-white">{metrics.learning_statistics.models_trained}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'نقاط البيانات' : 'Data Points'}
                </p>
                <p className="text-xl font-bold text-white">
                  {(metrics.learning_statistics.data_points_processed / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'انحرافات مكتشفة' : 'Drifts Detected'}
                </p>
                <p className="text-xl font-bold text-white">{metrics.learning_statistics.concept_drifts_detected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'إعادة التدريب التلقائي' : 'Auto Retrains'}
                </p>
                <p className="text-xl font-bold text-white">{metrics.learning_statistics.auto_retrains}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Score */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {lang === 'ar' ? 'صحة النظام الشاملة' : 'Overall System Health'}
            <Badge className={
              metrics.system_health.overall_score > 0.8 ? 'bg-green-500' :
              metrics.system_health.overall_score > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
            }>
              {(metrics.system_health.overall_score * 100).toFixed(1)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {systemHealthData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{item.name}</span>
                  <span className="text-sm text-white font-medium">{item.value.toFixed(1)}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview">{lang === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="automl">AutoML</TabsTrigger>
          <TabsTrigger value="online">{lang === 'ar' ? 'التعلم المباشر' : 'Online Learning'}</TabsTrigger>
          <TabsTrigger value="optimization">{lang === 'ar' ? 'التحسين' : 'Optimization'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {lang === 'ar' ? 'اتجاهات الأداء' : 'Performance Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy %" />
                    <Line type="monotone" dataKey="latency" stroke="#F59E0B" strokeWidth={2} name="Latency (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Online Learning Models */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {lang === 'ar' ? 'النماذج النشطة' : 'Active Models'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={onlineLearningData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="model" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="accuracy" fill="#3B82F6" name="Accuracy %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automl" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {lang === 'ar' ? 'التعلم الآلي التلقائي' : 'Automated Machine Learning'}
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={runAutoML} size="sm" className="bg-trading-primary">
                  {lang === 'ar' ? 'تشغيل AutoML' : 'Run AutoML'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {autoMLResult ? (
                <div className="space-y-6">
                  {/* Best Model */}
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {lang === 'ar' ? 'أفضل نموذج' : 'Best Model'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">النموذج</p>
                        <p className="text-white font-medium">{autoMLResult.best_model.model_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">الدقة</p>
                        <p className="text-white font-medium">{(autoMLResult.best_model.performance.accuracy * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">F1 Score</p>
                        <p className="text-white font-medium">{autoMLResult.best_model.performance.f1_score.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">AUC</p>
                        <p className="text-white font-medium">{autoMLResult.best_model.performance.auc.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Model Comparison */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {lang === 'ar' ? 'مقارنة النماذج' : 'Model Comparison'}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={autoMLResult.model_comparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="model_type" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                          labelStyle={{ color: '#F3F4F6' }}
                        />
                        <Bar dataKey="score" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {lang === 'ar' ? 'اضغط على "تشغيل AutoML" لبدء التحليل' : 'Click "Run AutoML" to start analysis'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="online" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {lang === 'ar' ? 'التعلم المباشر والتكيف' : 'Online Learning & Adaptation'}
            </h2>
            <Button onClick={runModelSelection} size="sm" className="bg-trading-primary">
              {lang === 'ar' ? 'اختيار النموذج الأمثل' : 'Select Optimal Model'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from(onlineLearningStates.entries()).map(([modelId, state]) => (
              <Card key={modelId} className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    <span>{modelId.replace('_', ' ').toUpperCase()}</span>
                    <Badge className={state.concept_drift_detected ? 'bg-red-500' : 'bg-green-500'}>
                      {state.concept_drift_detected ? 'Drift Detected' : 'Stable'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">الدقة الحالية</span>
                      <span className="text-white">{(state.performance_metrics.current_accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">العينات المعالجة</span>
                      <span className="text-white">{state.samples_processed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">معدل التكيف</span>
                      <span className="text-white">{(state.adaptation_rate * 100).toFixed(3)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">آخر تحديث</span>
                      <span className="text-white text-xs">
                        {state.last_update.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {modelSelection && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {lang === 'ar' ? 'نتيجة اختيار النموذج' : 'Model Selection Result'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">النموذج المختار</h3>
                    <p className="text-lg font-bold text-white">{modelSelection.selected_model}</p>
                    <p className="text-sm text-gray-300 mt-1">
                      الثقة: {(modelSelection.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">سبب الاختيار</h3>
                    <p className="text-sm text-gray-300">{modelSelection.selection_reason}</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">التقييم التالي</h3>
                    <p className="text-sm text-gray-300">
                      {modelSelection.next_evaluation.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {lang === 'ar' ? 'تحسين المعاملات الفائقة' : 'Hyperparameter Optimization'}
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={runHyperparameterOptimization} size="sm" className="bg-trading-primary">
                  {lang === 'ar' ? 'تشغيل التحسين' : 'Run Optimization'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {hyperparameterOpt ? (
                <div className="space-y-6">
                  {/* Optimization Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400">الطريقة</p>
                      <p className="text-white font-medium">{hyperparameterOpt.optimization_method}</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400">أفضل نتيجة</p>
                      <p className="text-white font-medium">{hyperparameterOpt.convergence_info.best_score.toFixed(4)}</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400">التكرارات</p>
                      <p className="text-white font-medium">{hyperparameterOpt.convergence_info.iterations}</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-400">التقارب</p>
                      <Badge className={hyperparameterOpt.convergence_info.converged ? 'bg-green-500' : 'bg-yellow-500'}>
                        {hyperparameterOpt.convergence_info.converged ? 'مكتمل' : 'جاري'}
                      </Badge>
                    </div>
                  </div>

                  {/* Optimization History */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {lang === 'ar' ? 'تاريخ التحسين' : 'Optimization History'}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={hyperparameterOpt.optimization_history.slice(-50)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="iteration" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                          labelStyle={{ color: '#F3F4F6' }}
                        />
                        <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} name="Score" />
                        <Line type="monotone" dataKey="validation_score" stroke="#3B82F6" strokeWidth={2} name="Validation" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Parameter Importance */}
                  {hyperparameterOpt.parameter_importance.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        {lang === 'ar' ? 'أهمية المعاملات' : 'Parameter Importance'}
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={hyperparameterOpt.parameter_importance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="parameter" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                            labelStyle={{ color: '#F3F4F6' }}
                          />
                          <Bar dataKey="importance" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {lang === 'ar' ? 'اضغط على "تشغيل التحسين" لبدء تحسين المعاملات' : 'Click "Run Optimization" to start hyperparameter tuning'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContinuousLearning;
