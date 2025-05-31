
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Calculator,
  BarChart3,
  Activity,
  DollarSign,
  Percent,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

// Define interfaces locally since they're missing from the service
interface RiskMetrics {
  currentRisk: number;
  maxRisk: number;
  portfolioValue: number;
  dailyVaR: number;
  expectedReturn: number;
  sharpeRatio: number;
  correlation: number;
  volatility: number;
}

interface PositionSize {
  symbol: string;
  recommendedSize: number;
  maxSize: number;
  riskAmount: number;
  stopLoss: number;
  targetPrice: number;
}

interface RiskParameters {
  maxRiskPerTrade: number;
  portfolioRisk: number;
  stopLossPercent: number;
  takeProfitRatio: number;
  correlationLimit: number;
  volatilityThreshold: number;
}

interface RiskManagementProps {
  lang?: 'en' | 'ar';
}

const RiskManagement = ({ lang = 'ar' }: RiskManagementProps) => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    currentRisk: 2.5,
    maxRisk: 5.0,
    portfolioValue: 100000,
    dailyVaR: 2500,
    expectedReturn: 12.5,
    sharpeRatio: 1.8,
    correlation: 0.65,
    volatility: 18.5
  });

  const [positionSizes, setPositionSizes] = useState<PositionSize[]>([]);
  const [riskParams, setRiskParams] = useState<RiskParameters>({
    maxRiskPerTrade: 2,
    portfolioRisk: 5,
    stopLossPercent: 2,
    takeProfitRatio: 3,
    correlationLimit: 0.7,
    volatilityThreshold: 20
  });

  const [symbol, setSymbol] = useState('BTCUSD');
  const [entryPrice, setEntryPrice] = useState<number>(50000);
  const [portfolioValue, setPortfolioValue] = useState<number>(100000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRiskMetrics();
    calculatePositionSizes();
  }, [riskParams]);

  const loadRiskMetrics = () => {
    // محاكاة تحميل مقاييس المخاطر
    const mockMetrics: RiskMetrics = {
      currentRisk: Math.random() * 5,
      maxRisk: 5.0,
      portfolioValue: portfolioValue,
      dailyVaR: portfolioValue * 0.025,
      expectedReturn: 8 + Math.random() * 15,
      sharpeRatio: 1 + Math.random() * 2,
      correlation: Math.random() * 0.8,
      volatility: 10 + Math.random() * 20
    };
    
    setRiskMetrics(mockMetrics);
  };

  const calculatePositionSizes = () => {
    // محاكاة حساب أحجام المراكز
    const symbols = ['BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSD'];
    const positions: PositionSize[] = symbols.map(sym => {
      const price = 1000 + Math.random() * 49000;
      const riskAmount = portfolioValue * (riskParams.maxRiskPerTrade / 100);
      const stopLoss = price * (1 - riskParams.stopLossPercent / 100);
      const recommendedSize = riskAmount / (price - stopLoss);
      
      return {
        symbol: sym,
        recommendedSize: Math.floor(recommendedSize * 100) / 100,
        maxSize: recommendedSize * 1.5,
        riskAmount,
        stopLoss,
        targetPrice: price * (1 + (riskParams.stopLossPercent * riskParams.takeProfitRatio) / 100)
      };
    });
    
    setPositionSizes(positions);
  };

  const handleCalculatePosition = () => {
    setLoading(true);
    
    setTimeout(() => {
      const riskAmount = portfolioValue * (riskParams.maxRiskPerTrade / 100);
      const stopLoss = entryPrice * (1 - riskParams.stopLossPercent / 100);
      const recommendedSize = riskAmount / (entryPrice - stopLoss);
      
      const newPosition: PositionSize = {
        symbol,
        recommendedSize: Math.floor(recommendedSize * 100) / 100,
        maxSize: recommendedSize * 1.5,
        riskAmount,
        stopLoss,
        targetPrice: entryPrice * (1 + (riskParams.stopLossPercent * riskParams.takeProfitRatio) / 100)
      };
      
      setPositionSizes(prev => [newPosition, ...prev.filter(p => p.symbol !== symbol)]);
      setLoading(false);
    }, 1000);
  };

  const updateRiskParams = (field: keyof RiskParameters, value: number) => {
    setRiskParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRiskColor = (risk: number, max: number) => {
    const ratio = risk / max;
    if (ratio > 0.8) return 'text-red-400';
    if (ratio > 0.6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskLevel = (risk: number, max: number) => {
    const ratio = risk / max;
    if (ratio > 0.8) return { level: 'عالي', color: 'bg-red-500' };
    if (ratio > 0.6) return { level: 'متوسط', color: 'bg-yellow-500' };
    return { level: 'منخفض', color: 'bg-green-500' };
  };

  // بيانات للرسوم البيانية
  const riskDistributionData = [
    { name: 'مخاطر منخفضة', value: 40, color: '#22C55E' },
    { name: 'مخاطر متوسطة', value: 35, color: '#EAB308' },
    { name: 'مخاطر عالية', value: 25, color: '#EF4444' }
  ];

  const portfolioAllocationData = [
    { name: 'Bitcoin', value: 40, color: '#F7931A' },
    { name: 'Ethereum', value: 25, color: '#627EEA' },
    { name: 'Others', value: 20, color: '#8B5CF6' },
    { name: 'Cash', value: 15, color: '#10B981' }
  ];

  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    portfolio: 100000 + (Math.random() - 0.5) * 10000,
    risk: Math.random() * 5,
    benchmark: 100000 + (Math.random() - 0.5) * 8000
  }));

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'إدارة المخاطر' : 'Risk Management'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' ? 'نظام متقدم لإدارة وتقييم المخاطر المالية' : 'Advanced system for managing and assessing financial risks'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            نشط
          </Badge>
          <Button
            onClick={loadRiskMetrics}
            size="sm"
            className="bg-trading-primary hover:bg-blue-600"
          >
            <Activity className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* مقاييس المخاطر الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">المخاطر الحالية</p>
                <p className={cn("text-2xl font-bold", getRiskColor(riskMetrics.currentRisk, riskMetrics.maxRisk))}>
                  {riskMetrics.currentRisk.toFixed(1)}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getRiskLevel(riskMetrics.currentRisk, riskMetrics.maxRisk).color}`}
                  style={{ width: `${(riskMetrics.currentRisk / riskMetrics.maxRisk) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                الحد الأقصى: {riskMetrics.maxRisk}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">قيمة المحفظة</p>
                <p className="text-2xl font-bold text-white">
                  ${riskMetrics.portfolioValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-green-400">
                العائد المتوقع: {riskMetrics.expectedReturn.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">نسبة شارب</p>
                <p className="text-2xl font-bold text-white">
                  {riskMetrics.sharpeRatio.toFixed(2)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                التقلبات: {riskMetrics.volatility.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">VaR يومي</p>
                <p className="text-2xl font-bold text-red-400">
                  ${riskMetrics.dailyVaR.toLocaleString()}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                بثقة 95%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* توزيع المخاطر */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">توزيع المخاطر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* توزيع المحفظة */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">توزيع المحفظة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioAllocationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {portfolioAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* حاسبة حجم المركز */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            حاسبة حجم المركز
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="symbol" className="text-gray-300">الرمز</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger className="bg-trading-secondary border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTCUSD">BTCUSD</SelectItem>
                  <SelectItem value="ETHUSD">ETHUSD</SelectItem>
                  <SelectItem value="ADAUSD">ADAUSD</SelectItem>
                  <SelectItem value="DOTUSD">DOTUSD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="entryPrice" className="text-gray-300">سعر الدخول</Label>
              <Input
                id="entryPrice"
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="bg-trading-secondary border-gray-700"
              />
            </div>
            
            <div>
              <Label htmlFor="portfolioValue" className="text-gray-300">قيمة المحفظة</Label>
              <Input
                id="portfolioValue"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                className="bg-trading-secondary border-gray-700"
              />
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleCalculatePosition}
                disabled={loading}
                className="bg-trading-primary hover:bg-blue-600 w-full"
              >
                {loading ? 'جاري الحساب...' : 'احسب'}
              </Button>
            </div>
          </div>

          {/* نتائج حساب المركز */}
          {positionSizes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {positionSizes.slice(0, 4).map((position, index) => (
                <div key={index} className="p-4 bg-trading-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{position.symbol}</span>
                    <Target className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">حجم موصى:</span>
                      <span className="text-white">{position.recommendedSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">وقف الخسارة:</span>
                      <span className="text-red-400">${position.stopLoss.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">الهدف:</span>
                      <span className="text-green-400">${position.targetPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">مبلغ المخاطرة:</span>
                      <span className="text-yellow-400">${position.riskAmount.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* معايير المخاطر */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">معايير المخاطر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="maxRiskPerTrade" className="text-gray-300">
                الحد الأقصى للمخاطر لكل صفقة (%)
              </Label>
              <Input
                id="maxRiskPerTrade"
                type="number"
                value={riskParams.maxRiskPerTrade}
                onChange={(e) => updateRiskParams('maxRiskPerTrade', Number(e.target.value))}
                className="bg-trading-secondary border-gray-700 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="stopLossPercent" className="text-gray-300">
                نسبة وقف الخسارة (%)
              </Label>
              <Input
                id="stopLossPercent"
                type="number"
                value={riskParams.stopLossPercent}
                onChange={(e) => updateRiskParams('stopLossPercent', Number(e.target.value))}
                className="bg-trading-secondary border-gray-700 mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="takeProfitRatio" className="text-gray-300">
                نسبة جني الأرباح
              </Label>
              <Input
                id="takeProfitRatio"
                type="number"
                value={riskParams.takeProfitRatio}
                onChange={(e) => updateRiskParams('takeProfitRatio', Number(e.target.value))}
                className="bg-trading-secondary border-gray-700 mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أداء المحفظة */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">أداء المحفظة مقابل المؤشر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke="#22C55E" 
                  strokeWidth={2}
                  name="المحفظة"
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#EAB308" 
                  strokeWidth={2}
                  name="المؤشر"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagement;
