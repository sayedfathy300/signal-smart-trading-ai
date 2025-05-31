import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fundamentalAnalysisService } from '@/services/fundamentalAnalysisService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator,
  Globe,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Calendar
} from 'lucide-react';

interface FundamentalAnalysisProps {
  symbol: string;
  lang?: 'en' | 'ar';
}

export function FundamentalAnalysis({ symbol, lang = 'ar' }: FundamentalAnalysisProps) {
  const [fundamentalData, setFundamentalData] = useState<any>(null);
  const [economicData, setEconomicData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1year' | '3years' | '5years'>('3years');

  useEffect(() => {
    loadFundamentals();
  }, [symbol, selectedTimeframe]);

  const loadFundamentals = async () => {
    setLoading(true);
    try {
      const [fundamentalsData, economicData] = await Promise.all([
        fundamentalAnalysisService.getCompanyFinancials(symbol),
        fundamentalAnalysisService.getEconomicIndicators()
      ]);

      console.log('Loaded fundamental data:', fundamentalsData);
      console.log('Loaded economic data:', economicData);

      setFundamentalData(fundamentalsData);
      setEconomicData(economicData);
    } catch (error) {
      console.error('Error loading fundamentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const safeToFixed = (value: any, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  const getValuationColor = (ratio: number, metric: string) => {
    if (!ratio || isNaN(ratio)) return '#9CA3AF';
    
    switch (metric) {
      case 'PE':
        if (ratio < 15) return '#00FF88';
        if (ratio < 25) return '#FFD700';
        return '#FF4444';
      case 'PB':
        if (ratio < 1.5) return '#00FF88';
        if (ratio < 3) return '#FFD700';
        return '#FF4444';
      case 'ROE':
        if (ratio > 15) return '#00FF88';
        if (ratio > 10) return '#FFD700';
        return '#FF4444';
      default:
        return '#9CA3AF';
    }
  };

  const getValuationSignal = (ratio: number, metric: string) => {
    if (!ratio || isNaN(ratio)) return 'HOLD';
    
    switch (metric) {
      case 'PE':
        if (ratio < 15) return 'BUY';
        if (ratio < 25) return 'HOLD';
        return 'SELL';
      case 'PB':
        if (ratio < 1.5) return 'BUY';
        if (ratio < 3) return 'HOLD';
        return 'SELL';
      case 'ROE':
        if (ratio > 15) return 'BUY';
        if (ratio > 10) return 'HOLD';
        return 'SELL';
      default:
        return 'HOLD';
    }
  };

  if (loading) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-trading-light animate-pulse">
              {lang === 'ar' ? 'جاري تحميل التحليل الأساسي...' : 'Loading Fundamental Analysis...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fundamentalData) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            {lang === 'ar' ? 'لا توجد بيانات أساسية متاحة' : 'No fundamental data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {lang === 'ar' ? `التحليل الأساسي - ${symbol}` : `Fundamental Analysis - ${symbol}`}
        </h2>
        <div className="flex gap-3">
          <div className="flex gap-2">
            {(['1year', '3years', '5years'] as const).map(timeframe => (
              <Button
                key={timeframe}
                size="sm"
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe === '1year' ? (lang === 'ar' ? 'سنة' : '1Y') :
                 timeframe === '3years' ? (lang === 'ar' ? '3 سنوات' : '3Y') :
                 (lang === 'ar' ? '5 سنوات' : '5Y')}
              </Button>
            ))}
          </div>
          <Button onClick={loadFundamentals} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Company Overview */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {lang === 'ar' ? 'نظرة عامة على الشركة' : 'Company Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'القطاع' : 'Sector'}</div>
              <div className="font-bold text-lg">{fundamentalData.sector || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'الصناعة' : 'Industry'}</div>
              <div className="font-bold text-lg">{fundamentalData.industry || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'القيمة السوقية' : 'Market Cap'}</div>
              <div className="font-bold text-lg">{fundamentalData.marketCap || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'عدد الموظفين' : 'Employees'}</div>
              <div className="font-bold text-lg">{fundamentalData.employees?.toLocaleString() || 'N/A'}</div>
            </div>
          </div>
          {fundamentalData.description && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-gray-300 text-sm">{fundamentalData.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              P/E Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div 
                className="text-2xl font-bold"
                style={{ color: getValuationColor(fundamentalData.pe_ratio, 'PE') }}
              >
                {safeToFixed(fundamentalData.pe_ratio)}
              </div>
              <Badge 
                variant={
                  getValuationSignal(fundamentalData.pe_ratio, 'PE') === 'BUY' ? 'default' :
                  getValuationSignal(fundamentalData.pe_ratio, 'PE') === 'SELL' ? 'destructive' : 'secondary'
                }
              >
                {getValuationSignal(fundamentalData.pe_ratio, 'PE')}
              </Badge>
              <div className="text-xs text-gray-400 mt-2">
                {lang === 'ar' ? 'القطاع:' : 'Sector Avg:'} {safeToFixed(fundamentalData.sector_pe)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              P/B Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div 
                className="text-2xl font-bold"
                style={{ color: getValuationColor(fundamentalData.pb_ratio, 'PB') }}
              >
                {safeToFixed(fundamentalData.pb_ratio)}
              </div>
              <Badge 
                variant={
                  getValuationSignal(fundamentalData.pb_ratio, 'PB') === 'BUY' ? 'default' :
                  getValuationSignal(fundamentalData.pb_ratio, 'PB') === 'SELL' ? 'destructive' : 'secondary'
                }
              >
                {getValuationSignal(fundamentalData.pb_ratio, 'PB')}
              </Badge>
              <div className="text-xs text-gray-400 mt-2">
                {lang === 'ar' ? 'القطاع:' : 'Sector Avg:'} {safeToFixed(fundamentalData.sector_pb)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              ROE %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div 
                className="text-2xl font-bold"
                style={{ color: getValuationColor(fundamentalData.roe, 'ROE') }}
              >
                {safeToFixed(fundamentalData.roe, 1)}%
              </div>
              <Badge 
                variant={
                  getValuationSignal(fundamentalData.roe, 'ROE') === 'BUY' ? 'default' :
                  getValuationSignal(fundamentalData.roe, 'ROE') === 'SELL' ? 'destructive' : 'secondary'
                }
              >
                {getValuationSignal(fundamentalData.roe, 'ROE')}
              </Badge>
              <div className="text-xs text-gray-400 mt-2">
                {lang === 'ar' ? 'القطاع:' : 'Sector Avg:'} {safeToFixed(fundamentalData.sector_roe, 1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {lang === 'ar' ? 'توزيعات الأرباح' : 'Dividend Yield'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {safeToFixed(fundamentalData.dividend_yield)}%
              </div>
              <Badge variant="default">
                {(fundamentalData.dividend_yield || 0) > 3 ? 'HIGH' : (fundamentalData.dividend_yield || 0) > 1 ? 'MEDIUM' : 'LOW'}
              </Badge>
              <div className="text-xs text-gray-400 mt-2">
                {lang === 'ar' ? 'نمو سنوي:' : 'Annual Growth:'} {safeToFixed(fundamentalData.dividend_growth, 1)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="financials" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-trading-card">
          <TabsTrigger value="financials">{lang === 'ar' ? 'البيانات المالية' : 'Financials'}</TabsTrigger>
          <TabsTrigger value="ratios">{lang === 'ar' ? 'النسب المالية' : 'Ratios'}</TabsTrigger>
          <TabsTrigger value="growth">{lang === 'ar' ? 'النمو' : 'Growth'}</TabsTrigger>
          <TabsTrigger value="dcf">{lang === 'ar' ? 'التقييم DCF' : 'DCF Valuation'}</TabsTrigger>
          <TabsTrigger value="competitors">{lang === 'ar' ? 'المنافسون' : 'Competitors'}</TabsTrigger>
          <TabsTrigger value="economic">{lang === 'ar' ? 'المؤشرات الاقتصادية' : 'Economic'}</TabsTrigger>
        </TabsList>

        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'الإيرادات السنوية' : 'Annual Revenue'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fundamentalData.revenue_history || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Area
                        dataKey="revenue"
                        stroke="#00FF88"
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00FF88" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'صافي الأرباح' : 'Net Income'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fundamentalData.net_income_history || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Bar 
                        dataKey="net_income" 
                        fill="#60A5FA"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle>{lang === 'ar' ? 'البيان المالي الأساسي' : 'Key Financial Metrics'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400">{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
                  <div className="text-xl font-bold text-green-400">{fundamentalData.total_revenue || 'N/A'}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    YoY: {fundamentalData.revenue_growth > 0 ? '+' : ''}{safeToFixed(fundamentalData.revenue_growth, 1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">{lang === 'ar' ? 'إجمالي الأصول' : 'Total Assets'}</div>
                  <div className="text-xl font-bold text-blue-400">{fundamentalData.total_assets || 'N/A'}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">{lang === 'ar' ? 'إجمالي الديون' : 'Total Debt'}</div>
                  <div className="text-xl font-bold text-red-400">{fundamentalData.total_debt || 'N/A'}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    D/E: {safeToFixed(fundamentalData.debt_to_equity)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">{lang === 'ar' ? 'التدفق النقدي الحر' : 'Free Cash Flow'}</div>
                  <div className="text-xl font-bold text-green-400">{fundamentalData.free_cash_flow || 'N/A'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'نسب التقييم' : 'Valuation Ratios'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'P/E Ratio', value: fundamentalData.pe_ratio, benchmark: 20, unit: '' },
                    { name: 'P/B Ratio', value: fundamentalData.pb_ratio, benchmark: 2, unit: '' },
                    { name: 'P/S Ratio', value: fundamentalData.ps_ratio, benchmark: 3, unit: '' },
                    { name: 'EV/EBITDA', value: fundamentalData.ev_ebitda, benchmark: 15, unit: '' }
                  ].map((ratio, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{ratio.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{ratio.value.toFixed(2)}{ratio.unit}</span>
                        <Badge 
                          variant={
                            ratio.value < ratio.benchmark ? 'default' : 
                            ratio.value < ratio.benchmark * 1.5 ? 'secondary' : 'destructive'
                          }
                        >
                          {ratio.value < ratio.benchmark ? 'Good' : 
                           ratio.value < ratio.benchmark * 1.5 ? 'Fair' : 'High'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'نسب الربحية' : 'Profitability Ratios'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'ROE', value: fundamentalData.roe, benchmark: 15, unit: '%' },
                    { name: 'ROA', value: fundamentalData.roa, benchmark: 8, unit: '%' },
                    { name: 'ROIC', value: fundamentalData.roic, benchmark: 12, unit: '%' },
                    { name: 'Net Margin', value: fundamentalData.net_margin, benchmark: 10, unit: '%' }
                  ].map((ratio, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{ratio.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{ratio.value.toFixed(1)}{ratio.unit}</span>
                        <Badge 
                          variant={
                            ratio.value > ratio.benchmark ? 'default' : 
                            ratio.value > ratio.benchmark * 0.7 ? 'secondary' : 'destructive'
                          }
                        >
                          {ratio.value > ratio.benchmark ? 'Excellent' : 
                           ratio.value > ratio.benchmark * 0.7 ? 'Good' : 'Poor'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle>{lang === 'ar' ? 'نسب السيولة' : 'Liquidity Ratios'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Current Ratio', value: fundamentalData.current_ratio, benchmark: 2, unit: '' },
                    { name: 'Quick Ratio', value: fundamentalData.quick_ratio, benchmark: 1, unit: '' },
                    { name: 'Cash Ratio', value: fundamentalData.cash_ratio, benchmark: 0.2, unit: '' },
                    { name: 'D/E Ratio', value: fundamentalData.debt_to_equity, benchmark: 1, unit: '' }
                  ].map((ratio, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{ratio.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{ratio.value.toFixed(2)}{ratio.unit}</span>
                        <Badge 
                          variant={
                            ratio.name === 'D/E Ratio' ? 
                              (ratio.value < ratio.benchmark ? 'default' : 'destructive') :
                              (ratio.value > ratio.benchmark ? 'default' : 'destructive')
                          }
                        >
                          {ratio.name === 'D/E Ratio' ? 
                            (ratio.value < ratio.benchmark ? 'Good' : 'High') :
                            (ratio.value > ratio.benchmark ? 'Good' : 'Low')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle>{lang === 'ar' ? 'معدلات النمو التاريخية' : 'Historical Growth Rates'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fundamentalData.growth_history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Line type="monotone" dataKey="revenue_growth" stroke="#00FF88" strokeWidth={2} />
                    <Line type="monotone" dataKey="earnings_growth" stroke="#60A5FA" strokeWidth={2} />
                    <Line type="monotone" dataKey="dividend_growth" stroke="#FFD700" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span>{lang === 'ar' ? 'نمو الإيرادات' : 'Revenue Growth'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded"></div>
                  <span>{lang === 'ar' ? 'نمو الأرباح' : 'Earnings Growth'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span>{lang === 'ar' ? 'نمو الأرباح الموزعة' : 'Dividend Growth'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{lang === 'ar' ? 'نمو الإيرادات (5 سنوات)' : '5Y Revenue Growth'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {fundamentalData.revenue_growth_5y?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {lang === 'ar' ? 'سنوياً' : 'CAGR'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{lang === 'ar' ? 'نمو الأرباح (5 سنوات)' : '5Y Earnings Growth'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {fundamentalData.earnings_growth_5y?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {lang === 'ar' ? 'سنوياً' : 'CAGR'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{lang === 'ar' ? 'نمو الأرباح الموزعة' : 'Dividend Growth'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {fundamentalData.dividend_growth_5y?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {lang === 'ar' ? '5 سنوات' : '5Y CAGR'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{lang === 'ar' ? 'نمو القيمة الدفترية' : 'Book Value Growth'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {fundamentalData.book_value_growth_5y?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {lang === 'ar' ? '5 سنوات' : '5Y CAGR'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dcf" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {lang === 'ar' ? 'تقييم التدفقات النقدية المخصومة (DCF)' : 'Discounted Cash Flow (DCF) Valuation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{lang === 'ar' ? 'السعر الحالي:' : 'Current Price:'}</span>
                    <span className="font-bold">${fundamentalData.current_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{lang === 'ar' ? 'القيمة العادلة DCF:' : 'DCF Fair Value:'}</span>
                    <span 
                      className="font-bold text-xl"
                      style={{ 
                        color: fundamentalData.dcf_value > fundamentalData.current_price ? '#00FF88' : '#FF4444' 
                      }}
                    >
                      ${fundamentalData.dcf_value.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{lang === 'ar' ? 'هامش الأمان:' : 'Margin of Safety:'}</span>
                    <span 
                      className="font-bold"
                      style={{ 
                        color: fundamentalData.margin_of_safety > 0 ? '#00FF88' : '#FF4444' 
                      }}
                    >
                      {fundamentalData.margin_of_safety.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{lang === 'ar' ? 'التوصية:' : 'Recommendation:'}</span>
                    <Badge 
                      variant={
                        fundamentalData.dcf_recommendation === 'BUY' ? 'default' :
                        fundamentalData.dcf_recommendation === 'SELL' ? 'destructive' : 'secondary'
                      }
                    >
                      {fundamentalData.dcf_recommendation}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">{lang === 'ar' ? 'افتراضات النموذج:' : 'Model Assumptions:'}</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'معدل النمو:' : 'Growth Rate:'}</span>
                      <span>{fundamentalData.dcf_growth_rate?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'معدل الخصم:' : 'Discount Rate:'}</span>
                      <span>{fundamentalData.dcf_discount_rate?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{lang === 'ar' ? 'النمو النهائي:' : 'Terminal Growth:'}</span>
                      <span>{fundamentalData.dcf_terminal_growth?.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle>{lang === 'ar' ? 'تحليل الحساسية' : 'Sensitivity Analysis'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fundamentalData.sensitivity_analysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="growth_rate" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Line type="monotone" dataKey="fair_value" stroke="#60A5FA" strokeWidth={2} />
                    <Line type="monotone" dataKey="current_price" stroke="#FF4444" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle>{lang === 'ar' ? 'مقارنة بالمنافسين' : 'Competitor Comparison'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2">{lang === 'ar' ? 'الشركة' : 'Company'}</th>
                      <th className="text-right py-2">P/E</th>
                      <th className="text-right py-2">P/B</th>
                      <th className="text-right py-2">ROE %</th>
                      <th className="text-right py-2">{lang === 'ar' ? 'القيمة السوقية' : 'Market Cap'}</th>
                      <th className="text-right py-2">{lang === 'ar' ? 'النمو' : 'Growth %'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundamentalData.competitors?.map((comp: any, index: number) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-2 font-medium">{comp.symbol}</td>
                        <td className="text-right py-2">{comp.pe_ratio.toFixed(2)}</td>
                        <td className="text-right py-2">{comp.pb_ratio.toFixed(2)}</td>
                        <td className="text-right py-2">{comp.roe.toFixed(1)}%</td>
                        <td className="text-right py-2">${comp.market_cap}</td>
                        <td className="text-right py-2">
                          <span 
                            className={comp.growth > 0 ? 'text-green-400' : 'text-red-400'}
                          >
                            {comp.growth > 0 ? '+' : ''}{comp.growth.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economic" className="space-y-6">
          {economicData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      {lang === 'ar' ? 'معدل البطالة' : 'Unemployment Rate'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{economicData.unemployment_rate}%</div>
                      <div 
                        className="text-sm mt-1"
                        style={{ 
                          color: economicData.unemployment_change > 0 ? '#FF4444' : '#00FF88' 
                        }}
                      >
                        {economicData.unemployment_change > 0 ? '+' : ''}{economicData.unemployment_change.toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {lang === 'ar' ? 'الناتج المحلي الإجمالي' : 'GDP Growth'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{economicData.gdp_growth}%</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {lang === 'ar' ? 'سنوياً' : 'YoY'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {lang === 'ar' ? 'معدل الفائدة' : 'Interest Rate'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{economicData.interest_rate}%</div>
                      <div 
                        className="text-sm mt-1"
                        style={{ 
                          color: economicData.interest_rate_change > 0 ? '#FF4444' : '#00FF88' 
                        }}
                      >
                        {economicData.interest_rate_change > 0 ? '+' : ''}{economicData.interest_rate_change.toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      {lang === 'ar' ? 'معدل التضخم' : 'Inflation Rate'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{economicData.inflation_rate}%</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {lang === 'ar' ? 'سنوياً' : 'YoY'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle>{lang === 'ar' ? 'المؤشرات الاقتصادية التاريخية' : 'Historical Economic Indicators'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={economicData.historical_data}>
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
                        <Line type="monotone" dataKey="gdp_growth" stroke="#00FF88" strokeWidth={2} />
                        <Line type="monotone" dataKey="inflation" stroke="#FF4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="interest_rate" stroke="#FFD700" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
