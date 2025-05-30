
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, Droplets, Eye, TrendingUp, TrendingDown, MapPin, Calendar } from 'lucide-react';

interface WeatherData {
  location: string;
  date: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  pressure: number;
  visibility: number;
  commodity: string;
  priceImpact: number;
}

interface WeatherDataProps {
  lang: 'en' | 'ar';
}

const WeatherData: React.FC<WeatherDataProps> = ({ lang }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('week');
  const [loading, setLoading] = useState(false);

  // Generate mock weather data
  const weatherData: WeatherData[] = useMemo(() => {
    const locations = ['Iowa, USA', 'São Paulo, Brazil', 'Punjab, India', 'Alberta, Canada', 'Queensland, Australia', 'Ukraine', 'Russia', 'Argentina'];
    const commodities = ['Corn', 'Soybeans', 'Wheat', 'Coffee', 'Sugar', 'Cotton', 'Rice', 'Cocoa'];
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
    
    return Array.from({ length: 100 }, (_, i) => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const commodity = commodities[Math.floor(Math.random() * commodities.length)];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const temperature = Math.floor(Math.random() * 60) - 10;
      const precipitation = Math.random() * 50;
      
      return {
        location,
        date: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature,
        humidity: Math.floor(Math.random() * 100),
        precipitation,
        windSpeed: Math.floor(Math.random() * 30),
        condition,
        pressure: Math.floor(Math.random() * 50) + 980,
        visibility: Math.floor(Math.random() * 20) + 1,
        commodity,
        priceImpact: (precipitation > 25 || temperature > 35 || temperature < 5) ? 
          Math.random() * 15 - 7.5 : Math.random() * 5 - 2.5
      };
    });
  }, []);

  // Helper function to get weather icon
  const getForecastIcon = (condition: string, size = 'h-5 w-5') => {
    switch (condition) {
      case 'sunny': return <Sun className={`${size} text-yellow-500`} />;
      case 'cloudy': return <Cloud className={`${size} text-gray-400`} />;
      case 'rainy': return <CloudRain className={`${size} text-blue-500`} />;
      case 'snowy': return <Snowflake className={`${size} text-blue-200`} />;
      case 'windy': return <Wind className={`${size} text-green-400`} />;
      default: return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return weatherData.filter(item => {
      if (selectedRegion !== 'global' && !item.location.includes(selectedRegion)) return false;
      if (selectedCommodity !== 'all' && item.commodity !== selectedCommodity) return false;
      return true;
    });
  }, [weatherData, selectedRegion, selectedCommodity]);

  // Prepare regional analysis
  const regionalAnalysis = useMemo(() => {
    const regions = filteredData.reduce((acc, item) => {
      const region = item.location;
      if (!acc[region]) {
        acc[region] = {
          region,
          avgTemp: 0,
          totalPrecipitation: 0,
          avgPriceImpact: 0,
          count: 0,
          dominantCondition: 'sunny' as WeatherData['condition']
        };
      }
      acc[region].avgTemp += item.temperature;
      acc[region].totalPrecipitation += item.precipitation;
      acc[region].avgPriceImpact += item.priceImpact;
      acc[region].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(regions).map((region: any) => ({
      ...region,
      avgTemp: Math.round(region.avgTemp / region.count),
      avgPrecipitation: Math.round(region.totalPrecipitation / region.count),
      avgPriceImpact: Math.round((region.avgPriceImpact / region.count) * 100) / 100
    }));
  }, [filteredData]);

  // Prepare time series data
  const timeSeriesData = useMemo(() => {
    const dateGroups = filteredData.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          avgTemp: 0,
          avgPrecipitation: 0,
          avgPriceImpact: 0,
          count: 0
        };
      }
      acc[item.date].avgTemp += item.temperature;
      acc[item.date].avgPrecipitation += item.precipitation;
      acc[item.date].avgPriceImpact += item.priceImpact;
      acc[item.date].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(dateGroups).map((group: any) => ({
      date: group.date,
      avgTemp: Math.round(group.avgTemp / group.count),
      avgPrecipitation: Math.round(group.avgPrecipitation / group.count),
      avgPriceImpact: Math.round((group.avgPriceImpact / group.count) * 100) / 100
    })).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [filteredData]);

  // Prepare commodity impact analysis
  const commodityImpact = useMemo(() => {
    const impact = filteredData.reduce((acc, item) => {
      if (!acc[item.commodity]) {
        acc[item.commodity] = {
          commodity: item.commodity,
          totalImpact: 0,
          positiveEvents: 0,
          negativeEvents: 0,
          count: 0
        };
      }
      acc[item.commodity].totalImpact += item.priceImpact;
      if (item.priceImpact > 0) acc[item.commodity].positiveEvents++;
      if (item.priceImpact < 0) acc[item.commodity].negativeEvents++;
      acc[item.commodity].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(impact).map((item: any) => ({
      ...item,
      avgImpact: Math.round((item.totalImpact / item.count) * 100) / 100,
      volatility: Math.round(((item.positiveEvents + item.negativeEvents) / item.count) * 100)
    }));
  }, [filteredData]);

  // Prepare weather alerts
  const weatherAlerts = useMemo(() => {
    return filteredData.filter(item => 
      item.precipitation > 30 || 
      item.temperature > 40 || 
      item.temperature < -5 || 
      item.windSpeed > 25 ||
      Math.abs(item.priceImpact) > 5
    ).slice(0, 10);
  }, [filteredData]);

  const regions = ['global', 'USA', 'Brazil', 'India', 'Canada', 'Australia', 'Ukraine', 'Russia', 'Argentina'];
  const commodities = ['all', 'Corn', 'Soybeans', 'Wheat', 'Coffee', 'Sugar', 'Cotton', 'Rice', 'Cocoa'];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'بيانات الطقس للسلع' : 'Weather Data for Commodities'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder={lang === 'ar' ? 'اختر المنطقة' : 'Select Region'} />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region === 'global' ? (lang === 'ar' ? 'عالمي' : 'Global') : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger>
                <SelectValue placeholder={lang === 'ar' ? 'اختر السلعة' : 'Select Commodity'} />
              </SelectTrigger>
              <SelectContent>
                {commodities.map(commodity => (
                  <SelectItem key={commodity} value={commodity}>
                    {commodity === 'all' ? (lang === 'ar' ? 'جميع السلع' : 'All Commodities') : commodity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">{lang === 'ar' ? 'يوم' : 'Day'}</SelectItem>
                <SelectItem value="week">{lang === 'ar' ? 'أسبوع' : 'Week'}</SelectItem>
                <SelectItem value="month">{lang === 'ar' ? 'شهر' : 'Month'}</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setLoading(!loading)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Cloud className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تحديث' : 'Update'}
            </Button>
          </div>

          {/* Key Weather Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Thermometer className="h-5 w-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round(filteredData.reduce((sum, item) => sum + item.temperature, 0) / filteredData.length) || 0}°C
              </div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'متوسط الحرارة' : 'Avg Temperature'}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <CloudRain className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round(filteredData.reduce((sum, item) => sum + item.precipitation, 0) / filteredData.length) || 0}mm
              </div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'متوسط الأمطار' : 'Avg Precipitation'}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Wind className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round(filteredData.reduce((sum, item) => sum + item.windSpeed, 0) / filteredData.length) || 0} km/h
              </div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'متوسط الرياح' : 'Avg Wind'}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {(filteredData.reduce((sum, item) => sum + Math.abs(item.priceImpact), 0) / filteredData.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'تأثير السعر' : 'Price Impact'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-900/20 to-red-900/20 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <CloudRain className="h-5 w-5" />
              {lang === 'ar' ? 'تنبيهات الطقس' : 'Weather Alerts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherAlerts.slice(0, 4).map((alert, index) => (
                <div key={index} className="bg-gray-800/50 p-3 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getForecastIcon(alert.condition)}
                      <span className="text-white font-medium">{alert.location}</span>
                    </div>
                    <Badge className={`${Math.abs(alert.priceImpact) > 5 ? 'bg-red-500' : 'bg-yellow-500'} text-white`}>
                      {alert.priceImpact > 0 ? '+' : ''}{alert.priceImpact.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {alert.temperature}°C, {alert.precipitation.toFixed(1)}mm, {alert.windSpeed}km/h
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 bg-trading-card">
          <TabsTrigger value="overview">{lang === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="regional">{lang === 'ar' ? 'تحليل إقليمي' : 'Regional'}</TabsTrigger>
          <TabsTrigger value="trends">{lang === 'ar' ? 'الاتجاهات' : 'Trends'}</TabsTrigger>
          <TabsTrigger value="impact">{lang === 'ar' ? 'تأثير السلع' : 'Commodity Impact'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{lang === 'ar' ? 'درجة الحرارة مقابل تأثير السعر' : 'Temperature vs Price Impact'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Area type="monotone" dataKey="avgTemp" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="avgPriceImpact" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{lang === 'ar' ? 'هطول الأمطار والرياح' : 'Precipitation & Wind'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Area type="monotone" dataKey="avgPrecipitation" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regional">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'التحليل الإقليمي' : 'Regional Analysis'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="region" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar dataKey="avgTemp" fill="#EF4444" />
                    <Bar dataKey="avgPrecipitation" fill="#3B82F6" />
                    <Bar dataKey="avgPriceImpact" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'اتجاهات الطقس' : 'Weather Trends'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Line type="monotone" dataKey="avgTemp" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgPrecipitation" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgPriceImpact" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'تأثير الطقس على السلع' : 'Weather Impact on Commodities'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commodityImpact.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{item.commodity}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            {item.positiveEvents} {lang === 'ar' ? 'إيجابي' : 'positive'}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            {item.negativeEvents} {lang === 'ar' ? 'سلبي' : 'negative'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${item.avgImpact >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.avgImpact >= 0 ? '+' : ''}{item.avgImpact}%
                        </div>
                        <div className="text-xs text-gray-400">{lang === 'ar' ? 'متوسط التأثير' : 'Avg Impact'}</div>
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

export default WeatherData;
