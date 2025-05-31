import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { marketDataService, MarketOverviewData } from '@/services/marketDataService';
import { Sparkline } from '@/components/Sparkline';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MarketOverviewProps {
  lang: 'en' | 'ar';
}

const MarketOverview = ({ lang }: MarketOverviewProps) => {
  console.log('MarketOverview rendering with lang:', lang);
  
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['marketData'],
    queryFn: async (): Promise<MarketOverviewData> => {
      try {
        const data = await marketDataService.getMarketOverview();
        console.log('Market data fetched:', data);
        return data;
      } catch (error) {
        console.error('Error fetching market data:', error);
        throw error;
      }
    },
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-300">
            {lang === 'ar' ? 'جاري تحميل بيانات السوق...' : 'Loading market data...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('MarketOverview error:', error);
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">
            {lang === 'ar' ? 'خطأ في تحميل البيانات' : 'Error Loading Data'}
          </h2>
          <p className="text-gray-300">
            {lang === 'ar' ? 'لا يمكن تحميل بيانات السوق حالياً' : 'Cannot load market data currently'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Safely access data with fallbacks
  const safeMarketData: MarketOverviewData = marketData || {
    indices: [],
    currencies: [],
    commodities: [],
    trending: []
  };

  const safeToFixed = (value: any, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">{lang === 'ar' ? 'نظرة عامة على السوق' : 'Market Overview'}</h1>

      {/* Indices */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{lang === 'ar' ? 'المؤشرات' : 'Indices'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeMarketData.indices.map((index) => (
            <div key={index.name} className="bg-trading-card p-4 rounded-lg shadow">
              <h3 className="font-semibold">{index.name}</h3>
              <p>{safeToFixed(index.value)}</p>
              <p className={index.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {index.change >= 0 ? <ArrowUp className="inline-block mr-1" size={16} /> : <ArrowDown className="inline-block mr-1" size={16} />}
                {safeToFixed(index.change)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Currencies */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{lang === 'ar' ? 'العملات' : 'Currencies'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeMarketData.currencies.map((currency) => (
            <div key={currency.name} className="bg-trading-card p-4 rounded-lg shadow">
              <h3 className="font-semibold">{currency.name}</h3>
              <p>{safeToFixed(currency.value)}</p>
              <p className={currency.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {currency.change >= 0 ? <ArrowUp className="inline-block mr-1" size={16} /> : <ArrowDown className="inline-block mr-1" size={16} />}
                {safeToFixed(currency.change)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Commodities */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{lang === 'ar' ? 'السلع' : 'Commodities'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeMarketData.commodities.map((commodity) => (
            <div key={commodity.name} className="bg-trading-card p-4 rounded-lg shadow">
              <h3 className="font-semibold">{commodity.name}</h3>
              <p>{safeToFixed(commodity.value)}</p>
              <p className={commodity.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {commodity.change >= 0 ? <ArrowUp className="inline-block mr-1" size={16} /> : <ArrowDown className="inline-block mr-1" size={16} />}
                {safeToFixed(commodity.change)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Stocks */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{lang === 'ar' ? 'الأسهم الرائجة' : 'Trending Stocks'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeMarketData.trending.map((stock) => (
            <div key={stock.ticker} className="bg-trading-card p-4 rounded-lg shadow">
              <h3 className="font-semibold">{stock.companyName} ({stock.ticker})</h3>
              <p>{safeToFixed(stock.price)}</p>
              <p className={stock.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {stock.change >= 0 ? <ArrowUp className="inline-block mr-1" size={16} /> : <ArrowDown className="inline-block mr-1" size={16} />}
                {safeToFixed(stock.change)}%
              </p>
              <Sparkline data={stock.sparklineData} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
