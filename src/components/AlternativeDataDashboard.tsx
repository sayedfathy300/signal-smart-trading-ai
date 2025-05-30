import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Satellite, Radio, CreditCard, BarChart3, Package } from 'lucide-react';

interface DataSource {
  name: string;
  status: 'active' | 'inactive';
  lastUpdate: string;
  reliability: number;
  description: string;
}

interface SatelliteData {
  date: string;
  activity: number;
}

const AlternativeDataDashboard = ({ lang = 'ar' }: { lang?: 'en' | 'ar' }) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      name: 'Satellite Imagery',
      status: 'active',
      lastUpdate: '2024-03-15 14:30',
      reliability: 95,
      description: 'Provides real-time imagery of agricultural fields and infrastructure.'
    },
    {
      name: 'Social Media Sentiment',
      status: 'inactive',
      lastUpdate: '2024-03-15 14:00',
      reliability: 88,
      description: 'Tracks public sentiment towards companies and products.'
    },
    {
      name: 'Credit Card Transactions',
      status: 'active',
      lastUpdate: '2024-03-15 13:45',
      reliability: 92,
      description: 'Aggregated transaction data for consumer spending analysis.'
    },
  ]);

  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([
    { date: '2024-03-01', activity: 1200 },
    { date: '2024-03-02', activity: 1300 },
    { date: '2024-03-03', activity: 1250 },
    { date: '2024-03-04', activity: 1400 },
    { date: '2024-03-05', activity: 1350 },
    { date: '2024-03-06', activity: 1500 },
    { date: '2024-03-07', activity: 1450 },
  ]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      // Replace with actual API endpoint
      // const response = await fetch('/api/alternative-data');
      // const data = await response.json();
      // setDataSources(data.dataSources);
      // setSatelliteData(data.satelliteData);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-trading-bg via-gray-900 to-black min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          {lang === 'ar' ? 'لوحة بيانات البيانات البديلة' : 'Alternative Data Dashboard'}
        </h1>
        <p className="text-xl text-gray-300">
          {lang === 'ar'
            ? 'تحليل متعمق لمصادر البيانات البديلة لاتخاذ قرارات استثمارية مستنيرة'
            : 'In-depth analysis of alternative data sources for informed investment decisions'}
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-400" />
              {lang === 'ar' ? 'إنفاق المستهلك' : 'Consumer Spending'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {lang === 'ar' ? '2.5 مليون دولار' : '$2.5M'}
            </div>
            <p className="text-gray-400">
              {lang === 'ar' ? 'إجمالي الإنفاق الأسبوعي' : 'Total weekly spending'}
            </p>
          </CardContent>
        </Card>

        {/* Stat Card 2 */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              {lang === 'ar' ? 'نمو الإيرادات' : 'Revenue Growth'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+12.3%</div>
            <p className="text-gray-400">
              {lang === 'ar' ? 'نمو الإيرادات الشهري' : 'Monthly revenue growth'}
            </p>
          </CardContent>
        </Card>

        {/* Stat Card 3 */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-400" />
              {lang === 'ar' ? 'حجم الشحن' : 'Shipping Volume'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">15,420</div>
            <p className="text-gray-400">
              {lang === 'ar' ? 'الشحنات الأسبوعية' : 'Weekly shipments'}
            </p>
          </CardContent>
        </Card>

        {/* Stat Card 4 */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Satellite className="w-5 h-5 text-purple-400" />
              {lang === 'ar' ? 'تغطية الأقمار الصناعية' : 'Satellite Coverage'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">85%</div>
            <p className="text-gray-400">
              {lang === 'ar' ? 'تغطية الأراضي الزراعية' : 'Agricultural land coverage'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Satellite Data Analysis */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Satellite className="w-5 h-5 text-blue-400" />
              {lang === 'ar' ? 'تحليل البيانات الفضائية' : 'Satellite Data Analysis'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={satelliteData}>
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
                    dataKey="activity"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Sentiment Analysis */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-green-400" />
              {lang === 'ar' ? 'تحليل المشاعر على وسائل التواصل الاجتماعي' : 'Social Media Sentiment Analysis'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400">
                {lang === 'ar'
                  ? 'المشاعر الإيجابية تزيد بنسبة 15٪ مقارنة بالشهر الماضي'
                  : 'Positive sentiment up 15% compared to last month'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {lang === 'ar' ? 'المشاعر الإيجابية' : 'Positive Sentiment'}
                </span>
                <span className="text-green-400 font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '78%' }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {lang === 'ar' ? 'المشاعر السلبية' : 'Negative Sentiment'}
                </span>
                <span className="text-red-400 font-medium">22%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '22%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Card Transaction Analysis */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-400" />
              {lang === 'ar' ? 'تحليل معاملات بطاقات الائتمان' : 'Credit Card Transaction Analysis'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400">
                {lang === 'ar'
                  ? 'زيادة بنسبة 10٪ في الإنفاق على المطاعم مقارنة بالشهر الماضي'
                  : '10% increase in spending on restaurants compared to last month'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {lang === 'ar' ? 'الإنفاق على المطاعم' : 'Restaurant Spending'}
                </span>
                <span className="text-blue-400 font-medium">
                  {lang === 'ar' ? '1.2 مليون دولار' : '$1.2M'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '60%' }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {lang === 'ar' ? 'الإنفاق على الترفيه' : 'Entertainment Spending'}
                </span>
                <span className="text-blue-400 font-medium">
                  {lang === 'ar' ? '800 ألف دولار' : '$800K'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '40%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Data Sources */}
      <Card className="bg-trading-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-green-400" />
            {lang === 'ar' ? 'مصادر البيانات في الوقت الفعلي' : 'Real-time Data Sources'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((source, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{source.name}</h4>
                  <Badge
                    variant={source.status === 'active' ? 'default' : 'secondary'}
                    className={source.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                  >
                    {source.status === 'active' 
                      ? (lang === 'ar' ? 'نشط' : 'Active')
                      : (lang === 'ar' ? 'غير نشط' : 'Inactive')
                    }
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mb-2">{source.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'آخر تحديث:' : 'Last Update:'} {source.lastUpdate}
                  </span>
                  <span className="text-blue-400 font-medium">{source.reliability}%</span>
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
