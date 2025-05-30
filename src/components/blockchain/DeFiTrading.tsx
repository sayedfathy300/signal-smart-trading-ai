
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  TrendingUp, 
  Wallet, 
  ArrowUpDown, 
  Zap,
  Shield,
  DollarSign,
  Percent,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Target,
  PieChart
} from 'lucide-react';

interface DeFiTradingProps {
  lang?: 'en' | 'ar';
}

const DeFiTrading = ({ lang = 'ar' }: DeFiTradingProps) => {
  const [selectedProtocol, setSelectedProtocol] = useState('uniswap');
  const [swapAmount, setSwapAmount] = useState('');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);

  // بيانات بروتوكولات DeFi
  const defiProtocols = [
    {
      id: 'uniswap',
      name: 'Uniswap V3',
      logo: '/api/placeholder/40/40',
      tvl: '4.2B',
      apy: 12.5,
      fees: 0.3,
      chains: ['Ethereum', 'Polygon', 'Arbitrum'],
      status: 'active'
    },
    {
      id: 'compound',
      name: 'Compound',
      logo: '/api/placeholder/40/40',
      tvl: '2.8B',
      apy: 8.7,
      fees: 0.1,
      chains: ['Ethereum'],
      status: 'active'
    },
    {
      id: 'aave',
      name: 'Aave',
      logo: '/api/placeholder/40/40',
      tvl: '6.1B',
      apy: 15.2,
      fees: 0.25,
      chains: ['Ethereum', 'Polygon', 'Avalanche'],
      status: 'active'
    },
    {
      id: 'sushiswap',
      name: 'SushiSwap',
      logo: '/api/placeholder/40/40',
      tvl: '1.5B',
      apy: 18.9,
      fees: 0.3,
      chains: ['Ethereum', 'Polygon', 'BSC'],
      status: 'maintenance'
    }
  ];

  // مجمعات السيولة
  const liquidityPools = [
    {
      id: '1',
      name: 'ETH/USDC',
      protocol: 'Uniswap V3',
      apy: 24.5,
      tvl: '890M',
      volume24h: '156M',
      fees24h: '45K',
      risk: 'Medium',
      myLiquidity: '5,240',
      rewards: ['UNI', 'COMP']
    },
    {
      id: '2',
      name: 'WBTC/ETH',
      protocol: 'SushiSwap',
      apy: 31.2,
      tvl: '340M',
      volume24h: '87M',
      fees24h: '26K',
      risk: 'High',
      myLiquidity: '2,890',
      rewards: ['SUSHI']
    },
    {
      id: '3',
      name: 'USDC/USDT',
      protocol: 'Curve',
      apy: 8.7,
      tvl: '1.2B',
      volume24h: '234M',
      fees24h: '18K',
      risk: 'Low',
      myLiquidity: '12,450',
      rewards: ['CRV', 'CVX']
    }
  ];

  // استراتيجيات Yield Farming
  const yieldStrategies = [
    {
      id: '1',
      name: lang === 'ar' ? 'استراتيجية العائد الآمن' : 'Safe Yield Strategy',
      apy: 12.5,
      risk: 'Low',
      protocols: ['Compound', 'Aave'],
      allocation: { usdc: 60, dai: 30, usdt: 10 },
      tvl: '2.5M',
      active: true
    },
    {
      id: '2',
      name: lang === 'ar' ? 'استراتيجية العائد المتوازن' : 'Balanced Yield Strategy',
      apy: 28.7,
      risk: 'Medium',
      protocols: ['Uniswap', 'SushiSwap'],
      allocation: { eth: 40, btc: 30, alts: 30 },
      tvl: '1.8M',
      active: true
    },
    {
      id: '3',
      name: lang === 'ar' ? 'استراتيجية العائد العالي' : 'High Yield Strategy',
      apy: 45.3,
      risk: 'High',
      protocols: ['PancakeSwap', 'TraderJoe'],
      allocation: { defi: 50, gaming: 25, nft: 25 },
      tvl: '950K',
      active: false
    }
  ];

  // محاكاة تبديل الرموز
  const handleSwapTokens = async () => {
    setIsLoading(true);
    try {
      // محاكاة API call لتبديل الرموز
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Swapping ${swapAmount} ${fromToken} for ${toToken}`);
    } catch (error) {
      console.error('Swap failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // محاكاة الاتصال بالمحفظة
  const connectWallet = async () => {
    try {
      // محاكاة اتصال Web3
      setWalletConnected(true);
      console.log('Wallet connected');
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
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

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      {!walletConnected && (
        <Card className="bg-yellow-900/20 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <h3 className="text-yellow-300 font-medium">
                    {lang === 'ar' ? 'يرجى توصيل المحفظة' : 'Please Connect Wallet'}
                  </h3>
                  <p className="text-yellow-200 text-sm">
                    {lang === 'ar' 
                      ? 'تحتاج إلى توصيل محفظة Web3 للتداول'
                      : 'You need to connect a Web3 wallet to trade'}
                  </p>
                </div>
              </div>
              <Button onClick={connectWallet} className="bg-yellow-600 hover:bg-yellow-700">
                <Wallet className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'توصيل المحفظة' : 'Connect Wallet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="swap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="swap">
            {lang === 'ar' ? 'التبديل' : 'Swap'}
          </TabsTrigger>
          <TabsTrigger value="liquidity">
            {lang === 'ar' ? 'السيولة' : 'Liquidity'}
          </TabsTrigger>
          <TabsTrigger value="yield">
            {lang === 'ar' ? 'Yield Farming' : 'Yield Farming'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {lang === 'ar' ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        {/* Token Swap */}
        <TabsContent value="swap" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Swap Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5 text-blue-400" />
                    {lang === 'ar' ? 'تبديل الرموز المميزة' : 'Token Swap'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* From Token */}
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'من' : 'From'}
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-trading-secondary rounded-lg">
                      <select 
                        value={fromToken}
                        onChange={(e) => setFromToken(e.target.value)}
                        className="bg-transparent text-white border-none outline-none"
                      >
                        <option value="ETH">ETH</option>
                        <option value="WBTC">WBTC</option>
                        <option value="USDC">USDC</option>
                        <option value="USDT">USDT</option>
                      </select>
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        className="bg-transparent border-none text-right text-white text-lg"
                      />
                    </div>
                    <div className="text-gray-400 text-sm text-right">
                      {lang === 'ar' ? 'الرصيد:' : 'Balance:'} 2.459 {fromToken}
                    </div>
                  </div>

                  {/* Swap Arrow */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const temp = fromToken;
                        setFromToken(toToken);
                        setToToken(temp);
                      }}
                      className="rounded-full bg-trading-secondary hover:bg-gray-700"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* To Token */}
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'إلى' : 'To'}
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-trading-secondary rounded-lg">
                      <select 
                        value={toToken}
                        onChange={(e) => setToToken(e.target.value)}
                        className="bg-transparent text-white border-none outline-none"
                      >
                        <option value="USDC">USDC</option>
                        <option value="ETH">ETH</option>
                        <option value="WBTC">WBTC</option>
                        <option value="USDT">USDT</option>
                      </select>
                      <div className="flex-1 text-right text-white text-lg">
                        {swapAmount ? (parseFloat(swapAmount) * 2650).toFixed(2) : '0.0'}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm text-right">
                      {lang === 'ar' ? 'الرصيد:' : 'Balance:'} 15,240 {toToken}
                    </div>
                  </div>

                  {/* Swap Details */}
                  {swapAmount && (
                    <div className="p-3 bg-trading-secondary rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'معدل التبديل' : 'Exchange Rate'}
                        </span>
                        <span className="text-white">1 {fromToken} = 2,650 {toToken}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'رسوم الشبكة' : 'Network Fee'}
                        </span>
                        <span className="text-white">~$12.50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'انزلاق السعر' : 'Price Slippage'}
                        </span>
                        <span className="text-green-400">0.1%</span>
                      </div>
                    </div>
                  )}

                  {/* Swap Button */}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleSwapTokens}
                    disabled={!swapAmount || !walletConnected || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {lang === 'ar' ? 'جاري التبديل...' : 'Swapping...'}
                      </>
                    ) : (
                      <>
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        {lang === 'ar' ? 'تبديل' : 'Swap'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* DeFi Protocols */}
            <div>
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    {lang === 'ar' ? 'بروتوكولات DeFi' : 'DeFi Protocols'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {defiProtocols.map((protocol) => (
                    <div 
                      key={protocol.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedProtocol === protocol.id 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedProtocol(protocol.id)}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={protocol.logo} 
                          alt={protocol.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium text-sm">
                              {protocol.name}
                            </span>
                            {protocol.status === 'active' ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-gray-400 text-xs">
                            TVL: ${protocol.tvl} • APY: {protocol.apy}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Liquidity Pools */}
        <TabsContent value="liquidity" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {liquidityPools.map((pool) => (
              <Card key={pool.id} className="bg-trading-card border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{pool.name}</h3>
                      <p className="text-gray-400 text-sm">{pool.protocol}</p>
                    </div>
                    <Badge className={getRiskBadge(pool.risk)}>
                      {pool.risk} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-green-400 text-lg font-bold">{pool.apy}%</div>
                      <div className="text-gray-400 text-xs">APY</div>
                    </div>
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-blue-400 text-lg font-bold">${pool.tvl}</div>
                      <div className="text-gray-400 text-xs">TVL</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'حجم 24 ساعة' : '24h Volume'}
                      </span>
                      <span className="text-white">${pool.volume24h}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'رسوم 24 ساعة' : '24h Fees'}
                      </span>
                      <span className="text-green-400">${pool.fees24h}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'سيولتي' : 'My Liquidity'}
                      </span>
                      <span className="text-white">${pool.myLiquidity}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {pool.rewards.map((reward) => (
                      <Badge key={reward} variant="secondary" className="text-xs">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600">
                      {lang === 'ar' ? 'إضافة سيولة' : 'Add Liquidity'}
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600">
                      {lang === 'ar' ? 'إزالة سيولة' : 'Remove Liquidity'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Yield Farming */}
        <TabsContent value="yield" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {yieldStrategies.map((strategy) => (
              <Card key={strategy.id} className="bg-trading-card border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">{strategy.name}</h3>
                    <Badge className={`${strategy.active ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-gray-900/30 border-gray-700 text-gray-300'}`}>
                      {strategy.active ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'متوقف' : 'Inactive')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-green-400 text-xl font-bold">{strategy.apy}%</div>
                      <div className="text-gray-400 text-xs">APY</div>
                    </div>
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className={`text-lg font-bold ${getRiskColor(strategy.risk)}`}>
                        {strategy.risk}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {lang === 'ar' ? 'المخاطر' : 'Risk'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">TVL</span>
                      <span className="text-white">${strategy.tvl}</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'البروتوكولات:' : 'Protocols:'} {strategy.protocols.join(', ')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'التوزيع:' : 'Allocation:'}
                    </h4>
                    {Object.entries(strategy.allocation).map(([asset, percentage]) => (
                      <div key={asset} className="flex items-center gap-2">
                        <span className="text-white text-sm uppercase w-12">{asset}</span>
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-gray-400 text-sm w-8">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${strategy.active 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {strategy.active 
                      ? (lang === 'ar' ? 'إيقاف' : 'Stop')
                      : (lang === 'ar' ? 'تشغيل' : 'Start')
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* DeFi Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">$45,672</div>
                    <div className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'إجمالي القيمة' : 'Total Value'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Percent className="h-8 w-8 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">18.7%</div>
                    <div className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'متوسط APY' : 'Average APY'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">+$2,340</div>
                    <div className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'أرباح الشهر' : 'Monthly Yield'}
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
                    <div className="text-2xl font-bold text-white">7</div>
                    <div className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'البروتوكولات النشطة' : 'Active Protocols'}
                    </div>
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

export default DeFiTrading;
