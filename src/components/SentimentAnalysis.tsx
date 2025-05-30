
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Twitter, 
  MessageSquare, 
  Newspaper,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Globe,
  Zap,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { sentimentAnalysisService, ComprehensiveSentimentAnalysis } from '@/services/sentimentAnalysisService';
import { cn } from '@/lib/utils';

interface SentimentAnalysisProps {
  symbol: string;
  lang?: 'en' | 'ar';
  className?: string;
}

export function SentimentAnalysis({ symbol, lang = 'en', className }: SentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<ComprehensiveSentimentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);
  const [monitoringStop, setMonitoringStop] = useState<(() => void) | null>(null);

  useEffect(() => {
    loadSentimentData();
  }, [symbol]);

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

  const toggleRealTimeMonitoring = async () => {
    if (realTimeMonitoring && monitoringStop) {
      monitoringStop();
      setMonitoringStop(null);
      setRealTimeMonitoring(false);
    } else {
      const stopFn = await sentimentAnalysisService.startRealTimeSentimentMonitoring(
        symbol,
        (data) => setSentimentData(data)
      );
      setMonitoringStop(() => stopFn);
      setRealTimeMonitoring(true);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-green-400';
    if (score < -0.1) return 'text-red-400';
    return 'text-gray-400';
  };

  const getSentimentBgColor = (score: number) => {
    if (score > 0.1) return 'bg-green-500/20';
    if (score < -0.1) return 'bg-red-500/20';
    return 'bg-gray-500/20';
  };

  const fearGreedColors = ['#FF4444', '#FF8800', '#FFDD00', '#88FF00', '#00FF44'];

  if (loading) {
    return (
      <Card className={cn("bg-trading-card border-gray-800", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-trading-light animate-pulse">
              {lang === 'ar' ? 'جاري تحليل المشاعر...' : 'Analyzing Market Sentiment...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sentimentData) {
    return (
      <Card className={cn("bg-trading-card border-gray-800", className)}>
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            {lang === 'ar' ? 'فشل في تحميل بيانات المشاعر' : 'Failed to load sentiment data'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* رأس التحليل */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Brain className="h-6 w-6" />
              {lang === 'ar' ? `تحليل المشاعر المتقدم - ${symbol}` : `Advanced Sentiment Analysis - ${symbol}`}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={loadSentimentData}
                disabled={loading}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {lang === 'ar' ? 'تحديث' : 'Refresh'}
              </Button>
              <Button
                onClick={toggleRealTimeMonitoring}
                size="sm"
                variant={realTimeMonitoring ? 'destructive' : 'default'}
              >
                <Eye className="h-4 w-4 mr-2" />
                {realTimeMonitoring 
                  ? (lang === 'ar' ? 'إيقاف المراقبة' : 'Stop Monitoring')
                  : (lang === 'ar' ? 'مراقبة مباشرة' : 'Live Monitoring')
                }
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: getSentimentColor(sentimentData.overall_sentiment.score) }}>
                {(sentimentData.overall_sentiment.score * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'المشاعر الإجمالية' : 'Overall Sentiment'}
              </div>
              <Badge className={getSentimentBgColor(sentimentData.overall_sentiment.score)}>
                {sentimentData.overall_sentiment.label}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(sentimentData.overall_sentiment.confidence * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'مستوى الثقة' : 'Confidence'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {sentimentData.social_media.twitter.mentions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'الإشارات على تويتر' : 'Twitter Mentions'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {sentimentData.social_media.reddit.mentions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'الإشارات على Reddit' : 'Reddit Mentions'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التنبيهات */}
      {sentimentData.alerts.length > 0 && (
        <Card className="bg-yellow-900/20 border-yellow-500/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              {lang === 'ar' ? 'تنبيهات المشاعر' : 'Sentiment Alerts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sentimentData.alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alert.severity === 'high' ? 'bg-red-900/20 border-red-500/50' :
                  alert.severity === 'medium' ? 'bg-yellow-900/20 border-yellow-500/50' :
                  'bg-blue-900/20 border-blue-500/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white">{alert.message}</span>
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* التحليلات التفصيلية */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">
            {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="news">
            {lang === 'ar' ? 'الأخبار' : 'News'}
          </TabsTrigger>
          <TabsTrigger value="social">
            {lang === 'ar' ? 'وسائل التواصل' : 'Social Media'}
          </TabsTrigger>
          <TabsTrigger value="fear-greed">
            {lang === 'ar' ? 'الخوف والطمع' : 'Fear & Greed'}
          </TabsTrigger>
          <TabsTrigger value="nlp">
            {lang === 'ar' ? 'تحليل النصوص' : 'NLP Analysis'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* اتجاهات المشاعر */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'اتجاهات المشاعر اليومية' : 'Daily Sentiment Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={sentimentData.sentiment_trends.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* مزاج السوق */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'مزاج السوق' : 'Market Mood'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'المستثمرون الأفراد' : 'Retail Investors'}
                    </span>
                    <span className="text-white">
                      {sentimentData.market_mood.retail_sentiment.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(sentimentData.market_mood.retail_sentiment)} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'المؤسسات' : 'Institutions'}
                    </span>
                    <span className="text-white">
                      {sentimentData.market_mood.institutional_sentiment.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(sentimentData.market_mood.institutional_sentiment)} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'المحللون' : 'Analysts'}
                    </span>
                    <span className="text-white">
                      {sentimentData.market_mood.analyst_sentiment.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(sentimentData.market_mood.analyst_sentiment)} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Newspaper className="h-5 w-5" />
                {lang === 'ar' ? 'تحليل الأخبار المالية' : 'Financial News Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentimentData.news_analysis.map((news, index) => (
                  <div key={index} className="p-4 bg-trading-secondary rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium flex-1">{news.headline}</h4>
                      <Badge className={getSentimentBgColor(news.sentiment.score)}>
                        {news.sentiment.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{news.source}</span>
                      <div className="flex items-center gap-4">
                        <span>تأثير: {news.impact}</span>
                        <span>نقاط: {(news.sentiment.score * 100).toFixed(1)}%</span>
                        <span>ثقة: {(news.sentiment.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* تويتر */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Twitter className="h-5 w-5" />
                  {lang === 'ar' ? 'تحليل تويتر/X' : 'Twitter/X Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {sentimentData.social_media.twitter.mentions.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">الإشارات</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {sentimentData.social_media.twitter.engagement.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">التفاعل</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">المواضيع الرائجة:</div>
                  <div className="flex flex-wrap gap-2">
                    {sentimentData.social_media.twitter.trending_topics.map((topic, i) => (
                      <Badge key={i} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${getSentimentColor(sentimentData.social_media.twitter.sentiment.score)}`}>
                    {(sentimentData.social_media.twitter.sentiment.score * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">المشاعر العامة</div>
                </div>
              </CardContent>
            </Card>

            {/* Reddit */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <MessageSquare className="h-5 w-5" />
                  {lang === 'ar' ? 'تحليل Reddit' : 'Reddit Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {sentimentData.social_media.reddit.mentions.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">الإشارات</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {sentimentData.social_media.reddit.engagement.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">التفاعل</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">المجتمعات النشطة:</div>
                  <div className="flex flex-wrap gap-2">
                    {sentimentData.social_media.reddit.trending_topics.map((topic, i) => (
                      <Badge key={i} variant="secondary">r/{topic}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${getSentimentColor(sentimentData.social_media.reddit.sentiment.score)}`}>
                    {(sentimentData.social_media.reddit.sentiment.score * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">المشاعر العامة</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fear-greed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* مؤشر الخوف والطمع */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'مؤشر الخوف والطمع' : 'Fear & Greed Index'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="relative">
                  <div className="text-6xl font-bold text-white mb-2">
                    {sentimentData.fear_greed_index.value}
                  </div>
                  <div className="text-lg text-gray-400">
                    {sentimentData.fear_greed_index.label}
                  </div>
                  <div className={`text-sm mt-2 ${sentimentData.fear_greed_index.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {sentimentData.fear_greed_index.change_24h >= 0 ? '↗' : '↘'} 
                    {Math.abs(sentimentData.fear_greed_index.change_24h).toFixed(1)} نقطة (24س)
                  </div>
                </div>
                <Progress value={sentimentData.fear_greed_index.value} className="h-3" />
              </CardContent>
            </Card>

            {/* مكونات المؤشر */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'مكونات المؤشر' : 'Index Components'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(sentimentData.fear_greed_index.components).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="text-white">{value.toFixed(0)}</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* التاريخ */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'التطور التاريخي (30 يوم)' : 'Historical Trend (30 Days)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={sentimentData.fear_greed_index.historical}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nlp" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* الكلمات المفتاحية */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'الكلمات المفتاحية' : 'Key Words'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sentimentData.nlp_insights.keywords.map((keyword, i) => (
                    <Badge key={i} variant="outline">{keyword}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* النبرة العاطفية */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'النبرة العاطفية' : 'Emotional Tone'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(sentimentData.nlp_insights.emotional_tone).map(([emotion, value]) => (
                  <div key={emotion}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 capitalize">{emotion}</span>
                      <span className="text-white">{(value * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* المؤشرات المالية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="h-5 w-5" />
                  {lang === 'ar' ? 'الإشارات الصاعدة' : 'Bullish Signals'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {sentimentData.nlp_insights.financial_indicators.bullish_signals.map((signal, i) => (
                    <li key={i} className="text-green-400 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      {signal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <TrendingDown className="h-5 w-5" />
                  {lang === 'ar' ? 'الإشارات الهابطة' : 'Bearish Signals'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {sentimentData.nlp_insights.financial_indicators.bearish_signals.map((signal, i) => (
                    <li key={i} className="text-red-400 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      {signal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
