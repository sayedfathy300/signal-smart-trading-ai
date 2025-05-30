
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

interface PortfolioProps {
  lang?: 'en' | 'ar';
}

const Portfolio = ({ lang = 'ar' }: PortfolioProps) => {
  const [loading, setLoading] = useState(false);

  // بيانات المحفظة التجريبية
  const portfolioData = {
    totalValue: 125430.67,
    totalProfit: 15234.50,
    totalProfitPercent: 13.85,
    todayChange: 1234.56,
    todayChangePercent: 0.99
  };

  const positions = [
    {
      symbol: 'EUR/USD',
      type: 'BUY',
      size: 10000,
      entryPrice: 1.0850,
      currentPrice: 1.0920,
      profit: 700,
      profitPercent: 0.65,
      unrealizedPL: 700
    },
    {
      symbol: 'GBP/USD',
      type: 'SELL',
      size: 5000,
      entryPrice: 1.2650,
      currentPrice: 1.2580,
      profit: 350,
      profitPercent: 0.55,
      unrealizedPL: 350
    },
    {
      symbol: 'USD/JPY',
      type: 'BUY',
      size: 8000,
      entryPrice: 149.50,
      currentPrice: 150.20,
      profit: 374,
      profitPercent: 0.47,
      unrealizedPL: 374
    }
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'محفظة التداول' : 'Trading Portfolio'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'إدارة المحفظة ومراقبة الأداء' : 'Portfolio Management and Performance Monitoring'}
          </p>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={loading}
          size="sm"
          className="bg-trading-primary hover:bg-blue-600"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? (lang === 'ar' ? 'جاري التحديث...' : 'Updating...') : (lang === 'ar' ? 'تحديث' : 'Refresh')}
        </Button>
      </div>

      {/* إحصائيات المحفظة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-trading-up" />
              <div>
                <div className="text-2xl font-bold text-white">
                  ${portfolioData.totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'إجمالي قيمة المحفظة' : 'Total Portfolio Value'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-trading-up" />
              <div>
                <div className="text-2xl font-bold text-trading-up">
                  +${portfolioData.totalProfit.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'إجمالي الأرباح' : 'Total Profit'}
                </div>
                <div className="text-xs text-trading-up">
                  +{portfolioData.totalProfitPercent}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-trading-up">
                  +${portfolioData.todayChange.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'تغيير اليوم' : "Today's Change"}
                </div>
                <div className="text-xs text-trading-up">
                  +{portfolioData.todayChangePercent}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <PieChart className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {positions.length}
                </div>
                <div className="text-sm text-gray-400">
                  {lang === 'ar' ? 'المراكز النشطة' : 'Active Positions'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* المراكز النشطة */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {lang === 'ar' ? 'المراكز النشطة' : 'Active Positions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div key={index} className="bg-trading-secondary p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-lg">{position.symbol}</span>
                        <Badge 
                          variant={position.type === 'BUY' ? 'default' : 'destructive'}
                          className={position.type === 'BUY' ? 'bg-trading-up' : 'bg-trading-down'}
                        >
                          {position.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        {lang === 'ar' ? 'الحجم:' : 'Size:'} {position.size.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-gray-400">
                          {lang === 'ar' ? 'سعر الدخول' : 'Entry Price'}
                        </div>
                        <div className="font-bold text-white">{position.entryPrice}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          {lang === 'ar' ? 'السعر الحالي' : 'Current Price'}
                        </div>
                        <div className="font-bold text-white">{position.currentPrice}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          {lang === 'ar' ? 'الربح/الخسارة' : 'P&L'}
                        </div>
                        <div className={`font-bold ${position.profit >= 0 ? 'text-trading-up' : 'text-trading-down'}`}>
                          {position.profit >= 0 ? '+' : ''}${position.profit}
                        </div>
                        <div className={`text-xs ${position.profit >= 0 ? 'text-trading-up' : 'text-trading-down'}`}>
                          {position.profit >= 0 ? '+' : ''}{position.profitPercent}%
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-trading-up text-trading-up hover:bg-trading-up hover:text-white">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-trading-down text-trading-down hover:bg-trading-down hover:text-white">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
