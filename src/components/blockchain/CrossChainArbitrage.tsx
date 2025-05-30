
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Shuffle, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Network,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';

interface CrossChainArbitrageProps {
  lang?: 'en' | 'ar';
}

const CrossChainArbitrage = ({ lang = 'ar' }: CrossChainArbitrageProps) => {
  const [selectedPair, setSelectedPair] = useState('ETH/USDC');
  const [isScanning, setIsScanning] = useState(false);
  const [autoExecute, setAutoExecute] = useState(false);

  // شبكات البلوك تشين المدعومة
  const supportedChains = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      logo: '/api/placeholder/32/32',
      gasPrice: 45,
      blockTime: 13,
      status: 'active'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      logo: '/api/placeholder/32/32',
      gasPrice: 0.02,
      blockTime: 2,
      status: 'active'
    },
    {
      id: 'bsc',
      name: 'Binance Smart Chain',
      symbol: 'BNB',
      logo: '/api/placeholder/32/32',
      gasPrice: 0.8,
      blockTime: 3,
      status: 'active'
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      symbol: 'ARB',
      logo: '/api/placeholder/32/32',
      gasPrice: 2.1,
      blockTime: 1,
      status: 'active'
    },
    {
      id: 'avalanche',
      name: 'Avalanche',
      symbol: 'AVAX',
      logo: '/api/placeholder/32/32',
      gasPrice: 1.2,
      blockTime: 2,
      status: 'maintenance'
    }
  ];

  // فرص المراجحة
  const arbitrageOpportunities = [
    {
      id: '1',
      pair: 'ETH/USDC',
      buyChain: 'Polygon',
      sellChain: 'Ethereum',
      buyPrice: 2645.30,
      sellPrice: 2658.75,
      spread: 0.51,
      profit: 13.45,
      volume: 50000,
      gasCost: 25.60,
      netProfit: 987.85,
      confidence: 92,
      timeWindow: 45,
      risk: 'Low'
    },
    {
      id: '2',
      pair: 'WBTC/USDT',
      buyChain: 'BSC',
      sellChain: 'Ethereum',
      buyPrice: 43250.80,
      sellPrice: 43402.15,
      spread: 0.35,
      profit: 151.35,
      volume: 25000,
      gasCost: 42.30,
      netProfit: 3792.05,
      confidence: 87,
      timeWindow: 32,
      risk: 'Medium'
    },
    {
      id: '3',
      pair: 'MATIC/USDC',
      buyChain: 'Ethereum',
      sellChain: 'Polygon',
      buyPrice: 0.8945,
      sellPrice: 0.9012,
      spread: 0.75,
      profit: 0.0067,
      volume: 100000,
      gasCost: 15.20,
      netProfit: 655.80,
      confidence: 95,
      timeWindow: 18,
      risk: 'Low'
    },
    {
      id: '4',
      pair: 'LINK/USDT',
      buyChain: 'Arbitrum',
      sellChain: 'BSC',
      buyPrice: 14.567,
      sellPrice: 14.689,
      spread: 0.84,
      profit: 0.122,
      volume: 75000,
      gasCost: 8.40,
      netProfit: 9141.60,
      confidence: 89,
      timeWindow: 28,
      risk: 'Medium'
    }
  ];

  // إحصائيات المراجحة
  const arbitrageStats = {
    totalProfitToday: 15674.32,
    successfulTrades: 47,
    totalVolume: 2456000,
    avgProfit: 333.28,
    bestPair: 'ETH/USDC',
    activeOpportunities: 12
  };

  // محاكاة البحث عن الفرص
  const scanForOpportunities = async () => {
    setIsScanning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Scanning for arbitrage opportunities...');
    } catch (error) {
      console.error('Scanning failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // تنفيذ المراجحة
  const executeArbitrage = async (opportunityId: string) => {
    console.log(`Executing arbitrage opportunity: ${opportunityId}`);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-900/30 border-green-700 text-green-300';
      case 'medium': return 'bg-yellow-900/30 border-yellow-700 text-yellow-300';
      case 'high': return 'bg-red-900/30 border-red-700 text-red-300';
      default: return 'bg-gray-900/30 border-gray-700 text-gray-300';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  ${arbitrageStats.totalProfitToday.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'ربح اليوم' : "Today's Profit"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{arbitrageStats.successfulTrades}</div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'صفقات ناجحة' : 'Successful Trades'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{arbitrageStats.activeOpportunities}</div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'فرص نشطة' : 'Active Opportunities'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  ${arbitrageStats.avgProfit.toFixed(2)}
                </div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'متوسط الربح' : 'Average Profit'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chain Status */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'حالة الشبكات' : 'Network Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {supportedChains.map((chain) => (
              <div key={chain.id} className="p-3 bg-trading-secondary rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={chain.logo} 
                    alt={chain.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-white font-medium text-sm">{chain.name}</span>
                  {chain.status === 'active' ? (
                    <CheckCircle className="h-3 w-3 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-yellow-400" />
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'رسوم الغاز:' : 'Gas:'}
                    </span>
                    <span className="text-white">${chain.gasPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'وقت البلوك:' : 'Block Time:'}
                    </span>
                    <span className="text-white">{chain.blockTime}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-purple-400" />
            {lang === 'ar' ? 'لوحة التحكم' : 'Control Panel'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-400 text-sm mb-2">
                {lang === 'ar' ? 'زوج التداول' : 'Trading Pair'}
              </label>
              <select 
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full p-2 bg-trading-secondary border border-gray-700 rounded-md text-white"
              >
                <option value="ETH/USDC">ETH/USDC</option>
                <option value="WBTC/USDT">WBTC/USDT</option>
                <option value="MATIC/USDC">MATIC/USDC</option>
                <option value="LINK/USDT">LINK/USDT</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 text-sm mb-2">
                {lang === 'ar' ? 'الحد الأدنى للربح' : 'Minimum Profit'}
              </label>
              <Input
                type="number"
                placeholder="100"
                className="bg-trading-secondary border-gray-700 text-white"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={scanForOpportunities}
                disabled={isScanning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {lang === 'ar' ? 'جاري البحث...' : 'Scanning...'}
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'بحث عن فرص' : 'Scan Opportunities'}
                  </>
                )}
              </Button>
              <Button
                variant={autoExecute ? "default" : "outline"}
                onClick={() => setAutoExecute(!autoExecute)}
                className={autoExecute ? 'bg-green-600 hover:bg-green-700' : 'border-gray-600'}
              >
                <Zap className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تنفيذ تلقائي' : 'Auto Execute'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arbitrage Opportunities */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            {lang === 'ar' ? 'فرص المراجحة المتاحة' : 'Available Arbitrage Opportunities'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {arbitrageOpportunities.map((opportunity) => (
              <div 
                key={opportunity.id}
                className="p-4 bg-trading-secondary rounded-lg border border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{opportunity.pair}</h3>
                    <Badge className={getRiskBadge(opportunity.risk)}>
                      {opportunity.risk} Risk
                    </Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-sm">
                        {lang === 'ar' ? 'الثقة:' : 'Confidence:'}
                      </span>
                      <span className={`text-sm font-medium ${getConfidenceColor(opportunity.confidence)}`}>
                        {opportunity.confidence}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">{opportunity.timeWindow}s</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="text-gray-400 text-xs">
                      {lang === 'ar' ? 'شراء من' : 'Buy from'}
                    </div>
                    <div className="text-white font-medium">{opportunity.buyChain}</div>
                    <div className="text-green-400 text-sm">${opportunity.buyPrice.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-gray-400 text-xs">
                      {lang === 'ar' ? 'بيع إلى' : 'Sell to'}
                    </div>
                    <div className="text-white font-medium">{opportunity.sellChain}</div>
                    <div className="text-blue-400 text-sm">${opportunity.sellPrice.toLocaleString()}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-gray-400 text-xs">
                      {lang === 'ar' ? 'الربح الصافي' : 'Net Profit'}
                    </div>
                    <div className="text-green-400 font-bold text-lg">
                      ${opportunity.netProfit.toLocaleString()}
                    </div>
                    <div className="text-green-400 text-sm">+{opportunity.spread}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="text-gray-400 text-xs">
                      {lang === 'ar' ? 'حجم التداول' : 'Volume'}
                    </div>
                    <div className="text-white">${opportunity.volume.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400 text-xs">
                      {lang === 'ar' ? 'رسوم الغاز' : 'Gas Costs'}
                    </div>
                    <div className="text-red-400">${opportunity.gasCost}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400 text-xs">
                      {lang === 'ar' ? 'الربح الإجمالي' : 'Gross Profit'}
                    </div>
                    <div className="text-blue-400">${opportunity.profit}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Progress value={opportunity.confidence} className="w-20 h-2" />
                    <span className="text-gray-400 text-xs">
                      {lang === 'ar' ? 'مستوى الثقة' : 'Confidence Level'}
                    </span>
                  </div>
                  <Button
                    onClick={() => executeArbitrage(opportunity.id)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={autoExecute}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'تنفيذ الآن' : 'Execute Now'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Warning */}
      <Card className="bg-yellow-900/20 border-yellow-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <h3 className="text-yellow-300 font-medium mb-2">
                {lang === 'ar' ? 'تحذير المخاطر' : 'Risk Warning'}
              </h3>
              <p className="text-yellow-200 text-sm">
                {lang === 'ar' 
                  ? 'المراجحة متعددة السلاسل تحمل مخاطر عالية بما في ذلك فقدان رؤوس الأموال، تقلبات الأسعار، وفشل المعاملات. تأكد من فهم المخاطر قبل المتابعة.'
                  : 'Cross-chain arbitrage carries high risks including capital loss, price volatility, and transaction failures. Ensure you understand the risks before proceeding.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossChainArbitrage;
