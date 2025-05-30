
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Droplets,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Globe
} from 'lucide-react';

interface WeatherDataProps {
  lang?: 'en' | 'ar';
}

interface WeatherMetrics {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
}

interface CommodityWeatherCorrelation {
  commodity: string;
  symbol: string;
  correlation: number;
  impact: 'high' | 'medium' | 'low';
  weatherFactors: string[];
  priceChange: number;
  forecast: 'bullish' | 'bearish' | 'neutral';
}

interface RegionWeatherData {
  region: string;
  country: string;
  coordinates: { lat: number; lng: number };
  weather: WeatherMetrics;
  cropConditions: {
    corn: number;
    wheat: number;
    soybeans: number;
    rice: number;
  };
  agriculturalIndex: number;
  alerts: string[];
}

const WeatherData = ({ lang = 'ar' }: WeatherDataProps) => {
  const [weatherData, setWeatherData] = useState<RegionWeatherData[]>([]);
  const [correlations, setCorrelations] = useState<CommodityWeatherCorrelation[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('midwest-usa');

  useEffect(() => {
    // محاكاة بيانات الطقس الفعلية
    setWeatherData([
      {
        region: 'Midwest USA',
        country: 'USA',
        coordinates: { lat: 41.8781, lng: -87.6298 },
        weather: {
          temperature: 22,
          humidity: 65,
          precipitation: 2.5,
          windSpeed: 15,
          pressure: 1013,
          condition: 'cloudy'
        },
        cropConditions: {
          corn: 85,
          wheat: 78,
          soybeans: 82,
          rice: 0
        },
        agriculturalIndex: 81.7,
        alerts: ['احتمال هطول أمطار غزيرة خلال 48 ساعة']
      },
      {
        region: 'Brazilian Cerrado',
        country: 'Brazil',
        coordinates: { lat: -15.7801, lng: -47.9292 },
        weather: {
          temperature: 28,
          humidity: 78,
          precipitation: 5.2,
          windSpeed: 12,
          pressure: 1008,
          condition: 'rainy'
        },
        cropConditions: {
          corn: 92,
          wheat: 45,
          soybeans: 89,
          rice: 72
        },
        agriculturalIndex: 74.5,
        alerts: ['موسم الأمطار الموسمية مثالي للصويا']
      },
      {
        region: 'European Plains',
        country: 'France',
        coordinates: { lat: 46.2276, lng: 2.2137 },
        weather: {
          temperature: 18,
          humidity: 72,
          precipitation: 1.8,
          windSpeed: 18,
          pressure: 1015,
          condition: 'cloudy'
        },
        cropConditions: {
          corn: 79,
          wheat: 88,
          soybeans: 75,
          rice: 0
        },
        agriculturalIndex: 80.7,
        alerts: ['ظروف مثالية لنمو القمح']
      }
    ]);

    setCorrelations([
      {
        commodity: 'الذرة',
        symbol: 'CORN',
        correlation: 0.78,
        impact: 'high',
        weatherFactors: ['درجة الحرارة', 'هطول الأمطار', 'الرطوبة'],
        priceChange: 2.5,
        forecast: 'bullish'
      },
      {
        commodity: 'القمح',
        symbol: 'WHEAT',
        correlation: 0.82,
        impact: 'high',
        weatherFactors: ['هطول الأمطار', 'درجة الحرارة', 'الرياح'],
        priceChange: 1.8,
        forecast: 'neutral'
      },
      {
        commodity: 'فول الصويا',
        symbol: 'SOYBEANS',
        correlation: 0.75,
        impact: 'high',
        weatherFactors: ['الرطوبة', 'هطول الأمطار', 'درجة الحرارة'],
        priceChange: 3.2,
        forecast: 'bullish'
      },
      {
        commodity: 'البن',
        symbol: 'COFFEE',
        correlation: 0.68,
        impact: 'medium',
        weatherFactors: ['درجة الحرارة', 'الصقيع', 'هطول الأمطار'],
        priceChange: -1.5,
        forecast: 'bearish'
      }
    ]);

    // بيانات تاريخية للارتباط
    setHistoricalData([
      { date: '2024-01', temperature: 18, cornPrice: 420, wheatPrice: 650, soybeansPrice: 1250 },
      { date: '2024-02', temperature: 20, cornPrice: 435, wheatPrice: 668, soybeansPrice: 1280 },
      { date: '2024-03', temperature: 22, cornPrice: 445, wheatPrice: 675, soybeansPrice: 1320 },
      { date: '2024-04', temperature: 25, cornPrice: 430, wheatPrice: 660, soybeansPrice: 1290 },
      { date: '2024-05', temperature: 28, cornPrice: 425, wheatPrice: 645, soybeansPrice: 1270 },
      { date: '2024-06', temperature: 32, cornPrice: 410, wheatPrice: 630, soybeansPrice: 1240 }
    ]);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-400" />;
      case 'stormy':
        return <AlertTriangle className="h-6 w-6 text-red-400" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-400" />;
    }
  };

  const getForecastIcon = (forecast: string) => {
    switch (forecast) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const formatArabicNumber = (num: number) => {
    return num.toLocaleString('ar-EG');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cloud className="h-6 w-6 text-blue-400" />
            {lang === 'ar' ? 'بيانات الطقس للسلع' : 'Weather Data for Commodities'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'تحليل تأثير الطقس على أسعار السلع الزراعية والتنبؤ بالاتجاهات'
              : 'Analyze weather impact on agricultural commodity prices and forecast trends'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-600">
            {lang === 'ar' ? 'البيانات محدثة' : 'Data Updated'}
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            {lang === 'ar' ? 'في الوقت الفعلي' : 'Real-time'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="overview">
            {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="correlations">
            {lang === 'ar' ? 'الارتباطات' : 'Correlations'}
          </TabsTrigger>
          <TabsTrigger value="regional">
            {lang === 'ar' ? 'البيانات الإقليمية' : 'Regional Data'}
          </TabsTrigger>
          <TabsTrigger value="forecasts">
            {lang === 'ar' ? 'التوقعات' : 'Forecasts'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Weather-Commodity Correlations Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {correlations.map((correlation, index) => (
              <Card key={index} className="bg-trading-card border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{correlation.commodity}</h4>
                    {getForecastIcon(correlation.forecast)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">
                        {lang === 'ar' ? 'الارتباط' : 'Correlation'}
                      </span>
                      <span className="text-white font-medium">
                        {(correlation.correlation * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">
                        {lang === 'ar' ? 'التغيير' : 'Change'}
                      </span>
                      <span className={correlation.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {correlation.priceChange >= 0 ? '+' : ''}{correlation.priceChange.toFixed(1)}%
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        correlation.impact === 'high' ? 'border-red-500 text-red-400' :
                        correlation.impact === 'medium' ? 'border-yellow-500 text-yellow-400' :
                        'border-green-500 text-green-400'
                      }
                    >
                      {lang === 'ar' ? 
                        (correlation.impact === 'high' ? 'تأثير عالي' :
                         correlation.impact === 'medium' ? 'تأثير متوسط' : 'تأثير منخفض') :
                        correlation.impact + ' impact'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Historical Weather-Price Correlation Chart */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'ارتباط الطقس بالأسعار التاريخي' : 'Historical Weather-Price Correlation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis yAxisId="temp" orientation="left" stroke="#F59E0B" />
                  <YAxis yAxisId="price" orientation="right" stroke="#10B981" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    name={lang === 'ar' ? 'درجة الحرارة (°C)' : 'Temperature (°C)'}
                  />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="cornPrice"
                    stroke="#10B981"
                    strokeWidth={2}
                    name={lang === 'ar' ? 'سعر الذرة' : 'Corn Price'}
                  />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="wheatPrice"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name={lang === 'ar' ? 'سعر القمح' : 'Wheat Price'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correlations Tab */}
        <TabsContent value="correlations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {correlations.map((correlation, index) => (
              <Card key={index} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{correlation.commodity} ({correlation.symbol})</span>
                    <div className="flex items-center gap-2">
                      {getForecastIcon(correlation.forecast)}
                      <Badge className={correlation.correlation > 0.7 ? 'bg-green-600' : 'bg-yellow-600'}>
                        {(correlation.correlation * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Weather Factors */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        {lang === 'ar' ? 'العوامل الجوية المؤثرة' : 'Influencing Weather Factors'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {correlation.weatherFactors.map((factor, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price Change */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">
                        {lang === 'ar' ? 'تغيير السعر (7 أيام)' : 'Price Change (7d)'}
                      </span>
                      <span className={correlation.priceChange >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {correlation.priceChange >= 0 ? '+' : ''}{correlation.priceChange.toFixed(2)}%
                      </span>
                    </div>

                    {/* Correlation Strength Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>{lang === 'ar' ? 'قوة الارتباط' : 'Correlation Strength'}</span>
                        <span>{(correlation.correlation * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            correlation.correlation > 0.7 ? 'bg-green-500' :
                            correlation.correlation > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${correlation.correlation * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Impact Level */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">
                        {lang === 'ar' ? 'مستوى التأثير' : 'Impact Level'}
                      </span>
                      <Badge 
                        variant="outline"
                        className={
                          correlation.impact === 'high' ? 'border-red-500 text-red-400' :
                          correlation.impact === 'medium' ? 'border-yellow-500 text-yellow-400' :
                          'border-green-500 text-green-400'
                        }
                      >
                        {lang === 'ar' ? 
                          (correlation.impact === 'high' ? 'عالي' :
                           correlation.impact === 'medium' ? 'متوسط' : 'منخفض') :
                          correlation.impact}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Regional Data Tab */}
        <TabsContent value="regional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {weatherData.map((region, index) => (
              <Card key={index} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {region.region}
                    </div>
                    {getWeatherIcon(region.weather.condition)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Weather Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-400" />
                        <div>
                          <p className="text-xs text-gray-400">
                            {lang === 'ar' ? 'درجة الحرارة' : 'Temperature'}
                          </p>
                          <p className="text-white font-semibold">
                            {formatArabicNumber(region.weather.temperature)}°C
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">
                            {lang === 'ar' ? 'الرطوبة' : 'Humidity'}
                          </p>
                          <p className="text-white font-semibold">
                            {formatArabicNumber(region.weather.humidity)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">
                            {lang === 'ar' ? 'هطول الأمطار' : 'Precipitation'}
                          </p>
                          <p className="text-white font-semibold">
                            {formatArabicNumber(region.weather.precipitation)}mm
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">
                            {lang === 'ar' ? 'سرعة الرياح' : 'Wind Speed'}
                          </p>
                          <p className="text-white font-semibold">
                            {formatArabicNumber(region.weather.windSpeed)} km/h
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Agricultural Index */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'المؤشر الزراعي' : 'Agricultural Index'}
                        </span>
                        <span className="text-white font-semibold">
                          {formatArabicNumber(region.agriculturalIndex.toFixed(1))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            region.agriculturalIndex > 80 ? 'bg-green-500' :
                            region.agriculturalIndex > 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${region.agriculturalIndex}%` }}
                        />
                      </div>
                    </div>

                    {/* Crop Conditions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        {lang === 'ar' ? 'حالة المحاصيل' : 'Crop Conditions'}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(region.cropConditions).map(([crop, condition]) => (
                          condition > 0 && (
                            <div key={crop} className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm capitalize">{crop}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-700 rounded-full h-1">
                                  <div
                                    className={`h-1 rounded-full ${
                                      condition > 80 ? 'bg-green-500' :
                                      condition > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${condition}%` }}
                                  />
                                </div>
                                <span className="text-white text-sm w-8">
                                  {formatArabicNumber(condition)}%
                                </span>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Alerts */}
                    {region.alerts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                          {lang === 'ar' ? 'التنبيهات' : 'Alerts'}
                        </h4>
                        {region.alerts.map((alert, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-yellow-900/30 rounded border border-yellow-700">
                            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                            <p className="text-yellow-300 text-sm">{alert}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Forecasts Tab */}
        <TabsContent value="forecasts" className="space-y-6">
          {/* Price Impact Forecast Chart */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'توقع تأثير الطقس على الأسعار (7 أيام)' : 'Weather Price Impact Forecast (7 days)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={correlations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="commodity" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar 
                    dataKey="priceChange" 
                    fill="#3B82F6"
                    name={lang === 'ar' ? 'تغيير السعر المتوقع (%)' : 'Expected Price Change (%)'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Forecasts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {correlations.map((correlation, index) => (
              <Card key={index} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{correlation.commodity}</span>
                    <div className="flex items-center gap-2">
                      {getForecastIcon(correlation.forecast)}
                      <Badge className={
                        correlation.forecast === 'bullish' ? 'bg-green-600' :
                        correlation.forecast === 'bearish' ? 'bg-red-600' : 'bg-gray-600'
                      }>
                        {lang === 'ar' ? 
                          (correlation.forecast === 'bullish' ? 'صاعد' :
                           correlation.forecast === 'bearish' ? 'هابط' : 'محايد') :
                          correlation.forecast}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-white">
                        {correlation.priceChange >= 0 ? '+' : ''}{correlation.priceChange.toFixed(1)}%
                      </p>
                      <p className="text-gray-400 text-sm">
                        {lang === 'ar' ? 'تغيير السعر المتوقع' : 'Expected Price Change'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-300">
                        {lang === 'ar' ? 'العوامل الرئيسية' : 'Key Factors'}
                      </h4>
                      <ul className="space-y-1">
                        {correlation.weatherFactors.map((factor, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                            <div className="w-1 h-1 bg-blue-400 rounded-full" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
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

export default WeatherData;
