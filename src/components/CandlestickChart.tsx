
import React, { useState, useEffect } from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketDataService, CandlestickData } from '@/services/marketDataService';
import { TrendingUp, TrendingDown, BarChart3, Zap, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandlestickChartProps {
  symbol: string;
  timeframe?: string;
  className?: string;
  lang?: 'en' | 'ar';
}

interface EnhancedCandlestickData extends CandlestickData {
  bullish: boolean;
  bodySize: number;
  upperShadow: number;
  lowerShadow: number;
  pattern?: string;
}

export function CandlestickChart({ symbol, timeframe = '1day', className, lang = 'en' }: CandlestickChartProps) {
  const [candleData, setCandleData] = useState<EnhancedCandlestickData[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiPrediction, setAiPrediction] = useState<any>(null);

  const patterns = [
    { id: 'hammer', name: lang === 'ar' ? 'المطرقة' : 'Hammer', color: '#00FF88' },
    { id: 'doji', name: lang === 'ar' ? 'دوجي' : 'Doji', color: '#FFD700' },
    { id: 'engulfing', name: lang === 'ar' ? 'الابتلاع' : 'Engulfing', color: '#FF4444' },
    { id: 'morning_star', name: lang === 'ar' ? 'نجمة الصباح' : 'Morning Star', color: '#00FF88' },
    { id: 'evening_star', name: lang === 'ar' ? 'نجمة المساء' : 'Evening Star', color: '#FF4444' }
  ];

  useEffect(() => {
    loadCandlestickData();
  }, [symbol, timeframe]);

  const loadCandlestickData = async () => {
    setLoading(true);
    try {
      const historicalData = await marketDataService.getHistoricalData(symbol, timeframe);
      
      const enhancedData: EnhancedCandlestickData[] = historicalData.map((candle, index) => {
        const bullish = candle.close > candle.open;
        const bodySize = Math.abs(candle.close - candle.open);
        const upperShadow = candle.high - Math.max(candle.open, candle.close);
        const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
        
        const pattern = detectCandlePattern(candle, historicalData, index);
        
        return {
          ...candle,
          bullish,
          bodySize,
          upperShadow,
          lowerShadow,
          pattern
        };
      });

      setCandleData(enhancedData);
      generateAIPrediction(enhancedData);
      
    } catch (error) {
      console.error('Error loading candlestick data:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectCandlePattern = (candle: CandlestickData, allCandles: CandlestickData[], index: number): string | undefined => {
    const bodySize = Math.abs(candle.close - candle.open);
    const totalRange = candle.high - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;

    if (lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.1) {
      return 'hammer';
    }
    
    if (bodySize < totalRange * 0.1) {
      return 'doji';
    }
    
    if (index > 0) {
      const prevCandle = allCandles[index - 1];
      if (prevCandle.close < prevCandle.open && 
          candle.close > candle.open && 
          candle.open < prevCandle.close && 
          candle.close > prevCandle.open) {
        return 'bullish_engulfing';
      }
      
      if (prevCandle.close > prevCandle.open && 
          candle.close < candle.open && 
          candle.open > prevCandle.close && 
          candle.close < prevCandle.open) {
        return 'bearish_engulfing';
      }
    }

    return undefined;
  };

  const generateAIPrediction = async (data: EnhancedCandlestickData[]) => {
    const lastCandles = data.slice(-10);
    const bullishCandles = lastCandles.filter(c => c.bullish).length;
    const patterns = lastCandles.filter(c => c.pattern).length;
    
    const trend = bullishCandles > 5 ? 'bullish' : bullishCandles < 3 ? 'bearish' : 'neutral';
    const strength = Math.abs(bullishCandles - 5) * 20;
    const confidence = (patterns * 0.1 + strength * 0.01);
    
    setAiPrediction({
      trend,
      strength,
      confidence: Math.min(confidence, 0.95),
      nextCandle: {
        expectedDirection: trend === 'bullish' ? 'up' : trend === 'bearish' ? 'down' : 'sideways',
        probabilityUp: trend === 'bullish' ? 0.7 + confidence * 0.2 : 0.3 - confidence * 0.2,
        targetPrice: data[data.length - 1]?.close * (trend === 'bullish' ? 1.02 : 0.98)
      }
    });
  };

  const CustomCandlestick = (props: any) => {
    const { payload, x, y, width, height } = props;
    
    if (!payload) return null;
    
    const { open, high, low, close, bullish, pattern } = payload;
    const candleWidth = Math.max(width * 0.6, 2);
    const candleX = x + (width - candleWidth) / 2;
    
    const maxPrice = Math.max(open, close, high, low);
    const minPrice = Math.min(open, close, high, low);
    const priceRange = maxPrice - minPrice || 1;
    
    const openY = y + height - ((open - minPrice) / priceRange) * height;
    const closeY = y + height - ((close - minPrice) / priceRange) * height;
    const highY = y + height - ((high - minPrice) / priceRange) * height;
    const lowY = y + height - ((low - minPrice) / priceRange) * height;
    
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(openY - closeY) || 2;
    
    return (
      <g>
        <line
          x1={candleX + candleWidth / 2}
          y1={highY}
          x2={candleX + candleWidth / 2}
          y2={bodyTop}
          stroke={bullish ? '#00FF88' : '#FF4444'}
          strokeWidth={1}
        />
        
        <line
          x1={candleX + candleWidth / 2}
          y1={bodyTop + bodyHeight}
          x2={candleX + candleWidth / 2}
          y2={lowY}
          stroke={bullish ? '#00FF88' : '#FF4444'}
          strokeWidth={1}
        />
        
        <rect
          x={candleX}
          y={bodyTop}
          width={candleWidth}
          height={bodyHeight}
          fill={bullish ? '#00FF88' : '#FF4444'}
          stroke={bullish ? '#00FF88' : '#FF4444'}
          strokeWidth={1}
          rx={1}
        />
        
        {pattern && (
          <circle
            cx={candleX + candleWidth / 2}
            cy={bodyTop - 8}
            r={3}
            fill="#FFD700"
            stroke="#000"
            strokeWidth={0.5}
          />
        )}
      </g>
    );
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US');
  };

  if (loading) {
    return (
      <Card className={cn("bg-trading-card border-gray-800", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-trading-light animate-pulse">
              {lang === 'ar' ? 'جاري تحميل الشموع اليابانية...' : 'Loading Japanese Candlesticks...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {aiPrediction && (
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Zap className="h-5 w-5" />
              {lang === 'ar' ? 'توقع الذكاء الاصطناعي' : 'AI Prediction'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'الاتجاه' : 'Trend'}
                </div>
                <Badge variant={aiPrediction.trend === 'bullish' ? 'default' : aiPrediction.trend === 'bearish' ? 'destructive' : 'secondary'}>
                  {aiPrediction.trend === 'bullish' ? (lang === 'ar' ? 'صاعد' : 'Bullish') :
                   aiPrediction.trend === 'bearish' ? (lang === 'ar' ? 'هابط' : 'Bearish') :
                   (lang === 'ar' ? 'محايد' : 'Neutral')}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'القوة' : 'Strength'}
                </div>
                <div className="text-xl font-bold">{aiPrediction.strength}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'الثقة' : 'Confidence'}
                </div>
                <div className="text-xl font-bold">{(aiPrediction.confidence * 100).toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'الهدف' : 'Target'}
                </div>
                <div className="text-xl font-bold">${aiPrediction.nextCandle.targetPrice.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-trading-card border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {symbol} - {lang === 'ar' ? 'الشموع اليابانية' : 'Japanese Candlesticks'}
            </CardTitle>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedPattern === null ? 'default' : 'outline'}
                onClick={() => setSelectedPattern(null)}
              >
                {lang === 'ar' ? 'جميع الأنماط' : 'All Patterns'}
              </Button>
              {patterns.map(pattern => (
                <Button
                  key={pattern.id}
                  size="sm"
                  variant={selectedPattern === pattern.id ? 'default' : 'outline'}
                  onClick={() => setSelectedPattern(pattern.id)}
                  className="text-xs"
                >
                  {pattern.name}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={candleData.filter(c => !selectedPattern || c.pattern?.includes(selectedPattern))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  stroke="#9CA3AF"
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <YAxis 
                  yAxisId="volume"
                  orientation="right"
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F3F4F6'
                  }}
                  labelFormatter={(value) => formatTimestamp(Number(value))}
                  formatter={(value: number, name: string) => {
                    if (name === 'volume') return [value.toLocaleString(), lang === 'ar' ? 'الحجم' : 'Volume'];
                    return [`$${value.toFixed(2)}`, name];
                  }}
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
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {patterns.map(pattern => {
              const count = candleData.filter(c => c.pattern?.includes(pattern.id)).length;
              return (
                <div key={pattern.id} className="bg-gray-800 p-3 rounded">
                  <div className="text-sm text-gray-400">{pattern.name}</div>
                  <div className="text-lg font-bold" style={{ color: pattern.color }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
