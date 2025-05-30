
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  Target,
  Cpu,
  Database,
  Timer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { 
  continuousLearningService, 
  ContinuousLearningMetrics,
  OnlineLearningState,
  AutoMLResult,
  ModelSelectionResult,
  HyperparameterOptimization
} from '@/services/continuousLearningService';
import { toast } from 'sonner';

interface ContinuousLearningProps {
  lang?: 'en' | 'ar';
}

const ContinuousLearning = ({ lang = 'ar' }: ContinuousLearningProps) => {
  const [metrics, setMetrics] = useState<ContinuousLearningMetrics | null>(null);
  const [onlineLearningStates, setOnlineLearningStates] = useState<OnlineLearningState[]>([]);
  const [autoMLResult, setAutoMLResult] = useState<AutoMLResult | null>(null);
  const [modelSelectionResult, setModelSelectionResult] = useState<ModelSelectionResult | null>(null);
  const [hyperparameterResult, setHyperparameterResult] = useState<HyperparameterOptimization | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContinuousLearningData();
  }, []);

  const loadContinuousLearningData = async () => {
    setLoading(true);
    try {
      const [metricsData, onlineStatesData] = await Promise.all([
        continuousLearningService.getContinuousLearningMetrics(),
        continuousLearningService.getAllOnlineLearningStates()
      ]);
      
      setMetrics(metricsData);
      setOnlineLearningStates(onlineStatesData);
    } catch (error) {
      console.error('خطأ في تحميل بيانات التعلم المستمر:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAutoML = async () => {
    setLoading(true);
    try {
      const result = await continuousLearningService.runAutoML('trading_data', 'price_direction');
      setAutoMLResult(result);
      toast.success('تم تشغيل AutoML بنجاح! 🤖');
    } catch (error) {
      toast.error('فشل في تشغيل AutoML');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelection = async () => {
    setLoading(true);
    try {
      const result = await continuousLearningService.selectOptimalModel({ accuracy: 0.9, speed: 0.8 });
      setModelSelectionResult(result);
      toast.success('تم اختيار النموذج الأمثل بنجاح! 🎯');
    } catch (error) {
      toast.error('فشل في اختيار النموذج');
    } finally {
      setLoading(false);
    }
  };

  const handleHyperparameterOptimization = async () => {
    setLoading(true);
    try {
      const result = await continuousLearningService.optimizeHyperparameters('xgboost', {});
      setHyperparameterResult(result);
      toast.success('تم تحسين المعاملات بنجاح! ⚙️');
    } catch (error) {
      toast.error('فشل في تحسين المعاملات');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ar-EG');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ar-EG');
  };

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'نظام التعلم المستمر المتقدم' : 'Advanced Continuous Learning System'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'تحسين وتطوير النماذج تلقائياً بناءً على البيانات الجديدة' : 'Automatic model optimization based on new data'}
          </p>
        </div>
        
        <Button
          onClick={loadContinuousLearningData}
          disabled={loading}
          className="bg-trading-primary hover:bg-blue-600"
        >
          <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'جاري التحديث...' : 'تحديث البيانات'}
        </Button>
      </div>

      {/* الإحصائيات العامة */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{metrics.totalModels}</div>
                  <div className="text-sm text-gray-400">إجمالي النماذج</div>
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
                    {(metrics.averageAccuracy * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">متوسط الدقة</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(metrics.totalDataProcessed)}
                  </div>
                  <div className="text-sm text-gray-400">البيانات المعالجة</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {getHealthIcon(metrics.systemHealth)}
                <div>
                  <div className={cn("text-lg font-bold", getHealthColor(metrics.systemHealth))}>
                    {metrics.systemHealth === 'excellent' ? 'ممتاز' :
                     metrics.systemHealth === 'good' ? 'جيد' :
                     metrics.systemHealth === 'warning' ? 'تحذير' : 'حرج'}
                  </div>
                  <div className="text-sm text-gray-400">حالة النظام</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="online-learning">التعلم المباشر</TabsTrigger>
          <TabsTrigger value="automl">AutoML</TabsTrigger>
          <TabsTrigger value="model-selection">اختيار النماذج</TabsTrigger>
          <TabsTrigger value="hyperparameters">تحسين المعاملات</TabsTrigger>
        </TabsList>

        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-6">
          {metrics && (
            <>
              {/* رسم الأداء */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">اتجاه الأداء</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.performanceTrend.accuracy.map((acc, idx) => ({
                        time: new Date(metrics.performanceTrend.timestamps[idx]).toLocaleTimeString(),
                        accuracy: acc * 100,
                        speed: metrics.performanceTrend.speed[idx]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="accuracy" 
                          stroke="#22C55E" 
                          strokeWidth={2}
                          name="الدقة %"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="speed" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          name="السرعة"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* استخدام الموارد */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">معالج CPU</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">الاستخدام</span>
                        <span className="text-white">{metrics.resourceUsage.cpu}%</span>
                      </div>
                      <Progress value={metrics.resourceUsage.cpu} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">الذاكرة RAM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">الاستخدام</span>
                        <span className="text-white">{metrics.resourceUsage.memory}%</span>
                      </div>
                      <Progress value={metrics.resourceUsage.memory} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">معالج الرسوميات GPU</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">الاستخدام</span>
                        <span className="text-white">{metrics.resourceUsage.gpu}%</span>
                      </div>
                      <Progress value={metrics.resourceUsage.gpu} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* التعلم المباشر */}
        <TabsContent value="online-learning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {onlineLearningStates.map((state, index) => (
              <Card key={index} className="bg-trading-card border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{state.modelName}</CardTitle>
                    <div className="flex items-center gap-2">
                      {state.driftDetected && (
                        <Badge variant="destructive" className="bg-yellow-600">
                          انحراف مكتشف
                        </Badge>
                      )}
                      <Badge 
                        variant={state.performanceTrend === 'improving' ? 'default' : 
                                state.performanceTrend === 'stable' ? 'secondary' : 'destructive'}
                        className={
                          state.performanceTrend === 'improving' ? 'bg-trading-up' :
                          state.performanceTrend === 'stable' ? 'bg-blue-600' : 'bg-trading-down'
                        }
                      >
                        {state.performanceTrend === 'improving' ? 'محسن' :
                         state.performanceTrend === 'stable' ? 'مستقر' : 'متراجع'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* مؤشرات الأداء */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-trading-up">
                          {(state.accuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">الدقة</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-white">
                          {formatNumber(state.dataProcessed)}
                        </div>
                        <div className="text-xs text-gray-400">البيانات المعالجة</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-blue-400">
                          {(state.adaptationRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">معدل التكيف</div>
                      </div>
                      <div className="text-center p-2 bg-trading-secondary rounded">
                        <div className="text-lg font-bold text-purple-400">
                          {state.memoryUsage} MB
                        </div>
                        <div className="text-xs text-gray-400">استخدام الذاكرة</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400">
                      آخر تحديث: {formatDate(state.lastUpdate)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AutoML */}
        <TabsContent value="automl" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-400" />
                تشغيل AutoML
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  AutoML يقوم بتجربة عدة نماذج تلقائياً واختيار الأفضل منها
                </p>
                
                <Button 
                  onClick={handleRunAutoML}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {loading ? 'جاري التشغيل...' : 'تشغيل AutoML'}
                </Button>

                {autoMLResult && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">نتائج AutoML</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-trading-secondary rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-trading-up">
                            {autoMLResult.bestModel}
                          </div>
                          <div className="text-sm text-gray-400">أفضل نموذج</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-trading-secondary rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {(autoMLResult.accuracy * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-400">الدقة</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-trading-secondary rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {autoMLResult.trainingTime}s
                          </div>
                          <div className="text-sm text-gray-400">وقت التدريب</div>
                        </div>
                      </div>
                    </div>

                    {/* التوصيات */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-white">التوصيات:</h4>
                      <ul className="space-y-1">
                        {autoMLResult.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* اختيار النماذج */}
        <TabsContent value="model-selection" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-trading-up" />
                اختيار النموذج الأمثل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  يقوم النظام بتقييم النماذج المختلفة واختيار الأنسب حسب المعايير المحددة
                </p>
                
                <Button 
                  onClick={handleModelSelection}
                  disabled={loading}
                  className="bg-trading-up hover:bg-green-600"
                >
                  <Target className="h-4 w-4 mr-2" />
                  {loading ? 'جاري الاختيار...' : 'اختيار النموذج الأمثل'}
                </Button>

                {modelSelectionResult && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">النموذج المختار</h3>
                    
                    <div className="p-4 bg-trading-secondary rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-trading-up">
                          {modelSelectionResult.selectedModel}
                        </span>
                        <Badge className="bg-trading-up">
                          ثقة: {(modelSelectionResult.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-bold text-white">أسباب الاختيار:</h4>
                        <ul className="space-y-1">
                          {modelSelectionResult.reasons.map((reason, idx) => (
                            <li key={idx} className="text-gray-300 text-sm">• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* البدائل */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-white">البدائل المتاحة:</h4>
                      {modelSelectionResult.alternatives.map((alt, idx) => (
                        <div key={idx} className="p-3 bg-gray-800 rounded border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{alt.model}</span>
                            <Badge variant="outline" className="border-gray-600">
                              {(alt.score * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-400">المميزات: </span>
                              <span className="text-green-400">{alt.pros.join(', ')}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">العيوب: </span>
                              <span className="text-red-400">{alt.cons.join(', ')}</span>
                            </div>
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

        {/* تحسين المعاملات */}
        <TabsContent value="hyperparameters" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                تحسين المعاملات الفائقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  تحسين معاملات النموذج للحصول على أفضل أداء ممكن
                </p>
                
                <Button 
                  onClick={handleHyperparameterOptimization}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {loading ? 'جاري التحسين...' : 'تحسين المعاملات'}
                </Button>

                {hyperparameterResult && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">نتائج التحسين</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-trading-secondary rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {hyperparameterResult.algorithm}
                          </div>
                          <div className="text-sm text-gray-400">خوارزمية التحسين</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-trading-secondary rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-trading-up">
                            {(hyperparameterResult.bestScore * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-400">أفضل نتيجة</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-trading-secondary rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {hyperparameterResult.iterations}
                          </div>
                          <div className="text-sm text-gray-400">التكرارات</div>
                        </div>
                      </div>
                    </div>

                    {/* تاريخ التحسين */}
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={hyperparameterResult.improvementHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="iteration" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            name="النتيجة"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* أفضل معاملات */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-white">أفضل معاملات:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(hyperparameterResult.bestParams).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-trading-secondary rounded">
                            <span className="text-gray-400">{key}:</span>
                            <span className="text-white font-mono">{JSON.stringify(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContinuousLearning;
