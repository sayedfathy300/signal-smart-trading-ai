
export interface FixedFractionalStrategy {
  fraction: number;
  maxRisk: number;
  minPosition: number;
  maxPosition: number;
  portfolioValue: number;
  recommendations: string[];
  expectedReturn: number;
  riskMetrics: {
    volatility: number;
    maxDrawdown: number;
    winRate: number;
  };
}

export interface KellyCriterionResult {
  optimalFraction: number;
  expectedReturn: number;
  winProbability: number;
  avgWin: number;
  avgLoss: number;
  recommendation: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  maxDrawdownEstimate: number;
  kellyCriterion: number;
  adjustedKelly: number;
}

export interface SharpeResult {
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  treynorRatio: number;
  informationRatio: number;
  averageReturn: number;
  volatility: number;
  riskFreeRate: number;
  maxDrawdown: number;
  benchmark: {
    return: number;
    volatility: number;
    sharpe: number;
  };
}

export interface MonteCarloSimulation {
  finalValues: number[];
  percentiles: {
    p5: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
  };
  probabilityOfLoss: number;
  expectedValue: number;
  standardDeviation: number;
  maxLoss: number;
  maxGain: number;
  scenarios: Array<{
    path: number[];
    finalValue: number;
    maxDrawdown: number;
  }>;
  riskMetrics: {
    var95: number;
    cvar95: number;
    skewness: number;
    kurtosis: number;
  };
}

export interface CapitalManagementMetrics {
  totalCapital: number;
  allocatedCapital: number;
  availableCapital: number;
  utilizationRate: number;
  diversificationRatio: number;
  concentrationRisk: number;
  liquidityScore: number;
  riskAdjustedReturn: number;
  capitalEfficiency: number;
}

class CapitalManagementService {
  private portfolioHistory: number[] = [];
  private returns: number[] = [];
  private riskFreeRate = 0.02; // 2% سنوياً

  constructor() {
    this.initializeHistoricalData();
  }

  private initializeHistoricalData() {
    // توليد بيانات تاريخية محاكاة
    let price = 100000; // رأس مال ابتدائي
    for (let i = 0; i < 252; i++) { // سنة تداول
      const dailyReturn = (Math.random() - 0.48) * 0.03; // عائد يومي مع انحياز إيجابي طفيف
      price *= (1 + dailyReturn);
      this.portfolioHistory.push(price);
      this.returns.push(dailyReturn);
    }
  }

  // استراتيجية الكسر الثابت
  async calculateFixedFractional(
    portfolioValue: number,
    riskPercentage: number,
    stopLossPercentage: number
  ): Promise<FixedFractionalStrategy> {
    console.log(`💰 حساب استراتيجية الكسر الثابت - المخاطر: ${riskPercentage}%`);

    const riskAmount = portfolioValue * (riskPercentage / 100);
    const positionSize = riskAmount / (stopLossPercentage / 100);
    const fraction = positionSize / portfolioValue;

    // حساب المؤشرات المتوقعة
    const expectedReturn = this.calculateExpectedReturn();
    const volatility = this.calculateVolatility();
    const maxDrawdown = this.calculateMaxDrawdown();
    const winRate = this.calculateWinRate();

    const recommendations = [
      `حجم المركز المقترح: ${(fraction * 100).toFixed(2)}% من رأس المال`,
      `المبلغ المخاطر به: $${riskAmount.toFixed(2)}`,
      `حجم المركز: $${positionSize.toFixed(2)}`,
      fraction > 0.25 ? 'تحذير: حجم المركز عالي جداً' : 'حجم المركز مناسب',
      'استخدم أوامر وقف الخسارة دائماً',
      'راجع الاستراتيجية أسبوعياً'
    ];

    return {
      fraction,
      maxRisk: riskPercentage,
      minPosition: portfolioValue * 0.01, // 1% كحد أدنى
      maxPosition: portfolioValue * 0.25, // 25% كحد أقصى
      portfolioValue,
      recommendations,
      expectedReturn,
      riskMetrics: {
        volatility,
        maxDrawdown,
        winRate
      }
    };
  }

  // معيار كيلي المحسن
  async calculateKellyCriterion(
    winRate: number,
    avgWin: number,
    avgLoss: number,
    confidenceLevel: number = 0.8
  ): Promise<KellyCriterionResult> {
    console.log(`🎯 حساب معيار كيلي - معدل الفوز: ${(winRate * 100).toFixed(1)}%`);

    const lossRate = 1 - winRate;
    const payoffRatio = Math.abs(avgWin / avgLoss);
    
    // معادلة كيلي الأساسية
    const kellyCriterion = (winRate * payoffRatio - lossRate) / payoffRatio;
    
    // كيلي المعدل (أكثر تحفظاً)
    const adjustedKelly = kellyCriterion * confidenceLevel;
    const optimalFraction = Math.max(0, Math.min(adjustedKelly, 0.25));

    const expectedReturn = (winRate * avgWin) + (lossRate * avgLoss);
    const maxDrawdownEstimate = this.estimateMaxDrawdown(optimalFraction, avgLoss, winRate);

    let riskLevel: 'conservative' | 'moderate' | 'aggressive';
    let recommendation: string;

    if (optimalFraction < 0.05) {
      riskLevel = 'conservative';
      recommendation = 'استثمار محافظ. حجم مركز صغير مع مخاطر منخفضة.';
    } else if (optimalFraction < 0.15) {
      riskLevel = 'moderate';
      recommendation = 'استثمار متوازن. إمكانية عوائد جيدة مع مخاطر معقولة.';
    } else {
      riskLevel = 'aggressive';
      recommendation = 'استثمار عدواني. عوائد عالية محتملة مع مخاطر كبيرة.';
    }

    return {
      optimalFraction,
      expectedReturn,
      winProbability: winRate,
      avgWin,
      avgLoss,
      recommendation,
      riskLevel,
      maxDrawdownEstimate,
      kellyCriterion,
      adjustedKelly
    };
  }

  private estimateMaxDrawdown(fraction: number, avgLoss: number, winRate: number): number {
    const consecutiveLosses = Math.log(0.01) / Math.log(1 - winRate);
    return fraction * Math.abs(avgLoss) * consecutiveLosses;
  }

  // حساب نسب شارب وسورتينو المحسنة
  async calculateSharpeRatios(
    portfolioReturns: number[],
    benchmarkReturns?: number[]
  ): Promise<SharpeResult> {
    console.log(`📊 حساب مؤشرات الأداء المعدلة للمخاطر`);

    const avgReturn = this.calculateAverageReturn(portfolioReturns);
    const volatility = this.calculateVolatility(portfolioReturns);
    const maxDrawdown = this.calculateMaxDrawdown(portfolioReturns);
    
    // نسبة شارب
    const sharpeRatio = (avgReturn - this.riskFreeRate) / volatility;
    
    // نسبة سورتينو (يركز على التقلبات الهبوطية فقط)
    const downsideReturns = portfolioReturns.filter(r => r < 0);
    const downsideDeviation = downsideReturns.length > 0 ? 
      Math.sqrt(downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length) : 0;
    const sortinoRatio = downsideDeviation > 0 ? (avgReturn - this.riskFreeRate) / downsideDeviation : 0;
    
    // نسبة كالمار
    const calmarRatio = maxDrawdown > 0 ? avgReturn / Math.abs(maxDrawdown) : 0;
    
    // نسبة ترينور (يحتاج بيتا)
    const beta = benchmarkReturns ? this.calculateBeta(portfolioReturns, benchmarkReturns) : 1;
    const treynorRatio = (avgReturn - this.riskFreeRate) / beta;
    
    // نسبة المعلومات
    const informationRatio = benchmarkReturns ? 
      this.calculateInformationRatio(portfolioReturns, benchmarkReturns) : 0;

    const benchmark = benchmarkReturns ? {
      return: this.calculateAverageReturn(benchmarkReturns),
      volatility: this.calculateVolatility(benchmarkReturns),
      sharpe: (this.calculateAverageReturn(benchmarkReturns) - this.riskFreeRate) / this.calculateVolatility(benchmarkReturns)
    } : {
      return: 0.08,
      volatility: 0.15,
      sharpe: 0.4
    };

    return {
      sharpeRatio,
      sortinoRatio,
      calmarRatio,
      treynorRatio,
      informationRatio,
      averageReturn: avgReturn,
      volatility,
      riskFreeRate: this.riskFreeRate,
      maxDrawdown,
      benchmark
    };
  }

  // محاكاة مونت كارلو المتقدمة
  async runMonteCarloSimulation(
    initialCapital: number,
    expectedReturn: number,
    volatility: number,
    timeHorizon: number,
    numSimulations: number = 10000
  ): Promise<MonteCarloSimulation> {
    console.log(`🎲 تشغيل محاكاة مونت كارلو - ${numSimulations} سيناريو`);

    const scenarios: Array<{ path: number[]; finalValue: number; maxDrawdown: number }> = [];
    const finalValues: number[] = [];

    for (let sim = 0; sim < numSimulations; sim++) {
      const path: number[] = [initialCapital];
      let currentValue = initialCapital;
      let maxValue = initialCapital;
      let maxDrawdown = 0;

      for (let day = 1; day <= timeHorizon; day++) {
        // توليد عائد يومي باستخدام التوزيع العادي
        const randomReturn = this.generateNormalRandom(expectedReturn / 252, volatility / Math.sqrt(252));
        currentValue *= (1 + randomReturn);
        path.push(currentValue);

        // تتبع أقصى انخفاض
        if (currentValue > maxValue) {
          maxValue = currentValue;
        } else {
          const drawdown = (currentValue - maxValue) / maxValue;
          maxDrawdown = Math.min(maxDrawdown, drawdown);
        }
      }

      scenarios.push({
        path,
        finalValue: currentValue,
        maxDrawdown
      });
      finalValues.push(currentValue);
    }

    // ترتيب النتائج النهائية
    finalValues.sort((a, b) => a - b);

    const percentiles = {
      p5: finalValues[Math.floor(numSimulations * 0.05)],
      p25: finalValues[Math.floor(numSimulations * 0.25)],
      p50: finalValues[Math.floor(numSimulations * 0.50)],
      p75: finalValues[Math.floor(numSimulations * 0.75)],
      p95: finalValues[Math.floor(numSimulations * 0.95)]
    };

    const expectedValue = finalValues.reduce((sum, val) => sum + val, 0) / numSimulations;
    const variance = finalValues.reduce((sum, val) => sum + Math.pow(val - expectedValue, 2), 0) / numSimulations;
    const standardDeviation = Math.sqrt(variance);

    const probabilityOfLoss = finalValues.filter(val => val < initialCapital).length / numSimulations;
    const maxLoss = Math.min(...finalValues);
    const maxGain = Math.max(...finalValues);

    // حساب VaR و CVaR
    const var95 = initialCapital - percentiles.p5;
    const lossValues = finalValues.filter(val => val < percentiles.p5);
    const cvar95 = lossValues.length > 0 ? 
      initialCapital - (lossValues.reduce((sum, val) => sum + val, 0) / lossValues.length) : 0;

    // حساب الانحراف والتفلطح
    const mean = expectedValue;
    const skewness = finalValues.reduce((sum, val) => sum + Math.pow((val - mean) / standardDeviation, 3), 0) / numSimulations;
    const kurtosis = finalValues.reduce((sum, val) => sum + Math.pow((val - mean) / standardDeviation, 4), 0) / numSimulations - 3;

    return {
      finalValues,
      percentiles,
      probabilityOfLoss,
      expectedValue,
      standardDeviation,
      maxLoss,
      maxGain,
      scenarios: scenarios.slice(0, 100), // أول 100 سيناريو للعرض
      riskMetrics: {
        var95,
        cvar95,
        skewness,
        kurtosis
      }
    };
  }

  // حساب مؤشرات إدارة رأس المال
  async getCapitalManagementMetrics(
    positions: Array<{ value: number; asset: string; liquidity: number }>
  ): Promise<CapitalManagementMetrics> {
    const totalCapital = positions.reduce((sum, pos) => sum + pos.value, 0);
    const allocatedCapital = totalCapital; // جميع رأس المال مخصص
    const availableCapital = 0; // لا يوجد رأس مال متاح
    const utilizationRate = allocatedCapital / totalCapital;

    // نسبة التنويع (عكس مؤشر هيرفيندال)
    const weights = positions.map(pos => pos.value / totalCapital);
    const herfindahlIndex = weights.reduce((sum, w) => sum + w * w, 0);
    const diversificationRatio = 1 - herfindahlIndex;

    // مخاطر التركز
    const maxWeight = Math.max(...weights);
    const concentrationRisk = maxWeight;

    // نقاط السيولة
    const liquidityScore = positions.reduce((sum, pos) => 
      sum + (pos.value / totalCapital) * pos.liquidity, 0);

    // العائد المعدل للمخاطر
    const portfolioReturn = this.calculateExpectedReturn();
    const portfolioRisk = this.calculateVolatility();
    const riskAdjustedReturn = portfolioReturn / portfolioRisk;

    // كفاءة رأس المال
    const capitalEfficiency = portfolioReturn / utilizationRate;

    return {
      totalCapital,
      allocatedCapital,
      availableCapital,
      utilizationRate,
      diversificationRatio,
      concentrationRisk,
      liquidityScore,
      riskAdjustedReturn,
      capitalEfficiency
    };
  }

  // دوال مساعدة
  private generateNormalRandom(mean: number, stdDev: number): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  private calculateAverageReturn(returns?: number[]): number {
    const data = returns || this.returns;
    return data.reduce((sum, r) => sum + r, 0) / data.length;
  }

  private calculateVolatility(returns?: number[]): number {
    const data = returns || this.returns;
    const mean = this.calculateAverageReturn(data);
    const variance = data.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (data.length - 1);
    return Math.sqrt(variance) * Math.sqrt(252); // تقلبات سنوية
  }

  private calculateMaxDrawdown(returns?: number[]): number {
    const data = returns || this.returns;
    let maxDrawdown = 0;
    let peak = 1;
    let value = 1;

    for (const ret of data) {
      value *= (1 + ret);
      if (value > peak) {
        peak = value;
      } else {
        const drawdown = (peak - value) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    }

    return maxDrawdown;
  }

  private calculateWinRate(): number {
    const winningTrades = this.returns.filter(r => r > 0).length;
    return winningTrades / this.returns.length;
  }

  private calculateExpectedReturn(): number {
    return this.calculateAverageReturn() * 252; // عائد سنوي
  }

  private calculateBeta(portfolioReturns: number[], benchmarkReturns: number[]): number {
    const portfolioMean = this.calculateAverageReturn(portfolioReturns);
    const benchmarkMean = this.calculateAverageReturn(benchmarkReturns);
    
    let covariance = 0;
    let benchmarkVariance = 0;
    
    for (let i = 0; i < Math.min(portfolioReturns.length, benchmarkReturns.length); i++) {
      covariance += (portfolioReturns[i] - portfolioMean) * (benchmarkReturns[i] - benchmarkMean);
      benchmarkVariance += Math.pow(benchmarkReturns[i] - benchmarkMean, 2);
    }
    
    return benchmarkVariance > 0 ? covariance / benchmarkVariance : 1;
  }

  private calculateInformationRatio(portfolioReturns: number[], benchmarkReturns: number[]): number {
    const activeReturns = portfolioReturns.map((ret, i) => ret - (benchmarkReturns[i] || 0));
    const activeReturn = this.calculateAverageReturn(activeReturns);
    const trackingError = this.calculateVolatility(activeReturns);
    
    return trackingError > 0 ? activeReturn / trackingError : 0;
  }
}

export const capitalManagementService = new CapitalManagementService();
