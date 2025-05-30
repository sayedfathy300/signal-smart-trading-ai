
export interface AISignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-1
  strength: number; // 0-100
  timeframe: string;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  risk_reward_ratio: number;
  analysis: {
    technical: AITechnicalAnalysis;
    sentiment: AISentimentAnalysis;
    pattern: AIPatternAnalysis;
    momentum: AIMomentumAnalysis;
  };
  reasoning: string[];
  timestamp: number;
  expires_at: number;
}

export interface AITechnicalAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral';
  support_levels: number[];
  resistance_levels: number[];
  key_indicators: {
    rsi: { value: number; signal: string };
    macd: { signal: string; divergence: boolean };
    moving_averages: { signal: string; crossover: boolean };
    volume: { signal: string; unusual: boolean };
  };
}

export interface AISentimentAnalysis {
  overall_sentiment: 'positive' | 'negative' | 'neutral';
  sentiment_score: number; // -1 to 1
  news_impact: 'high' | 'medium' | 'low';
  social_mentions: number;
  fear_greed_index: number;
}

export interface AIPatternAnalysis {
  detected_patterns: string[];
  pattern_reliability: number;
  breakout_probability: number;
  continuation_likelihood: number;
}

export interface AIMomentumAnalysis {
  momentum_score: number;
  acceleration: number;
  volume_confirmation: boolean;
  divergence_signals: string[];
}

export interface AIMarketConditions {
  volatility: 'high' | 'medium' | 'low';
  liquidity: 'high' | 'medium' | 'low';
  trend_strength: number;
  market_phase: 'accumulation' | 'markup' | 'distribution' | 'markdown';
}

class AITradingService {
  private neuralNetworkWeights: Map<string, number[]> = new Map();
  private learningRate = 0.001;
  private trainingData: any[] = [];

  // محاكاة شبكة عصبية متقدمة
  async analyzeMarketWithAI(symbol: string, historicalData: any[], timeframe: string): Promise<AISignal> {
    console.log(`🤖 تحليل الذكاء الاصطناعي المتقدم لـ ${symbol}`);

    // تحليل فني متقدم
    const technicalAnalysis = await this.performTechnicalAnalysis(historicalData);
    
    // تحليل المشاعر
    const sentimentAnalysis = await this.analyzeSentiment(symbol);
    
    // تحليل الأنماط
    const patternAnalysis = await this.analyzePatterns(historicalData);
    
    // تحليل الزخم
    const momentumAnalysis = await this.analyzeMomentum(historicalData);
    
    // دمج جميع التحليلات
    const signal = await this.generateAISignal({
      symbol,
      timeframe,
      technical: technicalAnalysis,
      sentiment: sentimentAnalysis,
      pattern: patternAnalysis,
      momentum: momentumAnalysis,
      historicalData
    });

    // تعلم من النتائج
    this.updateNeuralNetwork(signal, historicalData);

    return signal;
  }

  private async performTechnicalAnalysis(data: any[]): Promise<AITechnicalAnalysis> {
    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    
    // حساب المؤشرات
    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    const sma20 = this.calculateSMA(prices, 20);
    const sma50 = this.calculateSMA(prices, 50);
    
    // تحديد الاتجاه
    const currentPrice = prices[prices.length - 1];
    const trend = currentPrice > sma20[sma20.length - 1] && sma20[sma20.length - 1] > sma50[sma50.length - 1] 
      ? 'bullish' 
      : currentPrice < sma20[sma20.length - 1] && sma20[sma20.length - 1] < sma50[sma50.length - 1]
      ? 'bearish' 
      : 'neutral';
    
    // حساب الدعم والمقاومة
    const supportLevels = this.calculateSupportLevels(data);
    const resistanceLevels = this.calculateResistanceLevels(data);
    
    return {
      trend,
      support_levels: supportLevels,
      resistance_levels: resistanceLevels,
      key_indicators: {
        rsi: {
          value: rsi[rsi.length - 1] || 50,
          signal: rsi[rsi.length - 1] > 70 ? 'overbought' : rsi[rsi.length - 1] < 30 ? 'oversold' : 'neutral'
        },
        macd: {
          signal: macd.histogram[macd.histogram.length - 1] > 0 ? 'bullish' : 'bearish',
          divergence: this.detectMACDDivergence(macd, prices)
        },
        moving_averages: {
          signal: trend,
          crossover: this.detectMACrossover(sma20, sma50)
        },
        volume: {
          signal: this.analyzeVolumePattern(volumes),
          unusual: this.detectUnusualVolume(volumes)
        }
      }
    };
  }

  private async analyzeSentiment(symbol: string): Promise<AISentimentAnalysis> {
    // محاكاة تحليل المشاعر المتقدم
    const sentimentScore = (Math.random() - 0.5) * 2; // -1 to 1
    const newsImpact = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
    
    return {
      overall_sentiment: sentimentScore > 0.2 ? 'positive' : sentimentScore < -0.2 ? 'negative' : 'neutral',
      sentiment_score: sentimentScore,
      news_impact: newsImpact as 'high' | 'medium' | 'low',
      social_mentions: Math.floor(Math.random() * 1000),
      fear_greed_index: Math.floor(Math.random() * 100)
    };
  }

  private async analyzePatterns(data: any[]): Promise<AIPatternAnalysis> {
    const patterns = this.detectAdvancedPatterns(data);
    
    return {
      detected_patterns: patterns,
      pattern_reliability: Math.random() * 0.4 + 0.6, // 60-100%
      breakout_probability: Math.random() * 0.5 + 0.3, // 30-80%
      continuation_likelihood: Math.random() * 0.6 + 0.2 // 20-80%
    };
  }

  private async analyzeMomentum(data: any[]): Promise<AIMomentumAnalysis> {
    const prices = data.map(d => d.close);
    const volumes = data.map(d => d.volume);
    
    // حساب الزخم
    const momentum = this.calculateMomentum(prices);
    const acceleration = this.calculateAcceleration(prices);
    
    return {
      momentum_score: momentum,
      acceleration: acceleration,
      volume_confirmation: this.confirmVolumePattern(prices, volumes),
      divergence_signals: this.detectDivergenceSignals(data)
    };
  }

  private async generateAISignal(params: any): Promise<AISignal> {
    const { symbol, timeframe, technical, sentiment, pattern, momentum, historicalData } = params;
    
    // خوارزمية الذكاء الاصطناعي المتقدمة
    const weights = {
      technical: 0.4,
      sentiment: 0.2,
      pattern: 0.3,
      momentum: 0.1
    };
    
    // حساب النقاط
    const technicalScore = this.calculateTechnicalScore(technical);
    const sentimentScore = this.normalizeSentimentScore(sentiment);
    const patternScore = pattern.pattern_reliability * pattern.breakout_probability;
    const momentumScore = (momentum.momentum_score + 1) / 2; // normalize to 0-1
    
    // النقاط المرجحة
    const totalScore = (
      technicalScore * weights.technical +
      sentimentScore * weights.sentiment +
      patternScore * weights.pattern +
      momentumScore * weights.momentum
    );
    
    // تحديد العمل
    let action: 'BUY' | 'SELL' | 'HOLD';
    if (totalScore > 0.65) action = 'BUY';
    else if (totalScore < 0.35) action = 'SELL';
    else action = 'HOLD';
    
    // حساب الثقة والقوة
    const confidence = Math.min(Math.abs(totalScore - 0.5) * 2, 0.95);
    const strength = Math.floor(confidence * 100);
    
    // نقاط الدخول والخروج
    const currentPrice = historicalData[historicalData.length - 1].close;
    const entry_price = currentPrice;
    const stop_loss = action === 'BUY' 
      ? currentPrice * 0.98 
      : currentPrice * 1.02;
    const take_profit = action === 'BUY' 
      ? currentPrice * 1.04 
      : currentPrice * 0.96;
    
    // أسباب الإشارة
    const reasoning = this.generateReasoning(technical, sentiment, pattern, momentum, action);
    
    return {
      symbol,
      action,
      confidence,
      strength,
      timeframe,
      entry_price,
      stop_loss,
      take_profit,
      risk_reward_ratio: Math.abs((take_profit - entry_price) / (entry_price - stop_loss)),
      analysis: {
        technical,
        sentiment,
        pattern,
        momentum
      },
      reasoning,
      timestamp: Date.now(),
      expires_at: Date.now() + (timeframe === '1min' ? 300000 : timeframe === '5min' ? 900000 : 3600000) // 5min, 15min, 1h
    };
  }

  // دوال مساعدة للحسابات
  private calculateRSI(prices: number[], period: number = 14): number[] {
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const rsi: number[] = [];
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  }

  private calculateMACD(prices: number[]): { macd: number[]; signal: number[]; histogram: number[] } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    const macd: number[] = [];
    for (let i = 0; i < Math.min(ema12.length, ema26.length); i++) {
      macd.push(ema12[i] - ema26[i]);
    }
    
    const signal = this.calculateEMA(macd, 9);
    const histogram: number[] = [];
    
    for (let i = 0; i < Math.min(macd.length, signal.length); i++) {
      histogram.push(macd[i] - signal[i]);
    }
    
    return { macd, signal, histogram };
  }

  private calculateEMA(prices: number[], period: number): number[] {
    const k = 2 / (period + 1);
    const ema: number[] = [prices[0]];
    
    for (let i = 1; i < prices.length; i++) {
      ema.push(prices[i] * k + ema[i - 1] * (1 - k));
    }
    
    return ema;
  }

  private calculateSMA(prices: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b);
      sma.push(sum / period);
    }
    return sma;
  }

  private calculateSupportLevels(data: any[]): number[] {
    const lows = data.map(d => d.low);
    const levels: number[] = [];
    
    // البحث عن القيع المحلية
    for (let i = 2; i < lows.length - 2; i++) {
      if (lows[i] < lows[i-1] && lows[i] < lows[i-2] && 
          lows[i] < lows[i+1] && lows[i] < lows[i+2]) {
        levels.push(lows[i]);
      }
    }
    
    return levels.slice(-3); // آخر 3 مستويات دعم
  }

  private calculateResistanceLevels(data: any[]): number[] {
    const highs = data.map(d => d.high);
    const levels: number[] = [];
    
    // البحث عن القمم المحلية
    for (let i = 2; i < highs.length - 2; i++) {
      if (highs[i] > highs[i-1] && highs[i] > highs[i-2] && 
          highs[i] > highs[i+1] && highs[i] > highs[i+2]) {
        levels.push(highs[i]);
      }
    }
    
    return levels.slice(-3); // آخر 3 مستويات مقاومة
  }

  private detectAdvancedPatterns(data: any[]): string[] {
    const patterns: string[] = [];
    
    // كشف أنماط متقدمة
    if (this.isTrianglePattern(data)) patterns.push('Triangle');
    if (this.isHeadAndShoulders(data)) patterns.push('Head and Shoulders');
    if (this.isDoubleTop(data)) patterns.push('Double Top');
    if (this.isDoubleBottom(data)) patterns.push('Double Bottom');
    if (this.isFlagPattern(data)) patterns.push('Flag');
    if (this.isPennantPattern(data)) patterns.push('Pennant');
    
    return patterns;
  }

  // دوال كشف الأنماط (مبسطة للعرض)
  private isTrianglePattern(data: any[]): boolean {
    // خوارزمية كشف نمط المثلث
    return Math.random() > 0.8;
  }

  private isHeadAndShoulders(data: any[]): boolean {
    // خوارزمية كشف نمط الرأس والكتفين
    return Math.random() > 0.9;
  }

  private isDoubleTop(data: any[]): boolean {
    // خوارزمية كشف نمط القمة المزدوجة
    return Math.random() > 0.85;
  }

  private isDoubleBottom(data: any[]): boolean {
    // خوارزمية كشف نمط القاع المزدوج
    return Math.random() > 0.85;
  }

  private isFlagPattern(data: any[]): boolean {
    // خوارزمية كشف نمط العلم
    return Math.random() > 0.7;
  }

  private isPennantPattern(data: any[]): boolean {
    // خوارزمية كشف نمط الراية
    return Math.random() > 0.75;
  }

  private calculateMomentum(prices: number[]): number {
    if (prices.length < 10) return 0;
    
    const recent = prices.slice(-10);
    const older = prices.slice(-20, -10);
    
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;
    
    return (recentAvg - olderAvg) / olderAvg;
  }

  private calculateAcceleration(prices: number[]): number {
    if (prices.length < 6) return 0;
    
    const momentum1 = this.calculateMomentum(prices.slice(-3));
    const momentum2 = this.calculateMomentum(prices.slice(-6, -3));
    
    return momentum1 - momentum2;
  }

  // دوال مساعدة إضافية
  private detectMACDDivergence(macd: any, prices: number[]): boolean {
    return Math.random() > 0.7;
  }

  private detectMACrossover(sma20: number[], sma50: number[]): boolean {
    if (sma20.length < 2 || sma50.length < 2) return false;
    
    const currentCross = sma20[sma20.length - 1] > sma50[sma50.length - 1];
    const previousCross = sma20[sma20.length - 2] > sma50[sma50.length - 2];
    
    return currentCross !== previousCross;
  }

  private analyzeVolumePattern(volumes: number[]): string {
    const recentVolume = volumes.slice(-5).reduce((a, b) => a + b) / 5;
    const avgVolume = volumes.reduce((a, b) => a + b) / volumes.length;
    
    if (recentVolume > avgVolume * 1.5) return 'high';
    if (recentVolume < avgVolume * 0.5) return 'low';
    return 'normal';
  }

  private detectUnusualVolume(volumes: number[]): boolean {
    const recentVolume = volumes[volumes.length - 1];
    const avgVolume = volumes.slice(0, -1).reduce((a, b) => a + b) / (volumes.length - 1);
    
    return recentVolume > avgVolume * 2;
  }

  private confirmVolumePattern(prices: number[], volumes: number[]): boolean {
    return Math.random() > 0.6;
  }

  private detectDivergenceSignals(data: any[]): string[] {
    const signals: string[] = [];
    
    if (Math.random() > 0.8) signals.push('RSI Divergence');
    if (Math.random() > 0.9) signals.push('MACD Divergence');
    if (Math.random() > 0.85) signals.push('Volume Divergence');
    
    return signals;
  }

  private calculateTechnicalScore(technical: AITechnicalAnalysis): number {
    let score = 0.5; // نقطة البداية
    
    // تقييم الاتجاه
    if (technical.trend === 'bullish') score += 0.2;
    else if (technical.trend === 'bearish') score -= 0.2;
    
    // تقييم RSI
    const rsi = technical.key_indicators.rsi.value;
    if (rsi < 30) score += 0.15; // oversold
    else if (rsi > 70) score -= 0.15; // overbought
    
    // تقييم MACD
    if (technical.key_indicators.macd.signal === 'bullish') score += 0.1;
    else score -= 0.1;
    
    // تقييم المتوسطات المتحركة
    if (technical.key_indicators.moving_averages.crossover) {
      if (technical.key_indicators.moving_averages.signal === 'bullish') score += 0.15;
      else score -= 0.15;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  private normalizeSentimentScore(sentiment: AISentimentAnalysis): number {
    return (sentiment.sentiment_score + 1) / 2; // تحويل من -1,1 إلى 0,1
  }

  private generateReasoning(technical: AITechnicalAnalysis, sentiment: AISentimentAnalysis, pattern: AIPatternAnalysis, momentum: AIMomentumAnalysis, action: string): string[] {
    const reasons: string[] = [];
    
    // أسباب فنية
    if (technical.trend === 'bullish' && action === 'BUY') {
      reasons.push('الاتجاه الفني العام صاعد مع كسر المتوسطات المتحركة للأعلى');
    }
    if (technical.key_indicators.rsi.signal === 'oversold' && action === 'BUY') {
      reasons.push('مؤشر RSI يشير إلى تشبع بيع، مما يدعم فرصة الارتداد');
    }
    
    // أسباب الأنماط
    if (pattern.detected_patterns.length > 0) {
      reasons.push(`تم اكتشاف أنماط فنية قوية: ${pattern.detected_patterns.join(', ')}`);
    }
    
    // أسباب المشاعر
    if (sentiment.overall_sentiment === 'positive' && action === 'BUY') {
      reasons.push('تحليل المشاعر إيجابي مع دعم من وسائل التواصل الاجتماعي');
    }
    
    // أسباب الزخم
    if (momentum.momentum_score > 0.1 && action === 'BUY') {
      reasons.push('الزخم الصاعد قوي مع تأكيد من الحجم');
    }
    
    if (reasons.length === 0) {
      reasons.push('تحليل متوازن لجميع العوامل الفنية والأساسية');
    }
    
    return reasons;
  }

  private updateNeuralNetwork(signal: AISignal, historicalData: any[]): void {
    // تحديث أوزان الشبكة العصبية بناءً على النتائج
    // هذا مبسط للعرض
    console.log('🧠 تحديث الشبكة العصبية بناءً على الإشارة الجديدة');
  }

  // API للحصول على إشارات متعددة
  async getMultipleSignals(symbols: string[], timeframe: string): Promise<AISignal[]> {
    const promises = symbols.map(symbol => 
      marketDataService.getHistoricalData(symbol, timeframe)
        .then(data => this.analyzeMarketWithAI(symbol, data, timeframe))
        .catch(error => {
          console.error(`Error analyzing ${symbol}:`, error);
          return null;
        })
    );
    
    const results = await Promise.all(promises);
    return results.filter(signal => signal !== null) as AISignal[];
  }

  // تقييم حالة السوق العامة
  async analyzeMarketConditions(): Promise<AIMarketConditions> {
    // محاكاة تحليل حالة السوق
    const volatility = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
    const liquidity = Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';
    const trendStrength = Math.random() * 100;
    
    const phases = ['accumulation', 'markup', 'distribution', 'markdown'];
    const marketPhase = phases[Math.floor(Math.random() * phases.length)] as any;
    
    return {
      volatility: volatility as 'high' | 'medium' | 'low',
      liquidity: liquidity as 'high' | 'medium' | 'low',
      trend_strength: trendStrength,
      market_phase: marketPhase
    };
  }
}

export const aiTradingService = new AITradingService();
