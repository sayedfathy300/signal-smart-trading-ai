import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, TrendingDown, AlertTriangle, Target, BarChart3, DollarSign, Percent, Calculator } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { riskManagementService } from '@/services/riskManagementService';

interface RiskManagementProps {
  lang: 'en' | 'ar';
}

interface RiskProfile {
  name: string;
  description: string;
  riskTolerance: 'low' | 'medium' | 'high';
  capitalAllocation: number;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
}

const RiskManagement = ({ lang }: RiskManagementProps) => {
  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>([
    {
      name: 'محافظ',
      description: 'استراتيجية منخفضة المخاطر مع التركيز على الحفاظ على رأس المال.',
      riskTolerance: 'low',
      capitalAllocation: 0.1,
      stopLoss: 0.02,
      takeProfit: 0.05,
      leverage: 1
    },
    {
      name: 'متوازن',
      description: 'استراتيجية متوسطة المخاطر تهدف إلى تحقيق نمو معتدل.',
      riskTolerance: 'medium',
      capitalAllocation: 0.25,
      stopLoss: 0.05,
      takeProfit: 0.10,
      leverage: 2
    },
    {
      name: 'مغامر',
      description: 'استراتيجية عالية المخاطر تسعى إلى تحقيق أقصى قدر من العائدات.',
      riskTolerance: 'high',
      capitalAllocation: 0.5,
      stopLoss: 0.10,
      takeProfit: 0.20,
      leverage: 3
    }
  ]);
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile>(riskProfiles[0]);
  const [capital, setCapital] = useState(10000);
  const [riskPercentage, setRiskPercentage] = useState(2);
  const [positionSize, setPositionSize] = useState(0);
  const [stopLossPips, setStopLossPips] = useState(50);
  const [leverage, setLeverage] = useState(1);
  const [maxDrawdown, setMaxDrawdown] = useState(5);
  const [riskRewardRatio, setRiskRewardRatio] = useState(2);
  const [kellyCriterion, setKellyCriterion] = useState(0);
  const [monteCarloResults, setMonteCarloResults] = useState<any[]>([]);
  const [stressTestResults, setStressTestResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    calculatePositionSize();
    calculateKellyCriterion();
  }, [capital, riskPercentage, stopLossPips, leverage]);

  const calculatePositionSize = () => {
    const riskAmount = capital * (riskPercentage / 100);
    const pipValue = riskAmount / stopLossPips;
    setPositionSize(pipValue * leverage);
  };

  const calculateKellyCriterion = () => {
    const winProbability = 0.5;
    const winLossRatio = riskRewardRatio;
    const kelly = winProbability - ((1 - winProbability) / winLossRatio);
    setKellyCriterion(kelly * 100);
  };

  const runMonteCarloSimulation = () => {
    const numSimulations = 1000;
    const initialCapital = capital;
    const winProbability = 0.6;
    const averageWin = riskRewardRatio * stopLossPips;
    const averageLoss = -stopLossPips;
    const results = [];

    for (let i = 0; i < numSimulations; i++) {
      let currentCapital = initialCapital;
      const trades = [];
      for (let j = 0; j < 100; j++) {
        const tradeResult = Math.random() < winProbability ? averageWin : averageLoss;
        currentCapital += (tradeResult / 100) * currentCapital;
        trades.push(currentCapital);
      }
      results.push({ id: i, trades });
    }

    setMonteCarloResults(results);
  };

  const runStressTest = () => {
    const scenarios = [
      { name: 'الركود الاقتصادي', impact: -0.2 },
      { name: 'حدث البجعة السوداء', impact: -0.5 },
      { name: 'التضخم المفاجئ', impact: -0.1 }
    ];

    const results = scenarios.map(scenario => {
      const finalCapital = capital * (1 + scenario.impact);
      return {
        name: scenario.name,
        finalCapital
      };
    });

    setStressTestResults(results);
  };

  const drawdownData = [
    { name: 'Jan', drawdown: 2.5 },
    { name: 'Feb', drawdown: 1.8 },
    { name: 'Mar', drawdown: 3.2 },
    { name: 'Apr', drawdown: 1.5 },
    { name: 'May', drawdown: 2.8 },
    { name: 'Jun', drawdown: 0.9 }
  ];

  const riskMetricsData = [
    { name: 'Sharpe Ratio', value: 1.2 },
    { name: 'Sortino Ratio', value: 1.5 },
    { name: 'Max Drawdown', value: maxDrawdown },
    { name: 'Win Rate', value: 60 }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {lang === 'ar' ? 'إدارة المخاطر' : 'Risk Management'}
            </h1>
            <p className="text-gray-300">
              {lang === 'ar' ? 'أدوات متقدمة لإدارة المخاطر وحماية رأس المال' : 'Advanced tools for managing risk and protecting capital'}
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedProfile.name} onValueChange={(value) => {
              const profile = riskProfiles.find(p => p.name === value);
              if (profile) {
                setSelectedProfile(profile);
              }
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={lang === 'ar' ? 'اختر ملف المخاطر' : 'Select Risk Profile'} />
              </SelectTrigger>
              <SelectContent>
                {riskProfiles.map(profile => (
                  <SelectItem key={profile.name} value={profile.name}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="text-white border-white/20">
              <Calculator className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تحديث' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Risk Profile Description */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {lang === 'ar' ? 'ملف المخاطر المحدد' : 'Selected Risk Profile'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {selectedProfile.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">{lang === 'ar' ? 'تحمل المخاطر:' : 'Risk Tolerance:'}</Label>
                <p className="text-white">{selectedProfile.riskTolerance}</p>
              </div>
              <div>
                <Label className="text-gray-300">{lang === 'ar' ? 'تخصيص رأس المال:' : 'Capital Allocation:'}</Label>
                <p className="text-white">{(selectedProfile.capitalAllocation * 100).toFixed(1)}%</p>
              </div>
              <div>
                <Label className="text-gray-300">{lang === 'ar' ? 'وقف الخسارة:' : 'Stop Loss:'}</Label>
                <p className="text-white">{(selectedProfile.stopLoss * 100).toFixed(1)}%</p>
              </div>
              <div>
                <Label className="text-gray-300">{lang === 'ar' ? 'جني الأرباح:' : 'Take Profit:'}</Label>
                <p className="text-white">{(selectedProfile.takeProfit * 100).toFixed(1)}%</p>
              </div>
              <div>
                <Label className="text-gray-300">{lang === 'ar' ? 'الرافعة المالية:' : 'Leverage:'}</Label>
                <p className="text-white">{selectedProfile.leverage}x</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="overview" className="text-white">
              {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="positioning" className="text-white">
              {lang === 'ar' ? 'حجم المركز' : 'Positioning'}
            </TabsTrigger>
            <TabsTrigger value="simulation" className="text-white">
              {lang === 'ar' ? 'المحاكاة' : 'Simulation'}
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-white">
              {lang === 'ar' ? 'المقاييس' : 'Metrics'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    {lang === 'ar' ? 'اتجاهات السحب' : 'Drawdown Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={drawdownData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="drawdown" stroke="#ff6b6b" strokeWidth={2} name="Drawdown" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {lang === 'ar' ? 'مقاييس المخاطر' : 'Risk Metrics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={riskMetricsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" name="Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Positioning Tab */}
          <TabsContent value="positioning">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {lang === 'ar' ? 'حساب حجم المركز' : 'Position Size Calculation'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'حساب حجم المركز بناءً على تحمل المخاطر' : 'Calculate position size based on risk tolerance'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capital" className="text-gray-300">
                      {lang === 'ar' ? 'رأس المال:' : 'Capital:'}
                    </Label>
                    <Input
                      id="capital"
                      type="number"
                      value={capital}
                      onChange={(e) => setCapital(parseFloat(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="riskPercentage" className="text-gray-300">
                      {lang === 'ar' ? 'نسبة المخاطرة (%):' : 'Risk Percentage (%):'}
                    </Label>
                    <Input
                      id="riskPercentage"
                      type="number"
                      value={riskPercentage}
                      onChange={(e) => setRiskPercentage(parseFloat(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stopLossPips" className="text-gray-300">
                      {lang === 'ar' ? 'وقف الخسارة (نقطة):' : 'Stop Loss (Pips):'}
                    </Label>
                    <Input
                      id="stopLossPips"
                      type="number"
                      value={stopLossPips}
                      onChange={(e) => setStopLossPips(parseFloat(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leverage" className="text-gray-300">
                      {lang === 'ar' ? 'الرافعة المالية:' : 'Leverage:'}
                    </Label>
                    <Input
                      id="leverage"
                      type="number"
                      value={leverage}
                      onChange={(e) => setLeverage(parseFloat(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'حجم المركز المحسوب:' : 'Calculated Position Size:'}
                  </Label>
                  <p className="text-white">
                    {positionSize.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-300">
                    {lang === 'ar' ? 'معيار كيلي:' : 'Kelly Criterion:'}
                  </Label>
                  <p className="text-white">
                    {kellyCriterion.toFixed(2)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {lang === 'ar' ? 'محاكاة المخاطر' : 'Risk Simulation'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'تشغيل محاكاة مونت كارلو واختبارات الضغط' : 'Run Monte Carlo simulation and stress tests'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={runMonteCarloSimulation} className="bg-blue-600 hover:bg-blue-700">
                    {lang === 'ar' ? 'تشغيل مونت كارلو' : 'Run Monte Carlo'}
                  </Button>
                  <Button onClick={runStressTest} className="bg-red-600 hover:bg-red-700">
                    {lang === 'ar' ? 'تشغيل اختبار الضغط' : 'Run Stress Test'}
                  </Button>
                </div>

                {monteCarloResults.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">{lang === 'ar' ? 'نتائج مونت كارلو:' : 'Monte Carlo Results:'}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        {monteCarloResults.slice(0, 5).map(result => (
                          <Line key={result.id} data={result.trades} strokeWidth={1} stroke="#4ecdc4" name={`Simulation ${result.id}`} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {stressTestResults.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">{lang === 'ar' ? 'نتائج اختبار الضغط:' : 'Stress Test Results:'}</h4>
                    <div className="space-y-2">
                      {stressTestResults.map((result, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg">
                          <p className="text-white">{result.name}: {result.finalCapital.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    {lang === 'ar' ? 'توزيع المخاطر' : 'Risk Allocation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'BTC', value: 40 },
                          { name: 'ETH', value: 30 },
                          { name: 'Stocks', value: 20 },
                          { name: 'Cash', value: 10 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1, 2, 3].map((index) => (
                          <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {lang === 'ar' ? 'التعرض لرأس المال' : 'Capital Exposure'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{lang === 'ar' ? 'رأس المال المستخدم:' : 'Capital at Risk:'}</span>
                      <span className="text-white font-bold">{(capital * (riskPercentage / 100)).toFixed(2)}</span>
                    </div>
                    <Progress value={riskPercentage} className="h-2" />
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' ? 'الحد الأقصى للسحب:' : 'Max Drawdown:'} {maxDrawdown}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RiskManagement;
