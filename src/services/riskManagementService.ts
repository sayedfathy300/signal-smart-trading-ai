export interface KellyCriterionResult {
  optimalFraction: number;
  expectedReturn: number;
  winProbability: number;
  avgWin: number;
  avgLoss: number;
  recommendation: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  maxDrawdownEstimate: number;
}

export interface PortfolioOptimizationResult {
  optimalWeights: Record<string, number>;
  expectedReturn: number;
  expectedVolatility: number;
  sharpeRatio: number;
  efficientFrontier: Array<{
    risk: number;
    return: number;
    weights: Record<string, number>;
  }>;
  recommendations: string[];
}

export interface RiskParityStrategy {
  asset: string;
  currentWeight: number;
  riskContribution: number;
  targetRiskContribution: number;
  adjustedWeight: number;
  volatility: number;
  correlation: number;
}

export interface DrawdownManagement {
  currentDrawdown: number;
  maxDrawdown: number;
  drawdownDuration: number;
  recoveryTime: number;
  drawdownHistory: Array<{
    date: number;
    drawdown: number;
    portfolioValue: number;
  }>;
  riskMetrics: {
    var95: number;
    var99: number;
    cvar95: number;
    cvar99: number;
  };
  recommendations: string[];
}

export interface RiskManagementMetrics {
  totalRisk: number;
  concentrationRisk: number;
  liquidityRisk: number;
  marketRisk: number;
  operationalRisk: number;
  overallRiskScore: 'low' | 'medium' | 'high' | 'extreme';
  riskAdjustedReturn: number;
  informationRatio: number;
  calmarRatio: number;
  sortinoRatio: number;
  sharpeRatio: number;
}

class RiskManagementService {
  private portfolioData: any[] = [];
  private historicalReturns: Map<string, number[]> = new Map();
  private correlationMatrix: Map<string, Map<string, number>> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // تهيئة البيانات التاريخية للمحاكاة
    const assets = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'DOT/USDT', 'LINK/USDT'];
    
    assets.forEach(asset => {
      // توليد عوائد تاريخية محاكاة
      const returns = Array.from({ length: 252 }, () => 
        (Math.random() - 0.5) * 0.1 + (asset === 'BTC/USDT' ? 0.001 : 0.0005)
      );
      this.historicalReturns.set(asset, returns);
    });

    // حساب مصفوفة الارتباط
    this.calculateCorrelationMatrix(assets);
  }

  private calculateCorrelationMatrix(assets: string[]) {
    assets.forEach(asset1 => {
      const correlations = new Map<string, number>();
      assets.forEach(asset2 => {
        if (asset1 === asset2) {
          correlations.set(asset2, 1.0);
        } else {
          // محاكاة معاملات الارتباط
          const correlation = 0.3 + Math.random() * 0.4; // بين 0.3 و 0.7
          correlations.set(asset2, correlation);
        }
      });
      this.correlationMatrix.set(asset1, correlations);
    });
  }

  // حساب معيار كيلي
  async calculateKellyCriterion(
    asset: string,
    winRate: number,
    avgWin: number,
    avgLoss: number
  ): Promise<KellyCriterionResult> {
    console.log(`🎯 حساب معيار كيلي للأصل: ${asset}`);

    // معادلة كيلي: f = (bp - q) / b
    // حيث: b = odds received, p = probability of winning, q = probability of losing
    const lossRate = 1 - winRate;
    const odds = avgWin / Math.abs(avgLoss);
    
    const kellyCriterion = (winRate * odds - lossRate) / odds;
    const optimalFraction = Math.max(0, Math.min(kellyCriterion, 0.25)); // تحديد بـ 25%

    // حساب العائد المتوقع
    const expectedReturn = (winRate * avgWin) + (lossRate * avgLoss);

    // تقدير أقصى انخفاض
    const maxDrawdownEstimate = this.estimateMaxDrawdown(optimalFraction, avgLoss, winRate);

    // تحديد مستوى المخاطر
    let riskLevel: 'conservative' | 'moderate' | 'aggressive';
    let recommendation: string;

    if (optimalFraction < 0.05) {
      riskLevel = 'conservative';
      recommendation = 'استثمار محافظ مع حجم مركز صغير. المخاطر منخفضة والعوائد محدودة.';
    } else if (optimalFraction < 0.15) {
      riskLevel = 'moderate';
      recommendation = 'استثمار متوازن مع إمكانية عوائد جيدة ومخاطر معقولة.';
    } else {
      riskLevel = 'aggressive';
      recommendation = 'استثمار عدواني. عوائد عالية محتملة لكن مع مخاطر كبيرة.';
    }

    return {
      optimalFraction,
      expectedReturn,
      winProbability: winRate,
      avgWin,
      avgLoss,
      recommendation,
      riskLevel,
      maxDrawdownEstimate
    };
  }

  private estimateMaxDrawdown(fraction: number, avgLoss: number, winRate: number): number {
    // تقدير تقريبي لأقصى انخفاض بناءً على نظرية الاحتمالات
    const consecutiveLosses = Math.log(0.01) / Math.log(1 - winRate); // احتمال 1%
    return fraction * Math.abs(avgLoss) * consecutiveLosses;
  }

  // تحسين المحفظة (Modern Portfolio Theory)
  async optimizePortfolio(
    assets: string[],
    expectedReturns: number[],
    riskTolerance: number = 0.5
  ): Promise<PortfolioOptimizationResult> {
    console.log('📊 تحسين المحفظة باستخدام نظرية المحفظة الحديثة...');

    // حساب مصفوفة التباين والتباين المشترك
    const covarianceMatrix = this.calculateCovarianceMatrix(assets);
    
    // حساب الأوزان المثلى باستخدام خوارزمية تحسين تقريبية
    const optimalWeights = this.calculateOptimalWeights(
      assets,
      expectedReturns,
      covarianceMatrix,
      riskTolerance
    );

    // حساب العائد والمخاطر المتوقعة
    const expectedReturn = this.calculatePortfolioReturn(optimalWeights, expectedReturns);
    const expectedVolatility = this.calculatePortfolioVolatility(optimalWeights, covarianceMatrix);
    const sharpeRatio = expectedReturn / expectedVolatility;

    // توليد الحدود الكفؤة
    const efficientFrontier = this.generateEfficientFrontier(assets, expectedReturns, covarianceMatrix);

    const recommendations = [
      `المحفظة المثلى تحقق نسبة شارب قدرها ${sharpeRatio.toFixed(2)}`,
      `العائد المتوقع: ${(expectedReturn * 100).toFixed(2)}% سنوياً`,
      `المخاطر المتوقعة: ${(expectedVolatility * 100).toFixed(2)}% سنوياً`,
      'يُنصح بإعادة توازن المحفظة شهرياً',
      'مراقبة الارتباط بين الأصول باستمرار'
    ];

    return {
      optimalWeights,
      expectedReturn,
      expectedVolatility,
      sharpeRatio,
      efficientFrontier,
      recommendations
    };
  }

  private calculateCovarianceMatrix(assets: string[]): number[][] {
    const n = assets.length;
    const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          // التباين
          const returns = this.historicalReturns.get(assets[i]) || [];
          const variance = this.calculateVariance(returns);
          matrix[i][j] = variance;
        } else {
          // التباين المشترك
          const correlation = this.correlationMatrix.get(assets[i])?.get(assets[j]) || 0;
          const vol1 = Math.sqrt(this.calculateVariance(this.historicalReturns.get(assets[i]) || []));
          const vol2 = Math.sqrt(this.calculateVariance(this.historicalReturns.get(assets[j]) || []));
          matrix[i][j] = correlation * vol1 * vol2;
        }
      }
    }

    return matrix;
  }

  private calculateVariance(returns: number[]): number {
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
    return variance;
  }

  private calculateOptimalWeights(
    assets: string[],
    expectedReturns: number[],
    covarianceMatrix: number[][],
    riskTolerance: number
  ): Record<string, number> {
    // خوارزمية تحسين مبسطة (في الواقع نحتاج مكتبة تحسين متقدمة)
    const n = assets.length;
    let weights = Array(n).fill(1 / n); // بداية متساوية

    // تحسين تكراري بسيط
    for (let iter = 0; iter < 100; iter++) {
      const gradients = this.calculateGradients(weights, expectedReturns, covarianceMatrix, riskTolerance);
      
      // تحديث الأوزان
      for (let i = 0; i < n; i++) {
        weights[i] += 0.01 * gradients[i];
        weights[i] = Math.max(0, Math.min(1, weights[i])); // قيود الأوزان
      }

      // تطبيع الأوزان
      const sum = weights.reduce((s, w) => s + w, 0);
      weights = weights.map(w => w / sum);
    }

    // تحويل إلى كائن
    const result: Record<string, number> = {};
    assets.forEach((asset, idx) => {
      result[asset] = weights[idx];
    });

    return result;
  }

  private calculateGradients(
    weights: number[],
    expectedReturns: number[],
    covarianceMatrix: number[][],
    riskTolerance: number
  ): number[] {
    const n = weights.length;
    const gradients: number[] = Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      // gradient = expectedReturn - riskTolerance * (Σ covariance * weight)
      let riskComponent = 0;
      for (let j = 0; j < n; j++) {
        riskComponent += covarianceMatrix[i][j] * weights[j];
      }
      
      gradients[i] = expectedReturns[i] - riskTolerance * riskComponent;
    }

    return gradients;
  }

  private calculatePortfolioReturn(weights: Record<string, number>, expectedReturns: number[]): number {
    let portfolioReturn = 0;
    const assets = Object.keys(weights);
    
    assets.forEach((asset, idx) => {
      portfolioReturn += weights[asset] * expectedReturns[idx];
    });

    return portfolioReturn;
  }

  private calculatePortfolioVolatility(weights: Record<string, number>, covarianceMatrix: number[][]): number {
    const weightsArray = Object.values(weights);
    let variance = 0;

    for (let i = 0; i < weightsArray.length; i++) {
      for (let j = 0; j < weightsArray.length; j++) {
        variance += weightsArray[i] * weightsArray[j] * covarianceMatrix[i][j];
      }
    }

    return Math.sqrt(variance);
  }

  private generateEfficientFrontier(
    assets: string[],
    expectedReturns: number[],
    covarianceMatrix: number[][]
  ): Array<{ risk: number; return: number; weights: Record<string, number> }> {
    const frontier: Array<{ risk: number; return: number; weights: Record<string, number> }> = [];

    // توليد نقاط مختلفة على الحدود الكفؤة
    for (let tolerance = 0.1; tolerance <= 2.0; tolerance += 0.1) {
      const weights = this.calculateOptimalWeights(assets, expectedReturns, covarianceMatrix, tolerance);
      const portfolioReturn = this.calculatePortfolioReturn(weights, expectedReturns);
      const portfolioRisk = this.calculatePortfolioVolatility(weights, covarianceMatrix);

      frontier.push({
        risk: portfolioRisk,
        return: portfolioReturn,
        weights
      });
    }

    return frontier.sort((a, b) => a.risk - b.risk);
  }

  // استراتيجية Risk Parity
  async calculateRiskParity(assets: string[]): Promise<RiskParityStrategy[]> {
    console.log('⚖️ حساب استراتيجية Risk Parity...');

    const strategies: RiskParityStrategy[] = [];

    for (const asset of assets) {
      const returns = this.historicalReturns.get(asset) || [];
      const volatility = Math.sqrt(this.calculateVariance(returns)) * Math.sqrt(252); // تقلبات سنوية

      // حساب الوزن العكسي للتقلبات
      const inverseVolWeight = 1 / volatility;
      
      // محاكاة الأوزان الحالية والارتباط
      const currentWeight = Math.random() * 0.3 + 0.1; // بين 10% و 40%
      const correlation = 0.5 + Math.random() * 0.3; // بين 0.5 و 0.8

      // حساب مساهمة المخاطر
      const riskContribution = currentWeight * volatility;
      const targetRiskContribution = 1 / assets.length; // متساوية لجميع الأصول
      
      // حساب الوزن المعدل
      const adjustedWeight = targetRiskContribution / volatility;

      strategies.push({
        asset,
        currentWeight,
        riskContribution,
        targetRiskContribution,
        adjustedWeight: Math.min(adjustedWeight, 0.5), // حد أقصى 50%
        volatility,
        correlation
      });
    }

    // تطبيع الأوزان المعدلة
    const totalAdjustedWeight = strategies.reduce((sum, s) => sum + s.adjustedWeight, 0);
    strategies.forEach(strategy => {
      strategy.adjustedWeight = strategy.adjustedWeight / totalAdjustedWeight;
    });

    return strategies;
  }

  // إدارة الانخفاض (Drawdown Management)
  async analyzeDrawdown(portfolioHistory: Array<{ date: number; value: number }>): Promise<DrawdownManagement> {
    console.log('📉 تحليل إدارة الانخفاض...');

    let maxValue = portfolioHistory[0]?.value || 100000;
    let maxDrawdown = 0;
    let currentDrawdown = 0;
    let drawdownStart = 0;
    let maxDrawdownDuration = 0;
    let currentDrawdownDuration = 0;

    const drawdownHistory: Array<{ date: number; drawdown: number; portfolioValue: number }> = [];

    // حساب تاريخ الانخفاض
    portfolioHistory.forEach((point, index) => {
      if (point.value > maxValue) {
        maxValue = point.value;
        if (currentDrawdown < 0) {
          // انتهاء فترة الانخفاض
          maxDrawdownDuration = Math.max(maxDrawdownDuration, currentDrawdownDuration);
          currentDrawdownDuration = 0;
        }
        currentDrawdown = 0;
      } else {
        currentDrawdown = (point.value - maxValue) / maxValue;
        currentDrawdownDuration = index - drawdownStart;
        
        if (currentDrawdown < maxDrawdown) {
          maxDrawdown = currentDrawdown;
        }
      }

      drawdownHistory.push({
        date: point.date,
        drawdown: currentDrawdown,
        portfolioValue: point.value
      });
    });

    // حساب VaR و CVaR
    const returns = portfolioHistory.slice(1).map((point, index) => 
      (point.value - portfolioHistory[index].value) / portfolioHistory[index].value
    );

    returns.sort((a, b) => a - b);
    
    const var95Index = Math.floor(returns.length * 0.05);
    const var99Index = Math.floor(returns.length * 0.01);
    
    const var95 = returns[var95Index] || 0;
    const var99 = returns[var99Index] || 0;
    
    // CVaR (متوسط الخسائر في أسوأ الحالات)
    const cvar95 = returns.slice(0, var95Index + 1).reduce((sum, r) => sum + r, 0) / (var95Index + 1);
    const cvar99 = returns.slice(0, var99Index + 1).reduce((sum, r) => sum + r, 0) / (var99Index + 1);

    const recommendations = [
      `الانخفاض الأقصى الحالي: ${(Math.abs(currentDrawdown) * 100).toFixed(2)}%`,
      `الانخفاض الأقصى التاريخي: ${(Math.abs(maxDrawdown) * 100).toFixed(2)}%`,
      maxDrawdown < -0.1 ? 'يُنصح بتقليل حجم المراكز' : 'مستوى المخاطر مقبول',
      'استخدام أوامر وقف الخسارة المتحركة',
      'مراجعة استراتيجية التنويع'
    ];

    return {
      currentDrawdown,
      maxDrawdown,
      drawdownDuration: currentDrawdownDuration,
      recoveryTime: maxDrawdownDuration,
      drawdownHistory,
      riskMetrics: {
        var95: Math.abs(var95),
        var99: Math.abs(var99),
        cvar95: Math.abs(cvar95),
        cvar99: Math.abs(cvar99)
      },
      recommendations
    };
  }

  // حساب مقاييس إدارة المخاطر الشاملة
  async calculateRiskMetrics(portfolioData: any): Promise<RiskManagementMetrics> {
    console.log('📊 حساب مقاييس إدارة المخاطر...');

    // محاكاة المقاييس المختلفة
    const concentrationRisk = Math.random() * 0.4 + 0.1; // 10-50%
    const liquidityRisk = Math.random() * 0.3 + 0.05; // 5-35%
    const marketRisk = Math.random() * 0.6 + 0.2; // 20-80%
    const operationalRisk = Math.random() * 0.2 + 0.05; // 5-25%

    const totalRisk = (concentrationRisk + liquidityRisk + marketRisk + operationalRisk) / 4;

    let overallRiskScore: 'low' | 'medium' | 'high' | 'extreme';
    if (totalRisk < 0.2) overallRiskScore = 'low';
    else if (totalRisk < 0.4) overallRiskScore = 'medium';
    else if (totalRisk < 0.7) overallRiskScore = 'high';
    else overallRiskScore = 'extreme';

    // مؤشرات الأداء المعدلة للمخاطر
    const riskFreeRate = 0.02; // 2% سنوياً
    const portfolioReturn = 0.15; // 15% سنوياً محاكاة
    const portfolioVolatility = 0.25; // 25% تقلبات محاكاة
    const downSideVolatility = 0.18; // 18% تقلبات هبوطية محاكاة

    const riskAdjustedReturn = portfolioReturn / totalRisk;
    const informationRatio = (portfolioReturn - 0.1) / 0.05; // مقارنة بمؤشر محاكي
    const calmarRatio = portfolioReturn / 0.15; // مقارنة بأقصى انخفاض محاكي
    const sortinoRatio = (portfolioReturn - riskFreeRate) / downSideVolatility;
    const sharpeRatio = (portfolioReturn - riskFreeRate) / portfolioVolatility;

    return {
      totalRisk,
      concentrationRisk,
      liquidityRisk,
      marketRisk,
      operationalRisk,
      overallRiskScore,
      riskAdjustedReturn,
      informationRatio,
      calmarRatio,
      sortinoRatio,
      sharpeRatio
    };
  }

  // تحسين الأوزان بناءً على معيار كيلي
  async optimizePositionSizing(
    assets: string[],
    winRates: number[],
    avgWins: number[],
    avgLosses: number[]
  ): Promise<Record<string, number>> {
    const optimalSizes: Record<string, number> = {};

    for (let i = 0; i < assets.length; i++) {
      const kelly = await this.calculateKellyCriterion(assets[i], winRates[i], avgWins[i], avgLosses[i]);
      optimalSizes[assets[i]] = kelly.optimalFraction;
    }

    return optimalSizes;
  }

  // مراقبة المخاطر في الوقت الفعلي
  async monitorRealTimeRisk(currentPositions: any[]): Promise<{
    alerts: string[];
    riskLevel: 'safe' | 'warning' | 'danger';
    recommendations: string[];
  }> {
    const alerts: string[] = [];
    let riskLevel: 'safe' | 'warning' | 'danger' = 'safe';
    const recommendations: string[] = [];

    // فحص تركز المحفظة
    const totalValue = currentPositions.reduce((sum, pos) => sum + pos.value, 0);
    const maxPosition = Math.max(...currentPositions.map(pos => pos.value / totalValue));

    if (maxPosition > 0.5) {
      alerts.push('تحذير: تركز عالي في أصل واحد (>50%)');
      riskLevel = 'danger';
      recommendations.push('تنويع المحفظة فوراً');
    } else if (maxPosition > 0.3) {
      alerts.push('تنبيه: تركز متوسط في أصل واحد (>30%)');
      riskLevel = 'warning';
      recommendations.push('النظر في تقليل حجم المركز الأكبر');
    }

    // فحص الرافعة المالية
    const totalLeverage = currentPositions.reduce((sum, pos) => sum + (pos.leverage || 1), 0) / currentPositions.length;
    if (totalLeverage > 10) {
      alerts.push('تحذير: رافعة مالية عالية جداً');
      riskLevel = 'danger';
    }

    return { alerts, riskLevel, recommendations };
  }
}

export const riskManagementService = new RiskManagementService();
