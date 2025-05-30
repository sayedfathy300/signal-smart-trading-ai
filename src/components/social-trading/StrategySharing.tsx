
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Share2, 
  Download, 
  Star, 
  Eye, 
  TrendingUp, 
  Filter,
  Search,
  Plus,
  Upload,
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Heart,
  MessageSquare,
  Users,
  Shield,
  Award,
  Target
} from 'lucide-react';

interface StrategyProps {
  lang?: 'en' | 'ar';
}

const StrategySharing = ({ lang = 'ar' }: StrategyProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // بيانات الاستراتيجيات
  const strategies = [
    {
      id: '1',
      name: lang === 'ar' ? 'استراتيجية الاختراق اليومي' : 'Daily Breakout Strategy',
      author: lang === 'ar' ? 'أحمد المحترف' : 'Ahmed Pro',
      description: lang === 'ar' 
        ? 'استراتيجية متقدمة للاستفادة من الاختراقات اليومية في أسواق العملات المشفرة'
        : 'Advanced strategy to capitalize on daily breakouts in cryptocurrency markets',
      category: 'Cryptocurrency',
      timeframe: '1H',
      winRate: 78.5,
      profit: 45.2,
      maxDrawdown: 8.3,
      trades: 156,
      followers: 1250,
      rating: 4.8,
      reviews: 89,
      price: 99,
      tags: ['Breakout', 'Crypto', 'Intraday'],
      difficulty: 'Advanced',
      downloads: 450,
      lastUpdated: '2024-01-10',
      isPublic: true,
      isFavorite: false
    },
    {
      id: '2',
      name: lang === 'ar' ? 'نظام فوركس الآمن' : 'Safe Forex System',
      author: lang === 'ar' ? 'سارة الخبيرة' : 'Sara Expert',
      description: lang === 'ar'
        ? 'نظام تداول محافظ مناسب للمبتدئين مع إدارة مخاطر صارمة'
        : 'Conservative trading system suitable for beginners with strict risk management',
      category: 'Forex',
      timeframe: '4H',
      winRate: 65.4,
      profit: 28.7,
      maxDrawdown: 5.2,
      trades: 234,
      followers: 890,
      rating: 4.6,
      reviews: 156,
      price: 49,
      tags: ['Safe', 'Conservative', 'Beginner'],
      difficulty: 'Beginner',
      downloads: 890,
      lastUpdated: '2024-01-08',
      isPublic: true,
      isFavorite: true
    },
    {
      id: '3',
      name: lang === 'ar' ? 'سكالبينج الذهب السريع' : 'Gold Scalping Fast',
      author: lang === 'ar' ? 'محمد السريع' : 'Mohamed Fast',
      description: lang === 'ar'
        ? 'استراتيجية سكالبينج عالية السرعة للذهب مع أرباح سريعة'
        : 'High-speed gold scalping strategy with quick profits',
      category: 'Commodities',
      timeframe: '5M',
      winRate: 82.1,
      profit: 67.8,
      maxDrawdown: 12.1,
      trades: 567,
      followers: 1567,
      rating: 4.9,
      reviews: 234,
      price: 149,
      tags: ['Scalping', 'Gold', 'High-Frequency'],
      difficulty: 'Expert',
      downloads: 320,
      lastUpdated: '2024-01-12',
      isPublic: false,
      isFavorite: false
    }
  ];

  const categories = [
    { id: 'all', name: lang === 'ar' ? 'الكل' : 'All', count: strategies.length },
    { id: 'crypto', name: lang === 'ar' ? 'العملات المشفرة' : 'Cryptocurrency', count: 1 },
    { id: 'forex', name: lang === 'ar' ? 'الفوركس' : 'Forex', count: 1 },
    { id: 'commodities', name: lang === 'ar' ? 'السلع' : 'Commodities', count: 1 },
    { id: 'stocks', name: lang === 'ar' ? 'الأسهم' : 'Stocks', count: 0 }
  ];

  const handleDownloadStrategy = (strategyId: string) => {
    console.log(`Downloading strategy: ${strategyId}`);
  };

  const handleFollowAuthor = (authorName: string) => {
    console.log(`Following author: ${authorName}`);
  };

  const handleFavoriteStrategy = (strategyId: string) => {
    console.log(`Favoriting strategy: ${strategyId}`);
  };

  const filteredStrategies = strategies.filter(strategy => {
    const matchesCategory = selectedCategory === 'all' || 
                          strategy.category.toLowerCase().includes(selectedCategory);
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-600';
      case 'advanced': return 'bg-yellow-600';
      case 'expert': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {lang === 'ar' ? 'مشاركة الاستراتيجيات' : 'Strategy Sharing'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'اكتشف واشترِ ونشر أفضل استراتيجيات التداول'
              : 'Discover, purchase, and publish the best trading strategies'}
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {lang === 'ar' ? 'نشر استراتيجية' : 'Publish Strategy'}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={lang === 'ar' ? 'البحث في الاستراتيجيات...' : 'Search strategies...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-trading-secondary border-gray-700 text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'فلاتر متقدمة' : 'Advanced Filters'}
          </Button>
          <Button variant="outline" className="border-gray-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'الأكثر ربحاً' : 'Most Profitable'}
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={selectedCategory === category.id 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'border-gray-600'
            }
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Create Strategy Form */}
      {showCreateForm && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'ar' ? 'نشر استراتيجية جديدة' : 'Publish New Strategy'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'ar' ? 'اسم الاستراتيجية' : 'Strategy Name'}
                </label>
                <Input 
                  placeholder={lang === 'ar' ? 'أدخل اسم الاستراتيجية' : 'Enter strategy name'}
                  className="bg-trading-secondary border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'ar' ? 'الفئة' : 'Category'}
                </label>
                <select className="w-full p-2 bg-trading-secondary border border-gray-700 rounded-md text-white">
                  <option value="">{lang === 'ar' ? 'اختر الفئة' : 'Select Category'}</option>
                  <option value="crypto">{lang === 'ar' ? 'العملات المشفرة' : 'Cryptocurrency'}</option>
                  <option value="forex">{lang === 'ar' ? 'الفوركس' : 'Forex'}</option>
                  <option value="commodities">{lang === 'ar' ? 'السلع' : 'Commodities'}</option>
                  <option value="stocks">{lang === 'ar' ? 'الأسهم' : 'Stocks'}</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {lang === 'ar' ? 'الوصف' : 'Description'}
              </label>
              <Textarea 
                placeholder={lang === 'ar' ? 'وصف مفصل للاستراتيجية...' : 'Detailed strategy description...'}
                className="bg-trading-secondary border-gray-700 text-white"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'ar' ? 'السعر ($)' : 'Price ($)'}
                </label>
                <Input 
                  type="number"
                  placeholder="99"
                  className="bg-trading-secondary border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'ar' ? 'الإطار الزمني' : 'Timeframe'}
                </label>
                <select className="w-full p-2 bg-trading-secondary border border-gray-700 rounded-md text-white">
                  <option value="1M">1 دقيقة</option>
                  <option value="5M">5 دقائق</option>
                  <option value="15M">15 دقيقة</option>
                  <option value="1H">1 ساعة</option>
                  <option value="4H">4 ساعات</option>
                  <option value="1D">يومي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'ar' ? 'مستوى الصعوبة' : 'Difficulty Level'}
                </label>
                <select className="w-full p-2 bg-trading-secondary border border-gray-700 rounded-md text-white">
                  <option value="beginner">{lang === 'ar' ? 'مبتدئ' : 'Beginner'}</option>
                  <option value="advanced">{lang === 'ar' ? 'متقدم' : 'Advanced'}</option>
                  <option value="expert">{lang === 'ar' ? 'خبير' : 'Expert'}</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="public" />
                <label htmlFor="public" className="text-gray-300">
                  {lang === 'ar' ? 'نشر عام' : 'Public Strategy'}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="verified" />
                <label htmlFor="verified" className="text-gray-300">
                  {lang === 'ar' ? 'طلب التحقق' : 'Request Verification'}
                </label>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'نشر الاستراتيجية' : 'Publish Strategy'}
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-600"
                onClick={() => setShowCreateForm(false)}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStrategies.map((strategy) => (
          <Card key={strategy.id} className="bg-trading-card border-gray-800 hover:border-gray-700 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">{strategy.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {lang === 'ar' ? 'بواسطة' : 'by'} {strategy.author}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavoriteStrategy(strategy.id)}
                    className={strategy.isFavorite ? 'text-red-400' : 'text-gray-400'}
                  >
                    <Heart className={`h-4 w-4 ${strategy.isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-gray-600 text-xs">
                  {strategy.category}
                </Badge>
                <Badge className={`text-xs ${getDifficultyColor(strategy.difficulty)}`}>
                  {strategy.difficulty}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-xs">
                  {strategy.timeframe}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm line-clamp-2">
                {strategy.description}
              </p>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-trading-secondary p-3 rounded-lg">
                  <div className="text-green-400 text-lg font-bold">{strategy.winRate}%</div>
                  <div className="text-gray-400 text-xs">
                    {lang === 'ar' ? 'معدل النجاح' : 'Win Rate'}
                  </div>
                </div>
                <div className="bg-trading-secondary p-3 rounded-lg">
                  <div className="text-blue-400 text-lg font-bold">+{strategy.profit}%</div>
                  <div className="text-gray-400 text-xs">
                    {lang === 'ar' ? 'الربح الإجمالي' : 'Total Profit'}
                  </div>
                </div>
                <div className="bg-trading-secondary p-3 rounded-lg">
                  <div className="text-red-400 text-lg font-bold">{strategy.maxDrawdown}%</div>
                  <div className="text-gray-400 text-xs">
                    {lang === 'ar' ? 'أقصى انخفاض' : 'Max Drawdown'}
                  </div>
                </div>
                <div className="bg-trading-secondary p-3 rounded-lg">
                  <div className="text-yellow-400 text-lg font-bold">{strategy.trades}</div>
                  <div className="text-gray-400 text-xs">
                    {lang === 'ar' ? 'الصفقات' : 'Trades'}
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {strategy.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    {strategy.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {strategy.downloads}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {strategy.followers}
                  </span>
                </div>
              </div>
              
              {/* Price and Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold text-lg">
                    ${strategy.price}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {lang === 'ar' ? 'دولار' : 'USD'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600"
                    onClick={() => handleFollowAuthor(strategy.author)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {lang === 'ar' ? 'متابعة' : 'Follow'}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDownloadStrategy(strategy.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {lang === 'ar' ? 'شراء' : 'Buy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredStrategies.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-gray-600">
            {lang === 'ar' ? 'عرض المزيد' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredStrategies.length === 0 && (
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">
              {lang === 'ar' ? 'لا توجد استراتيجيات' : 'No Strategies Found'}
            </h3>
            <p className="text-gray-400 mb-4">
              {lang === 'ar' 
                ? 'لم نجد أي استراتيجيات تطابق معايير البحث الخاصة بك'
                : 'We couldn\'t find any strategies matching your search criteria'}
            </p>
            <Button 
              variant="outline" 
              className="border-gray-600"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrategySharing;
