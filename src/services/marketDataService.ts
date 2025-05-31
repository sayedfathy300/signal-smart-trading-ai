export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  timestamp: number;
  bid?: number;
  ask?: number;
  spread?: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
  trades?: number;
}

export interface TechnicalIndicators {
  sma: number[];
  ema: number[];
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
}

export interface YahooFinanceData {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketOpen: number;
  regularMarketPreviousClose: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

export interface WebSocketMessage {
  type: 'price' | 'trade' | 'orderbook' | 'news';
  symbol: string;
  data: any;
  timestamp: number;
}

export interface StoredData {
  symbol: string;
  timeframe: string;
  data: CandlestickData[];
  lastUpdate: number;
  expiresAt: number;
}

class MarketDataService {
  private wsConnections: Map<string, WebSocket> = new Map();
  private subscribers: Map<string, ((data: MarketData) => void)[]> = new Map();
  private cache: Map<string, MarketData> = new Map();
  private dbName = 'MarketDataDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // مصادر البيانات المختلفة
  private dataSources = {
    yahoo: {
      quote: 'https://query1.finance.yahoo.com/v8/finance/chart/',
      search: 'https://query1.finance.yahoo.com/v1/finance/search',
      news: 'https://query1.finance.yahoo.com/v1/finance/trending'
    },
    alpha: {
      base: 'https://www.alphavantage.co/query',
      apiKey: 'demo' // للتطوير
    },
    polygon: {
      base: 'https://api.polygon.io/v2',
      apiKey: 'demo'
    },
    websockets: {
      binance: 'wss://stream.binance.com:9443/ws',
      coinbase: 'wss://ws-feed.pro.coinbase.com',
      polygon: 'wss://socket.polygon.io'
    }
  };

  constructor() {
    this.initializeIndexedDB();
    this.startRealtimeUpdates();
  }

  // تهيئة IndexedDB للتخزين المحلي
  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('خطأ في فتح قاعدة البيانات المحلية:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ تم تهيئة قاعدة البيانات المحلية بنجاح');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // إنشاء مخازن البيانات
        if (!db.objectStoreNames.contains('historical_data')) {
          const historicalStore = db.createObjectStore('historical_data', { keyPath: 'id' });
          historicalStore.createIndex('symbol', 'symbol', { unique: false });
          historicalStore.createIndex('timeframe', 'timeframe', { unique: false });
        }

        if (!db.objectStoreNames.contains('market_data')) {
          const marketStore = db.createObjectStore('market_data', { keyPath: 'symbol' });
          marketStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('news_data')) {
          const newsStore = db.createObjectStore('news_data', { keyPath: 'id' });
          newsStore.createIndex('symbol', 'symbol', { unique: false });
          newsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        console.log('🗄️ تم إنشاء مخازن البيانات في IndexedDB');
      };
    });
  }

  // Yahoo Finance Integration
  async getYahooFinanceData(symbol: string): Promise<YahooFinanceData | null> {
    try {
      console.log(`📊 جلب بيانات Yahoo Finance للرمز: ${symbol}`);
      
      // محاولة جلب البيانات من Yahoo Finance
      const response = await fetch(`${this.dataSources.yahoo.quote}${symbol}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        console.warn(`تعذر الحصول على بيانات Yahoo Finance، التبديل إلى البيانات المحاكاة`);
        return this.generateYahooMockData(symbol);
      }

      const data = await response.json();
      const result = data.chart?.result?.[0];
      
      if (!result) {
        return this.generateYahooMockData(symbol);
      }

      const meta = result.meta;
      const quote = result.indicators?.quote?.[0];

      return {
        symbol: symbol.toUpperCase(),
        regularMarketPrice: meta.regularMarketPrice || 0,
        regularMarketChange: meta.regularMarketPrice - meta.previousClose || 0,
        regularMarketChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100) || 0,
        regularMarketVolume: meta.regularMarketVolume || 0,
        regularMarketDayHigh: meta.regularMarketDayHigh || 0,
        regularMarketDayLow: meta.regularMarketDayLow || 0,
        regularMarketOpen: meta.regularMarketOpen || 0,
        regularMarketPreviousClose: meta.previousClose || 0,
        marketCap: Math.random() * 1000000000, // محاكاة
        peRatio: Math.random() * 30 + 10,
        dividendYield: Math.random() * 5,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0
      };

    } catch (error) {
      console.error('خطأ في جلب بيانات Yahoo Finance:', error);
      return this.generateYahooMockData(symbol);
    }
  }

  private generateYahooMockData(symbol: string): YahooFinanceData {
    const basePrice = Math.random() * 500 + 50;
    const change = (Math.random() - 0.5) * 20;
    
    return {
      symbol: symbol.toUpperCase(),
      regularMarketPrice: basePrice,
      regularMarketChange: change,
      regularMarketChangePercent: (change / basePrice) * 100,
      regularMarketVolume: Math.floor(Math.random() * 10000000),
      regularMarketDayHigh: basePrice + Math.random() * 10,
      regularMarketDayLow: basePrice - Math.random() * 10,
      regularMarketOpen: basePrice + (Math.random() - 0.5) * 5,
      regularMarketPreviousClose: basePrice - change,
      marketCap: Math.random() * 1000000000,
      peRatio: Math.random() * 30 + 10,
      dividendYield: Math.random() * 5,
      fiftyTwoWeekHigh: basePrice + Math.random() * 50,
      fiftyTwoWeekLow: basePrice - Math.random() * 30
    };
  }

  // WebSocket Streams للبيانات المباشرة
  connectWebSocketStream(symbol: string, exchange: string = 'binance'): void {
    const wsKey = `${exchange}-${symbol}`;
    
    if (this.wsConnections.has(wsKey)) {
      console.log(`اتصال WebSocket موجود بالفعل للرمز: ${symbol}`);
      return;
    }

    try {
      let wsUrl: string;
      
      switch (exchange.toLowerCase()) {
        case 'binance':
          wsUrl = `${this.dataSources.websockets.binance}/${symbol.toLowerCase()}@ticker`;
          break;
        case 'coinbase':
          wsUrl = this.dataSources.websockets.coinbase;
          break;
        default:
          wsUrl = this.dataSources.websockets.binance;
      }

      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log(`✅ تم الاتصال بـ WebSocket للرمز: ${symbol} على منصة ${exchange}`);
        
        // إرسال رسالة الاشتراك لـ Coinbase
        if (exchange.toLowerCase() === 'coinbase') {
          ws.send(JSON.stringify({
            type: 'subscribe',
            product_ids: [symbol],
            channels: ['ticker']
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const marketData = this.parseWebSocketMessage(data, symbol, exchange);
          
          if (marketData) {
            this.updateCache(symbol, marketData);
            this.notifySubscribers(symbol, marketData);
            this.storeInIndexedDB(marketData);
          }
        } catch (error) {
          console.error('خطأ في معالجة رسالة WebSocket:', error);
        }
      };

      ws.onerror = (error) => {
        console.error(`خطأ في WebSocket للرمز ${symbol}:`, error);
      };

      ws.onclose = () => {
        console.log(`تم إغلاق اتصال WebSocket للرمز: ${symbol}`);
        this.wsConnections.delete(wsKey);
        
        // إعادة الاتصال بعد 5 ثوان
        setTimeout(() => {
          this.connectWebSocketStream(symbol, exchange);
        }, 5000);
      };

      this.wsConnections.set(wsKey, ws);
      
    } catch (error) {
      console.error(`خطأ في إنشاء اتصال WebSocket للرمز ${symbol}:`, error);
    }
  }

  private parseWebSocketMessage(data: any, symbol: string, exchange: string): MarketData | null {
    try {
      switch (exchange.toLowerCase()) {
        case 'binance':
          return {
            symbol: symbol.toUpperCase(),
            price: parseFloat(data.c),
            change: parseFloat(data.P),
            changePercent: parseFloat(data.P),
            volume: parseFloat(data.v),
            high: parseFloat(data.h),
            low: parseFloat(data.l),
            open: parseFloat(data.o),
            close: parseFloat(data.c),
            bid: parseFloat(data.b),
            ask: parseFloat(data.a),
            timestamp: Date.now()
          };
          
        case 'coinbase':
          if (data.type === 'ticker') {
            return {
              symbol: symbol.toUpperCase(),
              price: parseFloat(data.price),
              change: 0, // يحتاج حساب
              changePercent: 0,
              volume: parseFloat(data.volume_24h),
              high: parseFloat(data.high_24h),
              low: parseFloat(data.low_24h),
              open: parseFloat(data.open_24h),
              close: parseFloat(data.price),
              bid: parseFloat(data.best_bid),
              ask: parseFloat(data.best_ask),
              timestamp: Date.now()
            };
          }
          break;
      }
      
      return null;
    } catch (error) {
      console.error('خطأ في تحليل رسالة WebSocket:', error);
      return null;
    }
  }

  // IndexedDB Storage للتخزين المحلي
  private async storeInIndexedDB(data: MarketData): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['market_data'], 'readwrite');
      const store = transaction.objectStore('market_data');
      
      await store.put({
        symbol: data.symbol,
        ...data,
        storedAt: Date.now()
      });

    } catch (error) {
      console.error('خطأ في تخزين البيانات في IndexedDB:', error);
    }
  }

  async storeHistoricalData(symbol: string, timeframe: string, data: CandlestickData[]): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['historical_data'], 'readwrite');
      const store = transaction.objectStore('historical_data');
      
      const record: StoredData = {
        symbol,
        timeframe,
        data,
        lastUpdate: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // انتهاء الصلاحية خلال 24 ساعة
      };

      await store.put({
        id: `${symbol}-${timeframe}`,
        ...record
      });

      console.log(`💾 تم تخزين البيانات التاريخية: ${symbol} - ${timeframe}`);

    } catch (error) {
      console.error('خطأ في تخزين البيانات التاريخية:', error);
    }
  }

  async getStoredHistoricalData(symbol: string, timeframe: string): Promise<CandlestickData[] | null> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction(['historical_data'], 'readonly');
      const store = transaction.objectStore('historical_data');
      const request = store.get(`${symbol}-${timeframe}`);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.expiresAt > Date.now()) {
            console.log(`📁 تم استرداد البيانات المخزنة: ${symbol} - ${timeframe}`);
            resolve(result.data);
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          console.error('خطأ في استرداد البيانات المخزنة');
          resolve(null);
        };
      });

    } catch (error) {
      console.error('خطأ في الوصول للبيانات المخزنة:', error);
      return null;
    }
  }

  // تحسين جلب البيانات مع التخزين المؤقت
  async getMarketData(symbol: string, forceRefresh: boolean = false): Promise<MarketData> {
    try {
      // التحقق من التخزين المؤقت أولاً
      if (!forceRefresh) {
        const cached = this.cache.get(symbol);
        if (cached && Date.now() - cached.timestamp < 5000) { // 5 ثوان
          return cached;
        }
      }

      // محاولة Yahoo Finance أولاً
      const yahooData = await this.getYahooFinanceData(symbol);
      if (yahooData) {
        const marketData: MarketData = {
          symbol: yahooData.symbol,
          price: yahooData.regularMarketPrice,
          change: yahooData.regularMarketChange,
          changePercent: yahooData.regularMarketChangePercent,
          volume: yahooData.regularMarketVolume,
          high: yahooData.regularMarketDayHigh,
          low: yahooData.regularMarketDayLow,
          open: yahooData.regularMarketOpen,
          close: yahooData.regularMarketPrice,
          timestamp: Date.now()
        };

        this.updateCache(symbol, marketData);
        this.storeInIndexedDB(marketData);
        return marketData;
      }

      // التراجع للبيانات المحاكاة
      return this.generateMockData(symbol);

    } catch (error) {
      console.error('خطأ في جلب بيانات السوق:', error);
      return this.generateMockData(symbol);
    }
  }

  async getHistoricalData(symbol: string, interval: string = '1d', period: string = '1mo'): Promise<CandlestickData[]> {
    try {
      // التحقق من البيانات المخزنة أولاً
      const storedData = await this.getStoredHistoricalData(symbol, interval);
      if (storedData) {
        return storedData;
      }

      console.log(`📈 جلب البيانات التاريخية: ${symbol} - ${interval}`);

      // محاولة جلب من Yahoo Finance
      const yahooData = await this.fetchYahooHistoricalData(symbol, interval, period);
      if (yahooData.length > 0) {
        await this.storeHistoricalData(symbol, interval, yahooData);
        return yahooData;
      }

      // توليد بيانات محاكاة
      const mockData = this.generateMockHistoricalData(symbol);
      await this.storeHistoricalData(symbol, interval, mockData);
      return mockData;

    } catch (error) {
      console.error('خطأ في جلب البيانات التاريخية:', error);
      return this.generateMockHistoricalData(symbol);
    }
  }

  private async fetchYahooHistoricalData(symbol: string, interval: string, period: string): Promise<CandlestickData[]> {
    try {
      const response = await fetch(`${this.dataSources.yahoo.quote}${symbol}?interval=${interval}&range=${period}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات من Yahoo Finance');
      }

      const data = await response.json();
      const result = data.chart?.result?.[0];
      
      if (!result || !result.timestamp) {
        return [];
      }

      const timestamps = result.timestamp;
      const quotes = result.indicators?.quote?.[0];
      const volumes = result.indicators?.quote?.[0]?.volume || [];

      return timestamps.map((timestamp: number, index: number) => ({
        timestamp: timestamp * 1000,
        open: quotes?.open?.[index] || 0,
        high: quotes?.high?.[index] || 0,
        low: quotes?.low?.[index] || 0,
        close: quotes?.close?.[index] || 0,
        volume: volumes[index] || 0
      })).filter((candle: CandlestickData) => 
        candle.open > 0 && candle.high > 0 && candle.low > 0 && candle.close > 0
      );

    } catch (error) {
      console.error('خطأ في جلب البيانات التاريخية من Yahoo:', error);
      return [];
    }
  }

  // بدء التحديثات المباشرة
  private startRealtimeUpdates(): void {
    // تحديث البيانات المؤقتة كل 30 ثانية
    setInterval(() => {
      this.cache.forEach((data, symbol) => {
        if (Date.now() - data.timestamp > 30000) {
          this.getMarketData(symbol, true);
        }
      });
    }, 30000);

    console.log('🔄 تم بدء خدمة التحديثات المباشرة');
  }

  // إدارة الاشتراكات
  subscribe(symbol: string, callback: (data: MarketData) => void): void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
      // بدء WebSocket للرمز الجديد
      this.connectWebSocketStream(symbol);
    }
    this.subscribers.get(symbol)!.push(callback);
  }

  unsubscribe(symbol: string, callback: (data: MarketData) => void): void {
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      // إغلاق WebSocket إذا لم تعد هناك اشتراكات
      if (callbacks.length === 0) {
        this.subscribers.delete(symbol);
        this.closeWebSocketConnection(symbol);
      }
    }
  }

  private closeWebSocketConnection(symbol: string): void {
    this.wsConnections.forEach((ws, key) => {
      if (key.includes(symbol)) {
        ws.close();
        this.wsConnections.delete(key);
      }
    });
  }

  private notifySubscribers(symbol: string, data: MarketData): void {
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('خطأ في إشعار المشترك:', error);
        }
      });
    }
  }

  private updateCache(symbol: string, data: MarketData): void {
    this.cache.set(symbol, data);
  }

  private generateMockData(symbol: string): MarketData {
    const basePrice = Math.random() * 1000 + 50;
    const change = (Math.random() - 0.5) * 20;
    
    return {
      symbol,
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.random() * 1000000,
      high: basePrice + Math.random() * 10,
      low: basePrice - Math.random() * 10,
      open: basePrice + (Math.random() - 0.5) * 5,
      close: basePrice,
      bid: basePrice - 0.01,
      ask: basePrice + 0.01,
      timestamp: Date.now()
    };
  }

  private generateMockHistoricalData(symbol: string): CandlestickData[] {
    const data: CandlestickData[] = [];
    let basePrice = Math.random() * 1000 + 50;
    
    for (let i = 30; i >= 0; i--) {
      const open = basePrice;
      const close = basePrice + (Math.random() - 0.5) * 20;
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;
      
      data.push({
        timestamp: Date.now() - i * 24 * 60 * 60 * 1000,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000,
        vwap: (high + low + close) / 3,
        trades: Math.floor(Math.random() * 1000)
      });
      
      basePrice = close;
    }
    
    return data;
  }

  // تنظيف الموارد
  cleanup(): void {
    // إغلاق جميع اتصالات WebSocket
    this.wsConnections.forEach(ws => ws.close());
    this.wsConnections.clear();
    
    // مسح الاشتراكات
    this.subscribers.clear();
    
    // إغلاق قاعدة البيانات
    if (this.db) {
      this.db.close();
    }
    
    console.log('🧹 تم تنظيف موارد خدمة البيانات');
  }

  // إحصائيات الأداء
  getPerformanceStats(): any {
    return {
      cacheSize: this.cache.size,
      activeConnections: this.wsConnections.size,
      totalSubscribers: Array.from(this.subscribers.values()).reduce((sum, arr) => sum + arr.length, 0),
      dbStatus: this.db ? 'connected' : 'disconnected'
    };
  }

  // Add the missing getMarketOverview method
  async getMarketOverview(): Promise<MarketData> {
    try {
      console.log('🏛️ جلب نظرة عامة على السوق');

      // محاولة جلب البيانات الحقيقية من مصادر متعددة
      const [indicesData, currenciesData, commoditiesData, trendingData] = await Promise.allSettled([
        this.getIndicesData(),
        this.getCurrenciesData(),
        this.getCommoditiesData(),
        this.getTrendingStocksData()
      ]);

      return {
        indices: indicesData.status === 'fulfilled' ? indicesData.value : this.getMockIndicesData(),
        currencies: currenciesData.status === 'fulfilled' ? currenciesData.value : this.getMockCurrenciesData(),
        commodities: commoditiesData.status === 'fulfilled' ? commoditiesData.value : this.getMockCommoditiesData(),
        trending: trendingData.status === 'fulfilled' ? trendingData.value : this.getMockTrendingData()
      };

    } catch (error) {
      console.error('خطأ في جلب نظرة عامة على السوق:', error);
      return this.getMockMarketOverview();
    }
  }

  private async getIndicesData(): Promise<any[]> {
    try {
      // محاولة جلب من Yahoo Finance
      const symbols = ['^DJI', '^GSPC', '^IXIC', '^RUT', '^VIX'];
      const results = await Promise.allSettled(
        symbols.map(symbol => this.getYahooFinanceData(symbol))
      );

      return results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => {
          const data = (result as PromiseFulfilledResult<any>).value;
          return {
            name: this.getIndexName(data.symbol),
            value: data.regularMarketPrice,
            change: data.regularMarketChangePercent
          };
        });
    } catch (error) {
      return this.getMockIndicesData();
    }
  }

  private async getCurrenciesData(): Promise<any[]> {
    try {
      const pairs = ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'USDCAD=X'];
      const results = await Promise.allSettled(
        pairs.map(pair => this.getYahooFinanceData(pair))
      );

      return results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => {
          const data = (result as PromiseFulfilledResult<any>).value;
          return {
            name: this.getCurrencyName(data.symbol),
            value: data.regularMarketPrice,
            change: data.regularMarketChangePercent
          };
        });
    } catch (error) {
      return this.getMockCurrenciesData();
    }
  }

  private async getCommoditiesData(): Promise<any[]> {
    try {
      const commodities = ['GC=F', 'SI=F', 'CL=F', 'NG=F'];
      const results = await Promise.allSettled(
        commodities.map(commodity => this.getYahooFinanceData(commodity))
      );

      return results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => {
          const data = (result as PromiseFulfilledResult<any>).value;
          return {
            name: this.getCommodityName(data.symbol),
            value: data.regularMarketPrice,
            change: data.regularMarketChangePercent
          };
        });
    } catch (error) {
      return this.getMockCommoditiesData();
    }
  }

  private async getTrendingStocksData(): Promise<any[]> {
    try {
      const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];
      const results = await Promise.allSettled(
        stocks.map(stock => this.getYahooFinanceData(stock))
      );

      return results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => {
          const data = (result as PromiseFulfilledResult<any>).value;
          return {
            ticker: data.symbol,
            companyName: this.getCompanyName(data.symbol),
            price: data.regularMarketPrice,
            change: data.regularMarketChangePercent,
            sparklineData: this.generateSparklineData()
          };
        });
    } catch (error) {
      return this.getMockTrendingData();
    }
  }

  private getIndexName(symbol: string): string {
    const names: { [key: string]: string } = {
      '^DJI': 'Dow Jones',
      '^GSPC': 'S&P 500',
      '^IXIC': 'NASDAQ',
      '^RUT': 'Russell 2000',
      '^VIX': 'VIX'
    };
    return names[symbol] || symbol;
  }

  private getCurrencyName(symbol: string): string {
    const names: { [key: string]: string } = {
      'EURUSD=X': 'EUR/USD',
      'GBPUSD=X': 'GBP/USD',
      'USDJPY=X': 'USD/JPY',
      'USDCAD=X': 'USD/CAD'
    };
    return names[symbol] || symbol;
  }

  private getCommodityName(symbol: string): string {
    const names: { [key: string]: string } = {
      'GC=F': 'Gold',
      'SI=F': 'Silver',
      'CL=F': 'Crude Oil',
      'NG=F': 'Natural Gas'
    };
    return names[symbol] || symbol;
  }

  private getCompanyName(symbol: string): string {
    const names: { [key: string]: string } = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corp.',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corp.'
    };
    return names[symbol] || symbol;
  }

  private generateSparklineData(): number[] {
    const data: number[] = [];
    let baseValue = 100;
    
    for (let i = 0; i < 20; i++) {
      baseValue += (Math.random() - 0.5) * 5;
      data.push(Math.max(0, baseValue));
    }
    
    return data;
  }

  private getMockMarketOverview(): MarketData {
    return {
      indices: this.getMockIndicesData(),
      currencies: this.getMockCurrenciesData(),
      commodities: this.getMockCommoditiesData(),
      trending: this.getMockTrendingData()
    };
  }

  private getMockIndicesData(): any[] {
    return [
      { name: 'S&P 500', value: 4487.28, change: 0.75 },
      { name: 'Dow Jones', value: 34721.12, change: -0.32 },
      { name: 'NASDAQ', value: 13711.00, change: 1.22 },
      { name: 'Russell 2000', value: 1789.45, change: -0.18 },
      { name: 'VIX', value: 18.45, change: -5.67 }
    ];
  }

  private getMockCurrenciesData(): any[] {
    return [
      { name: 'EUR/USD', value: 1.0845, change: 0.23 },
      { name: 'GBP/USD', value: 1.2567, change: -0.45 },
      { name: 'USD/JPY', value: 149.23, change: 0.67 },
      { name: 'USD/CAD', value: 1.3456, change: 0.12 }
    ];
  }

  private getMockCommoditiesData(): any[] {
    return [
      { name: 'Gold', value: 1987.45, change: 0.89 },
      { name: 'Silver', value: 23.67, change: 1.45 },
      { name: 'Crude Oil', value: 78.23, change: -1.23 },
      { name: 'Natural Gas', value: 2.845, change: 2.34 }
    ];
  }

  private getMockTrendingData(): any[] {
    return [
      {
        ticker: 'AAPL',
        companyName: 'Apple Inc.',
        price: 189.45,
        change: 1.23,
        sparklineData: this.generateSparklineData()
      },
      {
        ticker: 'MSFT',
        companyName: 'Microsoft Corp.',
        price: 378.91,
        change: -0.67,
        sparklineData: this.generateSparklineData()
      },
      {
        ticker: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 134.56,
        change: 2.34,
        sparklineData: this.generateSparklineData()
      },
      {
        ticker: 'TSLA',
        companyName: 'Tesla Inc.',
        price: 234.67,
        change: -3.45,
        sparklineData: this.generateSparklineData()
      },
      {
        ticker: 'NVDA',
        companyName: 'NVIDIA Corp.',
        price: 456.78,
        change: 4.56,
        sparklineData: this.generateSparklineData()
      },
      {
        ticker: 'AMZN',
        companyName: 'Amazon.com Inc.',
        price: 145.23,
        change: 0.89,
        sparklineData: this.generateSparklineData()
      }
    ];
  }
}

export const marketDataService = new MarketDataService();
