
export interface BacktestParameters {
  strategy: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  symbol: string;
  timeframe: string;
  commission: number;
  slippage: number;
}

export interface BacktestConfiguration {
  strategyId: string;
  strategy: string;
  symbol: string;
  symbols: string[];
  timeframe: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
  slippage: number;
  riskPerTrade: number;
  maxDrawdown: number;
  riskManagement: {
    maxDrawdown: number;
    maxDailyLoss: number;
    positionSizing: string;
  };
}

export interface BacktestTrade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  entryTime: number;
  exitTime: number;
  pnl: number;
  pnlPercent: number;
  commission: number;
  duration: number;
}

export interface BacktestResult {
  strategyId: string;
  strategy?: string;
  startDate: string;
  endDate: string;
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  avgTradeDuration: number;
  volatility: number;
  calmarRatio: number;
  trades: BacktestTrade[];
  equityCurve: Array<{
    timestamp: number;
    equity: number;
    drawdown: number;
  }>;
  equity: Array<{
    timestamp: number;
    equity: number;
    drawdown: number;
  }>;
  monthlyReturns: Array<{
    month: string;
    return: number;
    trades?: number;
  }>;
  performanceMetrics: {
    totalDays: number;
    tradingDays: number;
    bestDay: number;
    worstDay: number;
    consecutiveWins: number;
    consecutiveLosses: number;
  };
}

export interface BacktestMetrics {
  volatility: number;
  sortinoRatio: number;
  calmarRatio: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  var95: number;
  expectedShortfall: number;
  returnMetrics: {
    totalReturn: number;
    annualizedReturn: number;
    monthlyReturn: number;
    dailyReturn: number;
  };
  riskMetrics: {
    volatility: number;
    maxDrawdown: number;
    valueAtRisk: number;
    expectedShortfall: number;
  };
  ratioMetrics: {
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
    informationRatio: number;
  };
  tradeMetrics: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    avgTradeDuration: number;
  };
}

class BacktestingService {
  private strategies: Map<string, any> = new Map();

  constructor() {
    this.initializeStrategies();
  }

  private initializeStrategies() {
    // استراتيجيات تداول مختلفة
    this.strategies.set('sma_crossover', {
      name: 'Moving Average Crossover',
      description: 'استراتيجية تقاطع المتوسطات المتحركة',
      parameters: {
        shortPeriod: 10,
        longPeriod: 30
      }
    });

    this.strategies.set('rsi_oversold', {
      name: 'RSI Oversold/Overbought',
      description: 'استراتيجية مؤشر القوة النسبية',
      parameters: {
        period: 14,
        oversold: 30,
        overbought: 70
      }
    });

    this.strategies.set('bollinger_bands', {
      name: 'Bollinger Bands',
      description: 'استراتيجية نطاقات بولينجر',
      parameters: {
        period: 20,
        deviation: 2
      }
    });

    this.strategies.set('scalping_ai_pro', {
      name: 'AI Scalping Pro',
      description: 'استراتيجية السكالبينج المدعومة بالذكاء الاصطناعي',
      parameters: {
        rsiPeriod: 14,
        stochPeriod: 14,
        profitTarget: 0.5,
        stopLoss: 0.3
      }
    });

    this.strategies.set('trend_following_adaptive', {
      name: 'Adaptive Trend Following',
      description: 'استراتيجية متابعة الاتجاه التكيفية',
      parameters: {
        emaPeriod: 21,
        adxPeriod: 14,
        adxThreshold: 25
      }
    });
  }

  async runBacktest(params: BacktestParameters | BacktestConfiguration): Promise<BacktestResult> {
    console.log(`🔄 بدء تشغيل الباك تيست للاستراتيجية: ${params.strategy || (params as any).strategyId}`);

    // محاكاة تشغيل الباك تيست
    await this.simulateBacktestExecution();

    // توليد نتائج الباك تيست
    return this.generateBacktestResults(params);
  }

  getDetailedMetrics(result: BacktestResult): BacktestMetrics {
    return {
      volatility: result.volatility,
      sortinoRatio: result.sortinoRatio,
      calmarRatio: result.calmarRatio,
      profitFactor: result.profitFactor,
      averageWin: result.avgWin,
      averageLoss: Math.abs(result.avgLoss),
      largestWin: result.largestWin,
      largestLoss: Math.abs(result.largestLoss),
      consecutiveWins: result.performanceMetrics.consecutiveWins,
      consecutiveLosses: result.performanceMetrics.consecutiveLosses,
      var95: this.calculateVaR(result.trades),
      expectedShortfall: this.calculateES(result.trades),
      returnMetrics: {
        totalReturn: result.totalReturn,
        annualizedReturn: result.annualizedReturn,
        monthlyReturn: result.annualizedReturn / 12,
        dailyReturn: result.annualizedReturn / 252
      },
      riskMetrics: {
        volatility: result.volatility,
        maxDrawdown: result.maxDrawdown,
        valueAtRisk: this.calculateVaR(result.trades),
        expectedShortfall: this.calculateES(result.trades)
      },
      ratioMetrics: {
        sharpeRatio: result.sharpeRatio,
        sortinoRatio: result.sortinoRatio,
        calmarRatio: result.calmarRatio,
        informationRatio: result.sharpeRatio * 0.9
      },
      tradeMetrics: {
        totalTrades: result.totalTrades,
        winRate: result.winRate,
        profitFactor: result.profitFactor,
        avgTradeDuration: result.avgTradeDuration
      }
    };
  }

  private calculateVaR(trades: BacktestTrade[], confidence: number = 0.05): number {
    const returns = trades.map(t => t.pnlPercent).sort((a, b) => a - b);
    const index = Math.floor(returns.length * confidence);
    return returns[index] || 0;
  }

  private calculateES(trades: BacktestTrade[], confidence: number = 0.05): number {
    const returns = trades.map(t => t.pnlPercent).sort((a, b) => a - b);
    const index = Math.floor(returns.length * confidence);
    const tailReturns = returns.slice(0, index);
    return tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length || 0;
  }

  private async simulateBacktestExecution(): Promise<void> {
    // محاكاة وقت التنفيذ
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }

  private generateBacktestResults(params: BacktestParameters | BacktestConfiguration): BacktestResult {
    const trades = this.generateMockTrades(params);
    const initialCapital = params.initialCapital;
    const equityCurve = this.generateEquityCurve(initialCapital, trades);
    const monthlyReturns = this.generateMonthlyReturns();

    // حساب المؤشرات
    const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const totalReturnPercent = (totalPnL / initialCapital) * 100;
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const winRate = winningTrades.length / trades.length;
    const avgWin = winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length || 0;
    const avgLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length || 0);
    const profitFactor = avgWin / avgLoss || 0;

    // حساب أقصى انخفاض
    const maxDrawdown = this.calculateMaxDrawdown(equityCurve);

    // حساب نسبة شارب
    const returns = equityCurve.map((point, index) => {
      if (index === 0) return 0;
      return (point.equity - equityCurve[index - 1].equity) / equityCurve[index - 1].equity;
    }).slice(1);

    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const returnStd = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const sharpeRatio = avgReturn / returnStd * Math.sqrt(252); // سنوي

    const strategyId = (params as any).strategyId || params.strategy;
    const strategy = this.strategies.get(strategyId);

    return {
      strategyId,
      strategy: strategy?.name || strategyId,
      startDate: params.startDate,
      endDate: params.endDate,
      totalReturn: totalPnL,
      totalReturnPercent,
      annualizedReturn: totalReturnPercent * (365 / this.getDaysBetween(params.startDate, params.endDate)),
      maxDrawdown,
      sharpeRatio: isNaN(sharpeRatio) ? 0 : sharpeRatio,
      sortinoRatio: sharpeRatio * 1.2, // تقريبي
      winRate,
      profitFactor,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgWin,
      avgLoss,
      largestWin: Math.max(...trades.map(t => t.pnl)),
      largestLoss: Math.min(...trades.map(t => t.pnl)),
      avgTradeDuration: trades.reduce((sum, t) => sum + t.duration, 0) / trades.length,
      volatility: returnStd * Math.sqrt(252),
      calmarRatio: totalReturnPercent / Math.abs(maxDrawdown),
      trades,
      equityCurve,
      equity: equityCurve,
      monthlyReturns,
      performanceMetrics: {
        totalDays: this.getDaysBetween(params.startDate, params.endDate),
        tradingDays: 252,
        bestDay: Math.max(...returns) * 100,
        worstDay: Math.min(...returns) * 100,
        consecutiveWins: this.getMaxConsecutive(trades, true),
        consecutiveLosses: this.getMaxConsecutive(trades, false)
      }
    };
  }

  private generateMockTrades(params: BacktestParameters | BacktestConfiguration): BacktestTrade[] {
    const trades: BacktestTrade[] = [];
    const startTime = new Date(params.startDate).getTime();
    const endTime = new Date(params.endDate).getTime();
    const totalDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
    const numTrades = Math.floor(totalDays / 7); // تداول أسبوعي تقريباً

    const symbol = (params as any).symbol || (params as any).symbols?.[0] || 'BTC/USDT';

    for (let i = 0; i < numTrades; i++) {
      const entryTime = startTime + (i * 7 * 24 * 60 * 60 * 1000);
      const duration = Math.random() * 5 * 24 * 60 * 60 * 1000; // 1-5 أيام
      const exitTime = entryTime + duration;

      const entryPrice = 100 + Math.random() * 50;
      const priceChange = (Math.random() - 0.45) * 0.1; // انحياز إيجابي طفيف
      const exitPrice = entryPrice * (1 + priceChange);

      const quantity = Math.floor(Math.random() * 100) + 10;
      const pnl = (exitPrice - entryPrice) * quantity - params.commission;

      trades.push({
        id: `trade_${i}`,
        symbol,
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        quantity,
        entryPrice,
        exitPrice,
        entryTime,
        exitTime,
        pnl,
        pnlPercent: (exitPrice - entryPrice) / entryPrice * 100,
        commission: params.commission,
        duration: duration / (1000 * 60 * 60) // بالساعات
      });
    }

    return trades.sort((a, b) => a.entryTime - b.entryTime);
  }

  private generateEquityCurve(initialCapital: number, trades: BacktestTrade[]): Array<{timestamp: number; equity: number; drawdown: number}> {
    const curve = [{
      timestamp: trades[0]?.entryTime || Date.now(),
      equity: initialCapital,
      drawdown: 0
    }];

    let currentEquity = initialCapital;
    let peakEquity = initialCapital;

    trades.forEach(trade => {
      currentEquity += trade.pnl;
      if (currentEquity > peakEquity) {
        peakEquity = currentEquity;
      }
      
      const drawdown = (peakEquity - currentEquity) / peakEquity;

      curve.push({
        timestamp: trade.exitTime,
        equity: currentEquity,
        drawdown: drawdown * 100
      });
    });

    return curve;
  }

  private generateMonthlyReturns(): Array<{month: string; return: number; trades: number}> {
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    return months.map(month => ({
      month,
      return: (Math.random() - 0.4) * 20, // عوائد شهرية متنوعة
      trades: Math.floor(Math.random() * 50) + 10
    }));
  }

  private calculateMaxDrawdown(equityCurve: Array<{equity: number}>): number {
    let maxDrawdown = 0;
    let peak = equityCurve[0].equity;

    equityCurve.forEach(point => {
      if (point.equity > peak) {
        peak = point.equity;
      } else {
        const drawdown = (peak - point.equity) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    });

    return maxDrawdown * 100;
  }

  private getDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  private getMaxConsecutive(trades: BacktestTrade[], wins: boolean): number {
    let maxConsecutive = 0;
    let currentConsecutive = 0;

    trades.forEach(trade => {
      const isWin = trade.pnl > 0;
      if (isWin === wins) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    });

    return maxConsecutive;
  }

  getAvailableStrategies(): Array<{id: string; name: string; description: string}> {
    return Array.from(this.strategies.entries()).map(([id, strategy]) => ({
      id,
      name: strategy.name,
      description: strategy.description
    }));
  }

  async optimizeStrategy(strategyId: string, parameters: any): Promise<any> {
    console.log(`🔧 تحسين معايير الاستراتيجية: ${strategyId}`);
    
    // محاكاة تحسين المعايير
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      originalParameters: parameters,
      optimizedParameters: {
        ...parameters,
        // تحسينات تلقائية
        shortPeriod: Math.floor(Math.random() * 20) + 5,
        longPeriod: Math.floor(Math.random() * 50) + 25
      },
      improvementPercent: Math.random() * 30 + 10
    };
  }
}

export const backtestingService = new BacktestingService();
