
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bot, Play, Square, Settings, TrendingUp, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TradingBotProps {
  lang?: 'en' | 'ar';
}

const TradingBot = ({ lang = 'en' }: TradingBotProps) => {
  const [botStatus, setBotStatus] = useState<'running' | 'stopped' | 'paused'>('stopped');
  const [autoMode, setAutoMode] = useState(false);

  const botStats = {
    totalTrades: 1247,
    successfulTrades: 1174,
    successRate: 94.1,
    totalProfit: 12547.32,
    todayProfit: 245.78,
    activePairs: 8
  };

  const activeTrades = [
    { pair: 'BTC/USDT', type: 'BUY', amount: '0.0234', profit: '+2.4%', status: 'active' },
    { pair: 'ETH/USDT', type: 'SELL', amount: '1.567', profit: '+1.8%', status: 'active' },
    { pair: 'BNB/USDT', type: 'BUY', amount: '12.45', profit: '-0.3%', status: 'active' },
  ];

  const strategies = [
    { name: 'Scalping Pro', enabled: true, profit: '+15.2%' },
    { name: 'Trend Following', enabled: true, profit: '+8.7%' },
    { name: 'Mean Reversion', enabled: false, profit: '+3.1%' },
    { name: 'Arbitrage Hunter', enabled: true, profit: '+12.9%' },
  ];

  const handleBotControl = (action: 'start' | 'stop' | 'pause') => {
    setBotStatus(action === 'start' ? 'running' : action === 'stop' ? 'stopped' : 'paused');
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-trading-bg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-trading-card rounded-lg border border-gray-800">
            <Bot className="h-8 w-8 text-trading-up animate-glow" />
          </div>
          <div>
            <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
              {lang === 'en' ? 'Signal Black Trading Bot' : 'بوت التداول Signal Black'}
            </h1>
            <p className="text-gray-400">
              {lang === 'en' ? 'Automated trading with AI precision' : 'تداول آلي بدقة الذكاء الاصطناعي'}
            </p>
          </div>
        </div>
        <Badge 
          variant={botStatus === 'running' ? 'default' : 'secondary'}
          className={cn(
            "text-lg px-4 py-2",
            botStatus === 'running' 
              ? 'bg-trading-up text-white animate-pulse' 
              : 'bg-gray-600 text-white'
          )}
        >
          {botStatus === 'running' 
            ? (lang === 'en' ? 'ACTIVE' : 'نشط')
            : (lang === 'en' ? 'STOPPED' : 'متوقف')
          }
        </Badge>
      </div>

      {/* Bot Controls */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-trading-up" />
            {lang === 'en' ? 'Bot Controls' : 'تحكم البوت'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">
                  {lang === 'en' ? 'Auto Trading Mode' : 'وضع التداول الآلي'}
                </span>
                <Switch 
                  checked={autoMode} 
                  onCheckedChange={setAutoMode}
                  className="data-[state=checked]:bg-trading-up"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleBotControl('start')}
                  disabled={botStatus === 'running'}
                  className="flex-1 bg-trading-up hover:bg-green-600 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {lang === 'en' ? 'Start' : 'تشغيل'}
                </Button>
                <Button 
                  onClick={() => handleBotControl('stop')}
                  disabled={botStatus === 'stopped'}
                  className="flex-1 bg-trading-down hover:bg-red-600 text-white"
                >
                  <Square className="h-4 w-4 mr-2" />
                  {lang === 'en' ? 'Stop' : 'إيقاف'}
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-trading-secondary rounded-lg">
                  <div className="text-2xl font-bold text-trading-up">{botStats.successRate}%</div>
                  <div className="text-xs text-gray-400">
                    {lang === 'en' ? 'Success Rate' : 'معدل النجاح'}
                  </div>
                </div>
                <div className="text-center p-3 bg-trading-secondary rounded-lg">
                  <div className="text-2xl font-bold text-white">{botStats.activePairs}</div>
                  <div className="text-xs text-gray-400">
                    {lang === 'en' ? 'Active Pairs' : 'أزواج نشطة'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-trading-up" />
              <div>
                <div className="text-2xl font-bold text-white">${botStats.totalProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-400">
                  {lang === 'en' ? 'Total Profit' : 'إجمالي الربح'}
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
                <div className="text-2xl font-bold text-trading-up">+${botStats.todayProfit}</div>
                <div className="text-sm text-gray-400">
                  {lang === 'en' ? 'Today\'s Profit' : 'ربح اليوم'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-white" />
              <div>
                <div className="text-2xl font-bold text-white">{botStats.totalTrades}</div>
                <div className="text-sm text-gray-400">
                  {lang === 'en' ? 'Total Trades' : 'إجمالي الصفقات'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-white">{botStats.totalTrades - botStats.successfulTrades}</div>
                <div className="text-sm text-gray-400">
                  {lang === 'en' ? 'Failed Trades' : 'صفقات فاشلة'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Trades and Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'en' ? 'Active Trades' : 'الصفقات النشطة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={trade.type === 'BUY' ? 'default' : 'destructive'}
                      className={trade.type === 'BUY' ? 'bg-trading-up' : 'bg-trading-down'}
                    >
                      {trade.type}
                    </Badge>
                    <div>
                      <div className="font-medium text-white">{trade.pair}</div>
                      <div className="text-sm text-gray-400">{trade.amount}</div>
                    </div>
                  </div>
                  <div className={cn(
                    "font-bold",
                    trade.profit.startsWith('+') ? 'text-trading-up' : 'text-trading-down'
                  )}>
                    {trade.profit}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {lang === 'en' ? 'Trading Strategies' : 'استراتيجيات التداول'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategies.map((strategy, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={strategy.enabled}
                      className="data-[state=checked]:bg-trading-up"
                    />
                    <div>
                      <div className="font-medium text-white">{strategy.name}</div>
                      <div className="text-sm text-trading-up">{strategy.profit}</div>
                    </div>
                  </div>
                  <Badge 
                    variant={strategy.enabled ? 'default' : 'secondary'}
                    className={strategy.enabled ? 'bg-trading-up' : 'bg-gray-600'}
                  >
                    {strategy.enabled 
                      ? (lang === 'en' ? 'Active' : 'نشط')
                      : (lang === 'en' ? 'Disabled' : 'معطل')
                    }
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingBot;
