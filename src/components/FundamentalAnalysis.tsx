
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart3,
  Building,
  Globe,
  Percent,
  Target
} from 'lucide-react';
import { 
  fundamentalAnalysisService, 
  CompanyFinancials, 
  EconomicIndicator,
  EconomicEvent,
  InterestRate,
  InflationData,
  GDPData
} from '@/services/fundamentalAnalysisService';
import { cn } from '@/lib/utils';

interface FundamentalAnalysisProps {
  symbol?: string;
  lang?: 'en' | 'ar';
  className?: string;
}

export function FundamentalAnalysis({ 
  symbol = 'AAPL', 
  lang = 'en',
  className 
}: FundamentalAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [fundamentals, setFundamentals] = useState<any>(null);
  const [economicIndicators, setEconomicIndicators] = useState<EconomicIndicator[]>([]);
  const [economicCalendar, setEconomicCalendar] = useState<EconomicEvent[]>([]);
  const [interestRates, setInterestRates] = useState<InterestRate[]>([]);
  const [inflationData, setInflationData] = useState<InflationData[]>([]);
  const [gdpData, setGdpData] = useState<GDPData[]>([]);

  useEffect(() => {
    loadAllFundamentalData();
  }, [symbol]);

  const loadAllFundamentalData = async () => {
    setLoading(true);
    try {
      const [
        fundamentalAnalysis,
        indicators,
        calendar,
        rates,
        inflation,
        gdp
      ] = await Promise.all([
        fundamentalAnalysisService.getFundamentalAnalysis(symbol),
        fundamentalAnalysisService.getEconomicIndicators(),
        fundamentalAnalysisService.getEconomicCalendar(7),
        fundamentalAnalysisService.getGlobalInterestRates(),
        fundamentalAnalysisService.getInflationData(),
        fundamentalAnalysisService.getGDPData()
      ]);

      setFundamentals(fundamentalAnalysis);
      setEconomicIndicators(indicators);
      setEconomicCalendar(calendar);
      setInterestRates(rates);
      setInflationData(inflation);
      setGdpData(gdp);
    } catch (error) {
      console.error('Error loading fundamental data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy': return 'bg-green-500';
      case 'buy': return 'bg-green-400';
      case 'hold': return 'bg-yellow-500';
      case 'sell': return 'bg-red-400';
      case 'strong_sell': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRecommendationText = (recommendation: string) => {
    const texts = {
      en: {
        strong_buy: 'Strong Buy',
        buy: 'Buy',
        hold: 'Hold',
        sell: 'Sell',
        strong_sell: 'Strong Sell'
      },
      ar: {
        strong_buy: 'شراء قوي',
        buy: 'شراء',
        hold: 'انتظار',
        sell: 'بيع',
        strong_sell: 'بيع قوي'
      }
    };
    return texts[lang][recommendation as keyof typeof texts[typeof lang]] || recommendation;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  if (loading) {
    return (
      <Card className={cn("bg-trading-card border-gray-800", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trading-primary"></div>
            <span className="ml-2 text-white">
              {lang === 'ar' ? 'جاري تحميل التحليل الأساسي...' : 'Loading fundamental analysis...'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {lang === 'ar' ? 'التحليل الأساسي الشامل' : 'Comprehensive Fundamental Analysis'}
        </h2>
        <Button onClick={loadAllFundamentalData} disabled={loading}>
          {lang === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
        </Button>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="company">
            {lang === 'ar' ? 'تحليل الشركة' : 'Company Analysis'}
          </TabsTrigger>
          <TabsTrigger value="economics">
            {lang === 'ar' ? 'المؤشرات الاقتصادية' : 'Economic Indicators'}
          </TabsTrigger>
          <TabsTrigger value="calendar">
            {lang === 'ar' ? 'التقويم الاقتصادي' : 'Economic Calendar'}
          </TabsTrigger>
          <TabsTrigger value="rates">
            {lang === 'ar' ? 'أسعار الفائدة' : 'Interest Rates'}
          </TabsTrigger>
          <TabsTrigger value="global">
            {lang === 'ar' ? 'البيانات العالمية' : 'Global Data'}
          </TabsTrigger>
        </TabsList>

        {/* تحليل الشركة */}
        <TabsContent value="company" className="space-y-6">
          {fundamentals && (
            <>
              {/* التوصية والنقاط */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {lang === 'ar' ? `تحليل ${symbol}` : `${symbol} Analysis`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {fundamentals.score}/100
                      </div>
                      <div className="text-gray-400">
                        {lang === 'ar' ? 'النقاط الإجمالية' : 'Overall Score'}
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge className={`${getRecommendationColor(fundamentals.recommendation)} text-white text-sm px-4 py-2`}>
                        {getRecommendationText(fundamentals.recommendation)}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">
                        {lang === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                      </div>
                      <div className="text-white">
                        {new Date(fundamentals.financials.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-trading-secondary rounded-lg">
                    <p className="text-white text-sm">{fundamentals.analysis}</p>
                  </div>
                </CardContent>
              </Card>

              {/* النسب المالية الرئيسية */}
              <Card className="bg-trading-card border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {lang === 'ar' ? 'النسب المالية الرئيسية' : 'Key Financial Ratios'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-trading-secondary rounded-lg">
                      <div className="text-gray-400 text-sm">P/E Ratio</div>
                      <div className="text-white font-bold">
                        {fundamentals.financials.peRatio.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 bg-trading-secondary rounded-lg">
                      <div className="text-gray-400 text-sm">P/B Ratio</div>
                      <div className="text-white font-bold">
                        {fundamentals.financials.priceToBook.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 bg-trading-secondary rounded-lg">
                      <div className="text-gray-400 text-sm">ROE</div>
                      <div className="text-white font-bold">
                        {fundamentals.financials.roe.toFixed(2)}%
                      </div>
                    </div>
                    <div className="p-3 bg-trading-secondary rounded-lg">
                      <div className="text-gray-400 text-sm">Debt/Equity</div>
                      <div className="text-white font-bold">
                        {fundamentals.financials.debtToEquity.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* نقاط القوة والضعف */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {lang === 'ar' ? 'نقاط القوة' : 'Strengths'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {fundamentals.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-green-400 text-sm flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-trading-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <TrendingDown className="h-5 w-5" />
                      {lang === 'ar' ? 'نقاط الضعف' : 'Weaknesses'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {fundamentals.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="text-red-400 text-sm flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* المؤشرات الاقتصادية */}
        <TabsContent value="economics" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {lang === 'ar' ? 'المؤشرات الاقتصادية الرئيسية' : 'Key Economic Indicators'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {economicIndicators.map((indicator, index) => (
                  <div key={index} className="p-4 bg-trading-secondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{indicator.name}</span>
                      <Badge className={getImpactColor(indicator.impact)}>
                        {indicator.impact}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">
                        {indicator.value.toFixed(2)}{indicator.unit}
                      </span>
                      <div className={`flex items-center gap-1 ${
                        indicator.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {indicator.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="text-sm">
                          {Math.abs(indicator.change).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {lang === 'ar' ? 'السابق:' : 'Previous:'} {indicator.previousValue.toFixed(2)}{indicator.unit}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التقويم الاقتصادي */}
        <TabsContent value="calendar" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {lang === 'ar' ? 'الأحداث الاقتصادية القادمة' : 'Upcoming Economic Events'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {economicCalendar.map((event) => (
                  <div key={event.id} className="p-4 bg-trading-secondary rounded-lg border-l-4 border-trading-primary">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-white">{event.title}</span>
                          <Badge className={getImpactColor(event.impact)}>
                            {event.impact}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                          {event.country} • {event.currency}
                        </div>
                        <div className="text-sm text-gray-300">{event.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{event.date}</div>
                        <div className="text-gray-400 text-sm">{event.time}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {lang === 'ar' ? 'متوقع:' : 'Forecast:'} {event.forecast}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* أسعار الفائدة */}
        <TabsContent value="rates" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Percent className="h-5 w-5" />
                {lang === 'ar' ? 'أسعار الفائدة العالمية' : 'Global Interest Rates'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interestRates.map((rate, index) => (
                  <div key={index} className="p-4 bg-trading-secondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{rate.country}</span>
                      <span className="text-gray-400 text-sm">{rate.currency}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-white">
                        {rate.currentRate.toFixed(2)}%
                      </span>
                      <div className={`flex items-center gap-1 ${
                        rate.trend === 'rising' ? 'text-red-400' : 
                        rate.trend === 'falling' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {rate.trend === 'rising' ? <TrendingUp className="h-4 w-4" /> : 
                         rate.trend === 'falling' ? <TrendingDown className="h-4 w-4" /> : 
                         <Target className="h-4 w-4" />}
                        <span className="text-sm capitalize">{rate.trend}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {rate.bank}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {lang === 'ar' ? 'الاجتماع القادم:' : 'Next Meeting:'} {rate.nextMeeting}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* البيانات العالمية */}
        <TabsContent value="global" className="space-y-6">
          {/* بيانات التضخم */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {lang === 'ar' ? 'معدلات التضخم العالمية' : 'Global Inflation Rates'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {inflationData.map((inflation, index) => (
                  <div key={index} className="p-4 bg-trading-secondary rounded-lg">
                    <div className="text-white font-medium mb-2">{inflation.country}</div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-white">
                        {inflation.currentRate.toFixed(1)}%
                      </span>
                      <div className={`flex items-center gap-1 ${
                        inflation.trend === 'rising' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {inflation.trend === 'rising' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {lang === 'ar' ? 'الهدف:' : 'Target:'} {inflation.target.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {inflation.month} {inflation.year}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* بيانات النمو الاقتصادي */}
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {lang === 'ar' ? 'معدلات النمو الاقتصادي' : 'GDP Growth Rates'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gdpData.map((gdp, index) => (
                  <div key={index} className="p-4 bg-trading-secondary rounded-lg">
                    <div className="text-white font-medium mb-2">{gdp.country}</div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-white">
                        {gdp.currentGrowth.toFixed(1)}%
                      </span>
                      <div className={`flex items-center gap-1 ${
                        gdp.currentGrowth >= gdp.previousGrowth ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {gdp.currentGrowth >= gdp.previousGrowth ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {lang === 'ar' ? 'السابق:' : 'Previous:'} {gdp.previousGrowth.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {gdp.quarter} {gdp.year} {gdp.annualized ? '(سنوي)' : ''}
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
}
