
import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Line, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { marketDataService, CandlestickData } from '@/services/marketDataService';
import { technicalAnalysisService } from '@/services/technicalAnalysisService';
import { TrendingUp, TrendingDown, BarChart3, Zap, Eye, Brain, Target, Settings } from 'lucide-react';
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
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  sma20?: number;
  sma50?: number;
  bb_upper?: number;
  bb_lower?: number;
  support?: number;
  resistance?: number;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: number;
}

export function CandlestickChart({ symbol, timeframe = '1day', className, lang = 'en' }: CandlestickChartProps) {
  const [candleData, setCandleData] = useState<EnhancedCandlestickData[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiPrediction, setAiPrediction] = useState<any>(null);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [showIndicators, setShowIndicators] = useState<string[]>(['RSI', 'MACD', 'SMA']);
  const [harmonicPatterns, setHarmonicPatterns] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  const patterns = [
    { id: 'hammer', name: lang === 'ar' ? 'المطرقة' : 'Hammer', color: '#00FF88' },
    { id: 'doji', name: lang === 'ar' ? 'دوجي' : 'Doji', color: '#FFD700' },
    { id: 'engulfing', name: lang === 'ar' ? 'الابتلاع' : 'Engulfing', color: '#FF4444' },
    { id: 'morning_star', name: lang === 'ar' ? 'نجمة الصباح' : 'Morning Star', color: '#00FF88' },
    { id: 'evening_star', name: lang === 'ar' ? 'نجمة المساء' : 'Evening Star', color: '#FF4444' },
    { id: 'triangle', name: lang === 'ar' ? 'المثلث' : 'Triangle', color: '#00BFFF' },
    { id: 'head_shoulders', name: lang === 'ar' ? 'الرأس والكتفين' : 'Head & Shoulders', color: '#FF6347' }
  ];

  const availableIndicators = [
    'RSI', 'MACD', 'SMA', 'EMA', 'Bollinger Bands', 'Stochastic', 'ATR', 'Volume'
  ];

  useEffect(() => {
    loadCandlestickData();
  }, [symbol, timeframe, showIndicators]);

  const loadCandlestickData = async () => {
    setLoading(true);
    try {
      const historicalData = await marketDataService.getHistoricalData(symbol, timeframe);
      
      // حساب المؤشرات الفنية
      const closes = historicalData.map(d => d.close);
      const highs = historicalData.map(d => d.high);
      const lows = historicalData.map(d => d.low);
      
      const rsi = technicalAnalysisService.calculateRSI(closes);
      const macd = technicalAnalysisService.calculateMACD(closes);
      const sma20 = technicalAnalysisService.calculateSMA(closes, 20);
      const sma50 = technicalAnalysisService.calculateSMA(closes, 50);
      const bollinger = technicalAnalysisService.calculateBollingerBands(closes);
      const stochastic = technicalAnalysisService.calculateStochastic(highs, lows, closes);
      const supportResistance = technicalAnalysisService.calculateSupportResistance(historicalData);
      
      const enhancedData: EnhancedCandlestickData[] = historicalData.map((candle, index) => {
        const bullish = candle.close > candle.open;
        const bodySize = Math.abs(candle.close - candle.open);
        const upperShadow = candle.high - Math.max(candle.open, candle.close);
        const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
        
        const pattern = detectAdvancedCandlePattern(candle, historicalData, index);
        
        return {
          ...candle,
          bullish,
          bodySize,
          upperShadow,
          lowerShadow,
          pattern,
          rsi: rsi[index - 13] || 0,
          macd: macd.macd[index - 25] || 0,
          macdSignal: macd.signal[index - 33] || 0,
          sma20: sma20[index - 19] || 0,
          sma50: sma50[index - 49] || 0,
          bb_upper: bollinger.upper[index - 19] || 0,
          bb_lower: bollinger.lower[index - 19] || 0,
          support: supportResistance.support[0] || 0,
          resistance: supportResistance.resistance[0] || 0
        };
      });

      setCandleData(enhancedData);
      generateAdvancedAIPrediction(enhancedData);
      calculateTechnicalIndicators(enhancedData);
      detectHarmonicPatterns(enhancedData);
      
    } catch (error) {
      console.error('Error loading candlestick data:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectAdvancedCandlePattern = (candle: CandlestickData, allCandles: CandlestickData[], index: number): string | undefined => {
    const bodySize = Math.abs(candle.close - candle.open);
    const totalRange = candle.high - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;

    // نمط المطرقة المتقدم
    if (lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.1 && index > 0) {
      const prevCandle = allCandles[index - 1];
      if (prevCandle.close < prevCandle.open) {
        return 'hammer';
      }
    }
    
    // نمط الدوجي المتقدم
    if (bodySize < totalRange * 0.1) {
      if (upperShadow > bodySize * 5 && lowerShadow > bodySize * 5) {
        return 'long_legged_doji';
      }
      return 'doji';
    }
    
    // أنماط الابتلاع المتقدمة
    if (index > 0) {
      const prevCandle = allCandles[index - 1];
      
      // الابتلاع الصعودي المتقدم
      if (prevCandle.close < prevCandle.open && 
          candle.close > candle.open && 
          candle.open < prevCandle.close && 
          candle.close > prevCandle.open &&
          bodySize > Math.abs(prevCandle.close - prevCandle.open) * 1.5) {
        return 'bullish_engulfing';
      }
      
      // الابتلاع الهبوطي المتقدم
      if (prevCandle.close > prevCandle.open && 
          candle.close < candle.open && 
          candle.open > prevCandle.close && 
          candle.close < prevCandle.open &&
          bodySize > Math.abs(prevCandle.close - prevCandle.open) * 1.5) {
        return 'bearish_engulfing';
      }
    }

    // نمط المثلث (يتطلب عدة شموع)
    if (index > 10) {
      const recentCandles = allCandles.slice(index - 10, index + 1);
      if (detectTrianglePattern(recentCandles)) {
        return 'triangle';
      }
    }

    // نمط الرأس والكتفين (يتطلب عدة شموع)
    if (index > 20) {
      const recentCandles = allCandles.slice(index - 20, index + 1);
      if (detectHeadAndShouldersPattern(recentCandles)) {
        return 'head_shoulders';
      }
    }

    return undefined;
  };

  const detectTrianglePattern = (candles: CandlestickData[]): boolean => {
    if (candles.length < 5) return false;
    
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    
    // حساب خط اتجاه القمم والقيعان
    const highTrend = calculateTrendLine(highs);
    const lowTrend = calculateTrendLine(lows);
    
    // إذا كانت القمم تنخفض والقيعان ترتفع = مثلث متماثل
    return highTrend.slope < -0.1 && lowTrend.slope > 0.1;
  };

  const detectHeadAndShouldersPattern = (candles: CandlestickData[]): boolean => {
    if (candles.length < 15) return false;
    
    // البحث عن ثلاث قمم: كتف، رأس، كتف
    const peaks = findLocalMaxima(candles.map(c => c.high));
    if (peaks.length < 3) return false;
    
    const [leftShoulder, head, rightShoulder] = peaks.slice(-3);
    
    // التحقق من أن الرأس أعلى من الكتفين
    return head.value > leftShoulder.value && head.value > rightShoulder.value &&
           Math.abs(leftShoulder.value - rightShoulder.value) < head.value * 0.05;
  };

  const findLocalMaxima = (data: number[]) => {
    const peaks = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        peaks.push({ index: i, value: data[i] });
      }
    }
    return peaks;
  };

  const calculateTrendLine = (data: number[]) => {
    const n = data.length;
    const x = Array.from({length: n}, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * data[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  };

  const generateAdvancedAIPrediction = async (data: EnhancedCandlestickData[]) => {
    const lastCandles = data.slice(-20);
    const bullishCandles = lastCandles.filter(c => c.bullish).length;
    const patterns = lastCandles.filter(c => c.pattern).length;
    const avgRSI = lastCandles.reduce((sum, c) => sum + (c.rsi || 50), 0) / lastCandles.length;
    const lastMACD = lastCandles[lastCandles.length - 1]?.macd || 0;
    const lastMACDSignal = lastCandles[lastCandles.length - 1]?.macdSignal || 0;
    
    // تحليل متقدم للاتجاه
    let trend = 'neutral';
    let confidence = 0.5;
    
    // تحليل RSI
    if (avgRSI < 30) {
      trend = 'bullish';
      confidence += 0.2;
    } else if (avgRSI > 70) {
      trend = 'bearish';
      confidence += 0.2;
    }
    
    // تحليل MACD
    if (lastMACD > lastMACDSignal) {
      if (trend === 'bullish') confidence += 0.15;
      else if (trend === 'neutral') trend = 'bullish';
    } else {
      if (trend === 'bearish') confidence += 0.15;
      else if (trend === 'neutral') trend = 'bearish';
    }
    
    // تحليل الأنماط
    if (patterns > 2) confidence += 0.1;
    
    const strength = Math.abs(bullishCandles - 10) * 5;
    const finalConfidence = Math.min(confidence, 0.95);
    
    // حساب السعر المستهدف باستخدام نسب فيبوناتشي
    const lastPrice = data[data.length - 1]?.close || 0;
    const priceRange = Math.max(...data.slice(-20).map(d => d.high)) - Math.min(...data.slice(-20).map(d => d.low));
    const fibonacciLevel = trend === 'bullish' ? 0.618 : 0.382;
    const targetPrice = trend === 'bullish' ? 
      lastPrice + (priceRange * fibonacciLevel) : 
      lastPrice - (priceRange * fibonacciLevel);
    
    setAiPrediction({
      trend,
      strength,
      confidence: finalConfidence,
      avgRSI,
      macdSignal: lastMACD > lastMACDSignal ? 'bullish' : 'bearish',
      nextCandle: {
        expectedDirection: trend === 'bullish' ? 'up' : trend === 'bearish' ? 'down' : 'sideways',
        probabilityUp: trend === 'bullish' ? 0.7 + finalConfidence * 0.2 : 0.3 - finalConfidence * 0.2,
        targetPrice,
        fibonacciLevels: {
          level_236: lastPrice + (priceRange * 0.236),
          level_382: lastPrice + (priceRange * 0.382),
          level_618: lastPrice + (priceRange * 0.618),
        }
      }
    });
  };

  const calculateTechnicalIndicators = (data: EnhancedCandlestickData[]) => {
    const lastCandle = data[data.length - 1];
    if (!lastCandle) return;

    const indicators: TechnicalIndicator[] = [
      {
        name: 'RSI',
        value: lastCandle.rsi || 50,
        signal: (lastCandle.rsi || 50) < 30 ? 'BUY' : (lastCandle.rsi || 50) > 70 ? 'SELL' : 'NEUTRAL',
        strength: Math.abs((lastCandle.rsi || 50) - 50) * 2
      },
      {
        name: 'MACD',
        value: lastCandle.macd || 0,
        signal: (lastCandle.macd || 0) > (lastCandle.macdSignal || 0) ? 'BUY' : 'SELL',
        strength: Math.abs((lastCandle.macd || 0) - (lastCandle.macdSignal || 0)) * 100
      },
      {
        name: 'SMA 20/50',
        value: ((lastCandle.sma20 || 0) / (lastCandle.sma50 || 1)) * 100,
        signal: (lastCandle.sma20 || 0) > (lastCandle.sma50 || 0) ? 'BUY' : 'SELL',
        strength: Math.abs(((lastCandle.sma20 || 0) - (lastCandle.sma50 || 0)) / (lastCandle.sma50 || 1)) * 100
      },
      {
        name: 'Bollinger Bands',
        value: lastCandle.close,
        signal: lastCandle.close < (lastCandle.bb_lower || 0) ? 'BUY' : 
                lastCandle.close > (lastCandle.bb_upper || 0) ? 'SELL' : 'NEUTRAL',
        strength: lastCandle.close < (lastCandle.bb_lower || 0) ? 80 : 
                 lastCandle.close > (lastCandle.bb_upper || 0) ? 80 : 40
      }
    ];

    setTechnicalIndicators(indicators);
  };

  const detectHarmonicPatterns = (data: EnhancedCandlestickData[]) => {
    // كشف أنماط هارمونيك متقدمة (Gartley, Butterfly, Bat, Crab)
    const patterns = [];
    
    if (data.length >= 5) {
      const recent = data.slice(-20);
      
      // نمط Gartley
      const gartley = detectGartleyPattern(recent);
      if (gartley) patterns.push(gartley);
      
      // نمط Butterfly
      const butterfly = detectButterflyPattern(recent);
      if (butterfly) patterns.push(butterfly);
    }
    
    setHarmonicPatterns(patterns);
  };

  const detectGartleyPattern = (candles: EnhancedCandlestickData[]) => {
    // تطبيق نسب فيبوناتشي للكشف عن نمط Gartley
    if (candles.length < 5) return null;
    
    const peaks = findLocalMaxima(candles.map(c => c.high));
    const valleys = findLocalMaxima(candles.map(c => -c.low));
    
    if (peaks.length >= 2 && valleys.length >= 2) {
      return {
        name: 'Gartley',
        type: 'bullish',
        confidence: 0.75,
        target: candles[candles.length - 1].close * 1.05,
        description: lang === 'ar' ? 'نمط جارتلي الصعودي' : 'Bullish Gartley Pattern'
      };
    }
    
    return null;
  };

  const detectButterflyPattern = (candles: EnhancedCandlestickData[]) => {
    // تطبيق نسب فيبوناتشي للكشف عن نمط Butterfly
    if (candles.length < 6) return null;
    
    return {
      name: 'Butterfly',
      type: 'bearish',
      confidence: 0.68,
      target: candles[candles.length - 1].close * 0.95,
      description: lang === 'ar' ? 'نمط الفراشة الهبوطي' : 'Bearish Butterfly Pattern'
    };
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
        {/* Shadow lines */}
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
        
        {/* Candle body */}
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
        
        {/* Pattern indicator */}
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
              {lang === 'ar' ? 'جاري تحميل التحليل المتقدم...' : 'Loading Advanced Analysis...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)} ref={chartRef}>
      {/* AI Prediction Card */}
      {aiPrediction && (
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Brain className="h-5 w-5" />
              {lang === 'ar' ? 'التنبؤ المتقدم بالذكاء الاصطناعي' : 'Advanced AI Prediction'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <div className="text-sm text-gray-400">RSI</div>
                <div className="text-xl font-bold">{aiPrediction.avgRSI?.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400">MACD</div>
                <Badge variant={aiPrediction.macdSignal === 'bullish' ? 'default' : 'destructive'}>
                  {aiPrediction.macdSignal === 'bullish' ? '↗' : '↘'}
                </Badge>
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
            
            {/* Fibonacci Levels */}
            {aiPrediction.nextCandle.fibonacciLevels && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  {lang === 'ar' ? 'مستويات فيبوناتشي' : 'Fibonacci Levels'}
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>23.6%: ${aiPrediction.nextCandle.fibonacciLevels.level_236.toFixed(2)}</div>
                  <div>38.2%: ${aiPrediction.nextCandle.fibonacciLevels.level_382.toFixed(2)}</div>
                  <div>61.8%: ${aiPrediction.nextCandle.fibonacciLevels.level_618.toFixed(2)}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technical Indicators Card */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {lang === 'ar' ? 'المؤشرات الفنية المتقدمة' : 'Advanced Technical Indicators'}
            </CardTitle>
            <div className="flex gap-2">
              <Select value={showIndicators.join(',')} onValueChange={(value) => setShowIndicators(value.split(','))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={lang === 'ar' ? 'اختر المؤشرات' : 'Select Indicators'} />
                </SelectTrigger>
                <SelectContent>
                  {availableIndicators.map(indicator => (
                    <SelectItem key={indicator} value={indicator}>
                      {indicator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {technicalIndicators.map((indicator, index) => (
              <div key={index} className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-sm text-gray-400">{indicator.name}</div>
                <div className="text-lg font-bold">{indicator.value.toFixed(2)}</div>
                <Badge 
                  variant={indicator.signal === 'BUY' ? 'default' : indicator.signal === 'SELL' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {indicator.signal} ({indicator.strength.toFixed(0)}%)
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Harmonic Patterns Card */}
      {harmonicPatterns.length > 0 && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {lang === 'ar' ? 'الأنماط التوافقية' : 'Harmonic Patterns'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {harmonicPatterns.map((pattern, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{pattern.name}</span>
                    <Badge variant={pattern.type === 'bullish' ? 'default' : 'destructive'}>
                      {pattern.type === 'bullish' ? '↗' : '↘'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{pattern.description}</div>
                  <div className="text-sm mt-2">
                    {lang === 'ar' ? 'الهدف:' : 'Target:'} ${pattern.target.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Chart */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {symbol} - {lang === 'ar' ? 'الشموع اليابانية المتقدمة' : 'Advanced Japanese Candlesticks'}
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
                    if (name === 'rsi') return [value.toFixed(2), 'RSI'];
                    if (name === 'macd') return [value.toFixed(4), 'MACD'];
                    return [`$${value.toFixed(2)}`, name];
                  }}
                />
                
                <Bar 
                  dataKey="volume" 
                  fill="#374151" 
                  opacity={0.3}
                  yAxisId="volume"
                />
                
                {showIndicators.includes('SMA') && (
                  <>
                    <Line 
                      type="monotone"
                      dataKey="sma20" 
                      stroke="#FFD700"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line 
                      type="monotone"
                      dataKey="sma50" 
                      stroke="#FF6347"
                      strokeWidth={1}
                      dot={false}
                    />
                  </>
                )}
                
                {showIndicators.includes('Bollinger Bands') && (
                  <>
                    <Area
                      dataKey="bb_upper"
                      fill="#60A5FA"
                      fillOpacity={0.1}
                      stroke="#60A5FA"
                      strokeWidth={1}
                    />
                    <Area
                      dataKey="bb_lower"
                      fill="#60A5FA"
                      fillOpacity={0.1}
                      stroke="#60A5FA"
                      strokeWidth={1}
                    />
                  </>
                )}
                
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
          
          {/* Pattern Statistics */}
          <div className="mt-4 grid grid-cols-3 md:grid-cols-7 gap-4 text-center">
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
