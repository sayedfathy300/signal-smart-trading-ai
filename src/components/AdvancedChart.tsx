
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketDataService, CandlestickData } from '@/services/marketDataService';
import { technicalAnalysisService, TradingSignal } from '@/services/technicalAnalysisService';
import { TrendingUp, TrendingDown, BarChart3, Zap, Target, ShieldAlert } from 'lucide-react';

interface AdvancedChartProps {
  symbol: string;
  timeframe: string;
  lang?: 'en' | 'ar';
}

interface ChartData extends CandlestickData {
  sma20?: number;
  sma50?: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  upperBand?: number;
  lowerBand?: number;
}

export const AdvancedChart: React.FC<AdvancedChartProps> = ({ 
  symbol, 
  timeframe = '1day',
  lang = 'en' 
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['sma20', 'sma50']);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('line');
  const [tradingSignal, setTradingSignal] = useState<TradingSignal | null>(null);
  const [loading, setLoading] = useState(true);

  const indicators = [
    { id: 'sma20', name: lang === 'ar' ? 'متوسط 20' : 'SMA 20', color: '#FF6B6B' },
    { id: 'sma50', name: lang === 'ar' ? 'متوسط 50' : 'SMA 50', color: '#4ECDC4' },
    { id: 'rsi', name: 'RSI', color: '#45B7D1' },
    { id: 'macd', name: 'MACD', color: '#96CEB4' },
    { id: 'bollinger', name: lang === 'ar' ? 'بولنجر' : 'Bollinger', color: '#FFEAA7' }
  ];

  useEffect(() => {
    loadChartData();
  }, [symbol, timeframe]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const historicalData = await marketDataService.getHistoricalData(symbol, timeframe);
      
      if (historicalData.length === 0) {
        setLoading(false);
        return;
      }

      const closes = historicalData.map(d => d.close);

      const sma20 = technicalAnalysisService.calculateSMA(closes, 20);
      const sma50 = technicalAnalysisService.calculateSMA(closes, 50);
      const rsi = technicalAnalysisService.calculateRSI(closes);
      const macd = technicalAnalysisService.calculateMACD(closes);
      const bollinger = technicalAnalysisService.calculateBollingerBands(closes);

      const enrichedData: ChartData[] = historicalData.map((candle, index) => {
        const dataPoint: ChartData = { ...candle };
        
        if (index >= 19 && sma20[index - 19]) {
          dataPoint.sma20 = sma20[index - 19];
        }
        if (index >= 49 && sma50[index - 49]) {
          dataPoint.sma50 = sma50[index - 49];
        }
        if (index >= 13 && rsi[index - 13]) {
          dataPoint.rsi = rsi[index - 13];
        }
        if (index >= 25 && macd.macd[index - 25]) {
          dataPoint.macd = macd.macd[index - 25];
          dataPoint.signal = macd.signal[index - 25];
        }
        if (index >= 19 && bollinger.upper[index - 19]) {
          dataPoint.upperBand = bollinger.upper[index - 19];
          dataPoint.lowerBand = bollinger.lower[index - 19];
        }

        return dataPoint;
      });

      setChartData(enrichedData);

      const signal = technicalAnalysisService.generateTradingSignal(symbol, historicalData, timeframe);
      setTradingSignal(signal);

    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicatorId) 
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US');
  };

  const getSignalColor = (signal: TradingSignal) => {
    switch (signal.type) {
      case 'BUY': return 'text-green-500';
      case 'SELL': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSignalIcon = (signal: TradingSignal) => {
    switch (signal.type) {
      case 'BUY': return <TrendingUp className="h-4 w-4" />;
      case 'SELL': return <TrendingDown className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-trading-light">
              {lang === 'ar' ? 'جاري تحميل البيانات...' : 'Loading chart data...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tradingSignal && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-lg flex items-center gap-2 ${getSignalColor(tradingSignal)}`}>
                {getSignalIcon(tradingSignal)}
                {lang === 'ar' ? 'إشارة التداول' : 'Trading Signal'}
              </CardTitle>
              <Badge variant={tradingSignal.type === 'BUY' ? 'default' : tradingSignal.type === 'SELL' ? 'destructive' : 'secondary'}>
                {tradingSignal.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-trading-light">
                  {lang === 'ar' ? 'القوة' : 'Strength'}
                </div>
                <div className="text-xl font-bold">{tradingSignal.strength}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-trading-light">
                  {lang === 'ar' ? 'الثقة' : 'Confidence'}
                </div>
                <div className="text-xl font-bold">{(tradingSignal.confidence * 100).toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-trading-light">
                  {lang === 'ar' ? 'الدخول' : 'Entry'}
                </div>
                <div className="text-xl font-bold">${tradingSignal.entry.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-trading-light">
                  {lang === 'ar' ? 'وقف الخسارة' : 'Stop Loss'}
                </div>
                <div className="text-xl font-bold text-red-500">${tradingSignal.stopLoss.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {lang === 'ar' ? 'أسباب الإشارة:' : 'Signal Reasoning:'}
              </h4>
              {tradingSignal.reasoning.map((reason, index) => (
                <div key={index} className="text-sm text-trading-light bg-gray-800 p-2 rounded">
                  • {reason}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-trading-card border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl">
              {symbol} - {lang === 'ar' ? 'الرسم البياني المتقدم' : 'Advanced Chart'}
            </CardTitle>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-1 bg-gray-800 rounded p-1">
                <Button
                  size="sm"
                  variant={chartType === 'line' ? 'default' : 'ghost'}
                  onClick={() => setChartType('line')}
                >
                  Line
                </Button>
                <Button
                  size="sm"
                  variant={chartType === 'area' ? 'default' : 'ghost'}
                  onClick={() => setChartType('area')}
                >
                  Area
                </Button>
                <Button
                  size="sm"
                  variant={chartType === 'candlestick' ? 'default' : 'ghost'}
                  onClick={() => setChartType('candlestick')}
                >
                  Candle
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {indicators.map(indicator => (
                  <Button
                    key={indicator.id}
                    size="sm"
                    variant={selectedIndicators.includes(indicator.id) ? 'default' : 'outline'}
                    onClick={() => toggleIndicator(indicator.id)}
                    className="text-xs"
                  >
                    {indicator.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTimestamp}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                    labelFormatter={(value) => formatTimestamp(Number(value))}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#60A5FA" 
                    strokeWidth={2}
                    dot={false}
                  />
                  
                  {selectedIndicators.includes('sma20') && (
                    <Line 
                      type="monotone" 
                      dataKey="sma20" 
                      stroke="#FF6B6B" 
                      strokeWidth={1}
                      dot={false}
                    />
                  )}
                  
                  {selectedIndicators.includes('sma50') && (
                    <Line 
                      type="monotone" 
                      dataKey="sma50" 
                      stroke="#4ECDC4" 
                      strokeWidth={1}
                      dot={false}
                    />
                  )}
                  
                  {selectedIndicators.includes('bollinger') && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="upperBand" 
                        stroke="#FFEAA7" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lowerBand" 
                        stroke="#FFEAA7" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </>
                  )}
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTimestamp}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                    labelFormatter={(value) => formatTimestamp(Number(value))}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#60A5FA" 
                    fill="#60A5FA"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              ) : (
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTimestamp}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <YAxis 
                    yAxisId="volume"
                    orientation="right"
                    stroke="#9CA3AF"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                    labelFormatter={(value) => formatTimestamp(Number(value))}
                  />
                  
                  <Bar 
                    dataKey="volume" 
                    fill="#374151" 
                    opacity={0.3}
                    yAxisId="volume"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#60A5FA" 
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {(selectedIndicators.includes('rsi') || selectedIndicators.includes('macd')) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedIndicators.includes('rsi') && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">RSI (14)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatTimestamp}
                        stroke="#9CA3AF"
                      />
                      <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rsi" 
                        stroke="#45B7D1" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedIndicators.includes('macd') && (
            <Card className="bg-trading-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">MACD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatTimestamp}
                        stroke="#9CA3AF"
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="macd" 
                        stroke="#96CEB4" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="signal" 
                        stroke="#FFEAA7" 
                        strokeWidth={1}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
