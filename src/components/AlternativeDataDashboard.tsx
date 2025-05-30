
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Satellite, 
  Wifi, 
  Cpu, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  MapPin,
  Activity,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { alternativeDataService, type ComprehensiveAlternativeData } from '@/services/alternativeDataService';

interface AlternativeDataDashboardProps {
  lang?: 'en' | 'ar';
}

const AlternativeDataDashboard = ({ lang = 'ar' }: AlternativeDataDashboardProps) => {
  const [data, setData] = useState<ComprehensiveAlternativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDataSource, setSelectedDataSource] = useState<'satellite' | 'iot' | 'blockchain' | 'futures'>('satellite');

  useEffect(() => {
    loadAlternativeData();
  }, []);

  const loadAlternativeData = async () => {
    try {
      setLoading(true);
      const alternativeData = await alternativeDataService.getComprehensiveAlternativeData();
      setData(alternativeData);
    } catch (error) {
      console.error('خطأ في تحميل البيانات البديلة:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2 text-trading-primary" />
          <p className="text-gray-400">
            {lang === 'ar' ? 'جاري تحميل البيانات البديلة...' : 'Loading alternative data...'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-400">
        {lang === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available'}
      </div>
    );
  }

  // إعداد بيانات الرسوم البيانية
  const satelliteChartData = Array.from(data.satellite_data.values()).slice(0, 8).map(item => ({
    name: item.location.name,
    activity: item.metrics.economic_activity,
    growth: item.trends.monthly_change,
    confidence: item.confidence_score * 100
  }));

  const iotSensorData = Array.from(data.iot_sensors.values()).slice(0, 6).map(sensor => ({
    type: sensor.sensor_type,
    value: sensor.readings.value,
    accuracy: sensor.readings.accuracy * 100,
    correlation: sensor.correlations.correlation_strength * 100
  }));

  const blockchainData = Array.from(data.blockchain_metrics.values()).map(blockchain => ({
    network: blockchain.network,
    tvl: blockchain.metrics.total_value_locked / 1000000000,
    addresses: blockchain.metrics.active_addresses / 1000,
    sentiment: blockchain.defi_analysis.market_sentiment + 100
  }));

  const futuresData = Array.from(data.futures_data.values()).slice(0, 6).map(future => ({
    symbol: future.symbol,
    price: future.current_price,
    volume: future.volume / 1000,
    openInterest: future.open_interest / 1000,
    basis: future.basis
  }));

  const alertsData = [
    { name: lang === 'ar' ? 'عالية' : 'High', value: data.real_time_alerts.filter(a => a.severity === 'high').length, color: '#EF4444' },
    { name: lang === 'ar' ? 'متوسطة' : 'Medium', value: data.real_time_alerts.filter(a => a.severity === 'medium').length, color: '#F59E0B' },
    { name: lang === 'ar' ? 'منخفضة' : 'Low', value: data.real_time_alerts.filter(a => a.severity === 'low').length, color: '#10B981' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Satellite className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'مواقع القمر الصناعي' : 'Satellite Locations'}
                </p>
                <p className="text-xl font-bold text-white">{data.satellite_data.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'أجهزة IoT' : 'IoT Sensors'}
                </p>
                <p className="text-xl font-bold text-white">{data.iot_sensors.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'شبكات البلوك تشين' : 'Blockchain Networks'}
                </p>
                <p className="text-xl font-bold text-white">{data.blockchain_metrics.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">
                  {lang === 'ar' ? 'العقود الآجلة' : 'Futures Contracts'}
                </p>
                <p className="text-xl font-bold text-white">{data.futures_data.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Selection */}
      <div className="flex flex-wrap gap-2">
        {['satellite', 'iot', 'blockchain', 'futures'].map((source) => (
          <Button
            key={source}
            variant={selectedDataSource === source ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDataSource(source as typeof selectedDataSource)}
            className={selectedDataSource === source ? "bg-trading-primary" : ""}
          >
            {lang === 'ar' ? 
              (source === 'satellite' ? 'أقمار صناعية' : 
               source === 'iot' ? 'إنترنت الأشياء' :
               source === 'blockchain' ? 'بلوك تشين' : 'عقود آجلة') :
              source.charAt(0).toUpperCase() + source.slice(1)
            }
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {selectedDataSource === 'satellite' && (lang === 'ar' ? 'النشاط الاقتصادي للأقمار الصناعية' : 'Satellite Economic Activity')}
              {selectedDataSource === 'iot' && (lang === 'ar' ? 'قراءات أجهزة IoT' : 'IoT Sensor Readings')}
              {selectedDataSource === 'blockchain' && (lang === 'ar' ? 'مقاييس البلوك تشين' : 'Blockchain Metrics')}
              {selectedDataSource === 'futures' && (lang === 'ar' ? 'أسعار العقود الآجلة' : 'Futures Prices')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {selectedDataSource === 'satellite' && (
                <BarChart data={satelliteChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="activity" fill="#3B82F6" />
                </BarChart>
              )}
              {selectedDataSource === 'iot' && (
                <AreaChart data={iotSensorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              )}
              {selectedDataSource === 'blockchain' && (
                <LineChart data={blockchainData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="network" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="tvl" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              )}
              {selectedDataSource === 'futures' && (
                <BarChart data={futuresData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="symbol" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="price" fill="#F59E0B" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts Distribution */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {lang === 'ar' ? 'توزيع التنبيهات' : 'Alert Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={alertsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {alertsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {alertsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Insights */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {lang === 'ar' ? 'الرؤى الحديثة' : 'Recent Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.insights.slice(0, 5).map((insight, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={
                      insight.market_impact === 'high' ? 'bg-red-500' :
                      insight.market_impact === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }>
                      {insight.market_impact}
                    </Badge>
                    <Badge variant="outline">
                      {insight.data_source}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">{insight.timeframe}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">
                      {lang === 'ar' ? 'الثقة:' : 'Confidence:'}
                    </span>
                    <span className="text-xs text-trading-primary">
                      {(insight.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  {insight.risk_reward_ratio && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">R/R:</span>
                      <span className="text-xs text-white">{insight.risk_reward_ratio.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Alerts */}
      {data.real_time_alerts.length > 0 && (
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {lang === 'ar' ? 'التنبيهات الفورية' : 'Real-time Alerts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.real_time_alerts.slice(0, 4).map((alert, index) => (
                <div key={index} className="p-3 bg-gray-800 rounded-lg border-l-4" style={{
                  borderLeftColor: alert.severity === 'high' ? '#EF4444' : 
                                   alert.severity === 'medium' ? '#F59E0B' : '#10B981'
                }}>
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlternativeDataDashboard;
