
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Share2, 
  Plus,
  Heart,
  MessageCircle,
  Download,
  Star,
  Eye,
  TrendingUp,
  BarChart3,
  Code,
  BookOpen,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Flag,
  Calendar,
  Clock,
  Target,
  Zap,
  Settings,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Strategy {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'indicator' | 'strategy' | 'script' | 'alert';
  code: string;
  parameters: Array<{
    name: string;
    type: string;
    default: any;
    description: string;
  }>;
  performance: {
    backtestPeriod: string;
    totalReturn: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    totalTrades: number;
  };
  stats: {
    views: number;
    downloads: number;
    likes: number;
    comments: number;
    rating: number;
    ratingCount: number;
  };
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  price: number; // 0 for free
  isLiked: boolean;
  isBookmarked: boolean;
  performance_chart: Array<{ date: string; value: number }>;
}

interface StrategySharingProps {
  lang?: 'en' | 'ar';
}

const StrategySharing = ({ lang = 'ar' }: StrategySharingProps) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create strategy form
  const [newStrategy, setNewStrategy] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    difficulty: 'beginner' as const,
    type: 'strategy' as const,
    code: '',
    isPublic: true,
    price: 0
  });

  const categories = [
    { id: 'all', name: lang === 'ar' ? 'جميع الفئات' : 'All Categories' },
    { id: 'technical', name: lang === 'ar' ? 'التحليل الفني' : 'Technical Analysis' },
    { id: 'fundamental', name: lang === 'ar' ? 'التحليل الأساسي' : 'Fundamental Analysis' },
    { id: 'scalping', name: lang === 'ar' ? 'السكالبينج' : 'Scalping' },
    { id: 'swing', name: lang === 'ar' ? 'التداول المتأرجح' : 'Swing Trading' },
    { id: 'arbitrage', name: lang === 'ar' ? 'المراجحة' : 'Arbitrage' },
    { id: 'ai', name: lang === 'ar' ? 'الذكاء الاصطناعي' : 'AI/ML' }
  ];

  const difficulties = [
    { id: 'all', name: lang === 'ar' ? 'جميع المستويات' : 'All Levels' },
    { id: 'beginner', name: lang === 'ar' ? 'مبتدئ' : 'Beginner' },
    { id: 'intermediate', name: lang === 'ar' ? 'متوسط' : 'Intermediate' },
    { id: 'advanced', name: lang === 'ar' ? 'متقدم' : 'Advanced' }
  ];

  const types = [
    { id: 'all', name: lang === 'ar' ? 'جميع الأنواع' : 'All Types' },
    { id: 'strategy', name: lang === 'ar' ? 'استراتيجية' : 'Strategy' },
    { id: 'indicator', name: lang === 'ar' ? 'مؤشر' : 'Indicator' },
    { id: 'script', name: lang === 'ar' ? 'سكريبت' : 'Script' },
    { id: 'alert', name: lang === 'ar' ? 'تنبيه' : 'Alert' }
  ];

  const sortOptions = [
    { id: 'popular', name: lang === 'ar' ? 'الأكثر شعبية' : 'Most Popular' },
    { id: 'recent', name: lang === 'ar' ? 'الأحدث' : 'Most Recent' },
    { id: 'rating', name: lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated' },
    { id: 'downloads', name: lang === 'ar' ? 'الأكثر تحميلاً' : 'Most Downloaded' },
    { id: 'performance', name: lang === 'ar' ? 'الأداء' : 'Performance' }
  ];

  // Load mock data
  useEffect(() => {
    const mockStrategies: Strategy[] = [
      {
        id: '1',
        title: 'استراتيجية RSI المتقدمة',
        description: 'استراتيجية تداول متطورة تعتمد على مؤشر RSI مع تحسينات خاصة للأسواق المتقلبة',
        author: {
          id: '1',
          name: 'أحمد محمد',
          username: '@ahmed_dev',
          avatar: '/api/placeholder/150/150',
          verified: true,
          followers: 2456
        },
        category: 'technical',
        tags: ['RSI', 'Oscillator', 'Trend', 'Scalping'],
        difficulty: 'intermediate',
        type: 'strategy',
        code: `
// Advanced RSI Strategy
//@version=5
strategy("Advanced RSI Strategy", overlay=true)

length = input(14, "RSI Length")
overbought = input(70, "Overbought Level")
oversold = input(30, "Oversold Level")

rsi = ta.rsi(close, length)
ma = ta.sma(close, 20)

// Entry conditions
long_condition = ta.crossover(rsi, oversold) and close > ma
short_condition = ta.crossunder(rsi, overbought) and close < ma

if long_condition
    strategy.entry("Long", strategy.long)
if short_condition
    strategy.entry("Short", strategy.short)
        `,
        parameters: [
          { name: 'RSI Length', type: 'number', default: 14, description: 'Period for RSI calculation' },
          { name: 'Overbought', type: 'number', default: 70, description: 'Overbought threshold' },
          { name: 'Oversold', type: 'number', default: 30, description: 'Oversold threshold' }
        ],
        performance: {
          backtestPeriod: '1 Year',
          totalReturn: 45.67,
          winRate: 68.5,
          sharpeRatio: 1.87,
          maxDrawdown: -12.34,
          totalTrades: 156
        },
        stats: {
          views: 5634,
          downloads: 1234,
          likes: 567,
          comments: 89,
          rating: 4.6,
          ratingCount: 234
        },
        createdAt: '2024-01-10',
        updatedAt: '2024-01-15',
        isPublic: true,
        price: 0,
        isLiked: false,
        isBookmarked: false,
        performance_chart: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 4000 + i * 60
        }))
      },
      {
        id: '2',
        title: 'Golden Cross Signal',
        description: 'استراتيجية التقاطع الذهبي المحسنة مع فلاتر إضافية لتقليل الإشارات الخاطئة',
        author: {
          id: '2',
          name: 'سارة أحمد',
          username: '@sara_trader',
          avatar: '/api/placeholder/150/150',
          verified: true,
          followers: 3421
        },
        category: 'swing',
        tags: ['Moving Average', 'Golden Cross', 'Trend Following'],
        difficulty: 'beginner',
        type: 'strategy',
        code: `
// Golden Cross Strategy with Filters
//@version=5
strategy("Enhanced Golden Cross", overlay=true)

fast_ma = input(50, "Fast MA")
slow_ma = input(200, "Slow MA")
volume_filter = input(true, "Volume Filter")

ma_fast = ta.sma(close, fast_ma)
ma_slow = ta.sma(close, slow_ma)
vol_ma = ta.sma(volume, 20)

golden_cross = ta.crossover(ma_fast, ma_slow)
death_cross = ta.crossunder(ma_fast, ma_slow)
volume_ok = volume_filter ? volume > vol_ma : true

if golden_cross and volume_ok
    strategy.entry("Long", strategy.long)
if death_cross
    strategy.close("Long")
        `,
        parameters: [
          { name: 'Fast MA', type: 'number', default: 50, description: 'Fast moving average period' },
          { name: 'Slow MA', type: 'number', default: 200, description: 'Slow moving average period' },
          { name: 'Volume Filter', type: 'boolean', default: true, description: 'Enable volume confirmation' }
        ],
        performance: {
          backtestPeriod: '2 Years',
          totalReturn: 78.34,
          winRate: 72.3,
          sharpeRatio: 2.12,
          maxDrawdown: -8.67,
          totalTrades: 87
        },
        stats: {
          views: 8921,
          downloads: 2341,
          likes: 892,
          comments: 156,
          rating: 4.8,
          ratingCount: 567
        },
        createdAt: '2024-01-05',
        updatedAt: '2024-01-12',
        isPublic: true,
        price: 25,
        isLiked: true,
        isBookmarked: true,
        performance_chart: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 7000 + i * 80
        }))
      },
      {
        id: '3',
        title: 'AI Sentiment Indicator',
        description: 'مؤشر متطور يستخدم الذكاء الاصطناعي لتحليل المشاعر في الأسواق',
        author: {
          id: '3',
          name: 'محمد العلي',
          username: '@mohammed_ai',
          avatar: '/api/placeholder/150/150',
          verified: false,
          followers: 1567
        },
        category: 'ai',
        tags: ['AI', 'Sentiment', 'Machine Learning', 'Neural Network'],
        difficulty: 'advanced',
        type: 'indicator',
        code: `
// AI Sentiment Indicator
//@version=5
indicator("AI Sentiment", shorttitle="AIS", overlay=false)

// Sentiment calculation using AI model
sentiment_length = input(20, "Sentiment Period")
threshold = input(0.6, "Sentiment Threshold", minval=0, maxval=1, step=0.1)

// Simplified sentiment calculation (actual AI would be more complex)
price_momentum = ta.mom(close, sentiment_length)
volume_momentum = ta.mom(volume, sentiment_length)
volatility = ta.stdev(close, sentiment_length)

sentiment_score = math.max(0, math.min(1, 
    (price_momentum / volatility + volume_momentum / ta.sma(volume, sentiment_length)) / 2))

plot(sentiment_score, "Sentiment", color=sentiment_score > threshold ? color.green : color.red)
hline(threshold, "Threshold", color=color.yellow)
        `,
        parameters: [
          { name: 'Sentiment Period', type: 'number', default: 20, description: 'Period for sentiment calculation' },
          { name: 'Threshold', type: 'number', default: 0.6, description: 'Sentiment threshold level' }
        ],
        performance: {
          backtestPeriod: '6 Months',
          totalReturn: 34.56,
          winRate: 65.4,
          sharpeRatio: 1.54,
          maxDrawdown: -15.23,
          totalTrades: 234
        },
        stats: {
          views: 3456,
          downloads: 789,
          likes: 345,
          comments: 67,
          rating: 4.3,
          ratingCount: 123
        },
        createdAt: '2024-01-20',
        updatedAt: '2024-01-22',
        isPublic: true,
        price: 50,
        isLiked: false,
        isBookmarked: false,
        performance_chart: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 3400 + i * 45
        }))
      }
    ];

    // Add more mock strategies
    for (let i = 4; i <= 20; i++) {
      mockStrategies.push({
        id: i.toString(),
        title: `استراتيجية ${i}`,
        description: `وصف تفصيلي للاستراتيجية رقم ${i}`,
        author: {
          id: i.toString(),
          name: `متداول ${i}`,
          username: `@trader${i}`,
          avatar: '/api/placeholder/150/150',
          verified: Math.random() > 0.7,
          followers: Math.floor(Math.random() * 5000)
        },
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
        tags: ['Technical', 'Trading', 'Strategy'],
        difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
        type: ['strategy', 'indicator', 'script'][Math.floor(Math.random() * 3)] as any,
        code: '// Sample code',
        parameters: [],
        performance: {
          backtestPeriod: '1 Year',
          totalReturn: Math.random() * 100,
          winRate: 50 + Math.random() * 40,
          sharpeRatio: Math.random() * 3,
          maxDrawdown: -Math.random() * 20,
          totalTrades: Math.floor(Math.random() * 500)
        },
        stats: {
          views: Math.floor(Math.random() * 10000),
          downloads: Math.floor(Math.random() * 2000),
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 200),
          rating: 3 + Math.random() * 2,
          ratingCount: Math.floor(Math.random() * 500)
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        isPublic: true,
        price: Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 100),
        isLiked: Math.random() > 0.8,
        isBookmarked: Math.random() > 0.9,
        performance_chart: Array.from({ length: 30 }, (_, j) => ({
          date: new Date(Date.now() - (29 - j) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 5000 + j * 50
        }))
      });
    }

    setTimeout(() => {
      setStrategies(mockStrategies);
      setFilteredStrategies(mockStrategies);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort strategies
  useEffect(() => {
    let filtered = strategies.filter(strategy => {
      const matchesSearch = strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || strategy.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || strategy.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'all' || strategy.type === selectedType;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
    });

    // Sort strategies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.stats.views + b.stats.downloads) - (a.stats.views + a.stats.downloads);
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'rating':
          return b.stats.rating - a.stats.rating;
        case 'downloads':
          return b.stats.downloads - a.stats.downloads;
        case 'performance':
          return b.performance.totalReturn - a.performance.totalReturn;
        default:
          return 0;
      }
    });

    setFilteredStrategies(filtered);
  }, [strategies, searchTerm, selectedCategory, selectedDifficulty, selectedType, sortBy]);

  const handleLike = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy =>
      strategy.id === strategyId
        ? {
            ...strategy,
            isLiked: !strategy.isLiked,
            stats: {
              ...strategy.stats,
              likes: strategy.isLiked ? strategy.stats.likes - 1 : strategy.stats.likes + 1
            }
          }
        : strategy
    ));
  };

  const handleBookmark = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy =>
      strategy.id === strategyId
        ? { ...strategy, isBookmarked: !strategy.isBookmarked }
        : strategy
    ));

    toast.success(lang === 'ar' ? 'تم تحديث الإشارة المرجعية' : 'Bookmark updated');
  };

  const handleDownload = (strategyId: string) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (!strategy) return;

    setStrategies(prev => prev.map(s =>
      s.id === strategyId
        ? { ...s, stats: { ...s.stats, downloads: s.stats.downloads + 1 } }
        : s
    ));

    // Create download file
    const content = `${strategy.title}\n\n${strategy.description}\n\n${strategy.code}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${strategy.title.replace(/\s+/g, '_')}.txt`;
    a.click();

    toast.success(lang === 'ar' ? 'تم تحميل الاستراتيجية' : 'Strategy downloaded');
  };

  const handleCreateStrategy = () => {
    if (!newStrategy.title || !newStrategy.description || !newStrategy.code) {
      toast.error(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    const strategy: Strategy = {
      id: Date.now().toString(),
      title: newStrategy.title,
      description: newStrategy.description,
      author: {
        id: 'current_user',
        name: 'أنت',
        username: '@you',
        avatar: '/api/placeholder/150/150',
        verified: false,
        followers: 0
      },
      category: newStrategy.category,
      tags: newStrategy.tags.split(',').map(tag => tag.trim()),
      difficulty: newStrategy.difficulty,
      type: newStrategy.type,
      code: newStrategy.code,
      parameters: [],
      performance: {
        backtestPeriod: 'Not Tested',
        totalReturn: 0,
        winRate: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        totalTrades: 0
      },
      stats: {
        views: 0,
        downloads: 0,
        likes: 0,
        comments: 0,
        rating: 0,
        ratingCount: 0
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isPublic: newStrategy.isPublic,
      price: newStrategy.price,
      isLiked: false,
      isBookmarked: false,
      performance_chart: []
    };

    setStrategies(prev => [strategy, ...prev]);
    setShowCreateForm(false);
    setNewStrategy({
      title: '',
      description: '',
      category: '',
      tags: '',
      difficulty: 'beginner',
      type: 'strategy',
      code: '',
      isPublic: true,
      price: 0
    });

    toast.success(lang === 'ar' ? 'تم إنشاء الاستراتيجية بنجاح!' : 'Strategy created successfully!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600';
      case 'intermediate': return 'bg-yellow-600';
      case 'advanced': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy': return <BarChart3 className="h-4 w-4" />;
      case 'indicator': return <TrendingUp className="h-4 w-4" />;
      case 'script': return <Code className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {lang === 'ar' ? 'مشاركة الاستراتيجيات' : 'Strategy Sharing'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'شارك استراتيجياتك واستفد من استراتيجيات الآخرين'
              : 'Share your strategies and benefit from others'}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {lang === 'ar' ? 'إنشاء استراتيجية' : 'Create Strategy'}
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'البحث' : 'Search'}
              </Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder={lang === 'ar' ? 'ابحث عن استراتيجية...' : 'Search strategies...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-trading-secondary border-gray-600 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'الفئة' : 'Category'}
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'المستوى' : 'Difficulty'}
              </Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty.id} value={difficulty.id}>
                      {difficulty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'النوع' : 'Type'}
              </Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {types.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'ترتيب حسب' : 'Sort by'}
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {sortOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full border-gray-600"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSelectedType('all');
                  setSortBy('popular');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStrategies.map((strategy) => (
          <Card key={strategy.id} className="bg-trading-card border-gray-800 hover:border-blue-500 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(strategy.type)}
                    <h3 className="font-bold text-white line-clamp-1">{strategy.title}</h3>
                    {strategy.price > 0 && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        ${strategy.price}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{strategy.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={strategy.author.avatar} alt={strategy.author.name} />
                      <AvatarFallback className="bg-trading-secondary text-white text-xs">
                        {strategy.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-300">{strategy.author.name}</span>
                    {strategy.author.verified && (
                      <CheckCircle className="h-3 w-3 text-blue-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleBookmark(strategy.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Bookmark className={cn("h-4 w-4", strategy.isBookmarked ? "fill-current text-blue-400" : "text-gray-400")} />
                  </Button>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", getDifficultyColor(strategy.difficulty))}
                  >
                    {difficulties.find(d => d.id === strategy.difficulty)?.name}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {strategy.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-trading-secondary">
                    {tag}
                  </Badge>
                ))}
                {strategy.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-trading-secondary">
                    +{strategy.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Performance */}
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-trading-secondary rounded">
                  <div className="text-sm font-bold text-green-400">
                    +{strategy.performance.totalReturn.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' ? 'العائد' : 'Return'}
                  </div>
                </div>
                <div className="text-center p-2 bg-trading-secondary rounded">
                  <div className="text-sm font-bold text-blue-400">
                    {strategy.performance.winRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                  </div>
                </div>
              </div>

              {/* Performance Chart */}
              {strategy.performance_chart.length > 0 && (
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={strategy.performance_chart.slice(-10)}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#22C55E" 
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-400">{strategy.stats.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-400">{strategy.stats.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span className="text-gray-400">{strategy.stats.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(strategy.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedStrategy(strategy)}
                  className="flex-1 border-gray-600"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {lang === 'ar' ? 'عرض' : 'View'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDownload(strategy.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-3 w-3 mr-1" />
                  {lang === 'ar' ? 'تحميل' : 'Download'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleLike(strategy.id)}
                  className="px-3"
                >
                  <Heart className={cn("h-4 w-4", strategy.isLiked ? "fill-current text-red-400" : "text-gray-400")} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-trading-card border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(selectedStrategy.type)}
                  <CardTitle className="text-white">{selectedStrategy.title}</CardTitle>
                  {selectedStrategy.price > 0 && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                      ${selectedStrategy.price}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedStrategy(null)}
                  className="text-gray-400"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Author Info */}
              <div className="flex items-center gap-4 p-4 bg-trading-secondary rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedStrategy.author.avatar} alt={selectedStrategy.author.name} />
                  <AvatarFallback className="bg-trading-bg text-white">
                    {selectedStrategy.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{selectedStrategy.author.name}</h3>
                    {selectedStrategy.author.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{selectedStrategy.author.username}</p>
                  <p className="text-xs text-gray-500">
                    {selectedStrategy.author.followers} {lang === 'ar' ? 'متابع' : 'followers'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-white mb-2">
                  {lang === 'ar' ? 'الوصف' : 'Description'}
                </h4>
                <p className="text-gray-300">{selectedStrategy.description}</p>
              </div>

              {/* Performance */}
              <div>
                <h4 className="font-bold text-white mb-3">
                  {lang === 'ar' ? 'الأداء' : 'Performance'}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-trading-secondary rounded">
                    <div className="text-lg font-bold text-green-400">
                      +{selectedStrategy.performance.totalReturn.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'إجمالي العائد' : 'Total Return'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-trading-secondary rounded">
                    <div className="text-lg font-bold text-blue-400">
                      {selectedStrategy.performance.winRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-trading-secondary rounded">
                    <div className="text-lg font-bold text-purple-400">
                      {selectedStrategy.performance.sharpeRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {lang === 'ar' ? 'نسبة شارب' : 'Sharpe Ratio'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code */}
              <div>
                <h4 className="font-bold text-white mb-3">
                  {lang === 'ar' ? 'الكود' : 'Code'}
                </h4>
                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{selectedStrategy.code}</code>
                  </pre>
                </div>
              </div>

              {/* Parameters */}
              {selectedStrategy.parameters.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-3">
                    {lang === 'ar' ? 'المعايير' : 'Parameters'}
                  </h4>
                  <div className="space-y-3">
                    {selectedStrategy.parameters.map((param, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-trading-secondary rounded">
                        <div>
                          <div className="font-medium text-white">{param.name}</div>
                          <div className="text-sm text-gray-400">{param.description}</div>
                        </div>
                        <div className="text-blue-400 font-mono">
                          {param.default.toString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleDownload(selectedStrategy.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'تحميل الاستراتيجية' : 'Download Strategy'}
                </Button>
                <Button
                  onClick={() => handleLike(selectedStrategy.id)}
                  variant="outline"
                  className={cn(
                    "border-gray-600",
                    selectedStrategy.isLiked && "border-red-400 text-red-400"
                  )}
                >
                  <Heart className={cn("h-4 w-4 mr-2", selectedStrategy.isLiked && "fill-current")} />
                  {selectedStrategy.stats.likes}
                </Button>
                <Button
                  onClick={() => handleBookmark(selectedStrategy.id)}
                  variant="outline"
                  className={cn(
                    "border-gray-600",
                    selectedStrategy.isBookmarked && "border-blue-400 text-blue-400"
                  )}
                >
                  <Bookmark className={cn("h-4 w-4", selectedStrategy.isBookmarked && "fill-current")} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Strategy Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-trading-card border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'إنشاء استراتيجية جديدة' : 'Create New Strategy'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">
                  {lang === 'ar' ? 'العنوان' : 'Title'} *
                </Label>
                <Input
                  value={newStrategy.title}
                  onChange={(e) => setNewStrategy({...newStrategy, title: e.target.value})}
                  className="bg-trading-secondary border-gray-600"
                  placeholder={lang === 'ar' ? 'أدخل عنوان الاستراتيجية' : 'Enter strategy title'}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">
                  {lang === 'ar' ? 'الوصف' : 'Description'} *
                </Label>
                <Textarea
                  value={newStrategy.description}
                  onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
                  className="bg-trading-secondary border-gray-600"
                  placeholder={lang === 'ar' ? 'وصف تفصيلي للاستراتيجية' : 'Detailed strategy description'}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'الفئة' : 'Category'}
                  </Label>
                  <Select 
                    value={newStrategy.category} 
                    onValueChange={(value) => setNewStrategy({...newStrategy, category: value})}
                  >
                    <SelectTrigger className="bg-trading-secondary border-gray-600">
                      <SelectValue placeholder={lang === 'ar' ? 'اختر الفئة' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent className="bg-trading-secondary border-gray-600">
                      {categories.slice(1).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'المستوى' : 'Difficulty'}
                  </Label>
                  <Select 
                    value={newStrategy.difficulty} 
                    onValueChange={(value: any) => setNewStrategy({...newStrategy, difficulty: value})}
                  >
                    <SelectTrigger className="bg-trading-secondary border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-trading-secondary border-gray-600">
                      {difficulties.slice(1).map(difficulty => (
                        <SelectItem key={difficulty.id} value={difficulty.id}>
                          {difficulty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'النوع' : 'Type'}
                  </Label>
                  <Select 
                    value={newStrategy.type} 
                    onValueChange={(value: any) => setNewStrategy({...newStrategy, type: value})}
                  >
                    <SelectTrigger className="bg-trading-secondary border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-trading-secondary border-gray-600">
                      {types.slice(1).map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'السعر (0 = مجاني)' : 'Price (0 = Free)'}
                  </Label>
                  <Input
                    type="number"
                    value={newStrategy.price}
                    onChange={(e) => setNewStrategy({...newStrategy, price: Number(e.target.value)})}
                    className="bg-trading-secondary border-gray-600"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">
                  {lang === 'ar' ? 'الكلمات المفتاحية (مفصولة بفواصل)' : 'Tags (comma separated)'}
                </Label>
                <Input
                  value={newStrategy.tags}
                  onChange={(e) => setNewStrategy({...newStrategy, tags: e.target.value})}
                  className="bg-trading-secondary border-gray-600"
                  placeholder={lang === 'ar' ? 'RSI, تحليل فني, سكالبينج' : 'RSI, Technical Analysis, Scalping'}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">
                  {lang === 'ar' ? 'الكود' : 'Code'} *
                </Label>
                <Textarea
                  value={newStrategy.code}
                  onChange={(e) => setNewStrategy({...newStrategy, code: e.target.value})}
                  className="bg-gray-900 border-gray-600 font-mono text-green-400"
                  placeholder="//@version=5&#10;strategy('My Strategy', overlay=true)&#10;&#10;// Your code here"
                  rows={10}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                <div>
                  <div className="text-white font-medium">
                    {lang === 'ar' ? 'عام (مرئي للجميع)' : 'Public (Visible to everyone)'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' 
                      ? 'يمكن للآخرين مشاهدة وتحميل هذه الاستراتيجية' 
                      : 'Others can view and download this strategy'}
                  </div>
                </div>
                <Switch 
                  checked={newStrategy.isPublic}
                  onCheckedChange={(checked) => setNewStrategy({...newStrategy, isPublic: checked})}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  className="flex-1 border-gray-600"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleCreateStrategy}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'نشر الاستراتيجية' : 'Publish Strategy'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredStrategies.length === 0 && (
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="text-center py-12">
            <Share2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'ar' ? 'لا توجد استراتيجيات' : 'No Strategies Found'}
            </h3>
            <p className="text-gray-400 mb-4">
              {lang === 'ar' 
                ? 'جرب تعديل معايير البحث أو كن أول من ينشر استراتيجية'
                : 'Try adjusting your search criteria or be the first to share a strategy'}
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'إنشاء استراتيجية' : 'Create Strategy'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrategySharing;
