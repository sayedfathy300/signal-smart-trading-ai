
import { BacktestResult, BacktestTrade, EquityPoint, MonthlyReturn } from './tradingPlatformService';

export interface BacktestConfiguration {
  strategyId: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  commission: number;
  slippage: number;
  symbols: string[];
  timeframe: string;
  riskManagement: {
    maxDrawdown: number;
    maxDailyLoss: number;
    positionSizing: 'fixed' | 'kelly' | 'optimal_f';
  };
}

export interface BacktestMetrics {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  maxDrawdownDuration: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  calmarRatio: number;
  var95: number;
  expectedShortfall: number;
}

export interface PerformanceAnalysis {
  monthlyReturns: MonthlyReturn[];
  yearlyReturns: { year: number; return: number }[];
  drawdownPeriods: { start: Date; end: Date; drawdown: number }[];
  bestTrades: BacktestTrade[];
  worstTrades: BacktestTrade[];
  tradingStatsBySymbol: Record<string, {
    trades: number;
    winRate: number;
    totalReturn: number;
    averageHoldingTime: number;
  }>;
}

class BacktestingService {
  private strategies: Map<string, any> = new Map();
  private marketData: Map<string, any[]> = new Map();

  constructor() {
    this.initializeStrategies();
    this.generateMarketData();
  }

  private initializeStrategies() {
    // تهيئة استراتيجيات الباك تيست
    const strategies = [
      {
        id: 'scalping_ai_pro',
        name: 'AI Scalping Pro',
        entryConditions: {
          rsi: { below: 30, above: 70 },
          volume: { multiplier: 1.5 },
          sentiment: { weight: 0.3 }
        },
        exitConditions: {
          takeProfit: 0.01,
          stopLoss: 0.005,
          timeExit: 300 // 5 minutes
        }
      },
      {
        id: 'trend_following_adaptive',
        name: 'Adaptive Trend Following',
        entryConditions: {
          ema_crossover: true,
          atr_filter: true,
          volume_confirm: true
        },
        exitConditions: {
          takeProfit: 0.06,
          stopLoss: 0.02,
          trailingStop: true
        }
      },
      {
        id: 'mean_reversion_ml',
        name: 'ML Mean Reversion',
        entryConditions: {
          bollinger_deviation: 2.0,
          rsi_extreme: true,
          ml_confidence: 0.8
        },
        exitConditions: {
          takeProfit: 0.02,
          stopLoss: 0.01,
          mean_revert: true
        }
      }
    ];

    strategies.forEach(strategy => {
      this.strategies.set(strategy.id, strategy);
    });
  }

  private generateMarketData() {
    // توليد بيانات سوق تجريبية للباك تيست
    const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT'];
    const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
    
    symbols.forEach(symbol => {
      timeframes.forEach(timeframe => {
        const data = this.generateOHLCVData(symbol, timeframe, 10000); // 10k candles
        this.marketData.set(`${symbol}_${timeframe}`, data);
      });
    });
  }

  private generateOHLCVData(symbol: string, timeframe: string, count: number): any[] {
    const data = [];
    let price = 50000; // starting price
    const now = Date.now();
    const timeframeMs = this.getTimeframeMs(timeframe);

    for (let i = 0; i < count; i++) {
      const timestamp = now - (count - i) * timeframeMs;
      
      // Generate realistic price movement
      const volatility = 0.02;
      const drift = 0.0001;
      const change = (Math.random() - 0.5) * 2 * volatility + drift;
      
      const open = price;
      const close = price * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = 1000000 + Math.random() * 5000000;
      
      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
        // Additional indicators
        rsi: 30 + Math.random() * 40,
        ema20: close * (0.98 + Math.random() * 0.04),
        ema50: close * (0.96 + Math.random() * 0.08),
        volume_sma: volume * (0.8 + Math.random() * 0.4)
      });
      
      price = close;
    }

    return data;
  }

  private getTimeframeMs(timeframe: string): number {
    const timeframes: Record<string, number> = {
      '1m': 60000,
      '5m': 300000,
      '15m': 900000,
      '30m': 1800000,
      '1h': 3600000,
      '4h': 14400000,
      '1d': 86400000
    };
    return timeframes[timeframe] || 60000;
  }

  async runBacktest(config: BacktestConfiguration): Promise<BacktestResult> {
    console.log(`🔄 بدء الباك تيست للاستراتيجية: ${config.strategyId}`);
    
    const strategy = this.strategies.get(config.strategyId);
    if (!strategy) {
      throw new Error(`الاستراتيجية غير موجودة: ${config.strategyId}`);
    }

    const trades: BacktestTrade[] = [];
    const equity: EquityPoint[] = [];
    let currentCapital = config.initialCapital;
    let currentDrawdown = 0;
    let maxDrawdown = 0;
    let peakCapital = config.initialCapital;

    // محاكاة تنفيذ الباك تيست
    const symbols = config.symbols.length > 0 ? config.symbols : ['BTC/USDT', 'ETH/USDT'];
    
    for (const symbol of symbols) {
      const marketData = this.marketData.get(`${symbol}_${config.timeframe}`) || [];
      
      // تطبيق الاستراتيجية على البيانات
      const symbolTrades = await this.simulateStrategy(
        strategy, 
        marketData, 
        symbol, 
        config
      );
      
      trades.push(...symbolTrades);
    }

    // ترتيب الصفقات حسب التاريخ
    trades.sort((a, b) => a.entryDate - b.entryDate);

    // حساب منحنى الأسهم
    let runningCapital = config.initialCapital;
    
    trades.forEach(trade => {
      runningCapital += trade.pnl;
      
      // تحديث أقصى انخفاض
      if (runningCapital > peakCapital) {
        peakCapital = runningCapital;
        currentDrawdown = 0;
      } else {
        currentDrawdown = (peakCapital - runningCapital) / peakCapital;
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      }
      
      equity.push({
        timestamp: trade.exitDate,
        equity: runningCapital,
        drawdown: currentDrawdown
      });
    });

    // حساب العائدات الشهرية
    const monthlyReturns = this.calculateMonthlyReturns(trades, config.startDate, config.endDate);

    // حساب المؤشرات
    const totalReturn = ((runningCapital - config.initialCapital) / config.initialCapital) * 100;
    const tradingDays = (config.endDate.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24);
    const annualizedReturn = ((runningCapital / config.initialCapital) ** (365 / tradingDays) - 1) * 100;
    
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const winRate = trades.length > 0 ? winningTrades.length / trades.length : 0;
    
    const totalProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;
    
    // حساب نسبة شارب (محاكاة)
    const returns = trades.map(t => t.pnlPercent);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const returnStdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = returnStdDev > 0 ? (avgReturn * Math.sqrt(252)) / (returnStdDev * Math.sqrt(252)) : 0;

    console.log(`✅ اكتمل الباك تيست - العائد الإجمالي: ${totalReturn.toFixed(2)}%`);

    return {
      strategyId: config.strategyId,
      startDate: config.startDate.getTime(),
      endDate: config.endDate.getTime(),
      totalReturn,
      annualizedReturn,
      maxDrawdown: maxDrawdown * 100,
      sharpeRatio,
      winRate,
      totalTrades: trades.length,
      profitFactor,
      trades,
      equity,
      monthlyReturns
    };
  }

  private async simulateStrategy(
    strategy: any, 
    marketData: any[], 
    symbol: string, 
    config: BacktestConfiguration
  ): Promise<BacktestTrade[]> {
    const trades: BacktestTrade[] = [];
    let inPosition = false;
    let entryPrice = 0;
    let entryDate = 0;
    let positionSide: 'long' | 'short' = 'long';

    for (let i = 100; i < marketData.length - 1; i++) { // Start from 100 to have enough history
      const candle = marketData[i];
      const nextCandle = marketData[i + 1];
      
      if (!inPosition) {
        // Check entry conditions
        const shouldEnterLong = this.checkEntryConditions(strategy, marketData, i, 'long');
        const shouldEnterShort = this.checkEntryConditions(strategy, marketData, i, 'short');
        
        if (shouldEnterLong || shouldEnterShort) {
          inPosition = true;
          entryPrice = nextCandle.open; // Enter at next candle open
          entryDate = nextCandle.timestamp;
          positionSide = shouldEnterLong ? 'long' : 'short';
        }
      } else {
        // Check exit conditions
        const shouldExit = this.checkExitConditions(
          strategy, 
          marketData, 
          i, 
          entryPrice, 
          positionSide,
          candle.timestamp - entryDate
        );
        
        if (shouldExit || i === marketData.length - 2) { // Force exit at end
          const exitPrice = nextCandle.open;
          const exitDate = nextCandle.timestamp;
          
          const quantity = 1; // Simplified position sizing
          let pnl: number;
          
          if (positionSide === 'long') {
            pnl = (exitPrice - entryPrice) * quantity;
          } else {
            pnl = (entryPrice - exitPrice) * quantity;
          }
          
          // Apply commission and slippage
          const commission = (entryPrice + exitPrice) * quantity * config.commission;
          const slippage = (entryPrice + exitPrice) * quantity * config.slippage;
          pnl = pnl - commission - slippage;
          
          const pnlPercent = (pnl / (entryPrice * quantity)) * 100;
          
          trades.push({
            entryDate,
            exitDate,
            symbol,
            side: positionSide,
            entryPrice,
            exitPrice,
            quantity,
            pnl,
            pnlPercent,
            holdingPeriod: (exitDate - entryDate) / (1000 * 60 * 60 * 24), // days
            reason: shouldExit.reason || 'End of backtest'
          });
          
          inPosition = false;
        }
      }
    }

    return trades;
  }

  private checkEntryConditions(strategy: any, data: any[], index: number, side: 'long' | 'short'): boolean {
    const current = data[index];
    const previous = data[index - 1];
    
    // Simple entry logic based on strategy type
    if (strategy.id === 'scalping_ai_pro') {
      if (side === 'long') {
        return current.rsi < 30 && current.volume > current.volume_sma * 1.5;
      } else {
        return current.rsi > 70 && current.volume > current.volume_sma * 1.5;
      }
    } else if (strategy.id === 'trend_following_adaptive') {
      if (side === 'long') {
        return current.ema20 > current.ema50 && previous.ema20 <= previous.ema50;
      } else {
        return current.ema20 < current.ema50 && previous.ema20 >= previous.ema50;
      }
    } else if (strategy.id === 'mean_reversion_ml') {
      if (side === 'long') {
        return current.rsi < 25 && Math.random() > 0.8; // ML confidence simulation
      } else {
        return current.rsi > 75 && Math.random() > 0.8;
      }
    }
    
    return false;
  }

  private checkExitConditions(
    strategy: any, 
    data: any[], 
    index: number, 
    entryPrice: number, 
    side: 'long' | 'short',
    holdingTime: number
  ): { should: boolean; reason?: string } {
    const current = data[index];
    
    // Take profit and stop loss
    const takeProfit = strategy.exitConditions.takeProfit;
    const stopLoss = strategy.exitConditions.stopLoss;
    
    let pnlPercent: number;
    if (side === 'long') {
      pnlPercent = (current.close - entryPrice) / entryPrice;
    } else {
      pnlPercent = (entryPrice - current.close) / entryPrice;
    }
    
    if (pnlPercent >= takeProfit) {
      return { should: true, reason: 'Take Profit' };
    }
    
    if (pnlPercent <= -stopLoss) {
      return { should: true, reason: 'Stop Loss' };
    }
    
    // Time-based exit for scalping
    if (strategy.id === 'scalping_ai_pro' && holdingTime > 300000) { // 5 minutes
      return { should: true, reason: 'Time Exit' };
    }
    
    // Mean reversion exit
    if (strategy.id === 'mean_reversion_ml') {
      if (side === 'long' && current.rsi > 50) {
        return { should: true, reason: 'Mean Reversion' };
      }
      if (side === 'short' && current.rsi < 50) {
        return { should: true, reason: 'Mean Reversion' };
      }
    }
    
    return { should: false };
  }

  private calculateMonthlyReturns(
    trades: BacktestTrade[], 
    startDate: Date, 
    endDate: Date
  ): MonthlyReturn[] {
    const monthlyReturns: MonthlyReturn[] = [];
    const monthlyPnL: Record<string, { pnl: number; trades: number }> = {};
    
    trades.forEach(trade => {
      const date = new Date(trade.exitDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyPnL[monthKey]) {
        monthlyPnL[monthKey] = { pnl: 0, trades: 0 };
      }
      
      monthlyPnL[monthKey].pnl += trade.pnl;
      monthlyPnL[monthKey].trades += 1;
    });
    
    Object.entries(monthlyPnL).forEach(([month, data]) => {
      monthlyReturns.push({
        month,
        return: data.pnl,
        trades: data.trades
      });
    });
    
    return monthlyReturns.sort((a, b) => a.month.localeCompare(b.month));
  }

  async getDetailedMetrics(backtestResult: BacktestResult): Promise<BacktestMetrics> {
    const trades = backtestResult.trades;
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const totalProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    
    const returns = trades.map(t => t.pnlPercent);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const returnStdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    
    const downside = returns.filter(r => r < 0);
    const downsideStdDev = downside.length > 0 ? Math.sqrt(
      downside.reduce((sum, r) => sum + Math.pow(r, 2), 0) / downside.length
    ) : 0;
    
    return {
      totalReturn: backtestResult.totalReturn,
      annualizedReturn: backtestResult.annualizedReturn,
      volatility: returnStdDev * Math.sqrt(252) * 100,
      sharpeRatio: backtestResult.sharpeRatio,
      sortinoRatio: downsideStdDev > 0 ? (avgReturn * Math.sqrt(252)) / (downsideStdDev * Math.sqrt(252)) : 0,
      maxDrawdown: backtestResult.maxDrawdown,
      maxDrawdownDuration: 0, // Would need to calculate from equity curve
      winRate: backtestResult.winRate,
      profitFactor: backtestResult.profitFactor,
      averageWin: winningTrades.length > 0 ? totalProfit / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0,
      consecutiveWins: this.getMaxConsecutive(trades, true),
      consecutiveLosses: this.getMaxConsecutive(trades, false),
      calmarRatio: backtestResult.maxDrawdown > 0 ? backtestResult.annualizedReturn / backtestResult.maxDrawdown : 0,
      var95: this.calculateVaR(returns, 0.95),
      expectedShortfall: this.calculateExpectedShortfall(returns, 0.95)
    };
  }

  private getMaxConsecutive(trades: BacktestTrade[], wins: boolean): number {
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    
    trades.forEach(trade => {
      if ((wins && trade.pnl > 0) || (!wins && trade.pnl < 0)) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    });
    
    return maxConsecutive;
  }

  private calculateVaR(returns: number[], confidence: number): number {
    const sortedReturns = returns.slice().sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sortedReturns.length);
    return sortedReturns[index] || 0;
  }

  private calculateExpectedShortfall(returns: number[], confidence: number): number {
    const var95 = this.calculateVaR(returns, confidence);
    const tailReturns = returns.filter(r => r <= var95);
    return tailReturns.length > 0 ? tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length : 0;
  }

  async compareStrategies(
    strategyIds: string[], 
    config: Omit<BacktestConfiguration, 'strategyId'>
  ): Promise<{ strategy: string; result: BacktestResult; metrics: BacktestMetrics }[]> {
    const results = [];
    
    for (const strategyId of strategyIds) {
      const backtestConfig = { ...config, strategyId };
      const result = await this.runBacktest(backtestConfig);
      const metrics = await this.getDetailedMetrics(result);
      
      results.push({
        strategy: strategyId,
        result,
        metrics
      });
    }
    
    return results;
  }

  async optimizeStrategy(
    strategyId: string, 
    config: BacktestConfiguration,
    parameters: Record<string, { min: number; max: number; step: number }>
  ): Promise<{ bestParams: Record<string, number>; result: BacktestResult }> {
    console.log(`🔧 تحسين معاملات الاستراتيجية: ${strategyId}`);
    
    let bestResult: BacktestResult | null = null;
    let bestParams: Record<string, number> = {};
    let bestSharpe = -Infinity;
    
    // Simple grid search optimization
    const paramNames = Object.keys(parameters);
    const paramCombinations = this.generateParameterCombinations(parameters);
    
    for (const params of paramCombinations.slice(0, 50)) { // Limit to 50 combinations for demo
      try {
        // Update strategy parameters
        const modifiedConfig = { ...config };
        
        const result = await this.runBacktest(modifiedConfig);
        
        if (result.sharpeRatio > bestSharpe) {
          bestSharpe = result.sharpeRatio;
          bestResult = result;
          bestParams = { ...params };
        }
      } catch (error) {
        console.warn(`خطأ في تحسين المعاملات:`, params, error);
      }
    }
    
    console.log(`✅ أفضل معاملات: نسبة شارب = ${bestSharpe.toFixed(2)}`);
    
    return {
      bestParams,
      result: bestResult || await this.runBacktest(config)
    };
  }

  private generateParameterCombinations(
    parameters: Record<string, { min: number; max: number; step: number }>
  ): Record<string, number>[] {
    const combinations: Record<string, number>[] = [];
    const paramNames = Object.keys(parameters);
    
    if (paramNames.length === 0) return [{}];
    
    function generateCombos(index: number, current: Record<string, number>) {
      if (index === paramNames.length) {
        combinations.push({ ...current });
        return;
      }
      
      const paramName = paramNames[index];
      const param = parameters[paramName];
      
      for (let value = param.min; value <= param.max; value += param.step) {
        current[paramName] = value;
        generateCombos(index + 1, current);
      }
    }
    
    generateCombos(0, {});
    return combinations;
  }
}

export const backtestingService = new BacktestingService();
