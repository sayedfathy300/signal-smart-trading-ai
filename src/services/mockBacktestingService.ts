
// Mock service for browser compatibility - replaces ccxt dependency
export interface MockBacktestResult {
  totalReturn: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  volatility: number;
  calmarRatio: number;
  sortinoRatio: number;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  trades: Array<{
    date: string;
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
    profit: number;
  }>;
  equity: Array<{
    date: string;
    value: number;
  }>;
}

export interface MockBacktestConfiguration {
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

class MockBacktestingService {
  private strategies = [
    {
      id: 'sma_crossover',
      name: 'SMA Crossover',
      nameAr: 'تقاطع المتوسطات المتحركة',
      description: 'Simple Moving Average crossover strategy',
      descriptionAr: 'استراتيجية تقاطع المتوسطات المتحركة البسيطة'
    },
    {
      id: 'rsi_oversold',
      name: 'RSI Oversold',
      nameAr: 'مؤشر القوة النسبية',
      description: 'RSI oversold/overbought strategy',
      descriptionAr: 'استراتيجية مؤشر القوة النسبية'
    },
    {
      id: 'bollinger_bands',
      name: 'Bollinger Bands',
      nameAr: 'نطاقات بولينجر',
      description: 'Bollinger Bands mean reversion strategy',
      descriptionAr: 'استراتيجية نطاقات بولينجر'
    }
  ];

  getAvailableStrategies() {
    return this.strategies;
  }

  async runBacktest(config: MockBacktestConfiguration): Promise<MockBacktestResult> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock data based on configuration
    const trades = this.generateMockTrades(config);
    const equity = this.generateMockEquity(config);
    
    const totalReturn = ((config.initialCapital * 1.247) - config.initialCapital) / config.initialCapital * 100;
    const winningTrades = trades.filter(t => t.profit > 0).length;
    const losingTrades = trades.filter(t => t.profit < 0).length;
    const winRate = (winningTrades / trades.length) * 100;

    return {
      totalReturn,
      winRate,
      profitFactor: 2.12,
      maxDrawdown: -8.3,
      sharpeRatio: 1.85,
      totalTrades: trades.length,
      winningTrades,
      losingTrades,
      avgWin: 150.5,
      avgLoss: -85.2,
      volatility: 15.7,
      calmarRatio: 2.98,
      sortinoRatio: 2.45,
      startDate: config.startDate,
      endDate: config.endDate,
      initialCapital: config.initialCapital,
      finalCapital: config.initialCapital * 1.247,
      trades,
      equity
    };
  }

  getDetailedMetrics(result: MockBacktestResult) {
    return {
      volatility: result.volatility,
      calmarRatio: result.calmarRatio,
      sortinoRatio: result.sortinoRatio,
      maxDrawdown: result.maxDrawdown,
      profitFactor: result.profitFactor,
      sharpeRatio: result.sharpeRatio
    };
  }

  private generateMockTrades(config: MockBacktestConfiguration) {
    const trades = [];
    const startDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const numTrades = Math.floor(daysDiff / 7); // Roughly one trade per week

    for (let i = 0; i < numTrades; i++) {
      const tradeDate = new Date(startDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
      const isWin = Math.random() > 0.32; // 68% win rate
      const profit = isWin ? 
        Math.random() * 300 + 50 : 
        -(Math.random() * 150 + 30);

      trades.push({
        date: tradeDate.toISOString().split('T')[0],
        type: Math.random() > 0.5 ? 'buy' : 'sell' as 'buy' | 'sell',
        price: 45000 + Math.random() * 10000,
        quantity: 0.1 + Math.random() * 0.5,
        profit
      });
    }

    return trades;
  }

  private generateMockEquity(config: MockBacktestConfiguration) {
    const equity = [];
    const startDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let currentValue = config.initialCapital;
    
    for (let i = 0; i <= daysDiff; i += 7) {
      const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      
      // Simulate equity growth with some volatility
      const growth = (Math.random() - 0.3) * 0.02; // Slight upward bias
      currentValue *= (1 + growth);
      
      equity.push({
        date: currentDate.toISOString().split('T')[0],
        value: Math.max(currentValue, config.initialCapital * 0.8) // Prevent going below 80% of initial
      });
    }
    
    return equity;
  }
}

export const mockBacktestingService = new MockBacktestingService();
