
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  User, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Search, 
  Filter,
  Building,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Target,
  AlertTriangle
} from 'lucide-react';

interface ExecutiveSentimentProps {
  lang?: 'en' | 'ar';
}

interface ExecutiveProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  sector: string;
  influence: number;
  credibility: number;
  followersCount: number;
  avgEngagement: number;
  recentActivity: number;
  marketImpact: 'high' | 'medium' | 'low';
  avatar: string;
}

interface SentimentData {
  executiveId: string;
  timestamp: string;
  content: string;
  platform: 'twitter' | 'linkedin' | 'interview' | 'earnings_call' | 'conference';
  sentiment: number; // -100 to 100
  confidence: number;
  topics: string[];
  marketRelevance: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  impact: {
    stockPrice: number;
    volumeChange: number;
    sectorMovement: number;
  };
}

interface SentimentTrend {
  date: string;
  overallSentiment: number;
  bullishExecutives: number;
  bearishExecutives: number;
  neutralExecutives: number;
  marketCorrelation: number;
}

interface TopicAnalysis {
  topic: string;
  mentionCount: number;
  averageSentiment: number;
  trendDirection: 'up' | 'down' | 'stable';
  keyExecutives: string[];
  marketImpact: number;
}

const ExecutiveSentiment = ({ lang = 'ar' }: ExecutiveSentimentProps) => {
  const [executives, setExecutives] = useState<ExecutiveProfile[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [sentimentTrends, setSentimentTrends] = useState<SentimentTrend[]>([]);
  const [topicAnalysis, setTopicAnalysis] = useState<TopicAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExecutive, setSelectedExecutive] = useState<string>('all');

  useEffect(() => {
    // محاكاة بيانات المدراء التنفيذيين
    setExecutives([
      {
        id: 'exec-1',
        name: 'Elon Musk',
        title: 'CEO',
        company: 'Tesla',
        sector: 'Technology/Automotive',
        influence: 98,
        credibility: 87,
        followersCount: 150000000,
        avgEngagement: 5.2,
        recentActivity: 85,
        marketImpact: 'high',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 'exec-2',
        name: 'Jamie Dimon',
        title: 'CEO',
        company: 'JPMorgan Chase',
        sector: 'Financial Services',
        influence: 94,
        credibility: 96,
        followersCount: 2500000,
        avgEngagement: 3.8,
        recentActivity: 72,
        marketImpact: 'high',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 'exec-3',
        name: 'Satya Nadella',
        title: 'CEO',
        company: 'Microsoft',
        sector: 'Technology',
        influence: 91,
        credibility: 94,
        followersCount: 8500000,
        avgEngagement: 4.1,
        recentActivity: 68,
        marketImpact: 'high',
        avatar: '/api/placeholder/40/40'
      },
      {
        id: 'exec-4',
        name: 'Tim Cook',
        title: 'CEO',
        company: 'Apple',
        sector: 'Technology',
        influence: 89,
        credibility: 92,
        followersCount: 12000000,
        avgEngagement: 3.5,
        recentActivity: 65,
        marketImpact: 'medium',
        avatar: '/api/placeholder/40/40'
      }
    ]);

    setSentimentData([
      {
        executiveId: 'exec-1',
        timestamp: '2024-03-15 14:30',
        content: 'Q1 results exceeded expectations. Strong demand for Model Y continues. Optimistic about AI developments.',
        platform: 'earnings_call',
        sentiment: 75,
        confidence: 92,
        topics: ['Q1 Results', 'Model Y', 'AI', 'Demand'],
        marketRelevance: 88,
        engagement: {
          likes: 45000,
          shares: 12000,
          comments: 8500
        },
        impact: {
          stockPrice: 3.2,
          volumeChange: 25,
          sectorMovement: 1.8
        }
      },
      {
        executiveId: 'exec-2',
        timestamp: '2024-03-15 13:15',
        content: 'Banking sector faces headwinds but JPM remains resilient. Credit quality stable.',
        platform: 'interview',
        sentiment: 15,
        confidence: 87,
        topics: ['Banking', 'Credit Quality', 'Economic Outlook'],
        marketRelevance: 82,
        engagement: {
          likes: 2300,
          shares: 890,
          comments: 1200
        },
        impact: {
          stockPrice: -1.5,
          volumeChange: 15,
          sectorMovement: -0.8
        }
      }
    ]);

    setSentimentTrends([
      { date: '2024-03-01', overallSentiment: 65, bullishExecutives: 45, bearishExecutives: 25, neutralExecutives: 30, marketCorrelation: 0.78 },
      { date: '2024-03-02', overallSentiment: 58, bullishExecutives: 42, bearishExecutives: 28, neutralExecutives: 30, marketCorrelation: 0.82 },
      { date: '2024-03-03', overallSentiment: 72, bullishExecutives: 48, bearishExecutives: 22, neutralExecutives: 30, marketCorrelation: 0.85 },
      { date: '2024-03-04', overallSentiment: 68, bullishExecutives: 46, bearishExecutives: 24, neutralExecutives: 30, marketCorrelation: 0.79 },
      { date: '2024-03-05', overallSentiment: 61, bullishExecutives: 43, bearishExecutives: 27, neutralExecutives: 30, marketCorrelation: 0.76 },
      { date: '2024-03-06', overallSentiment: 74, bullishExecutives: 50, bearishExecutives: 20, neutralExecutives: 30, marketCorrelation: 0.88 }
    ]);

    setTopicAnalysis([
      {
        topic: 'AI & Technology',
        mentionCount: 124,
        averageSentiment: 78,
        trendDirection: 'up',
        keyExecutives: ['Elon Musk', 'Satya Nadella', 'Tim Cook'],
        marketImpact: 85
      },
      {
        topic: 'Economic Outlook',
        mentionCount: 89,
        averageSentiment: 35,
        trendDirection: 'down',
        keyExecutives: ['Jamie Dimon', 'Warren Buffett'],
        marketImpact: 72
      },
      {
        topic: 'Supply Chain',
        mentionCount: 67,
        averageSentiment: 42,
        trendDirection: 'stable',
        keyExecutives: ['Tim Cook', 'Mary Barra'],
        marketImpact: 65
      },
      {
        topic: 'ESG & Sustainability',
        mentionCount: 45,
        averageSentiment: 68,
        trendDirection: 'up',
        keyExecutives: ['Satya Nadella', 'Tim Cook'],
        marketImpact: 58
      }
    ]);
  }, []);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 50) return 'text-green-400';
    if (sentiment > 0) return 'text-yellow-400';
    if (sentiment > -50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment > 50) return 'bg-green-600';
    if (sentiment > 0) return 'bg-yellow-600';
    if (sentiment > -50) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Zap className="h-4 w-4 text-red-400" />;
      case 'medium':
        return <Target className="h-4 w-4 text-yellow-400" />;
      case 'low':
        return <Eye className="h-4 w-4 text-green-400" />;
      default:
        return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const formatArabicNumber = (num: number) => {
    return num.toLocaleString('ar-EG');
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="h-6 w-6 text-blue-400" />
            {lang === 'ar' ? 'تحليل مشاعر المديرين التنفيذيين' : 'Executive Sentiment Analysis'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'مراقبة وتحليل مشاعر وتصريحات كبار المديرين التنفيذيين وتأثيرها على السوق'
              : 'Monitor and analyze executive sentiment and statements impact on market movements'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-600">
            {lang === 'ar' ? 'مراقبة مباشرة' : 'Live Monitoring'}
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            {lang === 'ar' ? 'ذكاء اصطناعي' : 'AI Powered'}
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={lang === 'ar' ? 'البحث في المديرين أو الشركات...' : 'Search executives or companies...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-trading-card border-gray-600 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600">
          <Filter className="h-4 w-4 mr-2" />
          {lang === 'ar' ? 'تصفية' : 'Filter'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">
            {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="executives">
            {lang === 'ar' ? 'المديرين' : 'Executives'}
          </TabsTrigger>
          <TabsTrigger value="sentiment">
            {lang === 'ar' ? 'المشاعر' : 'Sentiment'}
          </TabsTrigger>
          <TabsTrigger value="topics">
            {lang === 'ar' ? 'الموضوعات' : 'Topics'}
          </TabsTrigger>
          <TabsTrigger value="impact">
            {lang === 'ar' ? 'التأثير' : 'Impact'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'المشاعر العامة' : 'Overall Sentiment'}
                    </p>
                    <p className="text-2xl font-bold text-green-400">+68</p>
                  </div>
                  <ThumbsUp className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+5.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'المديرين النشطين' : 'Active Executives'}
                    </p>
                    <p className="text-2xl font-bold text-white">127</p>
                  </div>
                  <User className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+3.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'التصريحات اليومية' : 'Daily Statements'}
                    </p>
                    <p className="text-2xl font-bold text-white">43</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+8.7%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'الارتباط بالسوق' : 'Market Correlation'}
                    </p>
                    <p className="text-2xl font-bold text-white">0.82</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+1.5%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Trends */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'اتجاهات المشاعر' : 'Sentiment Trends'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={sentimentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bullishExecutives"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                    name={lang === 'ar' ? 'مديرين متفائلين' : 'Bullish Executives'}
                  />
                  <Area
                    type="monotone"
                    dataKey="neutralExecutives"
                    stackId="1"
                    stroke="#6B7280"
                    fill="#6B7280"
                    fillOpacity={0.6}
                    name={lang === 'ar' ? 'مديرين محايدين' : 'Neutral Executives'}
                  />
                  <Area
                    type="monotone"
                    dataKey="bearishExecutives"
                    stackId="1"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.6}
                    name={lang === 'ar' ? 'مديرين متشائمين' : 'Bearish Executives'}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Market Correlation */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'الارتباط مع حركة السوق' : 'Market Movement Correlation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis yAxisId="sentiment" stroke="#10B981" />
                  <YAxis yAxisId="correlation" orientation="right" stroke="#3B82F6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line
                    yAxisId="sentiment"
                    type="monotone"
                    dataKey="overallSentiment"
                    stroke="#10B981"
                    strokeWidth={3}
                    name={lang === 'ar' ? 'المشاعر العامة' : 'Overall Sentiment'}
                  />
                  <Line
                    yAxisId="correlation"
                    type="monotone"
                    dataKey="marketCorrelation"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name={lang === 'ar' ? 'الارتباط' : 'Correlation'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Executives Tab */}
        <TabsContent value="executives" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {executives.map((executive) => (
              <Card key={executive.id} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {executive.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-white">{executive.name}</CardTitle>
                        <p className="text-gray-400 text-sm">
                          {executive.title} - {executive.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getImpactIcon(executive.marketImpact)}
                      <Badge className={
                        executive.marketImpact === 'high' ? 'bg-red-600' :
                        executive.marketImpact === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }>
                        {lang === 'ar' ? 
                          (executive.marketImpact === 'high' ? 'تأثير عالي' :
                           executive.marketImpact === 'medium' ? 'تأثير متوسط' : 'تأثير منخفض') :
                          executive.marketImpact + ' impact'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'مؤشر التأثير' : 'Influence Score'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${executive.influence}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(executive.influence)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'المصداقية' : 'Credibility'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${executive.credibility}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(executive.credibility)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'المتابعون' : 'Followers'}
                        </p>
                        <p className="text-white font-semibold">
                          {formatFollowers(executive.followersCount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'متوسط التفاعل' : 'Avg Engagement'}
                        </p>
                        <p className="text-white font-semibold">
                          {formatArabicNumber(executive.avgEngagement)}%
                        </p>
                      </div>
                    </div>

                    {/* Sector and Recent Activity */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'القطاع' : 'Sector'}
                        </p>
                        <Badge variant="secondary">{executive.sector}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'النشاط الحديث' : 'Recent Activity'}
                        </p>
                        <p className="text-green-400 font-semibold">
                          {formatArabicNumber(executive.recentActivity)}%
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      {lang === 'ar' ? 'عرض الملف الكامل' : 'View Full Profile'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sentiment Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          {sentimentData.map((sentiment, index) => (
            <Card key={index} className="bg-trading-card border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {executives.find(e => e.id === sentiment.executiveId)?.name.split(' ').map(n => n[0]).join('') || 'EX'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">
                          {executives.find(e => e.id === sentiment.executiveId)?.name || 'Unknown Executive'}
                        </h4>
                        <p className="text-gray-400 text-sm">{sentiment.timestamp}</p>
                      </div>
                      <Badge className={getSentimentBadge(sentiment.sentiment)}>
                        {sentiment.sentiment > 0 ? '+' : ''}{formatArabicNumber(sentiment.sentiment)}
                      </Badge>
                      <Badge variant="outline">
                        {sentiment.platform}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 mb-3 leading-relaxed">
                      {sentiment.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {sentiment.topics.map((topic, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          #{topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'الثقة' : 'Confidence'}
                    </p>
                    <p className="text-white font-semibold">
                      {formatArabicNumber(sentiment.confidence)}%
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'الصلة بالسوق' : 'Market Relevance'}
                    </p>
                    <p className="text-white font-semibold">
                      {formatArabicNumber(sentiment.marketRelevance)}%
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'تأثير السعر' : 'Price Impact'}
                    </p>
                    <p className={sentiment.impact.stockPrice >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {sentiment.impact.stockPrice >= 0 ? '+' : ''}{sentiment.impact.stockPrice.toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'تغيير الحجم' : 'Volume Change'}
                    </p>
                    <p className="text-blue-400 font-semibold">
                      +{formatArabicNumber(sentiment.impact.volumeChange)}%
                    </p>
                  </div>
                </div>

                {/* Engagement */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 text-sm">
                          {formatFollowers(sentiment.engagement.likes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">
                          {formatFollowers(sentiment.engagement.comments)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-300 text-sm">
                          {formatFollowers(sentiment.engagement.shares)}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topicAnalysis.map((topic, index) => (
              <Card key={index} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-400" />
                      {topic.topic}
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(topic.trendDirection)}
                      <Badge className={getSentimentBadge(topic.averageSentiment)}>
                        {topic.averageSentiment > 0 ? '+' : ''}{formatArabicNumber(topic.averageSentiment)}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'عدد الذكر' : 'Mention Count'}
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {formatArabicNumber(topic.mentionCount)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'تأثير السوق' : 'Market Impact'}
                        </p>
                        <p className="text-blue-400 font-semibold text-lg">
                          {formatArabicNumber(topic.marketImpact)}%
                        </p>
                      </div>
                      
                      <div className="col-span-2">
                        <p className="text-gray-400 text-sm mb-2">
                          {lang === 'ar' ? 'متوسط المشاعر' : 'Average Sentiment'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${
                                topic.averageSentiment > 50 ? 'bg-green-500' :
                                topic.averageSentiment > 0 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.abs(topic.averageSentiment)}%` }}
                            />
                          </div>
                          <span className={`font-semibold ${getSentimentColor(topic.averageSentiment)}`}>
                            {topic.averageSentiment > 0 ? '+' : ''}{formatArabicNumber(topic.averageSentiment)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Executives */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        {lang === 'ar' ? 'المديرين الرئيسيين' : 'Key Executives'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {topic.keyExecutives.map((executive, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-blue-500 text-blue-400">
                            {executive}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Trend Direction */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {lang === 'ar' ? 'اتجاه الاتجاه' : 'Trend Direction'}
                      </span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(topic.trendDirection)}
                        <span className={`font-semibold ${
                          topic.trendDirection === 'up' ? 'text-green-400' :
                          topic.trendDirection === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {lang === 'ar' ? 
                            (topic.trendDirection === 'up' ? 'صاعد' :
                             topic.trendDirection === 'down' ? 'هابط' : 'مستقر') :
                            topic.trendDirection}
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      {lang === 'ar' ? 'تحليل الموضوع' : 'Analyze Topic'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-6">
          {/* Executive Influence Radar */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'تحليل تأثير المديرين التنفيذيين' : 'Executive Influence Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={executives.slice(0, 4).map(exec => ({
                  executive: exec.name.split(' ')[0],
                  influence: exec.influence,
                  credibility: exec.credibility,
                  engagement: exec.avgEngagement * 20,
                  activity: exec.recentActivity,
                  impact: exec.marketImpact === 'high' ? 90 : exec.marketImpact === 'medium' ? 60 : 30
                }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="executive" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name={lang === 'ar' ? 'التأثير' : 'Influence'}
                    dataKey="influence"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name={lang === 'ar' ? 'المصداقية' : 'Credibility'}
                    dataKey="credibility"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Market Impact Correlation */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'ارتباط التأثير بحركة السوق' : 'Market Impact Correlation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sentimentData.map(s => ({
                  executive: executives.find(e => e.id === s.executiveId)?.name.split(' ')[0] || 'Unknown',
                  sentiment: s.sentiment,
                  priceImpact: s.impact.stockPrice,
                  volumeChange: s.impact.volumeChange
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="executive" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar 
                    dataKey="sentiment" 
                    fill="#3B82F6"
                    name={lang === 'ar' ? 'المشاعر' : 'Sentiment'}
                  />
                  <Bar 
                    dataKey="priceImpact" 
                    fill="#10B981"
                    name={lang === 'ar' ? 'تأثير السعر (%)' : 'Price Impact (%)'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'الرؤى الرئيسية' : 'Key Insights'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/30 rounded border border-green-700">
                    <h4 className="text-green-300 font-semibold mb-2">
                      {lang === 'ar' ? 'إشارة إيجابية' : 'Positive Signal'}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? '78% من تصريحات المديرين التنفيذيين في قطاع التكنولوجيا إيجابية'
                        : '78% of tech sector executive statements are positive'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-900/30 rounded border border-yellow-700">
                    <h4 className="text-yellow-300 font-semibold mb-2">
                      {lang === 'ar' ? 'تحذير' : 'Warning'}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'تزايد المخاوف من مديري البنوك حول الوضع الاقتصادي'
                        : 'Increasing concerns from banking executives about economic outlook'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-900/30 rounded border border-blue-700">
                    <h4 className="text-blue-300 font-semibold mb-2">
                      {lang === 'ar' ? 'اتجاه ناشئ' : 'Emerging Trend'}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'تزايد الحديث عن الذكاء الاصطناعي بين المديرين بنسبة 45%'
                        : 'AI discussions among executives increased by 45%'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'توصيات التداول' : 'Trading Recommendations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/30 rounded border border-green-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-green-300 font-semibold">TSLA</h4>
                      <Badge className="bg-green-600">BUY</Badge>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'تصريحات إيجابية قوية من إيلون ماسك حول نتائج Q1'
                        : 'Strong positive statements from Elon Musk about Q1 results'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-900/30 rounded border border-red-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-red-300 font-semibold">Banking Sector</h4>
                      <Badge className="bg-red-600">CAUTIOUS</Badge>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'مخاوف متزايدة من مديري البنوك حول الائتمان'
                        : 'Growing concerns from bank executives about credit quality'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-900/30 rounded border border-blue-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-blue-300 font-semibold">MSFT</h4>
                      <Badge className="bg-blue-600">HOLD</Badge>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'موقف مستقر من ساتيا نادیلا حول نمو الذكاء الاصطناعي'
                        : 'Steady position from Satya Nadella on AI growth'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveSentiment;
