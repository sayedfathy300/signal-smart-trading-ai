
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Copy, 
  TrendingUp, 
  TrendingDown, 
  Star,
  Eye,
  DollarSign,
  Activity,
  Target,
  Shield,
  Settings,
  PlayCircle,
  StopCircle,
  UserPlus,
  UserMinus,
  BarChart3,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Trader {
  id: string;
  name: string;
  username: string;
  avatar: string;
  country: string;
  verified: boolean;
  rank: number;
  totalReturn: number;
  monthlyReturn: number;
  weeklyReturn: number;
  winRate: number;
  totalTrades: number;
  followers: number;
  copiers: number;
  riskScore: number;
  maxDrawdown: number;
  sharpeRatio: number;
  tradingStyle: string;
  instruments: string[];
  performance: Array<{ date: string; value: number }>;
  isFollowing: boolean;
  isCopying: boolean;
  copySettings?: {
    amount: number;
    proportion: number;
    stopLoss: number;
    maxTrades: number;
  };
}

interface CopyTradingProps {
  lang?: 'en' | 'ar';
}

const CopyTrading = ({ lang = 'ar' }: CopyTradingProps) => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [filteredTraders, setFilteredTraders] = useState<Trader[]>([]);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalReturn');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStyle, setFilterStyle] = useState('all');
  const [minReturn, setMinReturn] = useState([0]);
  const [loading, setLoading] = useState(true);

  // Copy settings
  const [copyAmount, setCopyAmount] = useState([1000]);
  const [copyProportion, setCopyProportion] = useState([10]);
  const [stopLoss, setStopLoss] = useState([20]);
  const [maxTrades, setMaxTrades] = useState([5]);
  const [autoStop, setAutoStop] = useState(false);

  // Load mock data
  useEffect(() => {
    const mockTraders: Trader[] = [
      {
        id: '1',
        name: 'أحمد محمد',
        username: '@ahmed_trader',
        avatar: '/api/placeholder/150/150',
        country: 'UAE',
        verified: true,
        rank: 1,
        totalReturn: 245.67,
        monthlyReturn: 18.45,
        weeklyReturn: 4.23,
        winRate: 78.5,
        totalTrades: 342,
        followers: 1547,
        copiers: 234,
        riskScore: 6.2,
        maxDrawdown: -8.45,
        sharpeRatio: 2.34,
        tradingStyle: 'Scalping',
        instruments: ['BTC/USDT', 'ETH/USDT', 'EUR/USD'],
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 2000 + i * 50
        })),
        isFollowing: false,
        isCopying: false
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        username: '@sarah_fx',
        avatar: '/api/placeholder/150/150',
        country: 'UK',
        verified: true,
        rank: 2,
        totalReturn: 198.34,
        monthlyReturn: 15.67,
        weeklyReturn: 3.12,
        winRate: 82.3,
        totalTrades: 156,
        followers: 2341,
        copiers: 567,
        riskScore: 4.1,
        maxDrawdown: -6.23,
        sharpeRatio: 2.89,
        tradingStyle: 'Swing Trading',
        instruments: ['GBP/USD', 'EUR/GBP', 'Gold'],
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 1800 + i * 45
        })),
        isFollowing: true,
        isCopying: false
      },
      {
        id: '3',
        name: 'محمد العلي',
        username: '@mohammed_crypto',
        avatar: '/api/placeholder/150/150',
        country: 'Saudi Arabia',
        verified: false,
        rank: 3,
        totalReturn: 176.89,
        monthlyReturn: 12.34,
        weeklyReturn: 2.45,
        winRate: 71.2,
        totalTrades: 289,
        followers: 892,
        copiers: 145,
        riskScore: 7.8,
        maxDrawdown: -12.67,
        sharpeRatio: 1.87,
        tradingStyle: 'Day Trading',
        instruments: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'],
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 1600 + i * 40
        })),
        isFollowing: false,
        isCopying: true,
        copySettings: {
          amount: 2000,
          proportion: 15,
          stopLoss: 15,
          maxTrades: 3
        }
      },
      {
        id: '4',
        name: 'Elena Rodriguez',
        username: '@elena_trader',
        avatar: '/api/placeholder/150/150',
        country: 'Spain',
        verified: true,
        rank: 4,
        totalReturn: 154.23,
        monthlyReturn: 9.87,
        weeklyReturn: 1.89,
        winRate: 75.6,
        totalTrades: 198,
        followers: 1234,
        copiers: 321,
        riskScore: 5.5,
        maxDrawdown: -9.34,
        sharpeRatio: 2.12,
        tradingStyle: 'Position Trading',
        instruments: ['EUR/USD', 'USD/JPY', 'AUD/USD'],
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 1400 + i * 35
        })),
        isFollowing: false,
        isCopying: false
      }
    ];

    setTimeout(() => {
      setTraders(mockTraders);
      setFilteredTraders(mockTraders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort traders
  useEffect(() => {
    let filtered = traders.filter(trader => {
      const matchesSearch = trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trader.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = filterRisk === 'all' || 
                         (filterRisk === 'low' && trader.riskScore <= 4) ||
                         (filterRisk === 'medium' && trader.riskScore > 4 && trader.riskScore <= 7) ||
                         (filterRisk === 'high' && trader.riskScore > 7);
      const matchesStyle = filterStyle === 'all' || trader.tradingStyle.toLowerCase().includes(filterStyle.toLowerCase());
      const matchesReturn = trader.totalReturn >= minReturn[0];

      return matchesSearch && matchesRisk && matchesStyle && matchesReturn;
    });

    // Sort traders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalReturn':
          return b.totalReturn - a.totalReturn;
        case 'monthlyReturn':
          return b.monthlyReturn - a.monthlyReturn;
        case 'winRate':
          return b.winRate - a.winRate;
        case 'followers':
          return b.followers - a.followers;
        case 'riskScore':
          return a.riskScore - b.riskScore;
        default:
          return b.totalReturn - a.totalReturn;
      }
    });

    setFilteredTraders(filtered);
  }, [traders, searchTerm, sortBy, filterRisk, filterStyle, minReturn]);

  const handleFollow = (traderId: string) => {
    setTraders(prev => prev.map(trader => 
      trader.id === traderId 
        ? { ...trader, isFollowing: !trader.isFollowing, followers: trader.isFollowing ? trader.followers - 1 : trader.followers + 1 }
        : trader
    ));
    
    toast.success(lang === 'ar' ? 'تم تحديث المتابعة' : 'Follow status updated');
  };

  const handleCopyTrader = (traderId: string) => {
    const trader = traders.find(t => t.id === traderId);
    if (!trader) return;

    const copySettings = {
      amount: copyAmount[0],
      proportion: copyProportion[0],
      stopLoss: stopLoss[0],
      maxTrades: maxTrades[0]
    };

    setTraders(prev => prev.map(t => 
      t.id === traderId 
        ? { ...t, isCopying: true, copySettings, copiers: t.copiers + 1 }
        : t
    ));

    toast.success(lang === 'ar' ? 'تم بدء نسخ المتداول بنجاح!' : 'Started copying trader successfully!');
  };

  const handleStopCopy = (traderId: string) => {
    setTraders(prev => prev.map(t => 
      t.id === traderId 
        ? { ...t, isCopying: false, copySettings: undefined, copiers: Math.max(0, t.copiers - 1) }
        : t
    ));

    toast.info(lang === 'ar' ? 'تم إيقاف نسخ المتداول' : 'Stopped copying trader');
  };

  const getRiskColor = (score: number) => {
    if (score <= 4) return 'text-green-400';
    if (score <= 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBadge = (score: number) => {
    if (score <= 4) return { text: lang === 'ar' ? 'منخفض' : 'Low', color: 'bg-green-600' };
    if (score <= 7) return { text: lang === 'ar' ? 'متوسط' : 'Medium', color: 'bg-yellow-600' };
    return { text: lang === 'ar' ? 'عالي' : 'High', color: 'bg-red-600' };
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
      {/* Filters and Search */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Copy className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'نسخ التداول' : 'Copy Trading'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'البحث' : 'Search'}
              </Label>
              <Input
                placeholder={lang === 'ar' ? 'ابحث عن متداول...' : 'Search for trader...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-trading-secondary border-gray-600"
              />
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
                  <SelectItem value="totalReturn">
                    {lang === 'ar' ? 'إجمالي العائد' : 'Total Return'}
                  </SelectItem>
                  <SelectItem value="monthlyReturn">
                    {lang === 'ar' ? 'العائد الشهري' : 'Monthly Return'}
                  </SelectItem>
                  <SelectItem value="winRate">
                    {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                  </SelectItem>
                  <SelectItem value="followers">
                    {lang === 'ar' ? 'المتابعين' : 'Followers'}
                  </SelectItem>
                  <SelectItem value="riskScore">
                    {lang === 'ar' ? 'درجة المخاطرة' : 'Risk Score'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'مستوى المخاطرة' : 'Risk Level'}
              </Label>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  <SelectItem value="all">
                    {lang === 'ar' ? 'جميع المستويات' : 'All Levels'}
                  </SelectItem>
                  <SelectItem value="low">
                    {lang === 'ar' ? 'منخفض (1-4)' : 'Low (1-4)'}
                  </SelectItem>
                  <SelectItem value="medium">
                    {lang === 'ar' ? 'متوسط (4-7)' : 'Medium (4-7)'}
                  </SelectItem>
                  <SelectItem value="high">
                    {lang === 'ar' ? 'عالي (7-10)' : 'High (7-10)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">
                {lang === 'ar' ? 'أسلوب التداول' : 'Trading Style'}
              </Label>
              <Select value={filterStyle} onValueChange={setFilterStyle}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  <SelectItem value="all">
                    {lang === 'ar' ? 'جميع الأساليب' : 'All Styles'}
                  </SelectItem>
                  <SelectItem value="scalping">
                    {lang === 'ar' ? 'السكالبينج' : 'Scalping'}
                  </SelectItem>
                  <SelectItem value="day">
                    {lang === 'ar' ? 'التداول اليومي' : 'Day Trading'}
                  </SelectItem>
                  <SelectItem value="swing">
                    {lang === 'ar' ? 'التداول المتأرجح' : 'Swing Trading'}
                  </SelectItem>
                  <SelectItem value="position">
                    {lang === 'ar' ? 'التداول طويل المدى' : 'Position Trading'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300">
              {lang === 'ar' ? 'الحد الأدنى للعائد' : 'Minimum Return'}: {minReturn[0]}%
            </Label>
            <Slider
              value={minReturn}
              onValueChange={setMinReturn}
              max={300}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Traders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTraders.map((trader) => (
          <Card key={trader.id} className="bg-trading-card border-gray-800 hover:border-blue-500 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={trader.avatar} alt={trader.name} />
                      <AvatarFallback className="bg-trading-secondary text-white">
                        {trader.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {trader.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-400 absolute -bottom-1 -right-1 bg-trading-card rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{trader.name}</h3>
                      <Badge variant="secondary" className="bg-trading-secondary">
                        #{trader.rank}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{trader.username}</p>
                    <p className="text-xs text-gray-500">{trader.country}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Button
                    size="sm"
                    variant={trader.isFollowing ? "secondary" : "outline"}
                    onClick={() => handleFollow(trader.id)}
                    className="border-gray-600"
                  >
                    {trader.isFollowing ? <UserMinus className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
                  </Button>
                  <span className="text-xs text-gray-400">{trader.followers} متابع</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-trading-secondary rounded">
                  <div className="text-lg font-bold text-green-400">
                    +{trader.totalReturn.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' ? 'إجمالي العائد' : 'Total Return'}
                  </div>
                </div>
                <div className="text-center p-2 bg-trading-secondary rounded">
                  <div className="text-lg font-bold text-blue-400">
                    {trader.winRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                  </div>
                </div>
                <div className="text-center p-2 bg-trading-secondary rounded">
                  <div className={cn("text-lg font-bold", getRiskColor(trader.riskScore))}>
                    {trader.riskScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' ? 'درجة المخاطرة' : 'Risk Score'}
                  </div>
                </div>
                <div className="text-center p-2 bg-trading-secondary rounded">
                  <div className="text-lg font-bold text-white">
                    {trader.copiers}
                  </div>
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' ? 'ناسخين' : 'Copiers'}
                  </div>
                </div>
              </div>

              {/* Monthly Performance */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {lang === 'ar' ? 'الأداء الشهري' : 'Monthly Performance'}
                  </span>
                  <span className={cn(
                    "font-bold",
                    trader.monthlyReturn >= 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                    {trader.monthlyReturn >= 0 ? '+' : ''}{trader.monthlyReturn.toFixed(2)}%
                  </span>
                </div>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trader.performance.slice(-7)}>
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
              </div>

              {/* Trading Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getRiskBadge(trader.riskScore).color)}
                  >
                    {getRiskBadge(trader.riskScore).text}
                  </Badge>
                  <span className="text-gray-400">{trader.tradingStyle}</span>
                </div>
                <div className="text-gray-400">
                  {trader.totalTrades} {lang === 'ar' ? 'صفقة' : 'trades'}
                </div>
              </div>

              {/* Instruments */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">
                  {lang === 'ar' ? 'الأدوات المالية' : 'Instruments'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {trader.instruments.slice(0, 3).map((instrument, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-trading-secondary">
                      {instrument}
                    </Badge>
                  ))}
                  {trader.instruments.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-trading-secondary">
                      +{trader.instruments.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {trader.isCopying ? (
                  <Button
                    onClick={() => handleStopCopy(trader.id)}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    <StopCircle className="h-3 w-3 mr-1" />
                    {lang === 'ar' ? 'إيقاف النسخ' : 'Stop Copy'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSelectedTrader(trader)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {lang === 'ar' ? 'نسخ' : 'Copy'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600"
                  onClick={() => setSelectedTrader(trader)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>

              {/* Copy Settings for active copies */}
              {trader.isCopying && trader.copySettings && (
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <PlayCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 font-medium text-sm">
                      {lang === 'ar' ? 'النسخ نشط' : 'Copy Active'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>{lang === 'ar' ? 'المبلغ' : 'Amount'}: ${trader.copySettings.amount}</div>
                    <div>{lang === 'ar' ? 'النسبة' : 'Proportion'}: {trader.copySettings.proportion}%</div>
                    <div>{lang === 'ar' ? 'وقف الخسارة' : 'Stop Loss'}: {trader.copySettings.stopLoss}%</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Copy Settings Modal */}
      {selectedTrader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-trading-card border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Copy className="h-5 w-5 text-blue-400" />
                  {lang === 'ar' ? 'إعدادات النسخ' : 'Copy Settings'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedTrader(null)}
                  className="text-gray-400"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Trader Info */}
              <div className="flex items-center gap-4 p-4 bg-trading-secondary rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedTrader.avatar} alt={selectedTrader.name} />
                  <AvatarFallback className="bg-trading-bg text-white">
                    {selectedTrader.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{selectedTrader.name}</h3>
                  <p className="text-gray-400">{selectedTrader.username}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-green-400 font-bold">
                      +{selectedTrader.totalReturn.toFixed(2)}%
                    </span>
                    <span className="text-blue-400">
                      {selectedTrader.winRate.toFixed(1)}% {lang === 'ar' ? 'فوز' : 'win rate'}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getRiskBadge(selectedTrader.riskScore).color)}
                    >
                      {getRiskBadge(selectedTrader.riskScore).text}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Copy Settings */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'مبلغ النسخ' : 'Copy Amount'}: ${copyAmount[0]}
                  </Label>
                  <Slider
                    value={copyAmount}
                    onValueChange={setCopyAmount}
                    max={10000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' 
                      ? 'المبلغ الذي ستخصصه لنسخ هذا المتداول' 
                      : 'Amount you will allocate to copy this trader'}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'نسبة النسخ' : 'Copy Proportion'}: {copyProportion[0]}%
                  </Label>
                  <Slider
                    value={copyProportion}
                    onValueChange={setCopyProportion}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' 
                      ? 'نسبة كل صفقة من إجمالي مبلغ النسخ' 
                      : 'Percentage of each trade from total copy amount'}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'وقف الخسارة' : 'Stop Loss'}: {stopLoss[0]}%
                  </Label>
                  <Slider
                    value={stopLoss}
                    onValueChange={setStopLoss}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' 
                      ? 'إيقاف النسخ عند خسارة هذه النسبة' 
                      : 'Stop copying when this percentage is lost'}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'الحد الأقصى للصفقات' : 'Max Open Trades'}: {maxTrades[0]}
                  </Label>
                  <Slider
                    value={maxTrades}
                    onValueChange={setMaxTrades}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' 
                      ? 'الحد الأقصى للصفقات المفتوحة في نفس الوقت' 
                      : 'Maximum number of trades open at the same time'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                  <div>
                    <div className="text-white font-medium">
                      {lang === 'ar' ? 'الإيقاف التلقائي' : 'Auto Stop'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {lang === 'ar' 
                        ? 'إيقاف النسخ تلقائياً عند الخسارة' 
                        : 'Automatically stop copying on loss'}
                    </div>
                  </div>
                  <Switch 
                    checked={autoStop}
                    onCheckedChange={setAutoStop}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>

              {/* Risk Warning */}
              <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <span className="font-bold text-yellow-300">
                    {lang === 'ar' ? 'تحذير المخاطر' : 'Risk Warning'}
                  </span>
                </div>
                <div className="text-yellow-200 text-sm">
                  {lang === 'ar' 
                    ? 'التداول ينطوي على مخاطر كبيرة وقد تفقد جميع أموالك. الأداء السابق لا يضمن النتائج المستقبلية.'
                    : 'Trading involves significant risks and you may lose all your money. Past performance does not guarantee future results.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedTrader(null)}
                  variant="outline"
                  className="flex-1 border-gray-600"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={() => {
                    handleCopyTrader(selectedTrader.id);
                    setSelectedTrader(null);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'بدء النسخ' : 'Start Copying'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredTraders.length === 0 && (
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="text-center py-12">
            <Copy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
            </h3>
            <p className="text-gray-400">
              {lang === 'ar' 
                ? 'جرب تعديل معايير البحث والتصفية'
                : 'Try adjusting your search and filter criteria'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CopyTrading;
