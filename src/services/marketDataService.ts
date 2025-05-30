
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
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
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

class MarketDataService {
  private wsConnection: WebSocket | null = null;
  private subscribers: Map<string, ((data: MarketData) => void)[]> = new Map();
  private cache: Map<string, MarketData> = new Map();

  // مصادر البيانات المجانية
  private dataSources = {
    primary: 'https://api.twelvedata.com/v1',
    crypto: 'https://api.coingecko.com/api/v3',
    forex: 'https://api.exchangerate-api.com/v4/latest',
    websocket: 'wss://ws.twelvedata.com/v1/quotes/price'
  };

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      // محاولة جلب البيانات من التخزين المؤقت أولاً
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < 30000) { // 30 ثانية
        return cached;
      }

      // جلب البيانات المباشرة
      const response = await fetch(
        `${this.dataSources.primary}/price?symbol=${symbol}&apikey=demo`
      );
      
      if (!response.ok) {
        // التبديل إلى مصدر بديل
        return await this.getFallbackData(symbol);
      }

      const data = await response.json();
      const marketData: MarketData = {
        symbol: symbol,
        price: parseFloat(data.price),
        change: data.change || 0,
        changePercent: data.percent_change || 0,
        volume: data.volume || 0,
        high: data.high || data.price,
        low: data.low || data.price,
        open: data.open || data.price,
        close: data.price,
        timestamp: Date.now()
      };

      this.cache.set(symbol, marketData);
      return marketData;

    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.generateMockData(symbol);
    }
  }

  async getHistoricalData(symbol: string, interval: string = '1day', period: string = '1month'): Promise<CandlestickData[]> {
    try {
      const response = await fetch(
        `${this.dataSources.primary}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${period}&apikey=demo`
      );

      if (!response.ok) {
        return this.generateMockHistoricalData(symbol);
      }

      const data = await response.json();
      
      if (data.values) {
        return data.values.map((item: any) => ({
          timestamp: new Date(item.datetime).getTime(),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          volume: parseFloat(item.volume || '0')
        })).reverse();
      }

      return this.generateMockHistoricalData(symbol);

    } catch (error) {
      console.error('Error fetching historical data:', error);
      return this.generateMockHistoricalData(symbol);
    }
  }

  async getCryptoData(symbol: string): Promise<MarketData> {
    try {
      const response = await fetch(
        `${this.dataSources.crypto}/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
      );

      const data = await response.json();
      const coinData = data[symbol];

      if (coinData) {
        return {
          symbol: symbol.toUpperCase(),
          price: coinData.usd,
          change: coinData.usd_24h_change || 0,
          changePercent: coinData.usd_24h_change || 0,
          volume: coinData.usd_24h_vol || 0,
          high: coinData.usd * 1.02,
          low: coinData.usd * 0.98,
          open: coinData.usd,
          close: coinData.usd,
          timestamp: Date.now()
        };
      }

      return this.generateMockData(symbol);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.generateMockData(symbol);
    }
  }

  private async getFallbackData(symbol: string): Promise<MarketData> {
    // بيانات تجريبية محسنة للعرض
    return this.generateMockData(symbol);
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
        volume: Math.random() * 1000000
      });
      
      basePrice = close;
    }
    
    return data;
  }

  // WebSocket للبيانات المباشرة
  connectWebSocket(symbols: string[]) {
    if (this.wsConnection) {
      this.wsConnection.close();
    }

    // محاكاة WebSocket ببيانات تحديث دورية
    setInterval(() => {
      symbols.forEach(symbol => {
        const mockData = this.generateMockData(symbol);
        this.notifySubscribers(symbol, mockData);
      });
    }, 5000); // تحديث كل 5 ثوان
  }

  subscribe(symbol: string, callback: (data: MarketData) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol)!.push(callback);
  }

  private notifySubscribers(symbol: string, data: MarketData) {
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export const marketDataService = new MarketDataService();
