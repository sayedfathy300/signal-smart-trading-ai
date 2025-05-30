
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Eye, Target, Zap, Activity, Search, Filter, AlertTriangle } from 'lucide-react';

interface PatternData {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timestamp: number;
  price: number;
  volume: number;
  significance: 'high' | 'medium' | 'low';
  description: string;
  historicalAccuracy: number;
  targetPrice: number;
  stopLoss: number;
}

interface PatternRecognitionUIProps {
  lang: 'en' | 'ar';
  data?: any[];
}

const PatternRecognitionUI: React.FC<PatternRecognitionUIProps> = ({ lang, data = [] }) => {
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [confidenceFilter, setConfidenceFilter] = useState<number>(50);
  const [isScanning, setIsScanning] = useState(false);

  // Pattern types configuration
  const patternTypes = [
    { id: 'head_shoulders', name: lang === 'ar' ? 'الرأس والكتفين' : 'Head & Shoulders', type: 'bearish' },
    { id: 'inverse_head_shoulders', name: lang === 'ar' ? 'الرأس والكتفين المقلوب' : 'Inverse Head & Shoulders', type: 'bullish' },
    { id: 'double_top', name: lang === 'ar' ? 'القمة المزدوجة' : 'Double Top', type: 'bearish' },
    { id: 'double_bottom', name: lang === 'ar' ? 'القاع المزدوج' : 'Double Bottom', type: 'bullish' },
    { id: 'triangle_ascending', name: lang === 'ar' ? 'المثلث الصاعد' : 'Ascending Triangle', type: 'bullish' },
    { id: 'triangle_descending', name: lang === 'ar' ? 'المثلث الهابط' : 'Descending Triangle', type: 'bearish' },
    { id: 'triangle_symmetrical', name: lang === 'ar' ? 'المثلث المتماثل' : 'Symmetrical Triangle', type: 'neutral' },
    { id: 'wedge_rising', name: lang === 'ar' ? 'الإسفين الصاعد' : 'Rising Wedge', type: 'bearish' },
    { id: 'wedge_falling', name: lang === 'ar' ? 'الإسفين الهابط' : 'Falling Wedge', type: 'bullish' },
    { id: 'flag_bull', name: lang === 'ar' ? 'العلم الصاعد' : 'Bull Flag', type: 'bullish' },
    { id: 'flag_bear', name: lang === 'ar' ? 'العلم الهابط' : 'Bear Flag', type: 'bearish' },
    { id: 'pennant', name: lang === 'ar' ? 'الراية' : 'Pennant', type: 'neutral' },
    { id: 'cup_handle', name: lang === 'ar' ? 'الكوب والمقبض' : 'Cup & Handle', type: 'bullish' },
    { id: 'rounding_bottom', name: lang === 'ar' ? 'القاع المدور' : 'Rounding Bottom', type: 'bullish' },
    { id: 'diamond', name: lang === 'ar' ? 'الماس' : 'Diamond', type: 'neutral' }
  ];

  // Generate mock pattern data
  const detectedPatterns: PatternData[] = useMemo(() => {
    return patternTypes.map((pattern, index) => ({
      id: `pattern_${index}`,
      name: pattern.name,
      type: pattern.type as 'bullish' | 'bearish' | 'neutral',
      confidence: Math.floor(Math.random() * 40) + 60,
      timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 7),
      price: 45000 + Math.random() * 5000,
      volume: Math.floor(Math.random() * 1000000) + 500000,
      significance: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      description: `${pattern.name} pattern detected with ${pattern.type} bias`,
      historicalAccuracy: Math.floor(Math.random() * 20) + 70,
      targetPrice: 45000 + Math.random() * 5000,
      stopLoss: 45000 - Math.random() * 2000
    }));
  }, [patternTypes]);

  // Filter patterns based on selections
  const filteredPatterns = useMemo(() => {
    return detectedPatterns.filter(pattern => {
      if (selectedPattern !== 'all' && pattern.type !== selectedPattern) return false;
      if (pattern.confidence < confidenceFilter) return false;
      return true;
    });
  }, [detectedPatterns, selectedPattern, confidenceFilter]);

  // Pattern statistics
  const patternStats = useMemo(() => {
    const total = filteredPatterns.length;
    const bullish = filteredPatterns.filter(p => p.type === 'bullish').length;
    const bearish = filteredPatterns.filter(p => p.type === 'bearish').length;
    const neutral = filteredPatterns.filter(p => p.type === 'neutral').length;
    const highConfidence = filteredPatterns.filter(p => p.confidence >= 80).length;
    const avgConfidence = filteredPatterns.reduce((sum, p) => sum + p.confidence, 0) / total;

    return {
      total,
      bullish,
      bearish,
      neutral,
      highConfidence,
      avgConfidence: Math.round(avgConfidence)
    };
  }, [filteredPatterns]);

  // Pattern performance data
  const performanceData = useMemo(() => {
    return patternTypes.map(pattern => {
      const patternData = filteredPatterns.filter(p => p.name === pattern.name);
      const avgAccuracy = patternData.length > 0 
        ? patternData.reduce((sum, p) => sum + p.historicalAccuracy, 0) / patternData.length 
        : 0;
      
      return {
        name: pattern.name,
        accuracy: Math.round(avgAccuracy),
        count: patternData.length,
        type: pattern.type
      };
    });
  }, [filteredPatterns, patternTypes]);

  // Confidence distribution data
  const confidenceDistribution = useMemo(() => {
    const ranges = [
      { range: '50-60', min: 50, max: 60 },
      { range: '60-70', min: 60, max: 70 },
      { range: '70-80', min: 70, max: 80 },
      { range: '80-90', min: 80, max: 90 },
      { range: '90-100', min: 90, max: 100 }
    ];

    return ranges.map(range => ({
      range: range.range,
      count: filteredPatterns.filter(p => p.confidence >= range.min && p.confidence < range.max).length
    }));
  }, [filteredPatterns]);

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getPatternBadgeColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'bg-green-600';
      case 'bearish': return 'bg-red-600';
      case 'neutral': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const startPatternScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'نظام التعرف على الأنماط المتقدم' : 'Advanced Pattern Recognition System'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Select value={selectedPattern} onValueChange={setSelectedPattern}>
              <SelectTrigger>
                <SelectValue placeholder={lang === 'ar' ? 'نوع النمط' : 'Pattern Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === 'ar' ? 'جميع الأنماط' : 'All Patterns'}</SelectItem>
                <SelectItem value="bullish">{lang === 'ar' ? 'صاعد' : 'Bullish'}</SelectItem>
                <SelectItem value="bearish">{lang === 'ar' ? 'هابط' : 'Bearish'}</SelectItem>
                <SelectItem value="neutral">{lang === 'ar' ? 'محايد' : 'Neutral'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1M</SelectItem>
                <SelectItem value="5m">5M</SelectItem>
                <SelectItem value="15m">15M</SelectItem>
                <SelectItem value="1h">1H</SelectItem>
                <SelectItem value="4h">4H</SelectItem>
                <SelectItem value="1d">1D</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1">
                {lang === 'ar' ? 'الحد الأدنى للثقة' : 'Min Confidence'}: {confidenceFilter}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <Button 
              onClick={startPatternScan}
              disabled={isScanning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {lang === 'ar' ? 'يتم المسح...' : 'Scanning...'}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'مسح الأنماط' : 'Scan Patterns'}
                </>
              )}
            </Button>

            <Button variant="outline" className="border-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تصفية متقدمة' : 'Advanced Filter'}
            </Button>
          </div>

          {/* Pattern Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-white">{patternStats.total}</div>
              <div className="text-xs text-gray-400">{lang === 'ar' ? 'مجموع الأنماط' : 'Total Patterns'}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-green-400">{patternStats.bullish}</div>
              <div className="text-xs text-gray-400">{lang === 'ar' ? 'صاعد' : 'Bullish'}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-red-400">{patternStats.bearish}</div>
              <div className="text-xs text-gray-400">{lang === 'ar' ? 'هابط' : 'Bearish'}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-yellow-400">{patternStats.neutral}</div>
              <div className="text-xs text-gray-400">{lang === 'ar' ? 'محايد' : 'Neutral'}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-400">{patternStats.highConfidence}</div>
              <div className="text-xs text-gray-400">{lang === 'ar' ? 'ثقة عالية' : 'High Confidence'}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-purple-400">{patternStats.avgConfidence}%</div>
              <div className="text-xs text-gray-400">{lang === 'ar' ? 'متوسط الثقة' : 'Avg Confidence'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pattern Analysis Tabs */}
      <Tabs defaultValue="detected" className="space-y-4">
        <TabsList className="grid grid-cols-4 bg-trading-card">
          <TabsTrigger value="detected">{lang === 'ar' ? 'الأنماط المكتشفة' : 'Detected Patterns'}</TabsTrigger>
          <TabsTrigger value="performance">{lang === 'ar' ? 'الأداء' : 'Performance'}</TabsTrigger>
          <TabsTrigger value="analysis">{lang === 'ar' ? 'التحليل' : 'Analysis'}</TabsTrigger>
          <TabsTrigger value="alerts">{lang === 'ar' ? 'التنبيهات' : 'Alerts'}</TabsTrigger>
        </TabsList>

        <TabsContent value="detected">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPatterns.map((pattern) => (
              <Card key={pattern.id} className="bg-trading-card border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-white">{pattern.name}</CardTitle>
                    <Badge className={`${getPatternBadgeColor(pattern.type)} text-white text-xs`}>
                      {pattern.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{lang === 'ar' ? 'الثقة' : 'Confidence'}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={pattern.confidence} className="w-16 h-2" />
                      <span className="text-white text-sm font-medium">{pattern.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{lang === 'ar' ? 'السعر' : 'Price'}</span>
                    <span className="text-white font-medium">${pattern.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{lang === 'ar' ? 'الأهمية' : 'Significance'}</span>
                    <span className={`text-sm font-medium ${getSignificanceColor(pattern.significance)}`}>
                      {pattern.significance.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{lang === 'ar' ? 'الدقة التاريخية' : 'Historical Accuracy'}</span>
                    <span className="text-green-400 font-medium">{pattern.historicalAccuracy}%</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{lang === 'ar' ? 'الهدف' : 'Target'}</span>
                      <span className="text-green-400">${pattern.targetPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-gray-400">{lang === 'ar' ? 'وقف الخسارة' : 'Stop Loss'}</span>
                      <span className="text-red-400">${pattern.stopLoss.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Target className="h-3 w-3 mr-1" />
                    {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'أداء الأنماط التاريخي' : 'Historical Pattern Performance'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="count" 
                      stroke="#9CA3AF"
                      label={{ value: lang === 'ar' ? 'عدد الحدوث' : 'Occurrence Count', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      dataKey="accuracy" 
                      stroke="#9CA3AF"
                      label={{ value: lang === 'ar' ? 'الدقة %' : 'Accuracy %', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                      formatter={(value, name, props) => [
                        `${value}${name === 'accuracy' ? '%' : ''}`,
                        name === 'accuracy' ? (lang === 'ar' ? 'الدقة' : 'Accuracy') : 
                        name === 'count' ? (lang === 'ar' ? 'العدد' : 'Count') : name
                      ]}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.name || label}
                    />
                    <Scatter dataKey="accuracy" fill="#3B82F6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{lang === 'ar' ? 'توزيع الثقة' : 'Confidence Distribution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {confidenceDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-400">{item.range}%</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <Progress value={(item.count / patternStats.total) * 100} className="flex-1" />
                        <span className="text-white text-sm font-medium w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{lang === 'ar' ? 'تحليل السوق الحالي' : 'Current Market Analysis'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-medium">
                      {lang === 'ar' ? 'إشارة صاعدة قوية' : 'Strong Bullish Signal'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' 
                      ? 'تم اكتشاف عدة أنماط صاعدة عالية الثقة'
                      : 'Multiple high-confidence bullish patterns detected'}
                  </p>
                </div>

                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">
                      {lang === 'ar' ? 'انتباه: تضارب في الإشارات' : 'Attention: Signal Conflict'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' 
                      ? 'يوجد أنماط متضاربة في الأطر الزمنية المختلفة'
                      : 'Conflicting patterns detected across timeframes'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">68%</div>
                    <div className="text-xs text-gray-400">{lang === 'ar' ? 'موثوقية' : 'Reliability'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">85%</div>
                    <div className="text-xs text-gray-400">{lang === 'ar' ? 'قوة الإشارة' : 'Signal Strength'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">12</div>
                    <div className="text-xs text-gray-400">{lang === 'ar' ? 'أنماط نشطة' : 'Active Patterns'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'تنبيهات الأنماط' : 'Pattern Alerts'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPatterns.filter(p => p.confidence >= 80).slice(0, 8).map((pattern) => (
                  <div key={pattern.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className={`h-5 w-5 ${getPatternColor(pattern.type)}`} />
                        <div>
                          <h4 className="text-white font-medium">{pattern.name}</h4>
                          <p className="text-gray-400 text-sm">{pattern.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getPatternBadgeColor(pattern.type)} text-white mb-1`}>
                          {pattern.confidence}%
                        </Badge>
                        <div className="text-xs text-gray-400">
                          {new Date(pattern.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatternRecognitionUI;
