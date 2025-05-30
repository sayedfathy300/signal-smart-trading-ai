
export interface SentimentData {
  score: number; // -1 to 1
  label: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
  magnitude: number; // 0-1
}

export interface NewsAnalysis {
  headline: string;
  source: string;
  sentiment: SentimentData;
  relevance: number;
  timestamp: number;
  url: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SocialMediaAnalysis {
  platform: 'twitter' | 'reddit';
  mentions: number;
  sentiment: SentimentData;
  trending_topics: string[];
  engagement: number;
  influence_score: number;
}

export interface FearGreedIndex {
  value: number; // 0-100
  label: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  change_24h: number;
  historical: { date: string; value: number }[];
  components: {
    volatility: number;
    momentum: number;
    volume: number;
    put_call_ratio: number;
    market_breadth: number;
    safe_haven: number;
    junk_bond_demand: number;
  };
}

export interface NLPAnalysis {
  keywords: string[];
  entities: { text: string; type: string; confidence: number }[];
  topics: { name: string; weight: number }[];
  emotional_tone: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    confidence: number;
  };
  financial_indicators: {
    bullish_signals: string[];
    bearish_signals: string[];
    risk_factors: string[];
    opportunities: string[];
  };
}

export interface ComprehensiveSentimentAnalysis {
  symbol: string;
  overall_sentiment: SentimentData;
  news_analysis: NewsAnalysis[];
  social_media: {
    twitter: SocialMediaAnalysis;
    reddit: SocialMediaAnalysis;
  };
  fear_greed_index: FearGreedIndex;
  nlp_insights: NLPAnalysis;
  market_mood: {
    retail_sentiment: number;
    institutional_sentiment: number;
    analyst_sentiment: number;
  };
  sentiment_trends: {
    hourly: { time: string; score: number }[];
    daily: { date: string; score: number }[];
    weekly: { week: string; score: number }[];
  };
  alerts: {
    type: 'sentiment_spike' | 'news_impact' | 'social_buzz' | 'fear_greed_extreme';
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: number;
  }[];
}

class SentimentAnalysisService {
  private newsApiKey = 'demo'; // في الإنتاج، يجب استخدام Supabase secrets
  private twitterApiKey = 'demo';
  private redditClientId = 'demo';

  // تحليل الأخبار المالية
  async analyzeNews(symbol: string): Promise<NewsAnalysis[]> {
    console.log(`📰 تحليل الأخبار المالية لـ ${symbol}`);
    
    try {
      // محاكاة تحليل الأخبار المتقدم
      const mockNews: NewsAnalysis[] = [
        {
          headline: `${symbol} تسجل أرباح فصلية قوية تفوق التوقعات`,
          source: 'Bloomberg',
          sentiment: {
            score: 0.8,
            label: 'positive',
            confidence: 0.92,
            magnitude: 0.75
          },
          relevance: 0.95,
          timestamp: Date.now() - 3600000,
          url: '#',
          impact: 'high'
        },
        {
          headline: `تقرير: ${symbol} تواجه تحديات في السوق الآسيوية`,
          source: 'Reuters',
          sentiment: {
            score: -0.4,
            label: 'negative',
            confidence: 0.78,
            magnitude: 0.55
          },
          relevance: 0.82,
          timestamp: Date.now() - 7200000,
          url: '#',
          impact: 'medium'
        },
        {
          headline: `محللون: ${symbol} تحافظ على موقع قوي رغم التقلبات`,
          source: 'CNBC',
          sentiment: {
            score: 0.3,
            label: 'positive',
            confidence: 0.85,
            magnitude: 0.45
          },
          relevance: 0.88,
          timestamp: Date.now() - 10800000,
          url: '#',
          impact: 'medium'
        }
      ];

      return mockNews;
    } catch (error) {
      console.error('خطأ في تحليل الأخبار:', error);
      return [];
    }
  }

  // تحليل تويتر/X
  async analyzeTwitterSentiment(symbol: string): Promise<SocialMediaAnalysis> {
    console.log(`🐦 تحليل مشاعر تويتر لـ ${symbol}`);
    
    // محاكاة تحليل تويتر المتقدم
    return {
      platform: 'twitter',
      mentions: Math.floor(Math.random() * 5000) + 1000,
      sentiment: {
        score: (Math.random() - 0.5) * 2,
        label: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
        confidence: Math.random() * 0.3 + 0.7,
        magnitude: Math.random() * 0.5 + 0.3
      },
      trending_topics: [
        `#${symbol}`,
        '#StockMarket',
        '#TradingSignals',
        '#InvestmentTips',
        '#MarketAnalysis'
      ],
      engagement: Math.floor(Math.random() * 100000) + 10000,
      influence_score: Math.random() * 0.4 + 0.6
    };
  }

  // تحليل Reddit
  async analyzeRedditSentiment(symbol: string): Promise<SocialMediaAnalysis> {
    console.log(`📱 تحليل مشاعر Reddit لـ ${symbol}`);
    
    // محاكاة تحليل Reddit المتقدم
    return {
      platform: 'reddit',
      mentions: Math.floor(Math.random() * 2000) + 500,
      sentiment: {
        score: (Math.random() - 0.5) * 2,
        label: Math.random() > 0.5 ? 'positive' : Math.random() > 0.25 ? 'neutral' : 'negative',
        confidence: Math.random() * 0.3 + 0.7,
        magnitude: Math.random() * 0.5 + 0.3
      },
      trending_topics: [
        'wallstreetbets',
        'investing',
        'stocks',
        'cryptocurrency',
        'financialadvice'
      ],
      engagement: Math.floor(Math.random() * 50000) + 5000,
      influence_score: Math.random() * 0.4 + 0.5
    };
  }

  // مؤشر الخوف والطمع
  async getFearGreedIndex(): Promise<FearGreedIndex> {
    console.log('😰 حساب مؤشر الخوف والطمع');
    
    const value = Math.floor(Math.random() * 100);
    let label: FearGreedIndex['label'];
    
    if (value <= 20) label = 'Extreme Fear';
    else if (value <= 40) label = 'Fear';
    else if (value <= 60) label = 'Neutral';
    else if (value <= 80) label = 'Greed';
    else label = 'Extreme Greed';

    // إنشاء بيانات تاريخية
    const historical = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100)
    })).reverse();

    return {
      value,
      label,
      change_24h: (Math.random() - 0.5) * 20,
      historical,
      components: {
        volatility: Math.random() * 100,
        momentum: Math.random() * 100,
        volume: Math.random() * 100,
        put_call_ratio: Math.random() * 100,
        market_breadth: Math.random() * 100,
        safe_haven: Math.random() * 100,
        junk_bond_demand: Math.random() * 100
      }
    };
  }

  // معالجة النصوص بـ NLP
  async performNLPAnalysis(texts: string[]): Promise<NLPAnalysis> {
    console.log('🧠 تحليل النصوص المالية بـ NLP');
    
    // محاكاة تحليل NLP متقدم
    const keywords = [
      'earnings', 'revenue', 'profit', 'growth', 'expansion',
      'market share', 'competition', 'innovation', 'dividend',
      'acquisition', 'merger', 'partnership', 'regulation'
    ];

    const entities = [
      { text: 'Federal Reserve', type: 'ORGANIZATION', confidence: 0.95 },
      { text: 'Q4 2024', type: 'DATE', confidence: 0.88 },
      { text: '$2.5 billion', type: 'MONEY', confidence: 0.92 },
      { text: 'Wall Street', type: 'LOCATION', confidence: 0.87 }
    ];

    const topics = [
      { name: 'Financial Performance', weight: 0.35 },
      { name: 'Market Trends', weight: 0.28 },
      { name: 'Economic Policy', weight: 0.22 },
      { name: 'Industry Analysis', weight: 0.15 }
    ];

    return {
      keywords: keywords.slice(0, Math.floor(Math.random() * 8) + 5),
      entities,
      topics,
      emotional_tone: {
        joy: Math.random() * 0.4 + 0.1,
        sadness: Math.random() * 0.3 + 0.05,
        anger: Math.random() * 0.2 + 0.05,
        fear: Math.random() * 0.3 + 0.1,
        confidence: Math.random() * 0.5 + 0.4
      },
      financial_indicators: {
        bullish_signals: [
          'إيرادات متزايدة',
          'نمو في الأرباح',
          'توسع في الأسواق الجديدة',
          'ابتكارات تقنية'
        ],
        bearish_signals: [
          'تراجع الهوامش',
          'زيادة المنافسة',
          'تحديات تنظيمية'
        ],
        risk_factors: [
          'تقلبات أسعار المواد الخام',
          'عدم اليقين الاقتصادي',
          'تغيرات في السياسة النقدية'
        ],
        opportunities: [
          'نمو الأسواق الناشئة',
          'التحول الرقمي',
          'الاستدامة البيئية'
        ]
      }
    };
  }

  // تحليل شامل للمشاعر
  async getComprehensiveSentimentAnalysis(symbol: string): Promise<ComprehensiveSentimentAnalysis> {
    console.log(`📊 التحليل الشامل للمشاعر - ${symbol}`);
    
    try {
      // جمع جميع البيانات بشكل متوازي
      const [newsAnalysis, twitterData, redditData, fearGreedData] = await Promise.all([
        this.analyzeNews(symbol),
        this.analyzeTwitterSentiment(symbol),
        this.analyzeRedditSentiment(symbol),
        this.getFearGreedIndex()
      ]);

      // تحليل NLP للأخبار
      const newsTexts = newsAnalysis.map(news => news.headline);
      const nlpInsights = await this.performNLPAnalysis(newsTexts);

      // حساب المشاعر الإجمالية
      const sentimentScores = [
        ...newsAnalysis.map(n => n.sentiment.score),
        twitterData.sentiment.score,
        redditData.sentiment.score
      ];
      
      const overallScore = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
      const overallSentiment: SentimentData = {
        score: overallScore,
        label: overallScore > 0.1 ? 'positive' : overallScore < -0.1 ? 'negative' : 'neutral',
        confidence: 0.85,
        magnitude: Math.abs(overallScore)
      };

      // إنشاء اتجاهات المشاعر
      const sentimentTrends = {
        hourly: Array.from({ length: 24 }, (_, i) => ({
          time: `${23 - i}:00`,
          score: (Math.random() - 0.5) * 2
        })).reverse(),
        daily: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          score: (Math.random() - 0.5) * 2
        })).reverse(),
        weekly: Array.from({ length: 4 }, (_, i) => ({
          week: `Week ${4 - i}`,
          score: (Math.random() - 0.5) * 2
        })).reverse()
      };

      // إنشاء التنبيهات
      const alerts = [];
      if (Math.abs(overallScore) > 0.7) {
        alerts.push({
          type: 'sentiment_spike' as const,
          message: `ارتفاع/انخفاض حاد في المشاعر العامة (${(overallScore * 100).toFixed(1)}%)`,
          severity: 'high' as const,
          timestamp: Date.now()
        });
      }

      if (fearGreedData.value <= 20 || fearGreedData.value >= 80) {
        alerts.push({
          type: 'fear_greed_extreme' as const,
          message: `مؤشر الخوف والطمع في منطقة ${fearGreedData.label}`,
          severity: 'medium' as const,
          timestamp: Date.now()
        });
      }

      return {
        symbol,
        overall_sentiment: overallSentiment,
        news_analysis: newsAnalysis,
        social_media: {
          twitter: twitterData,
          reddit: redditData
        },
        fear_greed_index: fearGreedData,
        nlp_insights: nlpInsights,
        market_mood: {
          retail_sentiment: Math.random() * 200 - 100,
          institutional_sentiment: Math.random() * 200 - 100,
          analyst_sentiment: Math.random() * 200 - 100
        },
        sentiment_trends: sentimentTrends,
        alerts
      };
    } catch (error) {
      console.error('خطأ في التحليل الشامل للمشاعر:', error);
      throw error;
    }
  }

  // تحليل المشاعر للرموز المتعددة
  async analyzeBulkSentiment(symbols: string[]): Promise<Map<string, ComprehensiveSentimentAnalysis>> {
    console.log(`📈 تحليل المشاعر المجمع لـ ${symbols.length} رمز`);
    
    const results = new Map<string, ComprehensiveSentimentAnalysis>();
    
    const promises = symbols.map(symbol => 
      this.getComprehensiveSentimentAnalysis(symbol)
        .then(analysis => results.set(symbol, analysis))
        .catch(error => console.error(`خطأ في تحليل ${symbol}:`, error))
    );
    
    await Promise.all(promises);
    return results;
  }

  // مراقبة المشاعر في الوقت الفعلي
  async startRealTimeSentimentMonitoring(symbol: string, callback: (data: ComprehensiveSentimentAnalysis) => void): Promise<() => void> {
    console.log(`⏰ بدء مراقبة المشاعر في الوقت الفعلي لـ ${symbol}`);
    
    const intervalId = setInterval(async () => {
      try {
        const analysis = await this.getComprehensiveSentimentAnalysis(symbol);
        callback(analysis);
      } catch (error) {
        console.error('خطأ في مراقبة المشاعر:', error);
      }
    }, 60000); // كل دقيقة
    
    return () => clearInterval(intervalId);
  }
}

export const sentimentAnalysisService = new SentimentAnalysisService();
