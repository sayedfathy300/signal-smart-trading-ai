
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { smartRecommendationsService, ShapExplanation } from '@/services/smartRecommendationsService';
import { cn } from '@/lib/utils';

interface ShapExplanationsProps {
  symbol: string;
  lang: 'en' | 'ar';
}

export const ShapExplanations = ({ symbol, lang }: ShapExplanationsProps) => {
  const [shapData, setShapData] = useState<ShapExplanation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShapExplanation();
  }, [symbol]);

  const loadShapExplanation = async () => {
    setLoading(true);
    try {
      const data = await smartRecommendationsService.generateShapExplanation(symbol);
      setShapData(data);
    } catch (error) {
      console.error('خطأ في تحميل تفسير SHAP:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBarColor = (impact: number) => {
    return impact >= 0 ? "#10B981" : "#EF4444";
  };

  if (loading) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
            <span className="ml-3 text-white">
              {lang === 'ar' ? 'جاري تحليل SHAP...' : 'Loading SHAP Analysis...'}
            </span>
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
            {lang === 'ar' ? 'لا توجد بيانات SHAP' : 'No SHAP data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ملخص التنبؤ */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            {lang === 'ar' ? `تحليل SHAP لرمز ${symbol}` : `SHAP Analysis for ${symbol}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-trading-secondary rounded-lg">
              <div className="text-2xl font-bold text-white">{shapData.prediction.toFixed(3)}</div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'التنبؤ النهائي' : 'Final Prediction'}
              </div>
            </div>
            <div className="text-center p-4 bg-trading-secondary rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{shapData.baseValue.toFixed(3)}</div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'القيمة الأساسية' : 'Base Value'}
              </div>
            </div>
            <div className="text-center p-4 bg-trading-secondary rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {(shapData.confidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                {lang === 'ar' ? 'مستوى الثقة' : 'Confidence Level'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <h4 className="font-bold text-blue-300 mb-2">
              {lang === 'ar' ? 'التفسير:' : 'Explanation:'}
            </h4>
            <p className="text-blue-200">{shapData.explanation}</p>
          </div>
        </CardContent>
      </Card>

      {/* رسم بياني لقيم SHAP */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            {lang === 'ar' ? 'تأثير المتغيرات (قيم SHAP)' : 'Feature Impact (SHAP Values)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shapData.shapValues}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis 
                  type="category" 
                  dataKey="feature" 
                  stroke="#9CA3AF"
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: string) => [
                    value.toFixed(4),
                    lang === 'ar' ? 'التأثير' : 'Impact'
                  ]}
                />
                <Bar dataKey="impact">
                  {shapData.shapValues.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(entry.impact)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل كل متغير */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            {lang === 'ar' ? 'تفاصيل تأثير المتغيرات' : 'Feature Impact Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shapData.shapValues.map((feature, index) => (
              <div key={index} className="p-4 bg-trading-secondary rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={feature.impact >= 0 ? 'default' : 'destructive'}
                      className={feature.impact >= 0 ? 'bg-trading-up' : 'bg-trading-down'}
                    >
                      {feature.impact >= 0 ? '+' : ''}{feature.impact.toFixed(4)}
                    </Badge>
                    <span className="font-medium text-white">{feature.feature}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{feature.value.toFixed(4)}</div>
                    <div className="text-xs text-gray-400">
                      {lang === 'ar' ? 'القيمة' : 'Value'}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm">{feature.description}</p>
                
                {/* مؤشر التأثير */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{lang === 'ar' ? 'التأثير:' : 'Impact:'}</span>
                    <span>{Math.abs(feature.impact).toFixed(4)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        feature.impact >= 0 ? 'bg-trading-up' : 'bg-trading-down'
                      )}
                      style={{ 
                        width: `${Math.min(Math.abs(feature.impact) * 500, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أدوات إضافية */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            {lang === 'ar' ? 'أدوات تحليل إضافية' : 'Additional Analysis Tools'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={loadShapExplanation}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {lang === 'ar' ? 'تحديث التحليل' : 'Refresh Analysis'}
            </Button>
            
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تصدير النتائج' : 'Export Results'}
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-600 text-gray-400"
            >
              <Info className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'معلومات SHAP' : 'SHAP Info'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
