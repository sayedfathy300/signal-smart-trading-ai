
import { CandlestickData, TechnicalIndicators } from './marketDataService';

export interface PatternResult {
  pattern: string;
  confidence: number;
  description: string;
  signal: 'bullish' | 'bearish' | 'neutral';
}

export interface SupportResistance {
  support: number[];
  resistance: number[];
  pivot: number;
}

export interface TradingSignal {
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  strength: number; // 0-100
  confidence: number; // 0-1
  entry: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  reasoning: string[];
  timestamp: number;
}

class TechnicalAnalysisService {
  
  // حساب المتوسطات المتحركة
  calculateSMA(data: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // البداية بـ SMA للقيمة الأولى
    const sma = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    ema.push(sma);
    
    for (let i = period; i < data.length; i++) {
      const emaValue = (data[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
      ema.push(emaValue);
    }
    
    return ema;
  }

  // حساب مؤشر القوة النسبية RSI
  calculateRSI(data: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  }

  // حساب MACD
  calculateMACD(data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
    const fastEMA = this.calculateEMA(data, fastPeriod);
    const slowEMA = this.calculateEMA(data, slowPeriod);
    
    const macdLine: number[] = [];
    const startIndex = slowPeriod - fastPeriod;
    
    for (let i = 0; i < fastEMA.length - startIndex; i++) {
      macdLine.push(fastEMA[i + startIndex] - slowEMA[i]);
    }
    
    const signalLine = this.calculateEMA(macdLine, signalPeriod);
    const histogram: number[] = [];
    
    for (let i = signalPeriod - 1; i < macdLine.length; i++) {
      histogram.push(macdLine[i] - signalLine[i - signalPeriod + 1]);
    }
    
    return {
      macd: macdLine,
      signal: signalLine,
      histogram: histogram
    };
  }

  // حساب خطوط بولنجر
  calculateBollingerBands(data: number[], period: number = 20, multiplier: number = 2) {
    const sma = this.calculateSMA(data, period);
    const bands = {
      upper: [],
      middle: sma,
      lower: []
    };
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      
      bands.upper.push(mean + (multiplier * stdDev));
      bands.lower.push(mean - (multiplier * stdDev));
    }
    
    return bands;
  }

  // حساب مؤشر الستوكاستيك
  calculateStochastic(highs: number[], lows: number[], closes: number[], kPeriod: number = 14, dPeriod: number = 3) {
    const kValues: number[] = [];
    
    for (let i = kPeriod - 1; i < closes.length; i++) {
      const highestHigh = Math.max(...highs.slice(i - kPeriod + 1, i + 1));
      const lowestLow = Math.min(...lows.slice(i - kPeriod + 1, i + 1));
      const currentClose = closes[i];
      
      const kValue = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
      kValues.push(kValue);
    }
    
    const dValues = this.calculateSMA(kValues, dPeriod);
    
    return {
      k: kValues,
      d: dValues
    };
  }

  // تحليل الأنماط الفنية
  detectPatterns(data: CandlestickData[]): PatternResult[] {
    const patterns: PatternResult[] = [];
    
    // نمط المطرقة
    const hammerPattern = this.detectHammer(data);
    if (hammerPattern) patterns.push(hammerPattern);
    
    // نمط الدوجي
    const dojiPattern = this.detectDoji(data);
    if (dojiPattern) patterns.push(dojiPattern);
    
    // نمط الابتلاع الصعودي/الهبوطي
    const engulfingPattern = this.detectEngulfing(data);
    if (engulfingPattern) patterns.push(engulfingPattern);
    
    // المثلثات
    const trianglePattern = this.detectTriangle(data);
    if (trianglePattern) patterns.push(trianglePattern);
    
    return patterns;
  }

  private detectHammer(data: CandlestickData[]): PatternResult | null {
    if (data.length < 2) return null;
    
    const current = data[data.length - 1];
    const body = Math.abs(current.close - current.open);
    const lowerShadow = Math.min(current.open, current.close) - current.low;
    const upperShadow = current.high - Math.max(current.open, current.close);
    
    // شروط نمط المطرقة
    if (lowerShadow > body * 2 && upperShadow < body * 0.1) {
      return {
        pattern: 'Hammer',
        confidence: 0.75,
        description: 'نمط انعكاس صعودي محتمل',
        signal: 'bullish'
      };
    }
    
    return null;
  }

  private detectDoji(data: CandlestickData[]): PatternResult | null {
    if (data.length < 1) return null;
    
    const current = data[data.length - 1];
    const body = Math.abs(current.close - current.open);
    const range = current.high - current.low;
    
    // شروط نمط الدوجي
    if (body < range * 0.1) {
      return {
        pattern: 'Doji',
        confidence: 0.6,
        description: 'نمط تردد - انعكاس محتمل',
        signal: 'neutral'
      };
    }
    
    return null;
  }

  private detectEngulfing(data: CandlestickData[]): PatternResult | null {
    if (data.length < 2) return null;
    
    const previous = data[data.length - 2];
    const current = data[data.length - 1];
    
    const prevBody = Math.abs(previous.close - previous.open);
    const currBody = Math.abs(current.close - current.open);
    
    // الابتلاع الصعودي
    if (previous.close < previous.open && current.close > current.open &&
        current.close > previous.open && current.open < previous.close &&
        currBody > prevBody) {
      return {
        pattern: 'Bullish Engulfing',
        confidence: 0.8,
        description: 'نمط انعكاس صعودي قوي',
        signal: 'bullish'
      };
    }
    
    // الابتلاع الهبوطي
    if (previous.close > previous.open && current.close < current.open &&
        current.close < previous.open && current.open > previous.close &&
        currBody > prevBody) {
      return {
        pattern: 'Bearish Engulfing',
        confidence: 0.8,
        description: 'نمط انعكاس هبوطي قوي',
        signal: 'bearish'
      };
    }
    
    return null;
  }

  private detectTriangle(data: CandlestickData[]): PatternResult | null {
    if (data.length < 10) return null;
    
    const recent = data.slice(-10);
    const highs = recent.map(d => d.high);
    const lows = recent.map(d => d.low);
    
    // حساب خطوط الاتجاه
    const highTrend = this.calculateTrendLine(highs);
    const lowTrend = this.calculateTrendLine(lows);
    
    // تحديد نوع المثلث
    if (Math.abs(highTrend.slope) < 0.1 && lowTrend.slope > 0.1) {
      return {
        pattern: 'Ascending Triangle',
        confidence: 0.65,
        description: 'مثلث صاعد - إشارة صعودية محتملة',
        signal: 'bullish'
      };
    }
    
    return null;
  }

  private calculateTrendLine(data: number[]) {
    const n = data.length;
    const x = Array.from({length: n}, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * data[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }

  // حساب نقاط الدعم والمقاومة
  calculateSupportResistance(data: CandlestickData[]): SupportResistance {
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    const closes = data.map(d => d.close);
    
    // نقاط الدعم والمقاومة الأساسية
    const resistance = this.findPeaks(highs);
    const support = this.findValleys(lows);
    
    // حساب نقطة البيفوت
    const lastCandle = data[data.length - 1];
    const pivot = (lastCandle.high + lastCandle.low + lastCandle.close) / 3;
    
    return {
      support: support.slice(-3), // آخر 3 نقاط دعم
      resistance: resistance.slice(-3), // آخر 3 نقاط مقاومة
      pivot
    };
  }

  private findPeaks(data: number[]): number[] {
    const peaks: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        peaks.push(data[i]);
      }
    }
    return peaks.sort((a, b) => b - a).slice(0, 5);
  }

  private findValleys(data: number[]): number[] {
    const valleys: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
        valleys.push(data[i]);
      }
    }
    return valleys.sort((a, b) => a - b).slice(0, 5);
  }

  // توليد الإشارات الذكية
  generateTradingSignal(symbol: string, data: CandlestickData[], timeframe: string): TradingSignal {
    const closes = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);
    
    // حساب المؤشرات
    const rsi = this.calculateRSI(closes);
    const macd = this.calculateMACD(closes);
    const sma20 = this.calculateSMA(closes, 20);
    const sma50 = this.calculateSMA(closes, 50);
    const patterns = this.detectPatterns(data);
    const supportResistance = this.calculateSupportResistance(data);
    
    // تحليل الإشارات
    const signals: string[] = [];
    let bullishScore = 0;
    let bearishScore = 0;
    
    // تحليل RSI
    const currentRSI = rsi[rsi.length - 1];
    if (currentRSI < 30) {
      bullishScore += 2;
      signals.push('RSI في منطقة تشبع البيع');
    } else if (currentRSI > 70) {
      bearishScore += 2;
      signals.push('RSI في منطقة تشبع الشراء');
    }
    
    // تحليل MACD
    const currentMACD = macd.macd[macd.macd.length - 1];
    const currentSignal = macd.signal[macd.signal.length - 1];
    if (currentMACD > currentSignal) {
      bullishScore += 1;
      signals.push('MACD فوق خط الإشارة');
    } else {
      bearishScore += 1;
      signals.push('MACD تحت خط الإشارة');
    }
    
    // تحليل المتوسطات المتحركة
    const currentPrice = closes[closes.length - 1];
    const currentSMA20 = sma20[sma20.length - 1];
    const currentSMA50 = sma50[sma50.length - 1];
    
    if (currentPrice > currentSMA20 && currentSMA20 > currentSMA50) {
      bullishScore += 2;
      signals.push('السعر فوق المتوسطات المتحركة');
    } else if (currentPrice < currentSMA20 && currentSMA20 < currentSMA50) {
      bearishScore += 2;
      signals.push('السعر تحت المتوسطات المتحركة');
    }
    
    // تحليل الأنماط
    patterns.forEach(pattern => {
      if (pattern.signal === 'bullish') {
        bullishScore += pattern.confidence * 3;
        signals.push(`نمط صعودي: ${pattern.pattern}`);
      } else if (pattern.signal === 'bearish') {
        bearishScore += pattern.confidence * 3;
        signals.push(`نمط هبوطي: ${pattern.pattern}`);
      }
    });
    
    // تحديد نوع الإشارة
    const totalScore = bullishScore + bearishScore;
    const bullishPercent = totalScore > 0 ? bullishScore / totalScore : 0;
    
    let signalType: 'BUY' | 'SELL' | 'HOLD';
    let strength: number;
    
    if (bullishPercent > 0.65) {
      signalType = 'BUY';
      strength = bullishPercent * 100;
    } else if (bullishPercent < 0.35) {
      signalType = 'SELL';
      strength = (1 - bullishPercent) * 100;
    } else {
      signalType = 'HOLD';
      strength = 50;
    }
    
    // حساب نقاط الدخول والخروج
    const atr = this.calculateATR(data.slice(-14));
    const entry = currentPrice;
    const stopLoss = signalType === 'BUY' ? 
      Math.max(entry - (atr * 2), supportResistance.support[0] || entry * 0.95) :
      Math.min(entry + (atr * 2), supportResistance.resistance[0] || entry * 1.05);
    const takeProfit = signalType === 'BUY' ?
      Math.min(entry + (atr * 3), supportResistance.resistance[0] || entry * 1.1) :
      Math.max(entry - (atr * 3), supportResistance.support[0] || entry * 0.9);
    
    return {
      symbol,
      type: signalType,
      strength: Math.round(strength),
      confidence: Math.min(totalScore / 10, 1),
      entry,
      stopLoss,
      takeProfit,
      timeframe,
      reasoning: signals,
      timestamp: Date.now()
    };
  }

  private calculateATR(data: CandlestickData[], period: number = 14): number {
    const trueRanges: number[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];
      
      const tr1 = current.high - current.low;
      const tr2 = Math.abs(current.high - previous.close);
      const tr3 = Math.abs(current.low - previous.close);
      
      trueRanges.push(Math.max(tr1, tr2, tr3));
    }
    
    return trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period;
  }
}

export const technicalAnalysisService = new TechnicalAnalysisService();
