
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sentimentAnalysisService, ComprehensiveSentimentAnalysis } from '@/services/sentimentAnalysisService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Globe,
  Twitter,
  MessageSquare,
  Newspaper,
  Eye,
  Zap,
  RefreshCw
} from 'lucide-react';

interface SentimentAnalysisProps {
  symbol: string;
  lang?: 'en' | 'ar';
}

export function SentimentAnalysis({ symbol, lang = 'en' }: SentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<ComprehensiveSentimentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'hourly' | 'daily' | 'weekly'>('daily');

  useEffect(() => {
    loadSentimentData();
  }, [symbol]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (realTimeMonitoring) {
      sentimentAnalysisService.startRealTimeSentimentMonitoring(symbol, (data) => {
        setSentimentData(data);
      }).then(stopMonitoring => {
        cleanup = stopMonitoring;
      });
    }
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [realTimeMonitoring, symbol]);

  const loadSentimentData = async () => {
    setLoading(true);
    try {
      const data = await sentimentAnalysisService.getComprehensiveSentimentAnalysis(symbol);
      setSentimentData(data);
    } catch (error) {
      console.error('Error loading sentiment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.2) return '#00FF88';
    if (score < -0.2) return '#FF4444';
    return '#FFD700';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.6) return lang === 'ar' ? 'إيجابي جداً' : 'Very Positive';
    if (score > 0.2) return lang === 'ar' ? 'إيجابي' : 'Positive';
    if (score > -0.2) return lang === 'ar' ? 'محايد' : 'Neutral';
    if (score > -0.6) return lang === 'ar' ? 'سلبي' : 'Negative';
    return lang === 'ar' ? 'سلبي جداً' : 'Very Negative';
  };

  const getFearGreedColor = (value: number) => {
    if (value <= 20) return '#FF4444';
    if (value <= 40) return '#FF8800';
    if (value <= 60) return '#FFD700';
    if (value <= 80) return '#88FF88';
    return '#00FF88';
  };

  const getFearGreedLabel = (value: number) => {
    if (value <= 20) return lang === 'ar' ? 'خوف شديد' : 'Extreme Fear';
    if (value <= 40) return lang === 'ar' ? 'خوف' : 'Fear';
    if (value <= 60) return lang === 'ar' ? 'محايد' : 'Neutral';
    if (value <= 80) return lang === 'ar' ? 'طمع' : 'Greed';
    return lang === 'ar' ? 'طمع شديد' : 'Extreme Greed';
  };

  if (loading) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-trading-light animate-pulse">
              {lang === 'ar' ? 'جاري تحليل المشاعر...' : 'Loading Sentiment Analysis...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sentimentData) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            {lang === 'ar' ? 'لا توجد بيانات مشاعر متاحة' : 'No sentiment data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pieChartData = [
    { 
      name: lang === 'ar' ? 'إيجابي' : 'Positive', 
      value: Math.max(0, sentimentData.overall_sentiment.score) * 100,
      color: '#00FF88'
    },
    { 
      name: lang === 'ar' ? 'محايد' : 'Neutral', 
      value: (1 - Math.abs(sentimentData.overall_sentiment.score)) * 100,
      color: '#FFD700'
    },
    { 
      name: lang === 'ar' ? 'سلبي' : 'Negative', 
      value: Math.max(0, -sentimentData.overall_sentiment.score) * 100,
      color: '#FF4444'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {lang === 'ar' ? `تحليل المشاعر - ${symbol}` : `Sentiment Analysis - ${symbol}`}
        </h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setRealTimeMonitoring(!realTimeMonitoring)}
            variant={realTimeMonitoring ? 'default' : 'outline'}
            size="sm"
          >
            <Zap className="h-4 w-4 mr-2" />
            {realTimeMonitoring ? 
              (lang === 'ar' ? 'إيقاف المراقبة' : 'Stop Monitoring') :
              (lang === 'ar' ? 'مراقبة فورية' : 'Live Monitor')
            }
          </Button>
          <Button onClick={loadSentimentData} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Overall Sentiment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4" />
              {lang === 'ar' ? 'المشاعر العامة' : 'Overall Sentiment'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: getSentimentColor(sentimentData.overall_sentiment.score) }}
              >
                {(sentimentData.overall_sentiment.score * 100).toFixed(1)}%
              </div>
              <Badge 
                style={{ 
                  backgroundColor: getSentimentColor(sentimentData.overall_sentiment.score),
                  color: 'black'
                }}
              >
                {getSentimentLabel(sentimentData.overall_sentiment.score)}
              </Badge>
              <Progress 
                value={Math.abs(sentimentData.overall_sentiment.score) * 100}
                className="mt-3"
              />
              <div className="text-xs text-gray-400 mt-2">
                {lang === 'ar' ? 'الثقة:' : 'Confidence:'} {(sentimentData.overall_sentiment.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Twitter className="h-4 w-4" />
              {lang === 'ar' ? 'تويتر/X' : 'Twitter/X'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{lang === 'ar' ? 'الإشارات:' : 'Mentions:'}</span>
                <span className="font-bold">{sentimentData.social_media.twitter.mentions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{lang === 'ar' ? 'المشاعر:' : 'Sentiment:'}</span>
                <Badge 
                  variant={
                    sentimentData.social_media.twitter.sentiment.score > 0.1 ? 'default' :
                    sentimentData.social_media.twitter.sentiment.score < -0.1 ? 'destructive' : 'secondary'
                  }
                >
                  {(sentimentData.social_media.twitter.sentiment.score * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{lang === 'ar' ? 'التفاعل:' : 'Engagement:'}</span>
                <span className="font-bold">{sentimentData.social_media.twitter.engagement.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              Reddit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{lang === 'ar' ? 'الإشارات:' : 'Mentions:'}</span>
                <span className="font-bold">{sentimentData.social_media.reddit.mentions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{lang === 'ar' ? 'المشاعر:' : 'Sentiment:'}</span>
                <Badge 
                  variant={
                    sentimentData.social_media.reddit.sentiment.score > 0.1 ? 'default' :
                    sentimentData.social_media.reddit.sentiment.score < -0.1 ? 'destructive' : 'secondary'
                  }
                >
                  {(sentimentData.social_media.reddit.sentiment.score * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{lang === 'ar' ? 'التأثير:' : 'Influence:'}</span>
                <Progress value={sentimentData.social_media.reddit.influence_score * 100} className="w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              {lang === 'ar' ? 'مؤشر الخوف والطمع' : 'Fear & Greed Index'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: getFearGreedColor(sentimentData.fear_greed_index.value) }}
              >
                {sentimentData.fear_greed_index.value}
              </div>
              <Badge 
                style={{ 
                  backgroundColor: getFearGreedColor(sentimentData.fear_greed_index.value),
                  color: 'white'
                }}
              >
                {getFearGreedLabel(sentimentData.fear_greed_index.value)}
              </Badge>
              <div className="text-xs text-gray-400 mt-2">
                24h: {sentimentData.fear_greed_index.change_24h > 0 ? '+' : ''}{sentimentData.fear_greed_index.change_24h.toFixed(1)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="trends">{lang === 'ar' ? 'الاتجاهات' : 'Trends'}</TabsTrigger>
          <TabsTrigger value="news">{lang === 'ar' ? 'الأخبار' : 'News'}</TabsTrigger>
          <TabsTrigger value="nlp">{lang === 'ar' ? 'تحليل النصوص' : 'NLP Analysis'}</TabsTrigger>
          <TabsTrigger value="market-mood">{lang === 'ar' ? 'حالة السوق' : 'Market Mood'}</TabsTrigger>
          <TabsTrigger value="alerts">{lang === 'ar' ? 'التنبيهات' : 'Alerts'}</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{lang === 'ar' ? 'اتجاهات المشاعر' : 'Sentiment Trends'}</CardTitle>
                <div className="flex gap-2">
                  {(['hourly', 'daily', 'weekly'] as const).map(timeframe => (
                    <Button
                      key={timeframe}
                      size="sm"
                      variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                      onClick={() => setSelectedTimeframe(timeframe)}
                    >
                      {timeframe === 'hourly' ? (lang === 'ar' ? 'ساعي' : 'Hourly') :
                       timeframe === 'daily' ? (lang === 'ar' ? 'يومي' : 'Daily') :
                       (lang === 'ar' ? 'أسبوعي' : 'Weekly')}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sentimentData.sentiment_trends[selectedTimeframe]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey={selectedTimeframe === 'hourly' ? 'time' : selectedTimeframe === 'daily' ? 'date' : 'week'}
                      stroke="#9CA3AF"
                    />
                    <YAxis stroke="#9CA3AF" domain={[-1, 1]} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Area
                      dataKey="score"
                      stroke="#60A5FA"
                      fill="url(#sentimentGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'توزيع المشاعر' : 'Sentiment Distribution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'مؤشرات الخوف والطمع' : 'Fear & Greed Components'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(sentimentData.fear_greed_index.components).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{key.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={value} className="w-20" />
                        <span className="text-sm font-bold">{value.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                {lang === 'ar' ? 'تحليل الأخبار المالية' : 'Financial News Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentimentData.news_analysis.slice(0, 10).map((news, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white line-clamp-2">{news.headline}</h4>
                      <Badge 
                        variant={news.impact === 'high' ? 'destructive' : news.impact === 'medium' ? 'default' : 'secondary'}
                      >
                        {news.impact.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">{news.source}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          style={{ 
                            backgroundColor: getSentimentColor(news.sentiment.score),
                            color: 'black'
                          }}
                        >
                          {(news.sentiment.score * 100).toFixed(1)}%
                        </Badge>
                        <span className="text-gray-400">
                          {new Date(news.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={news.relevance * 100}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {lang === 'ar' ? 'الصلة:' : 'Relevance:'} {(news.relevance * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nlp" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'الكلمات المفتاحية' : 'Keywords'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sentimentData.nlp_insights.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'المواضيع' : 'Topics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sentimentData.nlp_insights.topics.map((topic, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{topic.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={topic.weight * 100} className="w-20" />
                        <span className="text-sm font-bold">{(topic.weight * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'النبرة العاطفية' : 'Emotional Tone'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(sentimentData.nlp_insights.emotional_tone).map(([emotion, value]) => (
                    <div key={emotion} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{emotion}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={value * 100} className="w-20" />
                        <span className="text-sm font-bold">{(value * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'المؤشرات المالية' : 'Financial Indicators'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bullish" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="bullish">{lang === 'ar' ? 'صعودي' : 'Bullish'}</TabsTrigger>
                    <TabsTrigger value="bearish">{lang === 'ar' ? 'هبوطي' : 'Bearish'}</TabsTrigger>
                    <TabsTrigger value="risks">{lang === 'ar' ? 'مخاطر' : 'Risks'}</TabsTrigger>
                    <TabsTrigger value="opportunities">{lang === 'ar' ? 'فرص' : 'Opportunities'}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bullish" className="mt-4">
                    <div className="space-y-2">
                      {sentimentData.nlp_insights.financial_indicators.bullish_signals.map((signal, index) => (
                        <div key={index} className="flex items-center gap-2 text-green-400">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">{signal}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="bearish" className="mt-4">
                    <div className="space-y-2">
                      {sentimentData.nlp_insights.financial_indicators.bearish_signals.map((signal, index) => (
                        <div key={index} className="flex items-center gap-2 text-red-400">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm">{signal}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="risks" className="mt-4">
                    <div className="space-y-2">
                      {sentimentData.nlp_insights.financial_indicators.risk_factors.map((risk, index) => (
                        <div key={index} className="flex items-center gap-2 text-yellow-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="opportunities" className="mt-4">
                    <div className="space-y-2">
                      {sentimentData.nlp_insights.financial_indicators.opportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-center gap-2 text-blue-400">
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market-mood" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle>{lang === 'ar' ? 'حالة السوق العامة' : 'Overall Market Mood'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="text-lg font-medium mb-2">{lang === 'ar' ? 'المستثمرون الأفراد' : 'Retail Sentiment'}</h4>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: getSentimentColor(sentimentData.market_mood.retail_sentiment / 100) }}
                  >
                    {sentimentData.market_mood.retail_sentiment.toFixed(0)}
                  </div>
                  <Progress value={Math.abs(sentimentData.market_mood.retail_sentiment)} className="mt-2" />
                </div>
                
                <div className="text-center">
                  <h4 className="text-lg font-medium mb-2">{lang === 'ar' ? 'المؤسسات' : 'Institutional'}</h4>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: getSentimentColor(sentimentData.market_mood.institutional_sentiment / 100) }}
                  >
                    {sentimentData.market_mood.institutional_sentiment.toFixed(0)}
                  </div>
                  <Progress value={Math.abs(sentimentData.market_mood.institutional_sentiment)} className="mt-2" />
                </div>
                
                <div className="text-center">
                  <h4 className="text-lg font-medium mb-2">{lang === 'ar' ? 'المحللون' : 'Analysts'}</h4>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: getSentimentColor(sentimentData.market_mood.analyst_sentiment / 100) }}
                  >
                    {sentimentData.market_mood.analyst_sentiment.toFixed(0)}
                  </div>
                  <Progress value={Math.abs(sentimentData.market_mood.analyst_sentiment)} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle>{lang === 'ar' ? 'المواضيع الرائجة' : 'Trending Topics'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Twitter/X</h4>
                  <div className="space-y-2">
                    {sentimentData.social_media.twitter.trending_topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Reddit</h4>
                  <div className="space-y-2">
                    {sentimentData.social_media.reddit.trending_topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        r/{topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {lang === 'ar' ? 'تنبيهات المشاعر' : 'Sentiment Alerts'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentimentData.alerts.length > 0 ? (
                  sentimentData.alerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.severity === 'high' ? 'bg-red-900/20 border-red-500' :
                        alert.severity === 'medium' ? 'bg-yellow-900/20 border-yellow-500' :
                        'bg-blue-900/20 border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-white">{alert.message}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Badge 
                          variant={
                            alert.severity === 'high' ? 'destructive' :
                            alert.severity === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    {lang === 'ar' ? 'لا توجد تنبيهات حالياً' : 'No alerts currently'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
