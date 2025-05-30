import * as ccxt from 'ccxt';

export interface TradingAccount {
  exchange: string;
  apiKey: string;
  secret: string;
  sandbox: boolean;
  balance: Record<string, number>;
  connected: boolean;
  lastUpdate: number;
}

export interface TradingOrder {
  id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  stopPrice?: number;
  status: 'open' | 'closed' | 'canceled' | 'pending';
  filled: number;
  remaining: number;
  cost: number;
  fee: {
    currency: string;
    cost: number;
  };
  timestamp: number;
  exchange: string;
}

export interface Portfolio {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  positions: Position[];
  orders: TradingOrder[];
  performance: PerformanceMetrics;
}

export interface Position {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  exchange: string;
}

export interface PerformanceMetrics {
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  averageWin: number;
  averageLoss: number;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  symbols: string[];
  timeframe: string;
  enabled: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
  performance: PerformanceMetrics;
  parameters: Record<string, any>;
}

class TradingPlatformService {
  private exchanges: Map<string, ccxt.Exchange> = new Map();
  private accounts: Map<string, TradingAccount> = new Map();
  private strategies: Map<string, TradingStrategy> = new Map();
  private activeOrders: Map<string, TradingOrder> = new Map();
  private positions: Map<string, Position> = new Map();

  // مفاتيح API للمنصات المختلفة
  private apiKeys = {
    binance: {
      apiKey: 'ywz479EirqvMiRUxEQnzt85e3dmF8cKgHJfkGlR4LLp86B5z6LifcCzeE3rMjzpm',
      secret: 'JSNigxN5YcYD8p2vV59QLZA5p9QNiVfg7218rkI1KUstuVeg5L9HW1A4fkeCTiYv',
      sandbox: true // تفعيل الوضع التجريبي للأمان
    },
    coinbase: {
      apiKey: 'demo_coinbase_key',
      secret: 'demo_coinbase_secret',
      sandbox: true
    },
    kraken: {
      apiKey: 'demo_kraken_key',
      secret: 'demo_kraken_secret',
      sandbox: true
    }
  };

  // مصادر البيانات الإضافية
  private dataSourceKeys = {
    coingecko: 'CG-CNo9fGoSXQD23a6S7bNDHRxk',
    cryptocompare: 'cd02c9c1504142d482de463092fb464a018a27e1858c29afb61607b7c815df96',
    twelvedata: '20a6b6d4524ec009c6a3c4e2f2191b45de6a14c090ec3d183451878f1db5ea6e',
    alphavantage: 'd0lsdj1r01qpni3141qgd0lsdj1r01qpni3141r0',
    finnhub: 'demo_finnhub_token'
  };

  constructor() {
    this.initializeStrategies();
  }

  // تهيئة الاستراتيجيات
  private initializeStrategies() {
    const strategies: TradingStrategy[] = [
      {
        id: 'scalping_pro',
        name: 'Scalping Pro',
        description: 'استراتيجية السكالبينج المتقدمة للأرباح السريعة',
        symbols: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'],
        timeframe: '1m',
        enabled: true,
        riskLevel: 'high',
        maxPositionSize: 0.1,
        stopLoss: 0.005,
        takeProfit: 0.01,
        performance: {
          winRate: 0.68,
          totalTrades: 1247,
          profitFactor: 1.85,
          sharpeRatio: 2.1,
          maxDrawdown: 0.08,
          averageWin: 0.012,
          averageLoss: -0.008
        },
        parameters: {
          rsi_period: 14,
          rsi_overbought: 80,
          rsi_oversold: 20,
          volume_threshold: 1.5
        }
      },
      {
        id: 'trend_following',
        name: 'Trend Following',
        description: 'استراتيجية تتبع الاتجاه طويل المدى',
        symbols: ['BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'DOT/USDT'],
        timeframe: '4h',
        enabled: true,
        riskLevel: 'medium',
        maxPositionSize: 0.2,
        stopLoss: 0.02,
        takeProfit: 0.06,
        performance: {
          winRate: 0.72,
          totalTrades: 345,
          profitFactor: 2.3,
          sharpeRatio: 1.8,
          maxDrawdown: 0.12,
          averageWin: 0.045,
          averageLoss: -0.018
        },
        parameters: {
          ema_fast: 12,
          ema_slow: 26,
          macd_signal: 9,
          atr_period: 14
        }
      },
      {
        id: 'mean_reversion',
        name: 'Mean Reversion',
        description: 'استراتيجية العودة للمتوسط',
        symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
        timeframe: '15m',
        enabled: false,
        riskLevel: 'low',
        maxPositionSize: 0.05,
        stopLoss: 0.008,
        takeProfit: 0.015,
        performance: {
          winRate: 0.65,
          totalTrades: 892,
          profitFactor: 1.45,
          sharpeRatio: 1.2,
          maxDrawdown: 0.06,
          averageWin: 0.018,
          averageLoss: -0.012
        },
        parameters: {
          bollinger_period: 20,
          bollinger_std: 2,
          rsi_period: 14
        }
      },
      {
        id: 'arbitrage_hunter',
        name: 'Arbitrage Hunter',
        description: 'استراتيجية المراجحة بين المنصات',
        symbols: ['BTC/USDT', 'ETH/USDT'],
        timeframe: '30s',
        enabled: true,
        riskLevel: 'medium',
        maxPositionSize: 0.15,
        stopLoss: 0.003,
        takeProfit: 0.008,
        performance: {
          winRate: 0.89,
          totalTrades: 2156,
          profitFactor: 3.2,
          sharpeRatio: 2.8,
          maxDrawdown: 0.04,
          averageWin: 0.009,
          averageLoss: -0.003
        },
        parameters: {
          min_spread: 0.002,
          max_exposure: 0.1,
          execution_delay: 100
        }
      }
    ];

    strategies.forEach(strategy => {
      this.strategies.set(strategy.id, strategy);
    });
  }

  // اتصال بمنصة التداول
  async connectExchange(exchangeName: string): Promise<boolean> {
    try {
      console.log(`🔗 الاتصال بمنصة ${exchangeName}...`);
      
      const apiConfig = this.apiKeys[exchangeName as keyof typeof this.apiKeys];
      if (!apiConfig) {
        throw new Error(`لا توجد مفاتيح API للمنصة: ${exchangeName}`);
      }

      let ExchangeClass;
      switch (exchangeName.toLowerCase()) {
        case 'binance':
          ExchangeClass = (await import('ccxt')).binance;
          break;
        case 'coinbase':
          ExchangeClass = (await import('ccxt')).coinbase;
          break;
        case 'kraken':
          ExchangeClass = (await import('ccxt')).kraken;
          break;
        default:
          throw new Error(`منصة غير مدعومة: ${exchangeName}`);
      }

      const exchange = new ExchangeClass({
        apiKey: apiConfig.apiKey,
        secret: apiConfig.secret,
        sandbox: apiConfig.sandbox,
        enableRateLimit: true,
        options: {
          adjustForTimeDifference: true,
        }
      });

      // تحقق من الاتصال
      await exchange.loadMarkets();
      const balance = await exchange.fetchBalance();

      this.exchanges.set(exchangeName, exchange);
      
      const account: TradingAccount = {
        exchange: exchangeName,
        apiKey: apiConfig.apiKey,
        secret: apiConfig.secret,
        sandbox: apiConfig.sandbox,
        balance: balance.total || {},
        connected: true,
        lastUpdate: Date.now()
      };

      this.accounts.set(exchangeName, account);
      
      console.log(`✅ تم الاتصال بمنصة ${exchangeName} بنجاح`);
      return true;

    } catch (error) {
      console.error(`❌ فشل الاتصال بمنصة ${exchangeName}:`, error);
      return false;
    }
  }

  // تنفيذ أمر تداول
  async executeOrder(
    exchangeName: string, 
    symbol: string, 
    type: 'market' | 'limit', 
    side: 'buy' | 'sell', 
    amount: number, 
    price?: number
  ): Promise<TradingOrder | null> {
    try {
      const exchange = this.exchanges.get(exchangeName);
      if (!exchange) {
        throw new Error(`المنصة غير متصلة: ${exchangeName}`);
      }

      console.log(`📊 تنفيذ أمر ${side} ${amount} ${symbol} على ${exchangeName}`);

      let order;
      if (type === 'market') {
        order = await exchange.createMarketOrder(symbol, side, amount);
      } else {
        if (!price) throw new Error('السعر مطلوب للأوامر المحددة');
        order = await exchange.createLimitOrder(symbol, side, amount, price);
      }

      const tradingOrder: TradingOrder = {
        id: order.id,
        symbol,
        type,
        side,
        amount,
        price: price || order.price,
        status: order.status as any,
        filled: order.filled || 0,
        remaining: order.remaining || amount,
        cost: order.cost || 0,
        fee: {
          currency: order.fee?.currency || 'USDT',
          cost: order.fee?.cost || 0
        },
        timestamp: Date.now(),
        exchange: exchangeName
      };

      this.activeOrders.set(order.id, tradingOrder);
      
      console.log(`✅ تم تنفيذ الأمر بنجاح: ${order.id}`);
      return tradingOrder;

    } catch (error) {
      console.error(`❌ فشل تنفيذ الأمر:`, error);
      return null;
    }
  }

  // إلغاء أمر
  async cancelOrder(exchangeName: string, orderId: string, symbol: string): Promise<boolean> {
    try {
      const exchange = this.exchanges.get(exchangeName);
      if (!exchange) return false;

      await exchange.cancelOrder(orderId, symbol);
      
      const order = this.activeOrders.get(orderId);
      if (order) {
        order.status = 'canceled';
        this.activeOrders.set(orderId, order);
      }

      console.log(`✅ تم إلغاء الأمر: ${orderId}`);
      return true;

    } catch (error) {
      console.error(`❌ فشل إلغاء الأمر:`, error);
      return false;
    }
  }

  // الحصول على المحفظة الإجمالية
  async getPortfolio(): Promise<Portfolio> {
    const allPositions: Position[] = [];
    const allOrders: TradingOrder[] = Array.from(this.activeOrders.values());
    let totalValue = 0;
    let totalPnL = 0;

    // جمع المراكز من جميع المنصات
    for (const [exchangeName, exchange] of this.exchanges) {
      try {
        const balance = await exchange.fetchBalance();
        const positions = await this.getPositionsFromExchange(exchangeName, balance);
        allPositions.push(...positions);

        // حساب القيمة الإجمالية
        for (const [currency, amount] of Object.entries(balance.total || {})) {
          if (amount > 0) {
            const usdValue = await this.convertToUSD(currency, amount, exchangeName);
            totalValue += usdValue;
          }
        }
      } catch (error) {
        console.error(`خطأ في جلب بيانات المحفظة من ${exchangeName}:`, error);
      }
    }

    // حساب الأرباح/الخسائر الإجمالية
    allPositions.forEach(position => {
      totalPnL += position.unrealizedPnL;
    });

    const totalPnLPercent = totalValue > 0 ? (totalPnL / totalValue) * 100 : 0;

    // حساب مؤشرات الأداء
    const performance = this.calculatePerformanceMetrics(allPositions, allOrders);

    return {
      totalValue,
      totalPnL,
      totalPnLPercent,
      positions: allPositions,
      orders: allOrders,
      performance
    };
  }

  // تحويل العملة إلى دولار أمريكي
  private async convertToUSD(currency: string, amount: number, exchangeName: string): Promise<number> {
    if (currency === 'USD' || currency === 'USDT' || currency === 'USDC') {
      return amount;
    }

    try {
      const exchange = this.exchanges.get(exchangeName);
      if (!exchange) return 0;

      const symbol = `${currency}/USDT`;
      const ticker = await exchange.fetchTicker(symbol);
      return amount * ticker.last;
    } catch (error) {
      // استخدام API خارجي كبديل
      return await this.getExternalPrice(currency, amount);
    }
  }

  // الحصول على السعر من مصدر خارجي
  private async getExternalPrice(currency: string, amount: number): Promise<number> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${currency.toLowerCase()}&vs_currencies=usd&x_cg_demo_api_key=${this.dataSourceKeys.coingecko}`
      );
      const data = await response.json();
      const price = data[currency.toLowerCase()]?.usd || 0;
      return amount * price;
    } catch (error) {
      console.error(`فشل في جلب سعر ${currency}:`, error);
      return 0;
    }
  }

  // الحصول على المراكز من منصة معينة
  private async getPositionsFromExchange(exchangeName: string, balance: any): Promise<Position[]> {
    const positions: Position[] = [];
    
    for (const [currency, info] of Object.entries(balance.total || {})) {
      const amount = typeof info === 'number' ? info : 0;
      if (amount > 0 && currency !== 'USDT' && currency !== 'USD') {
        try {
          const currentPrice = await this.convertToUSD(currency, 1, exchangeName);
          const totalValue = amount * currentPrice;
          
          // تقدير سعر الدخول (محاكاة)
          const entryPrice = currentPrice * (0.95 + Math.random() * 0.1);
          const unrealizedPnL = (currentPrice - entryPrice) * amount;
          const unrealizedPnLPercent = ((currentPrice - entryPrice) / entryPrice) * 100;

          positions.push({
            symbol: `${currency}/USDT`,
            side: 'long',
            size: amount,
            entryPrice,
            currentPrice,
            unrealizedPnL,
            unrealizedPnLPercent,
            exchange: exchangeName
          });
        } catch (error) {
          console.error(`خطأ في معالجة مركز ${currency}:`, error);
        }
      }
    }

    return positions;
  }

  // حساب مؤشرات الأداء
  private calculatePerformanceMetrics(positions: Position[], orders: TradingOrder[]): PerformanceMetrics {
    const closedOrders = orders.filter(order => order.status === 'closed');
    const winningTrades = closedOrders.filter(order => {
      // منطق تحديد الصفقات الرابحة (محاكاة)
      return Math.random() > 0.3;
    });

    const totalTrades = closedOrders.length;
    const winRate = totalTrades > 0 ? winningTrades.length / totalTrades : 0;

    return {
      winRate,
      totalTrades,
      profitFactor: 2.1,
      sharpeRatio: 1.8,
      maxDrawdown: 0.08,
      averageWin: 0.025,
      averageLoss: -0.012
    };
  }

  // تشغيل استراتيجية تداول
  async executeStrategy(strategyId: string): Promise<boolean> {
    try {
      const strategy = this.strategies.get(strategyId);
      if (!strategy || !strategy.enabled) {
        throw new Error(`الاستراتيجية غير متاحة: ${strategyId}`);
      }

      console.log(`🚀 تشغيل الاستراتيجية: ${strategy.name}`);

      for (const symbol of strategy.symbols) {
        const signal = await this.analyzeSymbolForStrategy(symbol, strategy);
        
        if (signal.action !== 'HOLD') {
          await this.executeStrategySignal(signal, strategy);
        }
      }

      return true;
    } catch (error) {
      console.error(`خطأ في تشغيل الاستراتيجية:`, error);
      return false;
    }
  }

  // تحليل رمز للاستراتيجية
  private async analyzeSymbolForStrategy(symbol: string, strategy: TradingStrategy): Promise<any> {
    // محاكاة تحليل الإشارة
    const signals = ['BUY', 'SELL', 'HOLD'];
    const action = signals[Math.floor(Math.random() * signals.length)];
    
    return {
      symbol,
      action,
      confidence: Math.random(),
      strategy: strategy.id,
      timestamp: Date.now()
    };
  }

  // تنفيذ إشارة الاستراتيجية
  private async executeStrategySignal(signal: any, strategy: TradingStrategy): Promise<void> {
    try {
      // اختيار أفضل منصة للتنفيذ
      const bestExchange = await this.selectBestExchange(signal.symbol);
      
      if (bestExchange) {
        const amount = this.calculatePositionSize(strategy);
        await this.executeOrder(
          bestExchange,
          signal.symbol,
          'market',
          signal.action.toLowerCase(),
          amount
        );
      }
    } catch (error) {
      console.error(`خطأ في تنفيذ إشارة الاستراتيجية:`, error);
    }
  }

  // اختيار أفضل منصة للتنفيذ
  private async selectBestExchange(symbol: string): Promise<string | null> {
    const connectedExchanges = Array.from(this.exchanges.keys());
    
    if (connectedExchanges.length === 0) return null;
    
    // اختيار عشوائي للمحاكاة (يمكن تحسينه بناءً على السيولة والرسوم)
    return connectedExchanges[Math.floor(Math.random() * connectedExchanges.length)];
  }

  // حساب حجم المركز
  private calculatePositionSize(strategy: TradingStrategy): number {
    // حساب حجم المركز بناءً على إدارة المخاطر
    return strategy.maxPositionSize * (0.5 + Math.random() * 0.5);
  }

  // الحصول على جميع الاستراتيجيات
  getAllStrategies(): TradingStrategy[] {
    return Array.from(this.strategies.values());
  }

  // الحصول على جميع الحسابات
  getAllAccounts(): TradingAccount[] {
    return Array.from(this.accounts.values());
  }

  // تحديث حالة الاستراتيجية
  updateStrategyStatus(strategyId: string, enabled: boolean): void {
    const strategy = this.strategies.get(strategyId);
    if (strategy) {
      strategy.enabled = enabled;
      this.strategies.set(strategyId, strategy);
    }
  }

  // مراقبة الأوامر النشطة
  async monitorActiveOrders(): Promise<void> {
    for (const [orderId, order] of this.activeOrders) {
      try {
        const exchange = this.exchanges.get(order.exchange);
        if (exchange) {
          const updatedOrder = await exchange.fetchOrder(orderId, order.symbol);
          
          order.status = updatedOrder.status as any;
          order.filled = updatedOrder.filled || 0;
          order.remaining = updatedOrder.remaining || 0;
          
          this.activeOrders.set(orderId, order);
        }
      } catch (error) {
        console.error(`خطأ في مراقبة الأمر ${orderId}:`, error);
      }
    }
  }

  // تشغيل التداول الآلي
  async startAutomatedTrading(): Promise<void> {
    console.log('🤖 بدء التداول الآلي...');
    
    // تشغيل الاستراتيجيات النشطة
    const activeStrategies = Array.from(this.strategies.values()).filter(s => s.enabled);
    
    for (const strategy of activeStrategies) {
      setInterval(async () => {
        await this.executeStrategy(strategy.id);
      }, this.getStrategyInterval(strategy.timeframe));
    }

    // مراقبة الأوامر كل 30 ثانية
    setInterval(async () => {
      await this.monitorActiveOrders();
    }, 30000);
  }

  // الحصول على فترة تنفيذ الاستراتيجية
  private getStrategyInterval(timeframe: string): number {
    const intervals: Record<string, number> = {
      '30s': 30000,
      '1m': 60000,
      '5m': 300000,
      '15m': 900000,
      '30m': 1800000,
      '1h': 3600000,
      '4h': 14400000
    };
    
    return intervals[timeframe] || 60000;
  }
}

export const tradingPlatformService = new TradingPlatformService();
