
export interface OrderBookLevel {
  price: number;
  size: number;
  count: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
  checksum?: string;
}

export interface LatencyMetrics {
  roundTripTime: number;
  orderExecutionTime: number;
  dataLatency: number;
  networkLatency: number;
  averageLatency: number;
  jitter: number;
  uptime: number;
}

export interface HFTStrategy {
  id: string;
  name: string;
  type: 'market_making' | 'arbitrage' | 'momentum' | 'mean_reversion';
  symbols: string[];
  maxOrderSize: number;
  minSpread: number;
  maxPositionSize: number;
  enabled: boolean;
  performance: {
    totalTrades: number;
    winRate: number;
    avgProfit: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

export interface HFTSignal {
  strategy: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  size: number;
  confidence: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  metadata: Record<string, any>;
}

export interface ArbitrageOpportunity {
  symbol: string;
  exchange1: string;
  exchange2: string;
  price1: number;
  price2: number;
  spread: number;
  spreadPercent: number;
  volume: number;
  profit: number;
  timestamp: number;
  expiry: number;
}

class HighFrequencyTradingService {
  private workers: Map<string, Worker> = new Map();
  private webSockets: Map<string, WebSocket> = new Map();
  private orderBooks: Map<string, OrderBook> = new Map();
  private strategies: Map<string, HFTStrategy> = new Map();
  private latencyMetrics: Map<string, LatencyMetrics> = new Map();
  private arbitrageOpportunities: ArbitrageOpportunity[] = [];
  private isActive = false;
  private performanceStartTime = Date.now();

  constructor() {
    this.initializeStrategies();
    this.initializeWorkers();
  }

  private initializeStrategies() {
    const strategies: HFTStrategy[] = [
      {
        id: 'market_maker_btc',
        name: 'BTC Market Maker',
        type: 'market_making',
        symbols: ['BTC/USDT'],
        maxOrderSize: 0.1,
        minSpread: 0.01,
        maxPositionSize: 1.0,
        enabled: true,
        performance: {
          totalTrades: 2847,
          winRate: 0.73,
          avgProfit: 0.0012,
          maxDrawdown: 0.003,
          sharpeRatio: 3.2
        }
      },
      {
        id: 'arbitrage_multi',
        name: 'Multi-Exchange Arbitrage',
        type: 'arbitrage',
        symbols: ['BTC/USDT', 'ETH/USDT'],
        maxOrderSize: 0.5,
        minSpread: 0.002,
        maxPositionSize: 2.0,
        enabled: true,
        performance: {
          totalTrades: 1234,
          winRate: 0.89,
          avgProfit: 0.0025,
          maxDrawdown: 0.001,
          sharpeRatio: 4.1
        }
      },
      {
        id: 'momentum_scalper',
        name: 'Momentum Scalper',
        type: 'momentum',
        symbols: ['ETH/USDT', 'BNB/USDT'],
        maxOrderSize: 1.0,
        minSpread: 0.005,
        maxPositionSize: 3.0,
        enabled: false,
        performance: {
          totalTrades: 892,
          winRate: 0.68,
          avgProfit: 0.0018,
          maxDrawdown: 0.008,
          sharpeRatio: 2.1
        }
      }
    ];

    strategies.forEach(strategy => {
      this.strategies.set(strategy.id, strategy);
    });
  }

  private initializeWorkers() {
    console.log('🔧 تهيئة Web Workers للمعالجة المتوازية...');

    // Worker لتحليل دفتر الأوامر
    this.createWorker('orderBookAnalyzer', `
      self.onmessage = function(e) {
        const { orderBook, strategy } = e.data;
        
        // تحليل دفتر الأوامر
        const analysis = analyzeOrderBook(orderBook, strategy);
        
        self.postMessage({
          type: 'orderBookAnalysis',
          data: analysis
        });
      };

      function analyzeOrderBook(orderBook, strategy) {
        const spread = orderBook.asks[0].price - orderBook.bids[0].price;
        const spreadPercent = (spread / orderBook.bids[0].price) * 100;
        
        const bidVolume = orderBook.bids.slice(0, 10).reduce((sum, level) => sum + level.size, 0);
        const askVolume = orderBook.asks.slice(0, 10).reduce((sum, level) => sum + level.size, 0);
        
        const imbalance = (bidVolume - askVolume) / (bidVolume + askVolume);
        
        return {
          spread,
          spreadPercent,
          bidVolume,
          askVolume,
          imbalance,
          midPrice: (orderBook.bids[0].price + orderBook.asks[0].price) / 2,
          liquidity: bidVolume + askVolume,
          timestamp: Date.now()
        };
      }
    `);

    // Worker لاكتشاف الفرص
    this.createWorker('opportunityDetector', `
      self.onmessage = function(e) {
        const { marketData, strategies } = e.data;
        
        const opportunities = detectOpportunities(marketData, strategies);
        
        self.postMessage({
          type: 'opportunities',
          data: opportunities
        });
      };

      function detectOpportunities(marketData, strategies) {
        const opportunities = [];
        
        // اكتشاف فرص المراجحة
        for (let i = 0; i < marketData.length; i++) {
          for (let j = i + 1; j < marketData.length; j++) {
            const data1 = marketData[i];
            const data2 = marketData[j];
            
            if (data1.symbol === data2.symbol && data1.exchange !== data2.exchange) {
              const spread = Math.abs(data1.price - data2.price);
              const spreadPercent = (spread / Math.min(data1.price, data2.price)) * 100;
              
              if (spreadPercent > 0.05) { // فرصة مراجحة
                opportunities.push({
                  type: 'arbitrage',
                  symbol: data1.symbol,
                  exchange1: data1.exchange,
                  exchange2: data2.exchange,
                  price1: data1.price,
                  price2: data2.price,
                  spread: spread,
                  spreadPercent: spreadPercent,
                  confidence: Math.min(spreadPercent * 10, 1),
                  timestamp: Date.now()
                });
              }
            }
          }
        }
        
        return opportunities;
      }
    `);

    // Worker لتحسين الكمون
    this.createWorker('latencyOptimizer', `
      self.onmessage = function(e) {
        const { signals, latencyData } = e.data;
        
        const optimizedSignals = optimizeSignals(signals, latencyData);
        
        self.postMessage({
          type: 'optimizedSignals',
          data: optimizedSignals
        });
      };

      function optimizeSignals(signals, latencyData) {
        return signals.map(signal => {
          const exchangeLatency = latencyData[signal.exchange] || 50;
          
          // تعديل الإشارة حسب الكمون
          const adjustedPrice = signal.action === 'BUY' 
            ? signal.price * (1 + exchangeLatency / 10000)
            : signal.price * (1 - exchangeLatency / 10000);
          
          return {
            ...signal,
            adjustedPrice,
            latencyAdjustment: exchangeLatency,
            priority: signal.urgency === 'critical' ? 1 : 
                     signal.urgency === 'high' ? 2 : 
                     signal.urgency === 'medium' ? 3 : 4
          };
        }).sort((a, b) => a.priority - b.priority);
      }
    `);
  }

  private createWorker(name: string, code: string) {
    const blob = new Blob([code], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = (e) => {
      this.handleWorkerMessage(name, e.data);
    };
    
    worker.onerror = (error) => {
      console.error(`خطأ في Worker ${name}:`, error);
    };
    
    this.workers.set(name, worker);
  }

  private handleWorkerMessage(workerName: string, data: any) {
    switch (data.type) {
      case 'orderBookAnalysis':
        this.processOrderBookAnalysis(data.data);
        break;
      case 'opportunities':
        this.processOpportunities(data.data);
        break;
      case 'optimizedSignals':
        this.executeOptimizedSignals(data.data);
        break;
    }
  }

  // WebSocket connections for real-time data
  async connectWebSocket(exchange: string, symbol: string): Promise<void> {
    console.log(`🔌 الاتصال بـ WebSocket: ${exchange} - ${symbol}`);

    const wsKey = `${exchange}_${symbol}`;
    
    if (this.webSockets.has(wsKey)) {
      this.webSockets.get(wsKey)?.close();
    }

    // محاكاة WebSocket URLs (في الواقع ستكون URLs حقيقية)
    const wsUrls: Record<string, string> = {
      binance: `wss://stream.binance.com:9443/ws/${symbol.toLowerCase().replace('/', '')}@depth@100ms`,
      coinbase: `wss://ws-feed.pro.coinbase.com`,
      kraken: `wss://ws.kraken.com`
    };

    const wsUrl = wsUrls[exchange];
    if (!wsUrl) {
      console.error(`WebSocket URL غير متوفر للمنصة: ${exchange}`);
      return;
    }

    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`✅ اتصال WebSocket نشط: ${wsKey}`);
      
      // إرسال رسالة الاشتراك
      if (exchange === 'coinbase') {
        ws.send(JSON.stringify({
          type: 'subscribe',
          channels: [{ name: 'level2', product_ids: [symbol] }]
        }));
      }
      
      this.updateLatencyMetrics(exchange, 'connection', Date.now());
    };

    ws.onmessage = (event) => {
      const startTime = Date.now();
      
      try {
        const data = JSON.parse(event.data);
        this.processWebSocketData(exchange, symbol, data);
        
        this.updateLatencyMetrics(exchange, 'processing', Date.now() - startTime);
      } catch (error) {
        console.error('خطأ في معالجة بيانات WebSocket:', error);
      }
    };

    ws.onerror = (error) => {
      console.error(`خطأ WebSocket ${wsKey}:`, error);
    };

    ws.onclose = () => {
      console.log(`🔌 انقطع اتصال WebSocket: ${wsKey}`);
      
      // إعادة الاتصال بعد 5 ثواني
      setTimeout(() => {
        if (this.isActive) {
          this.connectWebSocket(exchange, symbol);
        }
      }, 5000);
    };

    this.webSockets.set(wsKey, ws);
  }

  private processWebSocketData(exchange: string, symbol: string, data: any) {
    // معالجة بيانات دفتر الأوامر
    if (data.bids && data.asks) {
      const orderBook: OrderBook = {
        symbol,
        bids: data.bids.map((bid: any) => ({
          price: parseFloat(bid[0]),
          size: parseFloat(bid[1]),
          count: parseInt(bid[2]) || 1
        })),
        asks: data.asks.map((ask: any) => ({
          price: parseFloat(ask[0]),
          size: parseFloat(ask[1]),
          count: parseInt(ask[2]) || 1
        })),
        timestamp: Date.now()
      };

      this.updateOrderBook(symbol, orderBook);
      this.analyzeOrderBookInWorker(orderBook);
    }
  }

  private updateOrderBook(symbol: string, orderBook: OrderBook) {
    this.orderBooks.set(symbol, orderBook);
    
    // إرسال التحديث للاستراتيجيات النشطة
    const activeStrategies = Array.from(this.strategies.values())
      .filter(s => s.enabled && s.symbols.includes(symbol));
    
    activeStrategies.forEach(strategy => {
      this.generateSignalsFromOrderBook(orderBook, strategy);
    });
  }

  private analyzeOrderBookInWorker(orderBook: OrderBook) {
    const worker = this.workers.get('orderBookAnalyzer');
    if (worker) {
      worker.postMessage({
        orderBook,
        strategy: { minSpread: 0.001 }
      });
    }
  }

  private processOrderBookAnalysis(analysis: any) {
    console.log('📊 تحليل دفتر الأوامر:', analysis);
    
    // اتخاذ قرارات بناءً على التحليل
    if (analysis.spreadPercent > 0.1) {
      // فرصة Market Making
      this.createMarketMakingSignal(analysis);
    }
    
    if (Math.abs(analysis.imbalance) > 0.3) {
      // عدم توازن في دفتر الأوامر
      this.createImbalanceSignal(analysis);
    }
  }

  private createMarketMakingSignal(analysis: any) {
    const signal: HFTSignal = {
      strategy: 'market_maker_btc',
      symbol: 'BTC/USDT',
      action: 'BUY',
      price: analysis.midPrice - analysis.spread / 4,
      size: 0.01,
      confidence: 0.8,
      urgency: 'high',
      timestamp: Date.now(),
      metadata: {
        type: 'market_making',
        spread: analysis.spread,
        liquidity: analysis.liquidity
      }
    };

    this.executeSignal(signal);
  }

  private createImbalanceSignal(analysis: any) {
    const signal: HFTSignal = {
      strategy: 'momentum_scalper',
      symbol: 'BTC/USDT',
      action: analysis.imbalance > 0 ? 'BUY' : 'SELL',
      price: analysis.midPrice,
      size: Math.min(0.1, analysis.liquidity * 0.01),
      confidence: Math.abs(analysis.imbalance),
      urgency: 'critical',
      timestamp: Date.now(),
      metadata: {
        type: 'imbalance',
        imbalance: analysis.imbalance
      }
    };

    this.executeSignal(signal);
  }

  private async executeSignal(signal: HFTSignal) {
    const latencyStart = Date.now();
    
    try {
      console.log(`⚡ تنفيذ إشارة عالية التردد:`, signal);
      
      // محاكاة تنفيذ الأمر
      await new Promise(resolve => setTimeout(resolve, Math.random() * 10 + 5));
      
      const executionTime = Date.now() - latencyStart;
      this.updateLatencyMetrics('execution', 'order', executionTime);
      
      // تحديث أداء الاستراتيجية
      this.updateStrategyPerformance(signal.strategy, true, signal.size * 0.001);
      
    } catch (error) {
      console.error('فشل تنفيذ الإشارة:', error);
      this.updateStrategyPerformance(signal.strategy, false, signal.size * -0.0005);
    }
  }

  private updateStrategyPerformance(strategyId: string, success: boolean, profit: number) {
    const strategy = this.strategies.get(strategyId);
    if (strategy) {
      strategy.performance.totalTrades++;
      
      if (success) {
        const wins = strategy.performance.winRate * (strategy.performance.totalTrades - 1) + 1;
        strategy.performance.winRate = wins / strategy.performance.totalTrades;
      } else {
        const wins = strategy.performance.winRate * (strategy.performance.totalTrades - 1);
        strategy.performance.winRate = wins / strategy.performance.totalTrades;
      }
      
      strategy.performance.avgProfit = (strategy.performance.avgProfit + profit) / 2;
    }
  }

  private updateLatencyMetrics(exchange: string, type: string, value: number) {
    let metrics = this.latencyMetrics.get(exchange);
    
    if (!metrics) {
      metrics = {
        roundTripTime: 0,
        orderExecutionTime: 0,
        dataLatency: 0,
        networkLatency: 0,
        averageLatency: 0,
        jitter: 0,
        uptime: 100
      };
    }

    switch (type) {
      case 'connection':
        metrics.networkLatency = value;
        break;
      case 'processing':
        metrics.dataLatency = value;
        break;
      case 'order':
        metrics.orderExecutionTime = value;
        break;
    }

    metrics.averageLatency = (metrics.networkLatency + metrics.dataLatency + metrics.orderExecutionTime) / 3;
    metrics.roundTripTime = metrics.networkLatency + metrics.orderExecutionTime;
    
    this.latencyMetrics.set(exchange, metrics);
  }

  private processOpportunities(opportunities: any[]) {
    opportunities.forEach(opp => {
      if (opp.type === 'arbitrage' && opp.spreadPercent > 0.1) {
        this.arbitrageOpportunities.push({
          symbol: opp.symbol,
          exchange1: opp.exchange1,
          exchange2: opp.exchange2,
          price1: opp.price1,
          price2: opp.price2,
          spread: opp.spread,
          spreadPercent: opp.spreadPercent,
          volume: 1.0,
          profit: opp.spread * 1.0 * 0.8, // 80% من الفرق
          timestamp: opp.timestamp,
          expiry: opp.timestamp + 5000 // انتهاء بعد 5 ثواني
        });
      }
    });
  }

  private executeOptimizedSignals(signals: any[]) {
    signals.forEach(signal => {
      if (signal.priority <= 2) { // أولوية عالية فقط
        this.executeSignal(signal);
      }
    });
  }

  private generateSignalsFromOrderBook(orderBook: OrderBook, strategy: HFTStrategy) {
    const spread = orderBook.asks[0].price - orderBook.bids[0].price;
    const spreadPercent = (spread / orderBook.bids[0].price) * 100;

    if (spreadPercent > strategy.minSpread && strategy.enabled) {
      // إنشاء إشارات بناءً على نوع الاستراتيجية
      switch (strategy.type) {
        case 'market_making':
          this.createMarketMakingOrders(orderBook, strategy);
          break;
        case 'arbitrage':
          this.detectArbitrageOpportunities(orderBook, strategy);
          break;
        case 'momentum':
          this.analyzeMomentum(orderBook, strategy);
          break;
      }
    }
  }

  private createMarketMakingOrders(orderBook: OrderBook, strategy: HFTStrategy) {
    const midPrice = (orderBook.bids[0].price + orderBook.asks[0].price) / 2;
    const spread = orderBook.asks[0].price - orderBook.bids[0].price;
    
    // أمر شراء
    const buySignal: HFTSignal = {
      strategy: strategy.id,
      symbol: orderBook.symbol,
      action: 'BUY',
      price: midPrice - spread / 4,
      size: Math.min(strategy.maxOrderSize, orderBook.asks[0].size * 0.1),
      confidence: 0.7,
      urgency: 'medium',
      timestamp: Date.now(),
      metadata: { type: 'market_making', side: 'buy' }
    };

    // أمر بيع
    const sellSignal: HFTSignal = {
      strategy: strategy.id,
      symbol: orderBook.symbol,
      action: 'SELL',
      price: midPrice + spread / 4,
      size: Math.min(strategy.maxOrderSize, orderBook.bids[0].size * 0.1),
      confidence: 0.7,
      urgency: 'medium',
      timestamp: Date.now(),
      metadata: { type: 'market_making', side: 'sell' }
    };

    this.executeSignal(buySignal);
    this.executeSignal(sellSignal);
  }

  private detectArbitrageOpportunities(orderBook: OrderBook, strategy: HFTStrategy) {
    // مقارنة الأسعار بين البورصات
    const otherExchangePrice = this.getOtherExchangePrice(orderBook.symbol);
    
    if (otherExchangePrice) {
      const currentPrice = orderBook.bids[0].price;
      const spread = Math.abs(currentPrice - otherExchangePrice);
      const spreadPercent = (spread / Math.min(currentPrice, otherExchangePrice)) * 100;

      if (spreadPercent > 0.1) {
        const signal: HFTSignal = {
          strategy: strategy.id,
          symbol: orderBook.symbol,
          action: currentPrice < otherExchangePrice ? 'BUY' : 'SELL',
          price: currentPrice,
          size: strategy.maxOrderSize,
          confidence: Math.min(spreadPercent / 2, 1),
          urgency: 'critical',
          timestamp: Date.now(),
          metadata: { 
            type: 'arbitrage', 
            spread: spreadPercent,
            otherPrice: otherExchangePrice 
          }
        };

        this.executeSignal(signal);
      }
    }
  }

  private getOtherExchangePrice(symbol: string): number | null {
    // محاكاة سعر من بورصة أخرى
    const basePrice = this.orderBooks.get(symbol)?.bids[0]?.price || 50000;
    return basePrice * (0.999 + Math.random() * 0.002); // تفاوت 0.1%
  }

  private analyzeMomentum(orderBook: OrderBook, strategy: HFTStrategy) {
    const bidVolume = orderBook.bids.slice(0, 5).reduce((sum, level) => sum + level.size, 0);
    const askVolume = orderBook.asks.slice(0, 5).reduce((sum, level) => sum + level.size, 0);
    const imbalance = (bidVolume - askVolume) / (bidVolume + askVolume);

    if (Math.abs(imbalance) > 0.2) {
      const signal: HFTSignal = {
        strategy: strategy.id,
        symbol: orderBook.symbol,
        action: imbalance > 0 ? 'BUY' : 'SELL',
        price: imbalance > 0 ? orderBook.asks[0].price : orderBook.bids[0].price,
        size: Math.min(strategy.maxOrderSize, Math.abs(imbalance) * 2),
        confidence: Math.abs(imbalance),
        urgency: 'high',
        timestamp: Date.now(),
        metadata: { type: 'momentum', imbalance }
      };

      this.executeSignal(signal);
    }
  }

  // Public methods
  async startHFT(): Promise<void> {
    console.log('🚀 بدء نظام التداول عالي التردد...');
    
    this.isActive = true;
    this.performanceStartTime = Date.now();

    // اتصال WebSocket للرموز المختلفة
    const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'];
    const exchanges = ['binance', 'coinbase', 'kraken'];

    for (const symbol of symbols) {
      for (const exchange of exchanges) {
        await this.connectWebSocket(exchange, symbol);
        await new Promise(resolve => setTimeout(resolve, 100)); // تأخير صغير
      }
    }

    // بدء مراقبة الكمون
    this.startLatencyMonitoring();
    
    console.log('✅ نظام التداول عالي التردد نشط!');
  }

  async stopHFT(): Promise<void> {
    console.log('⏹️ إيقاف نظام التداول عالي التردد...');
    
    this.isActive = false;

    // إغلاق WebSocket connections
    this.webSockets.forEach((ws, key) => {
      ws.close();
      console.log(`🔌 تم إغلاق ${key}`);
    });
    this.webSockets.clear();

    // إنهاء Workers
    this.workers.forEach((worker, name) => {
      worker.terminate();
      console.log(`🔧 تم إنهاء Worker: ${name}`);
    });

    console.log('✅ تم إيقاف نظام التداول عالي التردد');
  }

  private startLatencyMonitoring() {
    setInterval(() => {
      if (this.isActive) {
        this.monitorLatency();
      }
    }, 1000); // كل ثانية
  }

  private monitorLatency() {
    const exchanges = ['binance', 'coinbase', 'kraken'];
    
    exchanges.forEach(async (exchange) => {
      const start = Date.now();
      
      try {
        // ping test
        await fetch(`https://api.${exchange}.com/api/v3/ping`).catch(() => {});
        const pingTime = Date.now() - start;
        
        this.updateLatencyMetrics(exchange, 'connection', pingTime);
      } catch (error) {
        console.error(`خطأ في مراقبة الكمون لـ ${exchange}:`, error);
      }
    });
  }

  // Getters
  getStrategies(): HFTStrategy[] {
    return Array.from(this.strategies.values());
  }

  getLatencyMetrics(): Map<string, LatencyMetrics> {
    return this.latencyMetrics;
  }

  getOrderBooks(): Map<string, OrderBook> {
    return this.orderBooks;
  }

  getArbitrageOpportunities(): ArbitrageOpportunity[] {
    // تصفية الفرص المنتهية الصلاحية
    const now = Date.now();
    this.arbitrageOpportunities = this.arbitrageOpportunities.filter(opp => opp.expiry > now);
    return this.arbitrageOpportunities;
  }

  updateStrategyStatus(strategyId: string, enabled: boolean): void {
    const strategy = this.strategies.get(strategyId);
    if (strategy) {
      strategy.enabled = enabled;
    }
  }

  getPerformanceMetrics() {
    const uptime = Date.now() - this.performanceStartTime;
    const strategies = Array.from(this.strategies.values());
    
    const totalTrades = strategies.reduce((sum, s) => sum + s.performance.totalTrades, 0);
    const avgWinRate = strategies.reduce((sum, s) => sum + s.performance.winRate, 0) / strategies.length;
    const avgSharpe = strategies.reduce((sum, s) => sum + s.performance.sharpeRatio, 0) / strategies.length;

    return {
      uptime,
      totalTrades,
      avgWinRate,
      avgSharpe,
      activeStrategies: strategies.filter(s => s.enabled).length,
      totalStrategies: strategies.length
    };
  }
}

export const hftService = new HighFrequencyTradingService();
