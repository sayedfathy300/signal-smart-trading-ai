
// Mock service for browser compatibility - replaces ccxt dependency completely
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

export interface MockStrategy {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
}

class MockBacktestingService {
  private strategies: MockStrategy[] = [
    {
      id: 'sma_crossover',
      name: 'SMA Crossover',
      nameAr: 'تقاطع المتوسطات المتحركة',
      description: 'Simple Moving Average crossover strategy using 20 and 50 period SMAs',
      descriptionAr: 'استراتيجية تقاطع المتوسطات المتحركة البسيطة باستخدام فترات 20 و 50'
    },
    {
      id: 'rsi_oversold',
      name: 'RSI Oversold/Overbought',
      nameAr: 'مؤشر القوة النسبية',
      description: 'RSI-based strategy for oversold and overbought conditions',
      descriptionAr: 'استراتيجية مؤشر القوة النسبية لحالات التشبع البيعي والشرائي'
    },
    {
      id: 'bollinger_bands',
      name: 'Bollinger Bands',
      nameAr: 'نطاقات بولينجر',
      description: 'Mean reversion strategy using Bollinger Bands',
      descriptionAr: 'استراتيجية العودة للمتوسط باستخدام نطاقات بولينجر'
    },
    {
      id: 'macd_signal',
      name: 'MACD Signal',
      nameAr: 'إشارة الماكد',
      description: 'MACD signal line crossover strategy',
      descriptionAr: 'استراتيجية تقاطع خط إشارة الماكد'
    },
    {
      id: 'stochastic_oversold',
      name: 'Stochastic Oscillator',
      nameAr: 'مذبذب الستوكاستيك',
      description: 'Stochastic-based oversold/overbought strategy',
      descriptionAr: 'استراتيجية الستوكاستيك للتشبع البيعي والشرائي'
    }
  ];

  private symbols = [
    'BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'DOT/USDT', 'LINK/USDT',
    'BNB/USDT', 'XRP/USDT', 'LTC/USDT', 'BCH/USDT', 'UNI/USDT'
  ];

  private timeframes = [
    { value: '1m', label: '1 Minute', labelAr: '1 دقيقة' },
    { value: '5m', label: '5 Minutes', labelAr: '5 دقائق' },
    { value: '15m', label: '15 Minutes', labelAr: '15 دقيقة' },
    { value: '1h', label: '1 Hour', labelAr: '1 ساعة' },
    { value: '4h', label: '4 Hours', labelAr: '4 ساعات' },
    { value: '1d', label: '1 Day', labelAr: '1 يوم' },
    { value: '1w', label: '1 Week', labelAr: '1 أسبوع' }
  ];

  // Mock ccxt functionality
  static exchanges = ['binance', 'coinbase', 'kraken', 'bitfinex'];

  getAvailableStrategies(): MockStrategy[] {
    return this.strategies;
  }

  getAvailableSymbols(): string[] {
    return this.symbols;
  }

  getAvailableTimeframes() {
    return this.timeframes;
  }

  async runBacktest(config: MockBacktestConfiguration): Promise<MockBacktestResult> {
    // Simulate realistic processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    console.log('Running backtest with config:', config);

    // Generate realistic mock data based on configuration
    const trades = this.generateMockTrades(config);
    const equity = this.generateMockEquity(config);
    
    // Calculate realistic metrics
    const winningTrades = trades.filter(t => t.profit > 0);
    const losingTrades = trades.filter(t => t.profit <= 0);
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    
    const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const totalReturn = config.initialCapital > 0 ? (totalProfit / config.initialCapital) * 100 : 0;
    
    const avgWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, trade) => sum + trade.profit, 0) / winningTrades.length : 0;
    
    const avgLoss = losingTrades.length > 0 ? 
      Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0) / losingTrades.length) : 0;
    
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;
    
    // Calculate drawdown
    let maxEquity = config.initialCapital;
    let maxDrawdown = 0;
    
    equity.forEach(point => {
      if (point.value > maxEquity) {
        maxEquity = point.value;
      }
      const drawdown = ((maxEquity - point.value) / maxEquity) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    const result: MockBacktestResult = {
      totalReturn,
      winRate,
      profitFactor: Math.max(profitFactor, 0.1),
      maxDrawdown: -Math.abs(maxDrawdown),
      sharpeRatio: 1.2 + Math.random() * 1.5,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgWin,
      avgLoss,
      volatility: 12 + Math.random() * 8,
      calmarRatio: 1.8 + Math.random() * 1.2,
      sortinoRatio: 2.1 + Math.random() * 0.8,
      startDate: config.startDate,
      endDate: config.endDate,
      initialCapital: config.initialCapital,
      finalCapital: config.initialCapital + totalProfit,
      trades,
      equity
    };

    console.log('Backtest completed with result:', result);
    return result;
  }

  getDetailedMetrics(result: MockBacktestResult) {
    return {
      performance: {
        totalReturn: result.totalReturn,
        annualizedReturn: result.totalReturn * (365 / this.getDaysBetween(result.startDate, result.endDate)),
        volatility: result.volatility,
        sharpeRatio: result.sharpeRatio,
        sortinoRatio: result.sortinoRatio,
        calmarRatio: result.calmarRatio
      },
      risk: {
        maxDrawdown: result.maxDrawdown,
        valueAtRisk: -result.volatility * 1.65, // 95% VaR approximation
        beta: 0.85 + Math.random() * 0.3,
        correlation: 0.6 + Math.random() * 0.3
      },
      trading: {
        totalTrades: result.totalTrades,
        winRate: result.winRate,
        profitFactor: result.profitFactor,
        avgWin: result.avgWin,
        avgLoss: result.avgLoss,
        largestWin: Math.max(...result.trades.map(t => t.profit)),
        largestLoss: Math.min(...result.trades.map(t => t.profit))
      }
    };
  }

  private generateMockTrades(config: MockBacktestConfiguration) {
    const trades = [];
    const startDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate trades based on timeframe
    const timeframeMultiplier = this.getTimeframeMultiplier(config.timeframe);
    const numTrades = Math.floor(daysDiff / timeframeMultiplier);

    let currentPrice = 45000 + Math.random() * 10000; // Starting price

    for (let i = 0; i < numTrades; i++) {
      const tradeDate = new Date(startDate.getTime() + (i * timeframeMultiplier * 24 * 60 * 60 * 1000));
      
      // Price movement simulation
      currentPrice *= (1 + (Math.random() - 0.5) * 0.05); // ±2.5% price movement
      
      // Strategy-based win rate
      const strategyWinRate = this.getStrategyWinRate(config.strategy);
      const isWin = Math.random() < strategyWinRate;
      
      const baseProfit = config.initialCapital * (config.riskPerTrade / 100);
      const profit = isWin ? 
        baseProfit * (0.5 + Math.random() * 1.5) : 
        -baseProfit * (0.3 + Math.random() * 0.7);

      trades.push({
        date: tradeDate.toISOString().split('T')[0],
        type: Math.random() > 0.5 ? 'buy' : 'sell' as 'buy' | 'sell',
        price: currentPrice,
        quantity: (baseProfit / currentPrice) * (1 + Math.random() * 0.5),
        profit: profit * (1 - config.commission / 100) // Apply commission
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
    
    for (let i = 0; i <= daysDiff; i += 1) {
      const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      
      // Simulate realistic equity curve with some volatility
      const dailyReturn = (Math.random() - 0.45) * 0.03; // Slight upward bias
      currentValue *= (1 + dailyReturn);
      
      // Apply maximum drawdown constraint
      const maxAllowedDrawdown = config.initialCapital * (1 - config.maxDrawdown / 100);
      currentValue = Math.max(currentValue, maxAllowedDrawdown);
      
      equity.push({
        date: currentDate.toISOString().split('T')[0],
        value: Math.max(currentValue, config.initialCapital * 0.7) // Prevent going below 70%
      });
    }
    
    return equity;
  }

  private getTimeframeMultiplier(timeframe: string): number {
    const multipliers: { [key: string]: number } = {
      '1m': 0.001, '5m': 0.005, '15m': 0.015, '1h': 0.04, 
      '4h': 0.16, '1d': 1, '1w': 7
    };
    return multipliers[timeframe] || 1;
  }

  private getStrategyWinRate(strategy: string): number {
    const winRates: { [key: string]: number } = {
      'sma_crossover': 0.65,
      'rsi_oversold': 0.72,
      'bollinger_bands': 0.68,
      'macd_signal': 0.63,
      'stochastic_oversold': 0.70
    };
    return winRates[strategy] || 0.65;
  }

  private getDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Mock ccxt exchange methods
  static async loadExchange(exchangeId: string) {
    return new MockExchange(exchangeId);
  }
}

// Mock Exchange class to replace ccxt Exchange
class MockExchange {
  public id: string;
  public markets: any = {};
  public symbols: string[] = [];

  constructor(id: string) {
    this.id = id;
    this.symbols = [
      'BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'DOT/USDT', 'LINK/USDT',
      'BNB/USDT', 'XRP/USDT', 'LTC/USDT', 'BCH/USDT', 'UNI/USDT'
    ];
  }

  async loadMarkets() {
    // Mock market loading
    this.symbols.forEach(symbol => {
      this.markets[symbol] = {
        id: symbol.replace('/', ''),
        symbol,
        base: symbol.split('/')[0],
        quote: symbol.split('/')[1],
        active: true
      };
    });
    return this.markets;
  }

  async fetchOHLCV(symbol: string, timeframe: string, since?: number, limit?: number) {
    // Mock OHLCV data generation
    const data = [];
    const now = Date.now();
    const timeframeMs = this.parseTimeframe(timeframe);
    const count = limit || 100;

    for (let i = count; i >= 0; i--) {
      const timestamp = now - (i * timeframeMs);
      const open = 45000 + Math.random() * 10000;
      const close = open * (1 + (Math.random() - 0.5) * 0.02);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.random() * 1000;

      data.push([timestamp, open, high, low, close, volume]);
    }

    return data;
  }

  private parseTimeframe(timeframe: string): number {
    const unit = timeframe.slice(-1);
    const amount = parseInt(timeframe.slice(0, -1));
    
    const units: { [key: string]: number } = {
      'm': 60 * 1000,
      'h': 60 * 60 * 1000,
      'd': 24 * 60 * 60 * 1000,
      'w': 7 * 24 * 60 * 60 * 1000
    };

    return (units[unit] || 60000) * amount;
  }
}

// Export everything needed to replace ccxt
export const mockBacktestingService = new MockBacktestingService();
export default MockBacktestingService;

// Mock ccxt exports for compatibility
export const Exchange = MockExchange;
export const exchanges = MockBacktestingService.exchanges;
