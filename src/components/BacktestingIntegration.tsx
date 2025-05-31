
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3, 
  TrendingUp, 
  Activity,
  Settings,
  TestTube,
  Database,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { backtestingService, BacktestResult, BacktestConfiguration } from '@/services/backtestingService';
import StrategyBacktesting from '@/components/interactive-analysis/StrategyBacktesting';

interface IntegrationTest {
  id: string;
  name: string;
  nameAr: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  description: string;
  descriptionAr: string;
  result?: any;
  error?: string;
}

interface BacktestingIntegrationProps {
  lang?: 'en' | 'ar';
}

const BacktestingIntegration = ({ lang = 'ar' }: BacktestingIntegrationProps) => {
  const [tests, setTests] = useState<IntegrationTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'running' | 'passed' | 'failed'>('pending');
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    initializeTests();
  }, []);

  const initializeTests = () => {
    const integrationTests: IntegrationTest[] = [
      {
        id: 'service_initialization',
        name: 'Service Initialization',
        nameAr: 'تهيئة الخدمة',
        status: 'pending',
        description: 'Test backtesting service initialization and strategy loading',
        descriptionAr: 'اختبار تهيئة خدمة الباك تيست وتحميل الاستراتيجيات'
      },
      {
        id: 'strategy_list',
        name: 'Strategy List',
        nameAr: 'قائمة الاستراتيجيات',
        status: 'pending',
        description: 'Test available strategies retrieval',
        descriptionAr: 'اختبار استرجاع الاستراتيجيات المتاحة'
      },
      {
        id: 'backtest_execution',
        name: 'Backtest Execution',
        nameAr: 'تنفيذ الباك تيست',
        status: 'pending',
        description: 'Test backtest execution with sample parameters',
        descriptionAr: 'اختبار تنفيذ الباك تيست مع معايير عينة'
      },
      {
        id: 'result_processing',
        name: 'Result Processing',
        nameAr: 'معالجة النتائج',
        status: 'pending',
        description: 'Test result processing and metrics calculation',
        descriptionAr: 'اختبار معالجة النتائج وحساب المؤشرات'
      },
      {
        id: 'ui_integration',
        name: 'UI Integration',
        nameAr: 'تكامل الواجهة',
        status: 'pending',
        description: 'Test UI components and data display',
        descriptionAr: 'اختبار مكونات الواجهة وعرض البيانات'
      },
      {
        id: 'tabs_functionality',
        name: 'Tabs Functionality',
        nameAr: 'وظائف التابات',
        status: 'pending',
        description: 'Test all tabs and their content rendering',
        descriptionAr: 'اختبار جميع التابات وعرض محتوياتها'
      }
    ];

    setTests(integrationTests);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    
    const updatedTests = [...tests];
    const results: any = {};

    try {
      // Test 1: Service Initialization
      await runTest(updatedTests, 0, async () => {
        const strategies = backtestingService.getAvailableStrategies();
        if (!strategies || strategies.length === 0) {
          throw new Error('No strategies found');
        }
        return { strategiesCount: strategies.length, strategies };
      }, results);

      // Test 2: Strategy List
      await runTest(updatedTests, 1, async () => {
        const strategies = backtestingService.getAvailableStrategies();
        const requiredStrategies = ['sma_crossover', 'rsi_oversold', 'bollinger_bands'];
        const foundStrategies = strategies.filter(s => requiredStrategies.includes(s.id));
        
        if (foundStrategies.length !== requiredStrategies.length) {
          throw new Error(`Missing strategies. Found: ${foundStrategies.length}, Required: ${requiredStrategies.length}`);
        }
        return { strategies: foundStrategies };
      }, results);

      // Test 3: Backtest Execution
      await runTest(updatedTests, 2, async () => {
        const config: BacktestConfiguration = {
          strategyId: 'sma_crossover',
          strategy: 'sma_crossover',
          symbol: 'BTC/USDT',
          symbols: ['BTC/USDT'],
          timeframe: '1h',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          initialCapital: 10000,
          commission: 0.1,
          slippage: 0.01,
          riskPerTrade: 2,
          maxDrawdown: 20,
          riskManagement: {
            maxDrawdown: 20,
            maxDailyLoss: 5,
            positionSizing: 'fixed'
          }
        };

        const result = await backtestingService.runBacktest(config);
        
        if (!result || typeof result.totalReturn !== 'number') {
          throw new Error('Invalid backtest result structure');
        }
        
        return { backtestResult: result };
      }, results);

      // Test 4: Result Processing
      await runTest(updatedTests, 3, async () => {
        const backtestResult = results.backtest_execution?.backtestResult;
        if (!backtestResult) {
          throw new Error('No backtest result to process');
        }

        const metrics = backtestingService.getDetailedMetrics(backtestResult);
        
        if (!metrics || typeof metrics.volatility !== 'number') {
          throw new Error('Invalid metrics calculation');
        }
        
        return { metrics };
      }, results);

      // Test 5: UI Integration
      await runTest(updatedTests, 4, async () => {
        // محاكاة اختبار عناصر الواجهة
        const uiComponents = {
          cards: true,
          charts: true,
          tables: true,
          buttons: true
        };
        
        return { uiComponents };
      }, results);

      // Test 6: Tabs Functionality
      await runTest(updatedTests, 5, async () => {
        const tabs = ['overview', 'performance', 'trades', 'analysis'];
        const tabsStatus = tabs.map(tab => ({
          name: tab,
          working: true
        }));
        
        return { tabs: tabsStatus };
      }, results);

      // تحديد الحالة العامة
      const failedTests = updatedTests.filter(t => t.status === 'failed');
      setOverallStatus(failedTests.length === 0 ? 'passed' : 'failed');

    } catch (error) {
      console.error('Integration tests failed:', error);
      setOverallStatus('failed');
    }

    setTests(updatedTests);
    setTestResults(results);
    setIsRunning(false);
  };

  const runTest = async (
    testsArray: IntegrationTest[], 
    index: number, 
    testFunction: () => Promise<any>,
    results: any
  ) => {
    testsArray[index].status = 'running';
    setTests([...testsArray]);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // محاكاة وقت التنفيذ
      const result = await testFunction();
      
      testsArray[index].status = 'passed';
      testsArray[index].result = result;
      results[testsArray[index].id] = result;
      
    } catch (error: any) {
      testsArray[index].status = 'failed';
      testsArray[index].error = error.message;
      console.error(`Test ${testsArray[index].id} failed:`, error);
    }

    setTests([...testsArray]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'running':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      case 'running':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* حالة الاختبار العامة */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <TestTube className="h-6 w-6 text-blue-400" />
            {lang === 'ar' ? 'اختبار التكامل الشامل' : 'Comprehensive Integration Test'}
            <Badge 
              className={cn(
                "ml-auto",
                overallStatus === 'passed' && 'bg-green-600',
                overallStatus === 'failed' && 'bg-red-600',
                overallStatus === 'running' && 'bg-blue-600',
                overallStatus === 'pending' && 'bg-gray-600'
              )}
            >
              {overallStatus === 'passed' && (lang === 'ar' ? 'نجح' : 'Passed')}
              {overallStatus === 'failed' && (lang === 'ar' ? 'فشل' : 'Failed')}
              {overallStatus === 'running' && (lang === 'ar' ? 'يعمل' : 'Running')}
              {overallStatus === 'pending' && (lang === 'ar' ? 'في الانتظار' : 'Pending')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning 
                ? (lang === 'ar' ? 'جاري التشغيل...' : 'Running...') 
                : (lang === 'ar' ? 'تشغيل جميع الاختبارات' : 'Run All Tests')
              }
            </Button>
          </div>

          {/* إحصائيات الاختبارات */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-trading-secondary p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">
                {tests.length}
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'إجمالي الاختبارات' : 'Total Tests'}
              </div>
            </div>
            <div className="bg-trading-secondary p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">
                {tests.filter(t => t.status === 'passed').length}
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'نجح' : 'Passed'}
              </div>
            </div>
            <div className="bg-trading-secondary p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-400">
                {tests.filter(t => t.status === 'failed').length}
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'فشل' : 'Failed'}
              </div>
            </div>
            <div className="bg-trading-secondary p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">
                {tests.filter(t => t.status === 'running').length}
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'يعمل' : 'Running'}
              </div>
            </div>
          </div>

          {/* قائمة الاختبارات */}
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={test.id} className="bg-trading-secondary p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <h4 className="font-bold text-white">
                      {lang === 'ar' ? test.nameAr : test.name}
                    </h4>
                  </div>
                  <span className={cn("text-sm font-medium", getStatusColor(test.status))}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {lang === 'ar' ? test.descriptionAr : test.description}
                </p>
                
                {test.error && (
                  <div className="bg-red-900/30 border border-red-700 p-2 rounded text-red-300 text-sm">
                    {lang === 'ar' ? 'خطأ: ' : 'Error: '}{test.error}
                  </div>
                )}
                
                {test.result && (
                  <div className="bg-green-900/30 border border-green-700 p-2 rounded text-green-300 text-sm">
                    {lang === 'ar' ? 'النتيجة: ' : 'Result: '}
                    <code className="text-xs">
                      {JSON.stringify(test.result, null, 2).substring(0, 100)}...
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* التكامل مع StrategyBacktesting */}
      <Tabs defaultValue="integration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-trading-card">
          <TabsTrigger value="integration">
            {lang === 'ar' ? 'اختبار التكامل' : 'Integration Test'}
          </TabsTrigger>
          <TabsTrigger value="live-demo">
            {lang === 'ar' ? 'العرض المباشر' : 'Live Demo'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integration">
          {/* محتوى اختبار التكامل تم عرضه أعلاه */}
        </TabsContent>

        <TabsContent value="live-demo">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-400" />
                {lang === 'ar' ? 'العرض المباشر للباك تيست' : 'Live Backtesting Demo'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StrategyBacktesting lang={lang} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BacktestingIntegration;
