
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { smartRecommendationsService, ShapExplanation } from '@/services/smartRecommendationsService';
import { Brain, BarChart3, Target, TrendingUp, TrendingDown, HelpCircle, RefreshCw } from 'lucide-react';

interface ShapExplanationsProps {
  symbol?: string;
  lang?: 'en' | 'ar';
}

export const ShapExplanations: React.FC<ShapExplanationsProps> = ({ 
  symbol = 'BTCUSD',
  lang = 'ar' 
}) => {
  const [shapData, setShapData] = useState<ShapExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    loadShapExplanation();
  }, [symbol]);

  const loadShapExplanation = async () => {
    setLoading(true);
    try {
      const data = await smartRecommendationsService.generateShapExplanation(symbol);
      setShapData(data);
      if (data.shapValues.length > 0) {
        setSelectedFeature(data.shapValues[0].feature);
      }
    } catch (error) {
      console.error('Error loading SHAP explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0.1) return 'text-green-500';
    if (impact > 0) return 'text-green-300';
    if (impact > -0.1) return 'text-red-300';
    return 'text-red-500';
  };

  const getImpactBgColor = (impact: number) => {
    if (impact > 0.1) return 'bg-green-500';
    if (impact > 0) return 'bg-green-400';
    if (impact > -0.1) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getAbsoluteImpact = (impact: number) => Math.abs(impact);

  if (loading) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-trading-light animate-pulse">
              {lang === 'ar' ? 'جاري تحليل SHAP...' : 'Generating SHAP analysis...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!shapData) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            {lang === 'ar' ? 'لا توجد بيانات SHAP متاحة' : 'No SHAP data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = shapData.shapValues.map(item => ({
    name: item.feature,
    impact: item.impact,
    value: item.value,
    absImpact: Math.abs(item.impact)
  }));

  const pieData = shapData.shapValues.map((item, index) => ({
    name: item.feature,
    value: Math.abs(item.impact),
    impact: item.impact
  }));

  const COLORS = ['#60A5FA', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* SHAP Header */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              {lang === 'ar' ? 'تفسيرات SHAP للذكاء الاصطناعي' : 'SHAP AI Explanations'} - {symbol}
            </CardTitle>
            
            <Button
              onClick={loadShapExplanation}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {lang === 'ar' ? 'تحديث التحليل' : 'Refresh Analysis'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(shapData.prediction * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'التوقع النهائي' : 'Final Prediction'}
              </div>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(shapData.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'مستوى الثقة' : 'Confidence Level'}
              </div>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {shapData.baseValue.toFixed(3)}
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'القيمة الأساسية' : 'Base Value'}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">
                  {lang === 'ar' ? 'التفسير الشامل' : 'Comprehensive Explanation'}
                </h4>
                <p className="text-sm text-gray-300">{shapData.explanation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SHAP Analysis Tabs */}
      <Tabs defaultValue="waterfall" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="waterfall">
            {lang === 'ar' ? 'رسم الشلال' : 'Waterfall Plot'}
          </TabsTrigger>
          <TabsTrigger value="feature-importance">
            {lang === 'ar' ? 'أهمية الميزات' : 'Feature Importance'}
          </TabsTrigger>
          <TabsTrigger value="distribution">
            {lang === 'ar' ? 'التوزيع' : 'Distribution'}
          </TabsTrigger>
          <TabsTrigger value="details">
            {lang === 'ar' ? 'التفاصيل' : 'Details'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waterfall" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {lang === 'ar' ? 'رسم الشلال للتأثيرات' : 'SHAP Waterfall Plot'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: any, name: string) => [
                        `${value > 0 ? '+' : ''}${value.toFixed(4)}`,
                        lang === 'ar' ? 'التأثير' : 'Impact'
                      ]}
                    />
                    <Bar 
                      dataKey="impact" 
                      fill={(entry: any) => entry.impact > 0 ? '#10B981' : '#EF4444'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feature-importance" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                {lang === 'ar' ? 'أهمية الميزات' : 'Feature Importance Rankings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shapData.shapValues
                  .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                  .map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-white">{item.feature}</span>
                        {item.impact > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getImpactColor(item.impact)}`}>
                          {item.impact > 0 ? '+' : ''}{item.impact.toFixed(4)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {lang === 'ar' ? 'القيمة:' : 'Value:'} {item.value.toFixed(3)}
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={getAbsoluteImpact(item.impact) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-400 ml-9">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  {lang === 'ar' ? 'توزيع التأثيرات' : 'Impact Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${(value * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  {lang === 'ar' ? 'تحليل التأثير' : 'Impact Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                    <h5 className="font-semibold text-green-400 mb-1">
                      {lang === 'ar' ? 'العوامل الإيجابية' : 'Positive Factors'}
                    </h5>
                    <div className="space-y-1">
                      {shapData.shapValues
                        .filter(item => item.impact > 0)
                        .map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">{item.feature}</span>
                          <span className="text-green-400">+{item.impact.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                    <h5 className="font-semibold text-red-400 mb-1">
                      {lang === 'ar' ? 'العوامل السلبية' : 'Negative Factors'}
                    </h5>
                    <div className="space-y-1">
                      {shapData.shapValues
                        .filter(item => item.impact < 0)
                        .map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">{item.feature}</span>
                          <span className="text-red-400">{item.impact.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shapData.shapValues.map((item, index) => (
              <Card key={index} className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center justify-between">
                    <span>{item.feature}</span>
                    <Badge className={`${getImpactBgColor(item.impact)} text-white`}>
                      {item.impact > 0 ? '+' : ''}{item.impact.toFixed(4)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">
                          {lang === 'ar' ? 'القيمة الحالية' : 'Current Value'}
                        </div>
                        <div className="text-lg font-bold text-white">{item.value.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          {lang === 'ar' ? 'التأثير النسبي' : 'Relative Impact'}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {((Math.abs(item.impact) / shapData.shapValues.reduce((sum, i) => sum + Math.abs(i.impact), 0)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-2">
                        {lang === 'ar' ? 'شريط التأثير' : 'Impact Bar'}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${getImpactBgColor(item.impact)}`}
                          style={{ width: `${Math.abs(item.impact) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        {lang === 'ar' ? 'الوصف' : 'Description'}
                      </div>
                      <p className="text-sm text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
