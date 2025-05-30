
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
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Globe,
  Factory,
  Ship,
  Plane,
  Train
} from 'lucide-react';

interface SupplyChainDataProps {
  lang?: 'en' | 'ar';
}

interface SupplyChainMetrics {
  onTimeDelivery: number;
  inventoryLevels: number;
  transportationCosts: number;
  demandForecast: number;
  bottleneckIndex: number;
  riskScore: number;
}

interface SupplyChainNode {
  id: string;
  name: string;
  type: 'supplier' | 'manufacturer' | 'distributor' | 'retailer';
  location: {
    country: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  status: 'operational' | 'delayed' | 'disrupted' | 'critical';
  metrics: SupplyChainMetrics;
  connections: string[];
  impact: 'high' | 'medium' | 'low';
}

interface ShippingRoute {
  id: string;
  origin: string;
  destination: string;
  mode: 'sea' | 'air' | 'land' | 'rail';
  distance: number;
  duration: number;
  cost: number;
  delay: number;
  congestion: number;
  riskLevel: 'low' | 'medium' | 'high';
  commodities: string[];
}

interface SupplyChainAlert {
  id: string;
  type: 'delay' | 'disruption' | 'shortage' | 'price_spike' | 'risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  impact: string[];
  eta: string;
  timestamp: string;
}

const SupplyChainData = ({ lang = 'ar' }: SupplyChainDataProps) => {
  const [supplyChainNodes, setSupplyChainNodes] = useState<SupplyChainNode[]>([]);
  const [shippingRoutes, setShippingRoutes] = useState<ShippingRoute[]>([]);
  const [alerts, setAlerts] = useState<SupplyChainAlert[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [commodityFlows, setCommodityFlows] = useState<any[]>([]);

  useEffect(() => {
    // محاكاة بيانات سلسلة التوريد
    setSupplyChainNodes([
      {
        id: 'supplier-1',
        name: 'Asian Electronics Supplier',
        type: 'supplier',
        location: {
          country: 'China',
          city: 'Shenzhen',
          coordinates: { lat: 22.5431, lng: 114.0579 }
        },
        status: 'delayed',
        metrics: {
          onTimeDelivery: 78,
          inventoryLevels: 65,
          transportationCosts: 85,
          demandForecast: 92,
          bottleneckIndex: 45,
          riskScore: 67
        },
        connections: ['manufacturer-1', 'distributor-1'],
        impact: 'high'
      },
      {
        id: 'manufacturer-1',
        name: 'Global Manufacturing Hub',
        type: 'manufacturer',
        location: {
          country: 'Germany',
          city: 'Munich',
          coordinates: { lat: 48.1351, lng: 11.5820 }
        },
        status: 'operational',
        metrics: {
          onTimeDelivery: 89,
          inventoryLevels: 82,
          transportationCosts: 72,
          demandForecast: 88,
          bottleneckIndex: 32,
          riskScore: 34
        },
        connections: ['distributor-1', 'retailer-1'],
        impact: 'high'
      },
      {
        id: 'distributor-1',
        name: 'European Distribution Center',
        type: 'distributor',
        location: {
          country: 'Netherlands',
          city: 'Rotterdam',
          coordinates: { lat: 51.9244, lng: 4.4777 }
        },
        status: 'operational',
        metrics: {
          onTimeDelivery: 94,
          inventoryLevels: 88,
          transportationCosts: 68,
          demandForecast: 91,
          bottleneckIndex: 28,
          riskScore: 29
        },
        connections: ['retailer-1', 'retailer-2'],
        impact: 'medium'
      }
    ]);

    setShippingRoutes([
      {
        id: 'route-1',
        origin: 'Shanghai',
        destination: 'Rotterdam',
        mode: 'sea',
        distance: 19500,
        duration: 28,
        cost: 2400,
        delay: 3,
        congestion: 67,
        riskLevel: 'medium',
        commodities: ['Electronics', 'Textiles', 'Machinery']
      },
      {
        id: 'route-2',
        origin: 'Los Angeles',
        destination: 'Tokyo',
        mode: 'sea',
        distance: 8800,
        duration: 14,
        cost: 1800,
        delay: 1,
        congestion: 45,
        riskLevel: 'low',
        commodities: ['Food Products', 'Chemicals', 'Automobiles']
      },
      {
        id: 'route-3',
        origin: 'Frankfurt',
        destination: 'New York',
        mode: 'air',
        distance: 6200,
        duration: 8,
        cost: 4500,
        delay: 0,
        congestion: 23,
        riskLevel: 'low',
        commodities: ['Pharmaceuticals', 'Electronics', 'Luxury Goods']
      }
    ]);

    setAlerts([
      {
        id: 'alert-1',
        type: 'delay',
        severity: 'high',
        location: 'Suez Canal',
        description: 'ازدحام مروري يؤثر على 15% من حركة الشحن العالمية',
        impact: ['Oil', 'Container Shipping', 'Electronics'],
        eta: '72 hours',
        timestamp: '2024-03-15 10:30'
      },
      {
        id: 'alert-2',
        type: 'shortage',
        severity: 'medium',
        location: 'Southeast Asia',
        description: 'نقص في أشباه الموصلات يؤثر على صناعة الإلكترونيات',
        impact: ['Technology', 'Automotive', 'Consumer Electronics'],
        eta: '2 weeks',
        timestamp: '2024-03-15 09:15'
      },
      {
        id: 'alert-3',
        type: 'price_spike',
        severity: 'high',
        location: 'Global',
        description: 'ارتفاع أسعار الوقود يؤثر على تكاليف النقل',
        impact: ['Transportation', 'Logistics', 'All Commodities'],
        eta: 'ongoing',
        timestamp: '2024-03-15 08:00'
      }
    ]);

    // بيانات الأداء التاريخية
    setPerformanceData([
      { date: '2024-01', onTime: 87, costs: 2300, inventory: 78, risk: 34 },
      { date: '2024-02', onTime: 82, costs: 2450, inventory: 72, risk: 42 },
      { date: '2024-03', onTime: 79, costs: 2600, inventory: 68, risk: 48 },
      { date: '2024-04', onTime: 85, costs: 2520, inventory: 75, risk: 39 },
      { date: '2024-05', onTime: 88, costs: 2380, inventory: 82, risk: 31 },
      { date: '2024-06', onTime: 84, costs: 2480, inventory: 79, risk: 36 }
    ]);

    setCommodityFlows([
      { commodity: 'Electronics', flow: 35, color: '#3B82F6' },
      { commodity: 'Textiles', flow: 22, color: '#10B981' },
      { commodity: 'Machinery', flow: 18, color: '#F59E0B' },
      { commodity: 'Chemicals', flow: 15, color: '#EF4444' },
      { commodity: 'Food Products', flow: 10, color: '#8B5CF6' }
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <div className="w-3 h-3 bg-green-500 rounded-full" />;
      case 'delayed':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" />;
      case 'disrupted':
        return <div className="w-3 h-3 bg-orange-500 rounded-full" />;
      case 'critical':
        return <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full" />;
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'sea':
        return <Ship className="h-4 w-4 text-blue-400" />;
      case 'air':
        return <Plane className="h-4 w-4 text-blue-600" />;
      case 'land':
        return <Truck className="h-4 w-4 text-green-400" />;
      case 'rail':
        return <Train className="h-4 w-4 text-purple-400" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 text-red-400 bg-red-900/20';
      case 'high':
        return 'border-orange-500 text-orange-400 bg-orange-900/20';
      case 'medium':
        return 'border-yellow-500 text-yellow-400 bg-yellow-900/20';
      case 'low':
        return 'border-green-500 text-green-400 bg-green-900/20';
      default:
        return 'border-gray-500 text-gray-400 bg-gray-900/20';
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
            <Truck className="h-6 w-6 text-blue-400" />
            {lang === 'ar' ? 'بيانات سلسلة التوريد' : 'Supply Chain Data'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'مراقبة وتحليل سلاسل التوريد العالمية والتنبؤ بالاضطرابات'
              : 'Monitor and analyze global supply chains and predict disruptions'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-600">
            {lang === 'ar' ? 'مراقبة مباشرة' : 'Live Monitoring'}
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            {lang === 'ar' ? 'عالمي' : 'Global'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">
            {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="nodes">
            {lang === 'ar' ? 'العقد' : 'Nodes'}
          </TabsTrigger>
          <TabsTrigger value="routes">
            {lang === 'ar' ? 'الطرق' : 'Routes'}
          </TabsTrigger>
          <TabsTrigger value="alerts">
            {lang === 'ar' ? 'التنبيهات' : 'Alerts'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {lang === 'ar' ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'التسليم في الموعد' : 'On-Time Delivery'}
                    </p>
                    <p className="text-2xl font-bold text-white">87%</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+2.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'تكاليف النقل' : 'Transport Costs'}
                    </p>
                    <p className="text-2xl font-bold text-white">$2.4K</p>
                  </div>
                  <Truck className="h-8 w-8 text-orange-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-red-400" />
                  <span className="text-red-400 text-xs">+8.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'مستويات المخزون' : 'Inventory Levels'}
                    </p>
                    <p className="text-2xl font-bold text-white">78%</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+1.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'مؤشر المخاطر' : 'Risk Index'}
                    </p>
                    <p className="text-2xl font-bold text-white">43</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-red-400" />
                  <span className="text-red-400 text-xs">+5.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'اتجاهات الأداء' : 'Performance Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="onTime"
                      stroke="#10B981"
                      strokeWidth={2}
                      name={lang === 'ar' ? 'التسليم في الموعد (%)' : 'On-Time Delivery (%)'}
                    />
                    <Line
                      type="monotone"
                      dataKey="inventory"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name={lang === 'ar' ? 'مستوى المخزون (%)' : 'Inventory Level (%)'}
                    />
                    <Line
                      type="monotone"
                      dataKey="risk"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name={lang === 'ar' ? 'مؤشر المخاطر' : 'Risk Index'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'تدفق السلع' : 'Commodity Flow'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={commodityFlows}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="flow"
                      label={({ commodity, flow }) => `${commodity}: ${flow}%`}
                    >
                      {commodityFlows.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Nodes Tab */}
        <TabsContent value="nodes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {supplyChainNodes.map((node) => (
              <Card key={node.id} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Factory className="h-5 w-5" />
                      {node.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(node.status)}
                      <Badge variant="outline" className="text-xs">
                        {node.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{node.location.city}, {node.location.country}</span>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400">
                          {lang === 'ar' ? 'التسليم في الموعد' : 'On-Time'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-1">
                            <div
                              className="bg-green-500 h-1 rounded-full"
                              style={{ width: `${node.metrics.onTimeDelivery}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(node.metrics.onTimeDelivery)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          {lang === 'ar' ? 'المخزون' : 'Inventory'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full"
                              style={{ width: `${node.metrics.inventoryLevels}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(node.metrics.inventoryLevels)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          {lang === 'ar' ? 'مؤشر المخاطر' : 'Risk Score'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${
                                node.metrics.riskScore > 70 ? 'bg-red-500' :
                                node.metrics.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${node.metrics.riskScore}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(node.metrics.riskScore)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          {lang === 'ar' ? 'الاختناقات' : 'Bottlenecks'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-1">
                            <div
                              className="bg-orange-500 h-1 rounded-full"
                              style={{ width: `${node.metrics.bottleneckIndex}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(node.metrics.bottleneckIndex)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Impact Level */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {lang === 'ar' ? 'مستوى التأثير' : 'Impact Level'}
                      </span>
                      <Badge 
                        variant="outline"
                        className={
                          node.impact === 'high' ? 'border-red-500 text-red-400' :
                          node.impact === 'medium' ? 'border-yellow-500 text-yellow-400' :
                          'border-green-500 text-green-400'
                        }
                      >
                        {lang === 'ar' ? 
                          (node.impact === 'high' ? 'عالي' :
                           node.impact === 'medium' ? 'متوسط' : 'منخفض') :
                          node.impact}
                      </Badge>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {lang === 'ar' ? 'الحالة' : 'Status'}
                      </span>
                      <Badge className={
                        node.status === 'operational' ? 'bg-green-600' :
                        node.status === 'delayed' ? 'bg-yellow-600' :
                        node.status === 'disrupted' ? 'bg-orange-600' : 'bg-red-600'
                      }>
                        {lang === 'ar' ? 
                          (node.status === 'operational' ? 'تشغيلي' :
                           node.status === 'delayed' ? 'متأخر' :
                           node.status === 'disrupted' ? 'معطل' : 'حرج') :
                          node.status}
                      </Badge>
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

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shippingRoutes.map((route) => (
              <Card key={route.id} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTransportIcon(route.mode)}
                      {route.origin} → {route.destination}
                    </div>
                    <Badge className={
                      route.riskLevel === 'low' ? 'bg-green-600' :
                      route.riskLevel === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                    }>
                      {lang === 'ar' ? 
                        (route.riskLevel === 'low' ? 'منخفض المخاطر' :
                         route.riskLevel === 'medium' ? 'متوسط المخاطر' : 'عالي المخاطر') :
                        route.riskLevel + ' risk'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Route Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'المسافة' : 'Distance'}
                        </p>
                        <p className="text-white font-semibold">
                          {formatArabicNumber(route.distance)} km
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'المدة' : 'Duration'}
                        </p>
                        <p className="text-white font-semibold">
                          {formatArabicNumber(route.duration)} {lang === 'ar' ? 'يوم' : 'days'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'التكلفة' : 'Cost'}
                        </p>
                        <p className="text-white font-semibold">
                          ${formatArabicNumber(route.cost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'التأخير' : 'Delay'}
                        </p>
                        <p className={route.delay > 0 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                          {route.delay > 0 ? `+${formatArabicNumber(route.delay)}` : '0'} {lang === 'ar' ? 'يوم' : 'days'}
                        </p>
                      </div>
                    </div>

                    {/* Congestion Level */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'مستوى الازدحام' : 'Congestion Level'}
                        </span>
                        <span className="text-white">
                          {formatArabicNumber(route.congestion)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            route.congestion > 70 ? 'bg-red-500' :
                            route.congestion > 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${route.congestion}%` }}
                        />
                      </div>
                    </div>

                    {/* Commodities */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        {lang === 'ar' ? 'السلع المنقولة' : 'Transported Commodities'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {route.commodities.map((commodity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {commodity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      {lang === 'ar' ? 'تتبع الشحنة' : 'Track Shipment'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`bg-trading-card border ${getSeverityColor(alert.severity)}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.severity === 'critical' ? 'text-red-400' :
                        alert.severity === 'high' ? 'text-orange-400' :
                        alert.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`} />
                      <Badge className={`${
                        alert.severity === 'critical' ? 'bg-red-600' :
                        alert.severity === 'high' ? 'bg-orange-600' :
                        alert.severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {lang === 'ar' ? 
                          (alert.severity === 'critical' ? 'حرج' :
                           alert.severity === 'high' ? 'عالي' :
                           alert.severity === 'medium' ? 'متوسط' : 'منخفض') :
                          alert.severity}
                      </Badge>
                      <Badge variant="outline">
                        {lang === 'ar' ? 
                          (alert.type === 'delay' ? 'تأخير' :
                           alert.type === 'disruption' ? 'اضطراب' :
                           alert.type === 'shortage' ? 'نقص' :
                           alert.type === 'price_spike' ? 'ارتفاع أسعار' : 'مخاطر') :
                          alert.type}
                      </Badge>
                    </div>
                    
                    <h3 className="text-white font-semibold mb-2">
                      {alert.location}
                    </h3>
                    
                    <p className="text-gray-300 mb-3">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span>ETA: {alert.eta}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        {lang === 'ar' ? 'السلع المتأثرة' : 'Affected Commodities'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {alert.impact.map((commodity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {commodity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-gray-600">
                      {lang === 'ar' ? 'تفاصيل' : 'Details'}
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      {lang === 'ar' ? 'إجراء' : 'Action'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Cost Analysis */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'تحليل التكاليف والأداء' : 'Cost and Performance Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="costs"
                    stackId="1"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                    name={lang === 'ar' ? 'التكاليف ($)' : 'Costs ($)'}
                  />
                  <Area
                    type="monotone"
                    dataKey="onTime"
                    stackId="2"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    name={lang === 'ar' ? 'التسليم في الموعد (%)' : 'On-Time Delivery (%)'}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Predictive Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'رؤى تنبؤية' : 'Predictive Insights'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900/30 rounded border border-blue-700">
                    <h4 className="text-blue-300 font-semibold mb-2">
                      {lang === 'ar' ? 'توقع الطلب' : 'Demand Forecast'}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'متوقع زيادة الطلب على الإلكترونيات بنسبة 12% خلال الربع القادم'
                        : 'Expected 12% increase in electronics demand next quarter'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-900/30 rounded border border-yellow-700">
                    <h4 className="text-yellow-300 font-semibold mb-2">
                      {lang === 'ar' ? 'تحذير مخاطر' : 'Risk Warning'}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'احتمال اضطراب في طرق الشحن البحري بسبب الأحوال الجوية'
                        : 'Potential sea shipping disruption due to weather conditions'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-900/30 rounded border border-green-700">
                    <h4 className="text-green-300 font-semibold mb-2">
                      {lang === 'ar' ? 'فرصة تحسين' : 'Optimization Opportunity'}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {lang === 'ar' 
                        ? 'إمكانية توفير 8% من تكاليف النقل باستخدام طرق بديلة'
                        : 'Potential 8% cost savings using alternative routes'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {lang === 'ar' ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'كفاءة سلسلة التوريد' : 'Supply Chain Efficiency'}
                      </span>
                      <span className="text-white font-semibold">82%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'رضا الموردين' : 'Supplier Satisfaction'}
                      </span>
                      <span className="text-white font-semibold">91%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'استقرار الجودة' : 'Quality Stability'}
                      </span>
                      <span className="text-white font-semibold">95%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'الامتثال التنظيمي' : 'Regulatory Compliance'}
                      </span>
                      <span className="text-white font-semibold">98%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }} />
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

export default SupplyChainData;
