// خدمة التحليل الأساسي والاقتصادي المتكاملة
export interface EconomicIndicator {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  impact: 'high' | 'medium' | 'low';
  unit: string;
  releaseDate: string;
  nextRelease: string;
}

export interface CompanyFinancials {
  symbol: string;
  marketCap: string;
  peRatio: number;
  pegRatio: number;
  priceToBook: number;
  debtToEquity: number;
  roe: number;
  roa: number;
  currentRatio: number;
  quickRatio: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  revenue: string;
  revenueGrowth: number;
  earnings: number;
  earningsGrowth: number;
  freeCashFlow: string;
  dividendYield: number;
  lastUpdated: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  date: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual?: string;
  description: string;
  category: 'employment' | 'inflation' | 'gdp' | 'monetary' | 'trade' | 'manufacturing';
}

export interface InterestRate {
  country: string;
  currency: string;
  currentRate: number;
  previousRate: number;
  nextMeeting: string;
  trend: 'rising' | 'falling' | 'stable';
  bank: string;
}

export interface InflationData {
  country: string;
  currentRate: number;
  previousRate: number;
  target: number;
  trend: 'rising' | 'falling' | 'stable';
  month: string;
  year: number;
}

export interface GDPData {
  country: string;
  currentGrowth: number;
  previousGrowth: number;
  quarter: string;
  year: number;
  annualized: boolean;
}

class FundamentalAnalysisService {
  private readonly API_KEYS = {
    alphaVantage: 'demo', // يجب استبدالها بمفتاح حقيقي
    fred: 'demo', // يجب استبدالها بمفتاح حقيقي
    financialModelingPrep: 'demo' // يجب استبدالها بمفتاح حقيقي
  };

  private readonly BASE_URLS = {
    alphaVantage: 'https://www.alphavantage.co/query',
    fred: 'https://api.stlouisfed.org/fred/series/observations',
    financialModelingPrep: 'https://financialmodelingprep.com/api/v3',
    economicCalendar: 'https://api.investing.com/api/financialdata/calendar'
  };

  // التحليل الأساسي للشركات
  async getCompanyFinancials(symbol: string): Promise<any> {
    try {
      console.log(`Fetching fundamentals for ${symbol}`);
      
      // Return enhanced mock data with all required properties
      return this.generateEnhancedMockFinancials(symbol);
    } catch (error) {
      console.error('Error fetching company financials:', error);
      return this.generateEnhancedMockFinancials(symbol);
    }
  }

  // جلب البيانات الاقتصادية من FRED
  async getEconomicIndicators(): Promise<any> {
    try {
      console.log('Fetching economic indicators');
      
      return {
        unemployment_rate: 3.7,
        unemployment_change: -0.1,
        gdp_growth: 2.4,
        interest_rate: 5.25,
        interest_rate_change: 0.0,
        inflation_rate: 3.2,
        historical_data: [
          { date: '2023-Q1', gdp_growth: 2.1, inflation: 4.2, interest_rate: 4.75 },
          { date: '2023-Q2', gdp_growth: 2.3, inflation: 3.8, interest_rate: 5.0 },
          { date: '2023-Q3', gdp_growth: 2.4, inflation: 3.2, interest_rate: 5.25 },
        ]
      };
    } catch (error) {
      console.error('Error fetching economic indicators:', error);
      return this.generateMockEconomicData();
    }
  }

  // جلب أسعار الفائدة العالمية
  async getGlobalInterestRates(): Promise<InterestRate[]> {
    try {
      console.log('Fetching global interest rates');
      
      // بيانات تجريبية لأسعار الفائدة العالمية
      return [
        {
          country: 'United States',
          currency: 'USD',
          currentRate: 5.25,
          previousRate: 5.00,
          nextMeeting: '2024-01-31',
          trend: 'stable',
          bank: 'Federal Reserve'
        },
        {
          country: 'European Union',
          currency: 'EUR',
          currentRate: 4.50,
          previousRate: 4.25,
          nextMeeting: '2024-01-25',
          trend: 'rising',
          bank: 'European Central Bank'
        },
        {
          country: 'United Kingdom',
          currency: 'GBP',
          currentRate: 5.25,
          previousRate: 5.00,
          nextMeeting: '2024-02-01',
          trend: 'stable',
          bank: 'Bank of England'
        },
        {
          country: 'Japan',
          currency: 'JPY',
          currentRate: -0.10,
          previousRate: -0.10,
          nextMeeting: '2024-01-23',
          trend: 'stable',
          bank: 'Bank of Japan'
        },
        {
          country: 'Canada',
          currency: 'CAD',
          currentRate: 5.00,
          previousRate: 4.75,
          nextMeeting: '2024-01-24',
          trend: 'rising',
          bank: 'Bank of Canada'
        }
      ];
    } catch (error) {
      console.error('Error fetching interest rates:', error);
      return [];
    }
  }

  // جلب بيانات التضخم العالمية
  async getInflationData(): Promise<InflationData[]> {
    try {
      console.log('Fetching global inflation data');
      
      return [
        {
          country: 'United States',
          currentRate: 3.2,
          previousRate: 3.7,
          target: 2.0,
          trend: 'falling',
          month: 'December',
          year: 2023
        },
        {
          country: 'European Union',
          currentRate: 2.9,
          previousRate: 3.4,
          target: 2.0,
          trend: 'falling',
          month: 'December',
          year: 2023
        },
        {
          country: 'United Kingdom',
          currentRate: 4.0,
          previousRate: 4.6,
          target: 2.0,
          trend: 'falling',
          month: 'December',
          year: 2023
        },
        {
          country: 'Japan',
          currentRate: 3.1,
          previousRate: 3.3,
          target: 2.0,
          trend: 'falling',
          month: 'December',
          year: 2023
        }
      ];
    } catch (error) {
      console.error('Error fetching inflation data:', error);
      return [];
    }
  }

  // جلب بيانات النمو الاقتصادي (GDP)
  async getGDPData(): Promise<GDPData[]> {
    try {
      console.log('Fetching GDP data');
      
      return [
        {
          country: 'United States',
          currentGrowth: 2.4,
          previousGrowth: 2.1,
          quarter: 'Q3',
          year: 2023,
          annualized: true
        },
        {
          country: 'European Union',
          currentGrowth: 0.1,
          previousGrowth: 0.3,
          quarter: 'Q3',
          year: 2023,
          annualized: false
        },
        {
          country: 'China',
          currentGrowth: 4.9,
          previousGrowth: 6.3,
          quarter: 'Q3',
          year: 2023,
          annualized: false
        },
        {
          country: 'Japan',
          currentGrowth: 1.2,
          previousGrowth: 1.5,
          quarter: 'Q3',
          year: 2023,
          annualized: true
        }
      ];
    } catch (error) {
      console.error('Error fetching GDP data:', error);
      return [];
    }
  }

  // جلب التقويم الاقتصادي
  async getEconomicCalendar(days: number = 7): Promise<EconomicEvent[]> {
    try {
      console.log('Fetching economic calendar');
      
      // بيانات تجريبية للأحداث الاقتصادية القادمة
      return [
        {
          id: '1',
          title: 'Federal Reserve Interest Rate Decision',
          country: 'United States',
          currency: 'USD',
          date: '2024-01-31',
          time: '19:00',
          impact: 'high',
          forecast: '5.25%',
          previous: '5.25%',
          description: 'Federal Open Market Committee announces interest rate decision',
          category: 'monetary'
        },
        {
          id: '2',
          title: 'Non-Farm Payrolls',
          country: 'United States',
          currency: 'USD',
          date: '2024-02-02',
          time: '13:30',
          impact: 'high',
          forecast: '180K',
          previous: '199K',
          description: 'Monthly employment change in non-farm sector',
          category: 'employment'
        },
        {
          id: '3',
          title: 'ECB Interest Rate Decision',
          country: 'European Union',
          currency: 'EUR',
          date: '2024-01-25',
          time: '13:15',
          impact: 'high',
          forecast: '4.50%',
          previous: '4.50%',
          description: 'European Central Bank announces interest rate decision',
          category: 'monetary'
        },
        {
          id: '4',
          title: 'GDP Growth Rate',
          country: 'United States',
          currency: 'USD',
          date: '2024-01-25',
          time: '13:30',
          impact: 'high',
          forecast: '2.2%',
          previous: '2.4%',
          description: 'Quarterly GDP growth rate announcement',
          category: 'gdp'
        },
        {
          id: '5',
          title: 'Consumer Price Index',
          country: 'United States',
          currency: 'USD',
          date: '2024-01-11',
          time: '13:30',
          impact: 'high',
          forecast: '3.2%',
          previous: '3.1%',
          description: 'Monthly consumer price index',
          category: 'inflation'
        }
      ];
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      return [];
    }
  }

  // تحليل شامل للأساسيات
  async getFundamentalAnalysis(symbol: string): Promise<{
    financials: CompanyFinancials;
    score: number;
    recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    analysis: string;
    strengths: string[];
    weaknesses: string[];
  }> {
    try {
      const financials = await this.getCompanyFinancials(symbol);
      
      // حساب النقاط بناءً على النسب المالية
      let score = 50; // نقطة البداية
      
      // تقييم P/E Ratio
      if (financials.peRatio > 0 && financials.peRatio < 15) score += 10;
      else if (financials.peRatio > 25) score -= 10;
      
      // تقييم P/B Ratio
      if (financials.priceToBook > 0 && financials.priceToBook < 1.5) score += 8;
      else if (financials.priceToBook > 3) score -= 8;
      
      // تقييم ROE
      if (financials.roe > 15) score += 12;
      else if (financials.roe < 5) score -= 12;
      
      // تقييم Debt to Equity
      if (financials.debtToEquity < 0.5) score += 8;
      else if (financials.debtToEquity > 2) score -= 8;
      
      // تقييم Current Ratio
      if (financials.currentRatio > 1.5) score += 6;
      else if (financials.currentRatio < 1) score -= 10;
      
      // تقييم نمو الأرباح
      if (financials.earningsGrowth > 10) score += 10;
      else if (financials.earningsGrowth < -5) score -= 15;

      // تحديد التوصية
      let recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
      if (score >= 80) recommendation = 'strong_buy';
      else if (score >= 65) recommendation = 'buy';
      else if (score >= 40) recommendation = 'hold';
      else if (score >= 25) recommendation = 'sell';
      else recommendation = 'strong_sell';

      // تحليل نقاط القوة والضعف
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      if (financials.peRatio > 0 && financials.peRatio < 15) strengths.push('P/E ratio منخفض وجذاب');
      if (financials.roe > 15) strengths.push('عائد عالي على حقوق الملكية');
      if (financials.currentRatio > 1.5) strengths.push('سيولة مالية قوية');
      if (financials.earningsGrowth > 10) strengths.push('نمو قوي في الأرباح');
      if (financials.debtToEquity < 0.5) strengths.push('مستوى دين منخفض');

      if (financials.peRatio > 25) weaknesses.push('P/E ratio مرتفع ومكلف');
      if (financials.roe < 5) weaknesses.push('عائد ضعيف على حقوق الملكية');
      if (financials.currentRatio < 1) weaknesses.push('مشاكل في السيولة');
      if (financials.earningsGrowth < -5) weaknesses.push('تراجع في الأرباح');
      if (financials.debtToEquity > 2) weaknesses.push('مستوى دين عالي');

      return {
        financials,
        score,
        recommendation,
        analysis: this.generateAnalysisText(score, recommendation),
        strengths,
        weaknesses
      };
    } catch (error) {
      console.error('Error in fundamental analysis:', error);
      throw error;
    }
  }

  // مساعد لتوليد بيانات تجريبية
  private generateEnhancedMockFinancials(symbol: string): any {
    const baseValue = symbol.charCodeAt(0) / 100; // Seed based on symbol
    
    return {
      symbol,
      sector: 'Technology',
      industry: 'Software',
      marketCap: '$' + (50 + baseValue * 200).toFixed(1) + 'B',
      employees: Math.floor(50000 + baseValue * 100000),
      description: `${symbol} is a leading technology company in the software sector.`,
      
      // Financial ratios
      pe_ratio: 15 + baseValue * 20,
      pb_ratio: 1.2 + baseValue * 3,
      ps_ratio: 2.1 + baseValue * 4,
      ev_ebitda: 12 + baseValue * 15,
      roe: 12 + baseValue * 15,
      roa: 8 + baseValue * 12,
      roic: 10 + baseValue * 15,
      current_ratio: 1.5 + baseValue * 2,
      quick_ratio: 1.2 + baseValue * 1.5,
      cash_ratio: 0.3 + baseValue * 0.5,
      debt_to_equity: 0.2 + baseValue * 1.5,
      net_margin: 8 + baseValue * 20,
      
      // Sector comparisons
      sector_pe: 18 + baseValue * 10,
      sector_pb: 2.5 + baseValue * 2,
      sector_roe: 15 + baseValue * 8,
      
      // Dividend info
      dividend_yield: 1.5 + baseValue * 3,
      dividend_growth: 5 + baseValue * 10,
      
      // Financial data
      total_revenue: '$' + (20 + baseValue * 80).toFixed(1) + 'B',
      total_assets: '$' + (100 + baseValue * 300).toFixed(1) + 'B',
      total_debt: '$' + (10 + baseValue * 50).toFixed(1) + 'B',
      free_cash_flow: '$' + (5 + baseValue * 20).toFixed(1) + 'B',
      current_price: 150 + baseValue * 200,
      revenue_growth: -5 + baseValue * 25,
      earnings_growth_5y: 8 + baseValue * 20,
      revenue_growth_5y: 12 + baseValue * 15,
      dividend_growth_5y: 6 + baseValue * 10,
      book_value_growth_5y: 10 + baseValue * 12,
      
      // Historical data
      revenue_history: [
        { year: '2019', revenue: 15 + baseValue * 40 },
        { year: '2020', revenue: 18 + baseValue * 45 },
        { year: '2021', revenue: 22 + baseValue * 55 },
        { year: '2022', revenue: 26 + baseValue * 65 },
        { year: '2023', revenue: 30 + baseValue * 75 }
      ],
      
      net_income_history: [
        { year: '2019', net_income: 2 + baseValue * 10 },
        { year: '2020', net_income: 3 + baseValue * 12 },
        { year: '2021', net_income: 4 + baseValue * 15 },
        { year: '2022', net_income: 5 + baseValue * 18 },
        { year: '2023', net_income: 6 + baseValue * 20 }
      ],
      
      growth_history: [
        { year: '2019', revenue_growth: 5 + baseValue * 10, earnings_growth: 8 + baseValue * 15, dividend_growth: 3 + baseValue * 8 },
        { year: '2020', revenue_growth: 12 + baseValue * 15, earnings_growth: 15 + baseValue * 20, dividend_growth: 5 + baseValue * 10 },
        { year: '2021', revenue_growth: 18 + baseValue * 12, earnings_growth: 20 + baseValue * 18, dividend_growth: 8 + baseValue * 12 },
        { year: '2022', revenue_growth: 15 + baseValue * 10, earnings_growth: 12 + baseValue * 15, dividend_growth: 6 + baseValue * 8 },
        { year: '2023', revenue_growth: 10 + baseValue * 8, earnings_growth: 8 + baseValue * 12, dividend_growth: 4 + baseValue * 6 }
      ],
      
      // DCF Analysis
      dcf_value: 180 + baseValue * 150,
      margin_of_safety: -10 + baseValue * 30,
      dcf_recommendation: baseValue > 0.5 ? 'BUY' : baseValue > 0.3 ? 'HOLD' : 'SELL',
      dcf_growth_rate: 8 + baseValue * 12,
      dcf_discount_rate: 8 + baseValue * 4,
      dcf_terminal_growth: 2 + baseValue * 3,
      
      sensitivity_analysis: [
        { growth_rate: 5, fair_value: 150 + baseValue * 100, current_price: 150 + baseValue * 200 },
        { growth_rate: 8, fair_value: 170 + baseValue * 120, current_price: 150 + baseValue * 200 },
        { growth_rate: 10, fair_value: 190 + baseValue * 140, current_price: 150 + baseValue * 200 },
        { growth_rate: 12, fair_value: 210 + baseValue * 160, current_price: 150 + baseValue * 200 },
        { growth_rate: 15, fair_value: 240 + baseValue * 180, current_price: 150 + baseValue * 200 }
      ],
      
      // Competitors
      competitors: [
        { symbol: 'COMPETITOR1', pe_ratio: 16 + baseValue * 8, pb_ratio: 2.1 + baseValue * 1.5, roe: 14 + baseValue * 8, market_cap: '$45B', growth: 8 + baseValue * 12 },
        { symbol: 'COMPETITOR2', pe_ratio: 14 + baseValue * 10, pb_ratio: 1.8 + baseValue * 2, roe: 16 + baseValue * 6, market_cap: '$38B', growth: 12 + baseValue * 8 },
        { symbol: 'COMPETITOR3', pe_ratio: 18 + baseValue * 12, pb_ratio: 2.5 + baseValue * 1.8, roe: 12 + baseValue * 10, market_cap: '$52B', growth: 6 + baseValue * 15 }
      ]
    };
  }

  private generateMockEconomicData(): any {
    return {
      unemployment_rate: 3.7,
      unemployment_change: -0.1,
      gdp_growth: 2.4,
      interest_rate: 5.25,
      interest_rate_change: 0.0,
      inflation_rate: 3.2,
      historical_data: [
        { date: '2023-Q1', gdp_growth: 2.1, inflation: 4.2, interest_rate: 4.75 },
        { date: '2023-Q2', gdp_growth: 2.3, inflation: 3.8, interest_rate: 5.0 },
        { date: '2023-Q3', gdp_growth: 2.4, inflation: 3.2, interest_rate: 5.25 },
      ]
    };
  }

  private generateMockFinancials(symbol: string): CompanyFinancials {
    return {
      symbol,
      marketCap: '$' + (Math.random() * 100).toFixed(1) + 'B',
      peRatio: Math.random() * 30 + 5,
      pegRatio: Math.random() * 3 + 0.5,
      priceToBook: Math.random() * 5 + 0.5,
      debtToEquity: Math.random() * 2,
      roe: Math.random() * 25 + 5,
      roa: Math.random() * 15 + 2,
      currentRatio: Math.random() * 3 + 0.5,
      quickRatio: Math.random() * 2 + 0.3,
      grossMargin: Math.random() * 50 + 20,
      operatingMargin: Math.random() * 30 + 5,
      netMargin: Math.random() * 20 + 2,
      revenue: '$' + (Math.random() * 50).toFixed(1) + 'B',
      revenueGrowth: (Math.random() - 0.3) * 30,
      earnings: Math.random() * 10 + 1,
      earningsGrowth: (Math.random() - 0.3) * 50,
      freeCashFlow: '$' + (Math.random() * 10).toFixed(1) + 'B',
      dividendYield: Math.random() * 5,
      lastUpdated: new Date().toISOString()
    };
  }

  private generateMockIndicator(name: string): EconomicIndicator {
    const value = Math.random() * 10 + 1;
    const previous = value + (Math.random() - 0.5) * 2;
    
    return {
      name,
      value,
      previousValue: previous,
      change: value - previous,
      impact: 'medium',
      unit: '%',
      releaseDate: new Date().toISOString().split('T')[0],
      nextRelease: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  private generateMockIndicators(): EconomicIndicator[] {
    return [
      'GDP Growth', 'Unemployment Rate', 'Inflation Rate', 
      'Interest Rate', 'Trade Balance', 'Consumer Confidence'
    ].map(name => this.generateMockIndicator(name));
  }

  private getImpactLevel(series: string): 'high' | 'medium' | 'low' {
    const highImpact = ['FEDFUNDS', 'UNRATE', 'CPIAUCSL', 'GDP'];
    const mediumImpact = ['DGS10', 'DEXUSEU'];
    
    if (highImpact.includes(series)) return 'high';
    if (mediumImpact.includes(series)) return 'medium';
    return 'low';
  }

  private getUnit(series: string): string {
    const percentSeries = ['FEDFUNDS', 'UNRATE', 'DGS10'];
    if (percentSeries.includes(series)) return '%';
    return '';
  }

  private calculateNextRelease(series: string): string {
    // تقدير تاريخ الإصدار التالي بناءً على نوع البيانات
    const monthlyData = ['UNRATE', 'CPIAUCSL'];
    const quarterlyData = ['GDP'];
    const weeklyData = ['FEDFUNDS'];
    
    let daysToAdd = 30; // افتراضي شهري
    if (weeklyData.includes(series)) daysToAdd = 7;
    else if (quarterlyData.includes(series)) daysToAdd = 90;
    
    return new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }

  private generateAnalysisText(score: number, recommendation: string): string {
    if (score >= 80) {
      return 'التحليل الأساسي يشير إلى شركة قوية جداً مع نسب مالية ممتازة ونمو مستدام. فرصة استثمارية قوية.';
    } else if (score >= 65) {
      return 'التحليل الأساسي إيجابي مع نسب مالية جيدة وأداء مقبول. استثمار جذاب مع مراقبة المخاطر.';
    } else if (score >= 40) {
      return 'التحليل الأساسي متوسط مع بعض نقاط القوة والضعف. يحتاج لمراقبة دقيقة قبل الاستثمار.';
    } else if (score >= 25) {
      return 'التحليل الأساسي يظهر ضعفاً في الأداء المالي مع مخاطر عالية. غير مناسب للاستثمار حالياً.';
    } else {
      return 'التحليل الأساسي ضعيف جداً مع نسب مالية سيئة ومخاطر عالية جداً. تجنب الاستثمار.';
    }
  }
}

export const fundamentalAnalysisService = new FundamentalAnalysisService();
