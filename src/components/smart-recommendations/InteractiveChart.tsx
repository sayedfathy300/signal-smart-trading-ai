
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { smartRecommendationsService, InteractiveChartData, SmartRecommendation } from '@/services/smartRecommendationsService';
import { TrendingUp, TrendingDown, AlertTriangle, Info, Target, Zap } from 'lucide-react';

interface InteractiveChartProps {
  symbol: string;
  timeframe: string;
  lang?: 'en' | 'ar';
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({ 
  symbol, 
  timeframe = '1H',
  lang = 'ar' 
}) => {
  const [chartData, setChartData] = useState<InteractiveChartData | null>(null);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['sma20', 'sma50']);
  const [showVolume, setShowVolume] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [symbol, timeframe]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const data = await smartRecommendationsService.getInteractiveChartData(symbol, timeframe);
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US');
  };

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'sell': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRecommendationColor = (rec: SmartRecommendation) => {
    switch (rec.type) {
      case 'buy': return 'bg-green-500';
      case 'sell': return 'bg-red-500';
      case 'hold': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-trading-light animate-pulse">
              {lang === 'ar' ? 'جاري تحميل الرسم التفاعلي...' : 'Loading interactive chart...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-trading-light">
            {lang === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const processedData = chartData.candlestickData.map((candle, index) => ({
    ...candle,
    sma20: selectedIndicators.includes('sma20') ? chartData.indicators.sma20[index] : undefined,
    sma50: selectedIndicators.includes('sma50') ? chartData.indicators.sma50[index] : undefined,
    rsi: chartData.indicators.rsi[index],
    upperBand: selectedIndicators.includes('bollinger') ? chartData.indicators.bollingerBands.upper[index] : undefined,
    lowerBand: selectedIndicators.includes('bollinger') ? chartData.indicators.bollingerBands.lower[index] : undefined,
  }));

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              {lang === 'ar' ? 'الرسم التفاعلي المتقدم' : 'Advanced Interactive Chart'} - {symbol}
            </CardTitle>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-1 bg-gray-800 rounded p-1">
                {['sma20', 'sma50', 'bollinger'].map(indicator => (
                  <Button
                    key={indicator}
                    size="sm"
                    variant={selectedIndicators.includes(indicator) ? 'default' : 'ghost'}
                    onClick={() => {
                      setSelectedIndicators(prev => 
                        prev.includes(indicator) 
                          ? prev.filter(i => i !== indicator)
                          : [...prev, indicator]
                      );
                    }}
                  >
                    {indicator.toUpperCase()}
                  </Button>
                ))}
              </div>
              
              <Button
                size="sm"
                variant={showVolume ? 'default' : 'ghost'}
                onClick={() => setShowVolume(!showVolume)}
              >
                {lang === 'ar' ? 'الحجم' : 'Volume'}
              </Button>
              
              <Button
                size="sm"
                variant={showAnnotations ? 'default' : 'ghost'}
                onClick={() => setShowAnnotations(!showAnnotations)}
              >
                {lang === 'ar' ? 'التعليقات' : 'Annotations'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-96 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                {showVolume && (
                  <YAxis 
                    yAxisId="volume"
                    orientation="right"
                    stroke="#9CA3AF"
                  />
                )}
                <ChartTooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                  labelFormatter={(value) => formatTimestamp(Number(value))}
                />
                
                {/* Price Line */}
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#60A5FA" 
                  strokeWidth={3}
                  dot={false}
                  name={lang === 'ar' ? 'السعر' : 'Price'}
                />
                
                {/* Indicators */}
                {selectedIndicators.includes('sma20') && (
                  <Line 
                    type="monotone" 
                    dataKey="sma20" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                    name="SMA 20"
                  />
                )}
                
                {selectedIndicators.includes('sma50') && (
                  <Line 
                    type="monotone" 
                    dataKey="sma50" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="8 8"
                    name="SMA 50"
                  />
                )}
                
                {selectedIndicators.includes('bollinger') && (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="upperBand" 
                      stroke="#8B5CF6" 
                      strokeWidth={1}
                      dot={false}
                      strokeOpacity={0.7}
                      name="Upper Band"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lowerBand" 
                      stroke="#8B5CF6" 
                      strokeWidth={1}
                      dot={false}
                      strokeOpacity={0.7}
                      name="Lower Band"
                    />
                  </>
                )}
                
                {/* Volume */}
                {showVolume && (
                  <Bar 
                    dataKey="volume" 
                    fill="#374151" 
                    opacity={0.3}
                    yAxisId="volume"
                    name={lang === 'ar' ? 'الحجم' : 'Volume'}
                  />
                )}
                
                {/* Annotations */}
                {showAnnotations && chartData.annotations.map((annotation, index) => (
                  <ReferenceLine 
                    key={index}
                    x={annotation.timestamp}
                    stroke={annotation.color}
                    strokeDasharray="2 2"
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Annotations Display */}
          {showAnnotations && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white mb-2">
                {lang === 'ar' ? 'التعليقات والإشارات' : 'Annotations & Signals'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {chartData.annotations.map((annotation, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge 
                          variant="secondary" 
                          className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700"
                        >
                          {getAnnotationIcon(annotation.type)}
                          <span className="text-xs">{annotation.text}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatTimestamp(annotation.timestamp)}</p>
                        <p>{lang === 'ar' ? 'السعر:' : 'Price:'} ${annotation.price.toFixed(2)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Recommendations */}
      {chartData.recommendations.length > 0 && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              {lang === 'ar' ? 'التوصيات النشطة' : 'Active Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chartData.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-trading-secondary rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-white">{rec.title}</h5>
                    <Badge className={`${getRecommendationColor(rec)} text-white`}>
                      {rec.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{rec.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">{lang === 'ar' ? 'الدخول:' : 'Entry:'}</span>
                      <span className="text-white ml-1">${rec.entryPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{lang === 'ar' ? 'الهدف:' : 'Target:'}</span>
                      <span className="text-green-400 ml-1">${rec.targetPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{lang === 'ar' ? 'وقف الخسارة:' : 'Stop Loss:'}</span>
                      <span className="text-red-400 ml-1">${rec.stopLoss.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{lang === 'ar' ? 'الثقة:' : 'Confidence:'}</span>
                      <span className="text-blue-400 ml-1">{(rec.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RSI Indicator */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">RSI (14)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                  stroke="#9CA3AF"
                />
                <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                <ChartTooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="rsi" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
                <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="5 5" />
                <ReferenceLine y={30} stroke="#10B981" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
