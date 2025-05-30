
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Brain, 
  Zap, 
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';

interface CrossDataAnalyticsProps {
  lang?: 'en' | 'ar';
}

const CrossDataAnalytics = ({ lang = 'ar' }: CrossDataAnalyticsProps) => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<any[]>([]);
  const [alertsCount, setAlertsCount] = useState({ high: 0, medium: 0, low: 0 });

  useEffect(() => {
    generateAdvancedAnalytics();
  }, []);

  const generateAdvancedAnalytics = () => {
    // توليد تنبؤات متقدمة
    const newPredictions = [
      {
        id: 1,
        symbol: 'AAPL',
        prediction: 'bullish',
        confidence: 87,
        timeframe: '2 weeks',
        factors: ['satellite-economic-activity', 'iot-consumer-sentiment', 'blockchain-defi-growth'],
        probability: 0.87,
        risk_reward: 2.3
      },
      {
        id: 2,
        symbol: 'BTC',
        prediction: 'bearish',
        confidence: 73,
        timeframe: '1 week',
        factors: ['blockchain-network-congestion', 'futures-contango', 'iot-energy-costs'],
        probability: 0.73,
        risk_reward: 1.8
      },
      {
        id: 3,
        symbol: 'GOLD',
        prediction: 'bullish',
        confidence: 92,
        timeframe: '1 month',
        factors: ['satellite-geopolitical-tension', 'futures-backwardation', 'blockchain-stablecoin-demand'],
        probability: 0.92,
        risk_reward: 3.1
      }
    ];

    // مصفوفة الارتباط المتقدمة
    const newCorrelationMatrix = [
      { x: 'Satellite Economic Activity', y: 'Stock Market Performance', correlation: 0.78, significance: 0.95 },
      { x: 'IoT Energy Consumption', y: 'Commodity Prices', correlation: 0.65, significance: 0.88 },
      { x: 'Blockchain TVL', y: 'Crypto Market Cap', correlation: 0.89, significance: 0.97 },
      { x: 'Futures Contango', y: 'Market Volatility', correlation: -0.45, significance: 0.82 },
      { x: 'Satellite Urban Development', y: 'Real Estate REITs', correlation: 0.71, significance: 0.91 }
    ];

    setPredictions(newPredictions);
    setCorrelationMatrix(newCorrelationMatrix);
    setAlertsCount({ high: 3, medium: 7, low: 12 });
  };

  const getPredictionIcon = (prediction: string) => {
    return prediction === 'bullish' 
      ? <ArrowUpRight className="h-4 w-4 text-trading-up" />
      : <ArrowDownRight className="h-4 w-4 text-trading-down" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-trading-primary" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'دقة التنبؤ' : 'Prediction Accuracy'}
                </p>
                <p className="text-xl font-bold text-white">84.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'نماذج نشطة' : 'Active Models'}
                </p>
                <p className="text-xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'إشارات يومية' : 'Daily Signals'}
                </p>
                <p className="text-xl font-bold text-white">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'تنبيهات عالية' : 'High Alerts'}
                </p>
                <p className="text-xl font-bold text-white">{alertsCount.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advanced Predictions */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {lang === 'ar' ? 'التنبؤات المتقدمة' : 'Advanced Predictions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getPredictionIcon(prediction.prediction)}
                      <span className="font-medium text-white">{prediction.symbol}</span>
                      <Badge className={prediction.prediction === 'bullish' ? 'bg-trading-up' : 'bg-trading-down'}>
                        {prediction.prediction}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}%
                      </span>
                      <p className="text-xs text-gray-400">{prediction.timeframe}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'مستوى الثقة' : 'Confidence Level'}
                      </span>
                      <span className="text-white">{prediction.confidence}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{prediction.timeframe}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400">R/R: </span>
                      <span className="text-trading-primary">{prediction.risk_reward}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-1">
                      {lang === 'ar' ? 'العوامل المؤثرة:' : 'Key Factors:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {prediction.factors.map((factor: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor.split('-').slice(-1)[0]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Correlation Matrix Visualization */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {lang === 'ar' ? 'مصفوفة الارتباط' : 'Correlation Matrix'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={correlationMatrix}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  domain={[-1, 1]} 
                  dataKey="correlation"
                  stroke="#9CA3AF"
                  label={{ value: 'Correlation', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                />
                <YAxis 
                  type="number" 
                  domain={[0, 1]} 
                  dataKey="significance"
                  stroke="#9CA3AF"
                  label={{ value: 'Significance', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                  formatter={(value, name) => [value, name]}
                />
                <ReferenceLine x={0} stroke="#6B7280" strokeDasharray="2 2" />
                <ReferenceLine y={0.8} stroke="#6B7280" strokeDasharray="2 2" />
                <Scatter 
                  dataKey="significance" 
                  fill="#3B82F6"
                  r={6}
                />
              </ScatterChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {correlationMatrix.slice(0, 3).map((item, index) => (
                <div key={index} className="p-2 bg-gray-800 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{item.x} ↔ {item.y}</span>
                    <div className="flex items-center gap-2">
                      <span className={item.correlation > 0 ? 'text-trading-up' : 'text-trading-down'}>
                        {item.correlation > 0 ? '+' : ''}{(item.correlation * 100).toFixed(0)}%
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {(item.significance * 100).toFixed(0)}% sig
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {lang === 'ar' ? 'مقاييس الأداء' : 'Performance Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300">
                {lang === 'ar' ? 'دقة النماذج' : 'Model Accuracy'}
              </h4>
              {[
                { name: 'Satellite-Market Model', accuracy: 87 },
                { name: 'IoT-Commodity Model', accuracy: 82 },
                { name: 'Blockchain-Crypto Model', accuracy: 91 },
                { name: 'Futures-Volatility Model', accuracy: 79 }
              ].map((model, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{model.name}</span>
                    <span className="text-white">{model.accuracy}%</span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300">
                {lang === 'ar' ? 'توزيع التنبيهات' : 'Alert Distribution'}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      {lang === 'ar' ? 'عالية' : 'High'}
                    </span>
                  </div>
                  <span className="text-white font-medium">{alertsCount.high}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      {lang === 'ar' ? 'متوسطة' : 'Medium'}
                    </span>
                  </div>
                  <span className="text-white font-medium">{alertsCount.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">
                      {lang === 'ar' ? 'منخفضة' : 'Low'}
                    </span>
                  </div>
                  <span className="text-white font-medium">{alertsCount.low}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300">
                {lang === 'ar' ? 'معدلات النجاح' : 'Success Rates'}
              </h4>
              <div className="space-y-3">
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-trading-up">92.3%</p>
                  <p className="text-xs text-gray-400">
                    {lang === 'ar' ? 'التنبؤات قصيرة المدى' : 'Short-term Predictions'}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-trading-primary">87.1%</p>
                  <p className="text-xs text-gray-400">
                    {lang === 'ar' ? 'التنبؤات متوسطة المدى' : 'Medium-term Predictions'}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">74.8%</p>
                  <p className="text-xs text-gray-400">
                    {lang === 'ar' ? 'التنبؤات طويلة المدى' : 'Long-term Predictions'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossDataAnalytics;
