
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, 
  Medal, 
  Crown,
  TrendingUp, 
  TrendingDown, 
  Star,
  Target,
  Activity,
  DollarSign,
  Calendar,
  Users,
  Award,
  Zap,
  Shield,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Minus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  username: string;
  avatar: string;
  country: string;
  verified: boolean;
  totalReturn: number;
  periodReturn: number;
  winRate: number;
  totalTrades: number;
  followers: number;
  copiers: number;
  riskScore: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  consecutiveWins: number;
  tradingStyle: string;
  instruments: string[];
  badges: string[];
  joinDate: string;
  lastActive: string;
  performance: Array<{ date: string; value: number }>;
}

interface LeaderboardsProps {
  lang?: 'en' | 'ar';
}

const Leaderboards = ({ lang = 'ar' }: LeaderboardsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const periods = [
    { id: 'daily', name: lang === 'ar' ? 'يومي' : 'Daily' },
    { id: 'weekly', name: lang === 'ar' ? 'أسبوعي' : 'Weekly' },
    { id: 'monthly', name: lang === 'ar' ? 'شهري' : 'Monthly' },
    { id: 'quarterly', name: lang === 'ar' ? 'ربع سنوي' : 'Quarterly' },
    { id: 'yearly', name: lang === 'ar' ? 'سنوي' : 'Yearly' },
    { id: 'allTime', name: lang === 'ar' ? 'كل الأوقات' : 'All Time' }
  ];

  const categories = [
    { id: 'all', name: lang === 'ar' ? 'جميع المتداولين' : 'All Traders' },
    { id: 'crypto', name: lang === 'ar' ? 'العملات الرقمية' : 'Crypto' },
    { id: 'forex', name: lang === 'ar' ? 'الفوركس' : 'Forex' },
    { id: 'stocks', name: lang === 'ar' ? 'الأسهم' : 'Stocks' },
    { id: 'commodities', name: lang === 'ar' ? 'السلع' : 'Commodities' },
    { id: 'indices', name: lang === 'ar' ? 'المؤشرات' : 'Indices' }
  ];

  // Load mock data
  useEffect(() => {
    setLoading(true);
    
    const mockData: LeaderboardEntry[] = [
      {
        id: '1',
        rank: 1,
        previousRank: 2,
        name: 'أحمد محمد العلي',
        username: '@ahmed_pro',
        avatar: '/api/placeholder/150/150',
        country: 'UAE',
        verified: true,
        totalReturn: 342.67,
        periodReturn: 28.45,
        winRate: 84.2,
        totalTrades: 456,
        followers: 3245,
        copiers: 567,
        riskScore: 5.2,
        sharpeRatio: 3.45,
        maxDrawdown: -8.23,
        profitFactor: 2.67,
        consecutiveWins: 12,
        tradingStyle: 'Scalping',
        instruments: ['BTC/USDT', 'ETH/USDT', 'EUR/USD'],
        badges: ['Top Performer', 'Consistent Trader', 'Risk Manager'],
        joinDate: '2022-01-15',
        lastActive: '2024-01-15',
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 3000 + i * 80
        }))
      },
      {
        id: '2',
        rank: 2,
        previousRank: 1,
        name: 'Sarah Johnson',
        username: '@sarah_fx_queen',
        avatar: '/api/placeholder/150/150',
        country: 'UK',
        verified: true,
        totalReturn: 298.34,
        periodReturn: 25.67,
        winRate: 78.9,
        totalTrades: 234,
        followers: 2856,
        copiers: 423,
        riskScore: 4.1,
        sharpeRatio: 2.89,
        maxDrawdown: -6.45,
        profitFactor: 2.34,
        consecutiveWins: 8,
        tradingStyle: 'Swing Trading',
        instruments: ['GBP/USD', 'EUR/GBP', 'Gold'],
        badges: ['Forex Master', 'Low Risk', 'Profitable'],
        joinDate: '2021-08-22',
        lastActive: '2024-01-15',
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 2800 + i * 75
        }))
      },
      {
        id: '3',
        rank: 3,
        previousRank: 4,
        name: 'محمد خالد',
        username: '@khalid_crypto',
        avatar: '/api/placeholder/150/150',
        country: 'Saudi Arabia',
        verified: true,
        totalReturn: 267.89,
        periodReturn: 22.34,
        winRate: 76.5,
        totalTrades: 567,
        followers: 1892,
        copiers: 345,
        riskScore: 6.8,
        sharpeRatio: 2.12,
        maxDrawdown: -12.67,
        profitFactor: 2.08,
        consecutiveWins: 6,
        tradingStyle: 'Day Trading',
        instruments: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'],
        badges: ['Crypto Expert', 'High Volume', 'Active Trader'],
        joinDate: '2021-12-03',
        lastActive: '2024-01-15',
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 2600 + i * 70
        }))
      },
      {
        id: '4',
        rank: 4,
        previousRank: 3,
        name: 'Elena Rodriguez',
        username: '@elena_trader',
        avatar: '/api/placeholder/150/150',
        country: 'Spain',
        verified: false,
        totalReturn: 234.56,
        periodReturn: 19.87,
        winRate: 81.3,
        totalTrades: 198,
        followers: 1567,
        copiers: 287,
        riskScore: 3.9,
        sharpeRatio: 2.76,
        maxDrawdown: -5.89,
        profitFactor: 2.45,
        consecutiveWins: 9,
        tradingStyle: 'Position Trading',
        instruments: ['EUR/USD', 'USD/JPY', 'AUD/USD'],
        badges: ['Conservative', 'Steady Growth'],
        joinDate: '2022-03-18',
        lastActive: '2024-01-14',
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 2300 + i * 65
        }))
      },
      {
        id: '5',
        rank: 5,
        previousRank: 6,
        name: 'David Chen',
        username: '@david_asia_trader',
        avatar: '/api/placeholder/150/150',
        country: 'Singapore',
        verified: true,
        totalReturn: 212.34,
        periodReturn: 17.65,
        winRate: 79.8,
        totalTrades: 345,
        followers: 1234,
        copiers: 234,
        riskScore: 5.5,
        sharpeRatio: 2.34,
        maxDrawdown: -9.45,
        profitFactor: 2.12,
        consecutiveWins: 7,
        tradingStyle: 'Scalping',
        instruments: ['USD/JPY', 'EUR/JPY', 'AUD/JPY'],
        badges: ['Asian Markets', 'Technical Analyst'],
        joinDate: '2021-11-07',
        lastActive: '2024-01-15',
        performance: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * 2100 + i * 60
        }))
      }
    ];

    // Add more entries to fill top 50
    for (let i = 6; i <= 50; i++) {
      mockData.push({
        id: i.toString(),
        rank: i,
        previousRank: i + Math.floor(Math.random() * 6) - 3,
        name: `متداول ${i}`,
        username: `@trader${i}`,
        avatar: '/api/placeholder/150/150',
        country: ['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain'][Math.floor(Math.random() * 5)],
        verified: Math.random() > 0.7,
        totalReturn: 200 - (i * 3) + Math.random() * 20,
        periodReturn: 20 - (i * 0.3) + Math.random() * 5,
        winRate: 85 - (i * 0.2) + Math.random() * 10,
        totalTrades: 500 - (i * 8) + Math.floor(Math.random() * 100),
        followers: 3000 - (i * 50) + Math.floor(Math.random() * 500),
        copiers: 600 - (i * 10) + Math.floor(Math.random() * 100),
        riskScore: 3 + Math.random() * 5,
        sharpeRatio: 3 - (i * 0.02) + Math.random() * 0.5,
        maxDrawdown: -(5 + Math.random() * 10),
        profitFactor: 2.5 - (i * 0.02) + Math.random() * 0.3,
        consecutiveWins: Math.floor(Math.random() * 15),
        tradingStyle: ['Scalping', 'Day Trading', 'Swing Trading', 'Position Trading'][Math.floor(Math.random() * 4)],
        instruments: ['BTC/USDT', 'ETH/USDT', 'EUR/USD', 'GBP/USD'].slice(0, Math.floor(Math.random() * 4) + 1),
        badges: ['Trader', 'Active'].slice(0, Math.floor(Math.random() * 2) + 1),
        joinDate: '2022-01-01',
        lastActive: '2024-01-15',
        performance: Array.from({ length: 30 }, (_, j) => ({
          date: new Date(Date.now() - (29 - j) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 10000 + Math.random() * (2000 - i * 30) + j * (60 - i)
        }))
      });
    }

    setTimeout(() => {
      setLeaderboard(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod, selectedCategory]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <Trophy className="h-5 w-5 text-gray-500" />;
  };

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current;
    if (change > 0) return { icon: <ChevronUp className="h-4 w-4 text-green-400" />, color: 'text-green-400', text: `+${change}` };
    if (change < 0) return { icon: <ChevronDown className="h-4 w-4 text-red-400" />, color: 'text-red-400', text: `${change}` };
    return { icon: <Minus className="h-4 w-4 text-gray-400" />, color: 'text-gray-400', text: '0' };
  };

  const getRiskColor = (score: number) => {
    if (score <= 4) return 'text-green-400';
    if (score <= 7) return 'text-yellow-400';
    return 'text-red-400';
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
      {/* Filters */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            {lang === 'ar' ? 'لوحة المتصدرين' : 'Leaderboards'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                {lang === 'ar' ? 'الفترة الزمنية' : 'Time Period'}
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-trading-secondary border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-trading-secondary border-gray-600">
                  {periods.map(period => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                {lang === 'ar' ? 'الفئة' : 'Category'}
              </label>
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
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((trader, index) => (
          <Card key={trader.id} className={cn(
            "bg-trading-card border-gray-800",
            index === 0 && "ring-2 ring-yellow-400/50",
            index === 1 && "ring-2 ring-gray-300/50",
            index === 2 && "ring-2 ring-amber-600/50"
          )}>
            <CardContent className="text-center p-6">
              <div className="relative inline-block mb-4">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src={trader.avatar} alt={trader.name} />
                  <AvatarFallback className="bg-trading-secondary text-white text-lg">
                    {trader.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2">
                  {getRankIcon(trader.rank)}
                </div>
                {trader.verified && (
                  <CheckCircle className="h-5 w-5 text-blue-400 absolute -bottom-1 -right-1 bg-trading-card rounded-full" />
                )}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">{trader.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{trader.username}</p>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-400">
                  +{trader.periodReturn.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'العائد للفترة' : 'Period Return'}
                </div>
                
                <div className="flex justify-center items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-white font-bold">{trader.winRate.toFixed(1)}%</div>
                    <div className="text-gray-400">{lang === 'ar' ? 'فوز' : 'Win'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-bold">{trader.followers}</div>
                    <div className="text-gray-400">{lang === 'ar' ? 'متابع' : 'Followers'}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 justify-center mt-3">
                  {trader.badges.slice(0, 2).map((badge, badgeIndex) => (
                    <Badge key={badgeIndex} variant="secondary" className="text-xs bg-trading-secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Leaderboard */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            {lang === 'ar' ? 'التصنيف التفصيلي' : 'Detailed Rankings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-trading-secondary">
              <TabsTrigger value="table">
                {lang === 'ar' ? 'عرض جدولي' : 'Table View'}
              </TabsTrigger>
              <TabsTrigger value="cards">
                {lang === 'ar' ? 'عرض البطاقات' : 'Card View'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-gray-300">
                        {lang === 'ar' ? 'الترتيب' : 'Rank'}
                      </th>
                      <th className="text-left py-3 text-gray-300">
                        {lang === 'ar' ? 'المتداول' : 'Trader'}
                      </th>
                      <th className="text-right py-3 text-gray-300">
                        {lang === 'ar' ? 'العائد' : 'Return'}
                      </th>
                      <th className="text-right py-3 text-gray-300">
                        {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                      </th>
                      <th className="text-right py-3 text-gray-300">
                        {lang === 'ar' ? 'المخاطرة' : 'Risk'}
                      </th>
                      <th className="text-right py-3 text-gray-300">
                        {lang === 'ar' ? 'المتابعين' : 'Followers'}
                      </th>
                      <th className="text-right py-3 text-gray-300">
                        {lang === 'ar' ? 'الناسخين' : 'Copiers'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((trader) => {
                      const rankChange = getRankChange(trader.rank, trader.previousRank);
                      return (
                        <tr key={trader.id} className="border-b border-gray-800 hover:bg-trading-secondary/50">
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-white">{trader.rank}</span>
                              <div className="flex items-center">
                                {rankChange.icon}
                                <span className={cn("text-xs", rankChange.color)}>
                                  {rankChange.text}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={trader.avatar} alt={trader.name} />
                                <AvatarFallback className="bg-trading-bg text-white">
                                  {trader.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white">{trader.name}</span>
                                  {trader.verified && (
                                    <CheckCircle className="h-4 w-4 text-blue-400" />
                                  )}
                                </div>
                                <span className="text-sm text-gray-400">{trader.username}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="text-green-400 font-bold">
                              +{trader.periodReturn.toFixed(2)}%
                            </div>
                            <div className="text-xs text-gray-400">
                              {trader.totalReturn.toFixed(1)}% {lang === 'ar' ? 'إجمالي' : 'total'}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-white font-medium">
                              {trader.winRate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <span className={cn("font-medium", getRiskColor(trader.riskScore))}>
                              {trader.riskScore.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-white">{trader.followers.toLocaleString()}</span>
                          </td>
                          <td className="py-4 text-right">
                            <span className="text-white">{trader.copiers.toLocaleString()}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaderboard.slice(3, 21).map((trader) => {
                  const rankChange = getRankChange(trader.rank, trader.previousRank);
                  return (
                    <Card key={trader.id} className="bg-trading-secondary border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">#{trader.rank}</span>
                            <div className="flex items-center">
                              {rankChange.icon}
                              <span className={cn("text-xs", rankChange.color)}>
                                {rankChange.text}
                              </span>
                            </div>
                          </div>
                          {trader.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-400" />
                          )}
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={trader.avatar} alt={trader.name} />
                            <AvatarFallback className="bg-trading-bg text-white">
                              {trader.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-white">{trader.name}</h3>
                            <p className="text-sm text-gray-400">{trader.username}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="text-center p-2 bg-trading-card rounded">
                            <div className="text-green-400 font-bold">
                              +{trader.periodReturn.toFixed(2)}%
                            </div>
                            <div className="text-xs text-gray-400">
                              {lang === 'ar' ? 'عائد الفترة' : 'Period Return'}
                            </div>
                          </div>
                          <div className="text-center p-2 bg-trading-card rounded">
                            <div className="text-blue-400 font-bold">
                              {trader.winRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">
                              {lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <div>
                            <span className="text-gray-400">{lang === 'ar' ? 'متابعين:' : 'Followers:'}</span>
                            <span className="text-white ml-1">{trader.followers}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">{lang === 'ar' ? 'ناسخين:' : 'Copiers:'}</span>
                            <span className="text-white ml-1">{trader.copiers}</span>
                          </div>
                        </div>

                        {trader.badges.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {trader.badges.slice(0, 2).map((badge, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-trading-card">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">15,247</div>
            <div className="text-sm text-gray-400">
              {lang === 'ar' ? 'إجمالي المتداولين' : 'Total Traders'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">8,934</div>
            <div className="text-sm text-gray-400">
              {lang === 'ar' ? 'متداولين نشطين' : 'Active Traders'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">$2.4B</div>
            <div className="text-sm text-gray-400">
              {lang === 'ar' ? 'حجم التداول' : 'Trading Volume'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">67.8%</div>
            <div className="text-sm text-gray-400">
              {lang === 'ar' ? 'متوسط معدل الفوز' : 'Avg Win Rate'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboards;
