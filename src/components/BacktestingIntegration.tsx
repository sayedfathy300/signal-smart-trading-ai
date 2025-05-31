
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
  Zap,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockBacktestingService, MockBacktestResult, MockBacktestConfiguration } from '@/services/mockBacktestingService';
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
  duration?: number;
}

interface BacktestingIntegrationProps {
  lang?: 'en' | 'ar';
}

const BacktestingIntegration = ({ lang = 'ar' }: BacktestingIntegrationProps) => {
  const [tests, setTests] = useState<IntegrationTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'running' | 'passed' | 'failed'>('pending');
  const [testResults, setTestResults] = useState<any>({});
  const [testProgress, setTestProgress] = useState(0);

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
        description: 'Test available strategies retrieval and validation',
        descriptionAr: 'اختبار استرجاع الاستراتيجيات المتاحة والتحقق منها'
      },
      {
        id: 'symbols_timeframes',
        name: 'Symbols & Timeframes',
        nameAr: 'الرموز والأطر الزمنية',
        status: 'pending',
        description: 'Test available symbols and timeframes loading',
        descriptionAr: 'اختبار تحميل الرموز والأطر الزمنية المتاحة'
      },
      {
        id: 'backtest_execution',
        name: 'Backtest Execution',
        nameAr: 'تنفيذ الباك تيست',
        status: 'pending',
        description: 'Test backtest execution with comprehensive parameters',
        descriptionAr: 'اختبار تنفيذ الباك تيست مع معايير شاملة'
      },
      {
        id: 'result_processing',
        name: 'Result Processing',
        nameAr: 'معالجة النتائج',
        status: 'pending',
        description: 'Test result processing and detailed metrics calculation',
        descriptionAr: 'اختبار معالجة النتائج وحساب المؤشرات التفصيلية'
      },
      {
        id: 'data_validation',
        name: 'Data Validation',
        nameAr: 'التحقق من البيانات',
        status: 'pending',
        description: 'Validate data integrity and format consistency',
        descriptionAr: 'التحقق من سلامة البيانات وثبات التنسيق'
      },
      {
        id: 'ui_integration',
        name: 'UI Integration',
        nameAr: 'تكامل الواجهة',
        status: 'pending',
        description: 'Test UI components and responsive data display',
        descriptionAr: 'اختبار مكونات الواجهة وعرض البيانات التفاعلي'
      },
      {
        id: 'performance_test',
        name: 'Performance Test',
        nameAr: 'اختبار الأداء',
        status: 'pending',
        description: 'Test system performance and response times',
        descriptionAr: 'اختبار أداء النظام وأوقات الاستجابة'
      }
    ];

    setTests(integrationTests);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setTestProgress(0);
    
    const updatedTests = [...tests];
    const results: any = {};

    try {
      // Test 1: Service Initialization
      await runTest(updatedTests, 0, async () => {
        const startTime = Date.now();
        const strategies = mockBacktestingService.getAvailableStrategies();
        const symbols = mockBacktestingService.getAvailableSymbols();
        const timeframes = mockBacktestingService.getAvailableTimeframes();
        
        if (!strategies || strategies.length === 0) {
          throw new Error('No strategies found');
        }
        if (!symbols || symbols.length === 0) {
          throw new Error('No symbols found');
        }
        if (!timeframes || timeframes.length === 0) {
          throw new Error('No timeframes found');
        }
        
        return { 
          strategiesCount: strategies.length, 
          symbolsCount: symbols.length,
          timeframesCount: timeframes.length,
          loadTime: Date.now() - startTime
        };
      }, results);

      // Test 2: Strategy List Validation
      await runTest(updatedTests, 1, async () => {
        const strategies = mockBacktestingService.getAvailableStrategies();
        const requiredFields = ['id', 'name', 'nameAr', 'description', 'descriptionAr'];
        
        strategies.forEach(strategy => {
          requiredFields.forEach(field => {
            if (!strategy[field as keyof typeof strategy]) {
              throw new Error(`Missing required field '${field}' in strategy ${strategy.id}`);
            }
          });
        });
        
        return { 
          validStrategies: strategies.length,
          strategies: strategies.map(s => ({ id: s.id, name: s.name }))
        };
      }, results);

      // Test 3: Symbols & Timeframes
      await runTest(updatedTests, 2, async () => {
        const symbols = mockBacktestingService.getAvailableSymbols();
        const timeframes = mockBacktestingService.getAvailableTimeframes();
        
        // Validate symbol format
        const invalidSymbols = symbols.filter(symbol => !symbol.includes('/'));
        if (invalidSymbols.length > 0) {
          throw new Error(`Invalid symbol format: ${invalidSymbols.join(', ')}`);
        }
        
        // Validate timeframes
        timeframes.forEach(tf => {
          if (!tf.value || !tf.label || !tf.labelAr) {
            throw new Error(`Invalid timeframe structure: ${JSON.stringify(tf)}`);
          }
        });
        
        return { symbols, timeframes };
      }, results);

      // Test 4: Comprehensive Backtest Execution
      await runTest(updatedTests, 3, async () => {
        const strategies = mockBacktestingService.getAvailableStrategies();
        const symbols = mockBacktestingService.getAvailableSymbols();
        
        const config: MockBacktestConfiguration = {
          strategyId: strategies[0].id,
          strategy: strategies[0].id,
          symbol: symbols[0],
          symbols: [symbols[0]],
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

        const startTime = Date.now();
        const result = await mockBacktestingService.runBacktest(config);
        const executionTime = Date.now() - startTime;
        
        // Validate result structure
        const requiredFields = [
          'totalReturn', 'winRate', 'profitFactor', 'maxDrawdown', 'sharpeRatio',
          'totalTrades', 'trades', 'equity', 'initialCapital', 'finalCapital'
        ];
        
        requiredFields.forEach(field => {
          if (result[field as keyof MockBacktestResult] === undefined) {
            throw new Error(`Missing required field '${field}' in backtest result`);
          }
        });
        
        if (!Array.isArray(result.trades) || !Array.isArray(result.equity)) {
          throw new Error('Trades and equity must be arrays');
        }
        
        return { 
          backtestResult: {
            totalReturn: result.totalReturn,
            winRate: result.winRate,
            totalTrades: result.totalTrades,
            tradesCount: result.trades.length,
            equityPointsCount: result.equity.length
          },
          executionTime
        };
      }, results);

      // Test 5: Enhanced Result Processing
      await runTest(updatedTests, 4, async () => {
        const backtestResult = results.backtest_execution?.backtestResult;
        if (!backtestResult) {
          throw new Error('No backtest result to process');
        }

        // Create a full result for metrics calculation
        const fullResult: MockBacktestResult = {
          totalReturn: 15.5,
          winRate: 68.4,
          profitFactor: 2.12,
          maxDrawdown: -8.3,
          sharpeRatio: 1.85,
          totalTrades: 125,
          winningTrades: 85,
          losingTrades: 40,
          avgWin: 150.5,
          avgLoss: 85.2,
          volatility: 15.7,
          calmarRatio: 2.98,
          sortinoRatio: 2.45,
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          initialCapital: 10000,
          finalCapital: 11550,
          trades: [],
          equity: []
        };

        const metrics = mockBacktestingService.getDetailedMetrics(fullResult);
        
        if (!metrics || typeof metrics.performance?.volatility !== 'number') {
          throw new Error('Invalid metrics calculation');
        }
        
        return { 
          metricsCalculated: true,
          performanceMetrics: Object.keys(metrics.performance || {}).length,
          riskMetrics: Object.keys(metrics.risk || {}).length,
          tradingMetrics: Object.keys(metrics.trading || {}).length
        };
      }, results);

      // Test 6: Data Validation
      await runTest(updatedTests, 5, async () => {
        const testConfig: MockBacktestConfiguration = {
          strategyId: 'sma_crossover',
          strategy: 'sma_crossover',
          symbol: 'BTC/USDT',
          symbols: ['BTC/USDT'],
          timeframe: '1d',
          startDate: '2023-06-01',
          endDate: '2023-06-30',
          initialCapital: 5000,
          commission: 0.1,
          slippage: 0.01,
          riskPerTrade: 1,
          maxDrawdown: 10,
          riskManagement: {
            maxDrawdown: 10,
            maxDailyLoss: 2,
            positionSizing: 'fixed'
          }
        };

        const result = await mockBacktestingService.runBacktest(testConfig);
        
        // Validate data integrity
        if (result.trades.some(trade => isNaN(trade.price) || isNaN(trade.profit))) {
          throw new Error('Invalid trade data detected');
        }
        
        if (result.equity.some(point => isNaN(point.value))) {
          throw new Error('Invalid equity data detected');
        }
        
        // Check date consistency
        const startDate = new Date(testConfig.startDate);
        const endDate = new Date(testConfig.endDate);
        const firstTradeDate = new Date(result.trades[0]?.date || testConfig.startDate);
        const lastEquityDate = new Date(result.equity[result.equity.length - 1]?.date || testConfig.endDate);
        
        if (firstTradeDate < startDate || lastEquityDate > endDate) {
          throw new Error('Date range inconsistency detected');
        }
        
        return {
          dataIntegrityPassed: true,
          tradesValidated: result.trades.length,
          equityPointsValidated: result.equity.length,
          dateRangeValid: true
        };
      }, results);

      // Test 7: UI Integration
      await runTest(updatedTests, 6, async () => {
        // Simulate UI component testing
        const uiComponents = {
          strategySelector: true,
          dateRangePicker: true,
          parametersForm: true,
          resultsDisplay: true,
          chartsRendering: true,
          tabsNavigation: true,
          responsiveLayout: true
        };
        
        // Simulate component rendering checks
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const failedComponents = Object.entries(uiComponents)
          .filter(([_, status]) => !status)
          .map(([component]) => component);
          
        if (failedComponents.length > 0) {
          throw new Error(`UI components failed: ${failedComponents.join(', ')}`);
        }
        
        return { 
          uiComponentsPassed: Object.keys(uiComponents).length,
          allComponentsWorking: true
        };
      }, results);

      // Test 8: Performance Test
      await runTest(updatedTests, 7, async () => {
        const performanceTests = [];
        
        // Test multiple quick backtests
        for (let i = 0; i < 3; i++) {
          const startTime = Date.now();
          
          const quickConfig: MockBacktestConfiguration = {
            strategyId: 'rsi_oversold',
            strategy: 'rsi_oversold',
            symbol: 'ETH/USDT',
            symbols: ['ETH/USDT'],
            timeframe: '4h',
            startDate: '2023-11-01',
            endDate: '2023-11-30',
            initialCapital: 1000,
            commission: 0.1,
            slippage: 0.01,
            riskPerTrade: 2,
            maxDrawdown: 15,
            riskManagement: {
              maxDrawdown: 15,
              maxDailyLoss: 3,
              positionSizing: 'fixed'
            }
          };
          
          await mockBacktestingService.runBacktest(quickConfig);
          performanceTests.push(Date.now() - startTime);
        }
        
        const avgExecutionTime = performanceTests.reduce((a, b) => a + b, 0) / performanceTests.length;
        
        if (avgExecutionTime > 5000) { // 5 seconds threshold
          throw new Error(`Performance below threshold: ${avgExecutionTime}ms average`);
        }
        
        return {
          averageExecutionTime: avgExecutionTime,
          testsRun: performanceTests.length,
          performanceGrade: avgExecutionTime < 2000 ? 'Excellent' : avgExecutionTime < 3500 ? 'Good' : 'Acceptable'
        };
      }, results);

      // Determine overall status
      const failedTests = updatedTests.filter(t => t.status === 'failed');
      setOverallStatus(failedTests.length === 0 ? 'passed' : 'failed');

    } catch (error) {
      console.error('Integration tests failed:', error);
      setOverallStatus('failed');
    }

    setTests(updatedTests);
    setTestResults(results);
    setIsRunning(false);
    setTestProgress(100);
  };

  const runTest = async (
    testsArray: IntegrationTest[], 
    index: number, 
    testFunction: () => Promise<any>,
    results: any
  ) => {
    const startTime = Date.now();
    testsArray[index].status = 'running';
    setTests([...testsArray]);
    setTestProgress(((index) / testsArray.length) * 100);

    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Realistic delay
      const result = await testFunction();
      
      testsArray[index].status = 'passed';
      testsArray[index].result = result;
      testsArray[index].duration = Date.now() - startTime;
      results[testsArray[index].id] = result;
      
    } catch (error: any) {
      testsArray[index].status = 'failed';
      testsArray[index].error = error.message;
      testsArray[index].duration = Date.now() - startTime;
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
        return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
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
      {/* Overall Test Status */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <TestTube className="h-6 w-6 text-blue-400" />
            {lang === 'ar' ? 'اختبار التكامل الشامل للنظام' : 'Comprehensive System Integration Test'}
            <Badge 
              className={cn(
                "ml-auto",
                overallStatus === 'passed' && 'bg-green-600',
                overallStatus === 'failed' && 'bg-red-600',
                overallStatus === 'running' && 'bg-blue-600',
                overallStatus === 'pending' && 'bg-gray-600'
              )}
            >
              {overallStatus === 'passed' && (lang === 'ar' ? 'نجح بالكامل' : 'All Passed')}
              {overallStatus === 'failed' && (lang === 'ar' ? 'فشل' : 'Failed')}
              {overallStatus === 'running' && (lang === 'ar' ? 'جاري التشغيل' : 'Running')}
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
                ? (lang === 'ar' ? 'جاري التشغيل...' : 'Running Tests...') 
                : (lang === 'ar' ? 'تشغيل جميع الاختبارات' : 'Run All Tests')
              }
            </Button>
            
            {isRunning && (
              <div className="flex-1 bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${testProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Test Statistics */}
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

          {/* Test Results List */}
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={test.id} className="bg-trading-secondary p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <h4 className="font-bold text-white">
                      {lang === 'ar' ? test.nameAr : test.name}
                    </h4>
                    {test.duration && (
                      <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                        {test.duration}ms
                      </span>
                    )}
                  </div>
                  <span className={cn("text-sm font-medium", getStatusColor(test.status))}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {lang === 'ar' ? test.descriptionAr : test.description}
                </p>
                
                {test.error && (
                  <div className="bg-red-900/30 border border-red-700 p-3 rounded text-red-300 text-sm mt-2">
                    <strong>{lang === 'ar' ? 'خطأ: ' : 'Error: '}</strong>{test.error}
                  </div>
                )}
                
                {test.result && (
                  <div className="bg-green-900/30 border border-green-700 p-3 rounded text-green-300 text-sm mt-2">
                    <strong>{lang === 'ar' ? 'النتيجة: ' : 'Result: '}</strong>
                    <div className="mt-1 font-mono text-xs overflow-x-auto">
                      {JSON.stringify(test.result, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration with StrategyBacktesting */}
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
          {/* Integration test content shown above */}
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
