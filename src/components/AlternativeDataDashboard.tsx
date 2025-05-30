
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Satellite, 
  Wifi, 
  Link, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Globe,
  Zap,
  BarChart3,
  Brain,
  RefreshCw,
  MapPin,
  Thermometer,
  Car,
  Factory,
  Coins,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  alternativeDataService,
  ComprehensiveAlternativeData,
  SatelliteData,
  IoTSensorData,
  BlockchainMetrics,
  FuturesData
} from '@/services/alternativeDataService';

interface AlternativeDataDashboardProps {
  lang?: 'en' | 'ar';
}

const AlternativeDataDashboard = ({ lang = 'ar' }: AlternativeDataDashboardProps) => {
  const [data, setData] = useState<ComprehensiveAlternativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('satellite');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const alternativeData = await alternativeDataService.getComprehensiveAlternativeData();
      setData(alternativeData);
    } catch (error) {
      console.error('Error loading alternative data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRealTime = () => {
    if (realTimeEnabled) {
      setRealTimeEnabled(false);
    } else {
      setRealTimeEnabled(true);
      alternativeDataService.startRealTimeMonitoring((newData) => {
        setData(newData);
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-trading-primary" />
          <p className="text-gray-400">
            {lang === 'ar' ? 'جاري تحميل البيانات البديلة...' : 'Loading alternative data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">
          {lang === 'ar' ? 'فشل في تحميل البيانات البديلة' : 'Failed to load alternative data'}
        </p>
        <Button onClick={loadData} className="mt-4 bg-trading-primary hover:bg-blue-600">
          {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Alerts */}
      {data.real_time_alerts.length > 0 && (
        <div className="space-y-2">
          {data.real_time_alerts.slice(0, 3).map((alert, index) => (
            <Alert key={index} className="border-l-4 border-l-trading-primary bg-trading-card">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-white">
                <div className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {lang === 'ar' ? 'البيانات البديلة المتقدمة' : 'Advanced Alternative Data'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' ? 'تحليل شامل للبيانات غير التقليدية' : 'Comprehensive non-traditional data analysis'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleRealTime}
            variant={realTimeEnabled ? "destructive" : "default"}
            size="sm"
            className="bg-trading-primary hover:bg-blue-600"
          >
            <Activity className={`h-4 w-4 mr-2 ${realTimeEnabled ? 'animate-pulse' : ''}`} />
            {realTimeEnabled 
              ? (lang === 'ar' ? 'إيقاف المراقبة' : 'Stop Monitoring')
              : (lang === 'ar' ? 'مراقبة فورية' : 'Real-time')
            }
          </Button>
          
          <Button onClick={loadData} size="sm" className="bg-gray-600 hover:bg-gray-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Main Data Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="satellite">
            <Satellite className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'الأقمار الصناعية' : 'Satellite'}
          </TabsTrigger>
          <TabsTrigger value="iot">
            <Wifi className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'إنترنت الأشياء' : 'IoT'}
          </TabsTrigger>
          <TabsTrigger value="blockchain">
            <Link className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'البلوك تشين' : 'Blockchain'}
          </TabsTrigger>
          <TabsTrigger value="futures">
            <TrendingUp className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'العقود الآجلة' : 'Futures'}
          </TabsTrigger>
        </TabsList>

        {/* Satellite Data Tab */}
        <TabsContent value="satellite" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Economic Activity Map */}
            <Card className="lg:col-span-2 bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {lang === 'ar' ? 'خريطة النشاط الاقتصادي العالمي' : 'Global Economic Activity Map'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Array.from(data.satellite_data.entries()).slice(0, 10).map(([location, satelliteData]) => (
                    <div key={location} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-trading-primary" />
                        <span className="text-sm font-medium text-white">{location}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">
                              {lang === 'ar' ? 'النشاط الاقتصادي' : 'Economic Activity'}
                            </span>
                            <span className="text-white">{satelliteData.metrics.economic_activity.toFixed(1)}%</span>
                          </div>
                          <Progress value={satelliteData.metrics.economic_activity} className="h-2" />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">
                            {lang === 'ar' ? 'التغيير الشهري' : 'Monthly Change'}
                          </span>
                          <span className={satelliteData.trends.monthly_change >= 0 ? 'text-trading-up' : 'text-trading-down'}>
                            {satelliteData.trends.monthly_change > 0 ? '+' : ''}{satelliteData.trends.monthly_change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Economic Activity Trends */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {lang === 'ar' ? 'اتجاهات النشاط الاقتصادي' : 'Economic Activity Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={Array.from(data.satellite_data.entries()).map(([location, data]) => ({
                    location: location.slice(0, 8),
                    activity: data.metrics.economic_activity,
                    industrial: data.metrics.industrial_activity,
                    transport: data.metrics.transportation_index
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="location" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Area type="monotone" dataKey="activity" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="industrial" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="transport" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Environmental Indicators */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  {lang === 'ar' ? 'المؤشرات البيئية' : 'Environmental Indicators'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={Array.from(data.satellite_data.values()).slice(0, 1).map(satelliteData => ({
                    subject: 'Pollution',
                    A: satelliteData.metrics.pollution_level,
                    fullMark: 100
                  })).concat([
                    { subject: 'Vegetation', A: 75, fullMark: 100 },
                    { subject: 'Urban Development', A: 60, fullMark: 100 },
                    { subject: 'Agriculture', A: 85, fullMark: 100 },
                    { subject: 'Transportation', A: 70, fullMark: 100 }
                  ])}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <Radar name="Current" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* IoT Data Tab */}
        <TabsContent value="iot" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IoT Sensors Overview */}
            <Card className="lg:col-span-2 bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {lang === 'ar' ? 'شبكة أجهزة الاستشعار' : 'Sensor Network Overview'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  {['traffic', 'energy', 'weather', 'commodity', 'industrial'].map(type => {
                    const sensors = Array.from(data.iot_sensors.values()).filter(s => s.sensor_type === type);
                    const avgValue = sensors.reduce((sum, s) => sum + s.readings.value, 0) / sensors.length;
                    const onlineCount = sensors.filter(s => s.readings.status === 'online').length;
                    
                    return (
                      <div key={type} className="p-4 bg-gray-800 rounded-lg text-center">
                        <div className="mb-2">
                          {type === 'traffic' && <Car className="h-6 w-6 mx-auto text-blue-400" />}
                          {type === 'energy' && <Zap className="h-6 w-6 mx-auto text-yellow-400" />}
                          {type === 'weather' && <Thermometer className="h-6 w-6 mx-auto text-green-400" />}
                          {type === 'commodity' && <Coins className="h-6 w-6 mx-auto text-orange-400" />}
                          {type === 'industrial' && <Factory className="h-6 w-6 mx-auto text-purple-400" />}
                        </div>
                        <h3 className="text-sm font-medium text-white capitalize">{type}</h3>
                        <p className="text-2xl font-bold text-trading-primary">{avgValue.toFixed(1)}</p>
                        <p className="text-xs text-gray-400">{onlineCount}/{sensors.length} online</p>
                      </div>
                    );
                  })}
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={Array.from(data.iot_sensors.values()).slice(0, 1)[0]?.historical_data.map((point, index) => ({
                    time: new Date(point.time).getHours() + ':00',
                    value: point.value,
                    correlationStrength: Math.random() * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="correlationStrength" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Correlations */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {lang === 'ar' ? 'الارتباطات مع السوق' : 'Market Correlations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(data.iot_sensors.values()).slice(0, 5).map((sensor, index) => (
                    <div key={sensor.sensor_id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{sensor.sensor_type}</span>
                        <Badge variant="outline" className="text-xs">
                          {(sensor.correlations.correlation_strength * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={sensor.correlations.correlation_strength * 100} className="h-2 mb-2" />
                      <div className="flex flex-wrap gap-1">
                        {sensor.correlations.market_symbols.map(symbol => (
                          <Badge key={symbol} variant="secondary" className="text-xs">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sensor Status Distribution */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  {lang === 'ar' ? 'حالة أجهزة الاستشعار' : 'Sensor Status'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Online', value: Array.from(data.iot_sensors.values()).filter(s => s.readings.status === 'online').length, fill: '#10B981' },
                        { name: 'Offline', value: Array.from(data.iot_sensors.values()).filter(s => s.readings.status === 'offline').length, fill: '#EF4444' },
                        { name: 'Maintenance', value: Array.from(data.iot_sensors.values()).filter(s => s.readings.status === 'maintenance').length, fill: '#F59E0B' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blockchain Data Tab */}
        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Network Metrics */}
            <Card className="lg:col-span-2 bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  {lang === 'ar' ? 'مقاييس الشبكات' : 'Network Metrics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  {Array.from(data.blockchain_metrics.entries()).map(([network, metrics]) => (
                    <div key={network} className="p-4 bg-gray-800 rounded-lg text-center">
                      <h3 className="text-sm font-medium text-white capitalize mb-2">{network}</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400">TVL</p>
                          <p className="text-lg font-bold text-trading-primary">
                            ${(metrics.metrics.total_value_locked / 1e9).toFixed(1)}B
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">
                            {lang === 'ar' ? 'العناوين النشطة' : 'Active Addresses'}
                          </p>
                          <p className="text-sm text-white">
                            {(metrics.metrics.active_addresses / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">
                            {lang === 'ar' ? 'المشاعر' : 'Sentiment'}
                          </p>
                          <Badge className={metrics.defi_analysis.market_sentiment > 0 ? 'bg-trading-up' : 'bg-trading-down'}>
                            {metrics.defi_analysis.market_sentiment > 0 ? '+' : ''}{metrics.defi_analysis.market_sentiment.toFixed(0)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Array.from(data.blockchain_metrics.entries()).map(([network, metrics]) => ({
                    network: network.slice(0, 8),
                    tvl: metrics.metrics.total_value_locked / 1e9,
                    volume: metrics.metrics.transaction_volume / 1e9,
                    protocols: metrics.metrics.defi_protocols_count
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="network" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="tvl" fill="#3B82F6" />
                    <Bar dataKey="volume" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* DeFi Protocols */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  {lang === 'ar' ? 'بروتوكولات DeFi' : 'DeFi Protocols'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(data.blockchain_metrics.values())[0]?.defi_analysis.top_protocols.slice(0, 6).map((protocol, index) => (
                    <div key={protocol.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-white">{protocol.name}</h4>
                        <p className="text-xs text-gray-400 capitalize">{protocol.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-trading-primary">
                          ${(protocol.tvl / 1e9).toFixed(2)}B
                        </p>
                        <p className="text-xs text-trading-up">
                          {protocol.apy.toFixed(1)}% APY
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Indicators */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {lang === 'ar' ? 'مؤشرات المخاطر' : 'Risk Indicators'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={Object.entries(Array.from(data.blockchain_metrics.values())[0]?.risk_indicators || {}).map(([key, value]) => ({
                    subject: key.replace('_', ' '),
                    A: value,
                    fullMark: 100
                  }))}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 8 }} />
                    <Radar name="Risk" dataKey="A" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Futures Data Tab */}
        <TabsContent value="futures" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Futures Overview */}
            <Card className="lg:col-span-2 bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {lang === 'ar' ? 'نظرة عامة على العقود الآجلة' : 'Futures Overview'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {Array.from(data.futures_data.entries()).slice(0, 10).map(([symbol, futuresData]) => (
                    <div key={symbol} className="p-4 bg-gray-800 rounded-lg text-center">
                      <h3 className="text-sm font-medium text-white">{symbol}</h3>
                      <p className="text-lg font-bold text-trading-primary">
                        ${futuresData.current_price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        {lang === 'ar' ? 'الأساس' : 'Basis'}: {futuresData.basis.toFixed(2)}
                      </p>
                      <Badge className={
                        futuresData.contango_backwardation === 'contango' ? 'bg-blue-500' :
                        futuresData.contango_backwardation === 'backwardation' ? 'bg-red-500' : 'bg-gray-500'
                      }>
                        {futuresData.contango_backwardation}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={Array.from(data.futures_data.values())[0]?.term_structure.map(point => ({
                    month: point.month.slice(-2),
                    price: point.price,
                    openInterest: point.open_interest / 1000
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis yAxisId="left" stroke="#9CA3AF" />
                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="openInterest" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* COT Analysis */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {lang === 'ar' ? 'تحليل التزام المتداولين' : 'COT Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    {
                      category: 'Commercial Long',
                      value: Array.from(data.futures_data.values())[0]?.commitment_of_traders.commercial_long || 0
                    },
                    {
                      category: 'Commercial Short',
                      value: -(Array.from(data.futures_data.values())[0]?.commitment_of_traders.commercial_short || 0)
                    },
                    {
                      category: 'Non-Commercial Long',
                      value: Array.from(data.futures_data.values())[0]?.commitment_of_traders.non_commercial_long || 0
                    },
                    {
                      category: 'Non-Commercial Short',
                      value: -(Array.from(data.futures_data.values())[0]?.commitment_of_traders.non_commercial_short || 0)
                    }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="value" fill={(entry: any) => entry.value > 0 ? '#10B981' : '#EF4444'} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Seasonality Patterns */}
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {lang === 'ar' ? 'الأنماط الموسمية' : 'Seasonality Patterns'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={Array.from(data.futures_data.values())[0]?.seasonality.map(point => ({
                    month: point.month,
                    performance: point.historical_performance,
                    probability: point.probability_up * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Area type="monotone" dataKey="performance" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="probability" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Insights and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {lang === 'ar' ? 'الرؤى الذكية' : 'Key Insights'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.insights.slice(0, 5).map((insight, index) => (
                <div key={index} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {insight.data_source}
                    </Badge>
                    <Badge className={getImpactColor(insight.market_impact)}>
                      {insight.market_impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-white mb-2">{insight.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{insight.timeframe}</span>
                    <span className="text-xs text-trading-primary">
                      {(insight.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Models */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {lang === 'ar' ? 'نماذج التنبؤ' : 'Predictive Models'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.predictive_models.map((model, index) => (
                <div key={index} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-white">{model.model_name}</h4>
                    <Badge className="bg-trading-primary">
                      {(model.accuracy * 100).toFixed(0)}% accuracy
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {model.predictions.slice(0, 3).map((prediction, predIndex) => (
                      <div key={predIndex} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">{prediction.symbol}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            prediction.predicted_direction === 'up' ? 'bg-trading-up' :
                            prediction.predicted_direction === 'down' ? 'bg-trading-down' : 'bg-gray-500'
                          }>
                            {prediction.predicted_direction}
                          </Badge>
                          <span className="text-gray-400">
                            {(prediction.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-Correlations */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ChevronRight className="h-5 w-5" />
            {lang === 'ar' ? 'الارتباطات المتقاطعة' : 'Cross-Correlations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.cross_correlations.slice(0, 6).map((correlation, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                <div className="mb-3">
                  {correlation.data_pairs.map((pair, pairIndex) => (
                    <Badge key={pairIndex} variant="outline" className="text-xs mr-1 mb-1">
                      {pair.split(':')[1]}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'الارتباط' : 'Correlation'}
                      </span>
                      <span className="text-white">
                        {(correlation.correlation_coefficient * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={Math.abs(correlation.correlation_coefficient) * 100} className="h-2" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">
                      {lang === 'ar' ? 'الأهمية السوقية' : 'Market Relevance'}
                    </span>
                    <span className="text-trading-primary">
                      {(correlation.market_relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlternativeDataDashboard;
