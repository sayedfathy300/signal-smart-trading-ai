import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketDataService, MarketData } from '@/services/marketDataService';
import { TrendingUp, TrendingDown, DollarSign, Euro, BadgeJapaneseYen, PoundSterling } from 'lucide-react';

interface CurrencyPairsProps {
  lang?: 'en' | 'ar';
  onSelectPair?: (pair: string) => void;
}

interface CurrencyPair {
  symbol: string;
  name: string;
  baseIcon: React.ReactNode;
  quoteIcon: React.ReactNode;
  category: 'major' | 'minor' | 'exotic' | 'crypto';
}

export const CurrencyPairs: React.FC<CurrencyPairsProps> = ({ lang = 'en', onSelectPair }) => {
  const [currencyData, setCurrencyData] = useState<Record<string, MarketData>>({});
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'major' | 'minor' | 'exotic' | 'crypto'>('major');
  const [loading, setLoading] = useState(true);

  const currencyPairs: CurrencyPair[] = [
    // أزواج العملات الرئيسية
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', baseIcon: <Euro className="h-4 w-4" />, quoteIcon: <DollarSign className="h-4 w-4" />, category: 'major' },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', baseIcon: <PoundSterling className="h-4 w-4" />, quoteIcon: <DollarSign className="h-4 w-4" />, category: 'major' },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', baseIcon: <DollarSign className="h-4 w-4" />, quoteIcon: <BadgeJapaneseYen className="h-4 w-4" />, category: 'major' },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', baseIcon: <DollarSign className="h-4 w-4" />, quoteIcon: <span className="text-xs font-bold">CHF</span>, category: 'major' },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', baseIcon: <span className="text-xs font-bold">AUD</span>, quoteIcon: <DollarSign className="h-4 w-4" />, category: 'major' },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', baseIcon: <DollarSign className="h-4 w-4" />, quoteIcon: <span className="text-xs font-bold">CAD</span>, category: 'major' },
    { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', baseIcon: <span className="text-xs font-bold">NZD</span>, quoteIcon: <DollarSign className="h-4 w-4" />, category: 'major' },

    // أزواج العملات الثانوية
    { symbol: 'EUR/GBP', name: 'Euro / British Pound', baseIcon: <Euro className="h-4 w-4" />, quoteIcon: <PoundSterling className="h-4 w-4" />, category: 'minor' },
    { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', baseIcon: <Euro className="h-4 w-4" />, quoteIcon: <BadgeJapaneseYen className="h-4 w-4" />, category: 'minor' },
    { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', baseIcon: <PoundSterling className="h-4 w-4" />, quoteIcon: <BadgeJapaneseYen className="h-4 w-4" />, category: 'minor' },
    { symbol: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', baseIcon: <span className="text-xs font-bold">AUD</span>, quoteIcon: <BadgeJapaneseYen className="h-4 w-4" />, category: 'minor' },
    { symbol: 'CAD/JPY', name: 'Canadian Dollar / Japanese Yen', baseIcon: <span className="text-xs font-bold">CAD</span>, quoteIcon: <BadgeJapaneseYen className="h-4 w-4" />, category: 'minor' },

    // أزواج العملات الغريبة
    { symbol: 'USD/TRY', name: 'US Dollar / Turkish Lira', baseIcon: <DollarSign className="h-4 w-4" />, quoteIcon: <span className="text-xs font-bold">TRY</span>, category: 'exotic' },
    { symbol: 'EUR/TRY', name: 'Euro / Turkish Lira', baseIcon: <Euro className="h-4 w-4" />, quoteIcon: <span className="text-xs font-bold">TRY</span>, category: 'exotic' },
    { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', baseIcon: <DollarSign className="h-4 w-4" />, quoteIcon: <span className="text-xs font-bold">ZAR</span>, category: 'exotic' },
    { symbol: 'USD/MXN', name: 'US Dollar / Mexican Peso', baseIcon: <DollarSign className="h-4 w-4" />, quoteIcon: <span className="text-xs font-bold">MXN</span>, category: 'exotic' },

    // العملات المشفرة
    { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', baseIcon: <span className="text-xs font-bold text-orange-500">₿</span>, quoteIcon: <DollarSign className="h-4 w-4" />, category: 'crypto' },
    { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', baseIcon: <span className="text-xs font-bold text-blue-500">Ξ</span>, quoteIcon: <DollarSign className="h-4 w-4" />, category: 'crypto' },
    { symbol: 'ADA/USD', name: 'Cardano / US Dollar', baseIcon: <span className="text-xs font-bold text-blue-400">ADA</span>, quoteIcon: <DollarSign className="h-4 w-4" />, category: 'crypto' },
    { symbol: 'DOT/USD', name: 'Polkadot / US Dollar', baseIcon: <span className="text-xs font-bold text-pink-500">DOT</span>, quoteIcon: <DollarSign className="h-4 w-4" />, category: 'crypto' }
  ];

  const categories = [
    { id: 'all', name: lang === 'ar' ? 'جميع الأزواج' : 'All Pairs' },
    { id: 'major', name: lang === 'ar' ? 'الأزواج الرئيسية' : 'Major Pairs' },
    { id: 'minor', name: lang === 'ar' ? 'الأزواج الثانوية' : 'Minor Pairs' },
    { id: 'exotic', name: lang === 'ar' ? 'الأزواج الغريبة' : 'Exotic Pairs' },
    { id: 'crypto', name: lang === 'ar' ? 'العملات المشفرة' : 'Cryptocurrencies' }
  ];

  useEffect(() => {
    loadCurrencyData();
    
    // تحديث البيانات كل 10 ثواني
    const interval = setInterval(loadCurrencyData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadCurrencyData = async () => {
    setLoading(true);
    try {
      const promises = currencyPairs.map(async (pair) => {
        try {
          // تحويل الرمز للتوافق مع API
          const symbol = pair.symbol.replace('/', '');
          const data = await marketDataService.getMarketData(symbol);
          return { [pair.symbol]: data };
        } catch (error) {
          // إنشاء بيانات تجريبية في حالة الخطأ
          return {
            [pair.symbol]: {
              symbol: pair.symbol,
              price: Math.random() * 2 + 0.5,
              change: (Math.random() - 0.5) * 0.1,
              changePercent: (Math.random() - 0.5) * 5,
              volume: Math.random() * 1000000,
              high: 0,
              low: 0,
              open: 0,
              close: 0,
              timestamp: Date.now()
            }
          };
        }
      });

      const results = await Promise.all(promises);
      const dataMap = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setCurrencyData(dataMap);

    } catch (error) {
      console.error('Error loading currency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPairs = selectedCategory === 'all' 
    ? currencyPairs 
    : currencyPairs.filter(pair => pair.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'major': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'minor': return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      case 'exotic': return <DollarSign className="h-4 w-4 text-orange-500" />;
      case 'crypto': return <span className="text-purple-500">₿</span>;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number, pair: string) => {
    const decimals = pair.includes('JPY') ? 3 : 5;
    return price.toFixed(decimals);
  };

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {lang === 'ar' ? 'أزواج العملات' : 'Currency Pairs'}
        </CardTitle>
        
        {/* فلترة الفئات */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(category => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id as any)}
              className="flex items-center gap-2"
            >
              {getCategoryIcon(category.id)}
              {category.name}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="text-trading-light animate-pulse">
              {lang === 'ar' ? 'جاري تحميل أزواج العملات...' : 'Loading currency pairs...'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPairs.map(pair => {
              const data = currencyData[pair.symbol];
              if (!data) return null;

              const isPositive = data.changePercent >= 0;

              return (
                <div
                  key={pair.symbol}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer border border-gray-600 hover:border-gray-500"
                  onClick={() => onSelectPair?.(pair.symbol)}
                >
                  {/* رأس الزوج */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {pair.baseIcon}
                        <span className="text-gray-400">/</span>
                        {pair.quoteIcon}
                      </div>
                      <span className="font-bold text-white">{pair.symbol}</span>
                    </div>
                    <Badge variant={pair.category === 'major' ? 'default' : 'secondary'}>
                      {pair.category}
                    </Badge>
                  </div>

                  {/* السعر والتغيير */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {lang === 'ar' ? 'السعر:' : 'Price:'}
                      </span>
                      <span className="text-lg font-bold text-white">
                        {formatPrice(data.price, pair.symbol)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {lang === 'ar' ? 'التغيير:' : 'Change:'}
                      </span>
                      <div className="flex items-center gap-1">
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                          {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {lang === 'ar' ? 'الحجم:' : 'Volume:'}
                      </span>
                      <span className="text-sm text-gray-300">
                        {(data.volume / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>

                  {/* اسم الزوج */}
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-xs text-gray-400 text-center">
                      {pair.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
