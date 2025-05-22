
import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, ArrowUpDown, PieChart } from 'lucide-react';
import { CandlestickChart } from '@/components/CandlestickChart';
import { MarketOverview } from '@/components/MarketOverview';
import { StatCard } from '@/components/StatCard';
import { TradingControls } from '@/components/TradingControls';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  lang: 'en' | 'ar';
}

export default function Dashboard({ lang }: DashboardProps) {
  const { toast } = useToast();
  const [isTrading, setIsTrading] = useState(false);
  
  // Mock market data
  const marketItems = [
    { id: '1', name: 'BTC/USDT', price: '68,245.30', change: '+1.2%', isUp: true },
    { id: '2', name: 'ETH/USDT', price: '3,762.80', change: '+0.8%', isUp: true },
    { id: '3', name: 'XRP/USDT', price: '0.5234', change: '-0.3%', isUp: false },
    { id: '4', name: 'ADA/USDT', price: '0.4425', change: '+1.5%', isUp: true },
    { id: '5', name: 'SOL/USDT', price: '143.62', change: '-0.7%', isUp: false },
  ];
  
  // Arabic market data
  const marketItemsAr = [
    { id: '1', name: 'بيتكوين/دولار', price: '68,245.30', change: '+1.2%', isUp: true },
    { id: '2', name: 'إيثريوم/دولار', price: '3,762.80', change: '+0.8%', isUp: true },
    { id: '3', name: 'ريبل/دولار', price: '0.5234', change: '-0.3%', isUp: false },
    { id: '4', name: 'كاردانو/دولار', price: '0.4425', change: '+1.5%', isUp: true },
    { id: '5', name: 'سولانا/دولار', price: '143.62', change: '-0.7%', isUp: false },
  ];
  
  const handleStartTrading = () => {
    setIsTrading(true);
    toast({
      title: lang === 'en' ? 'Trading Started' : 'تم بدء التداول',
      description: lang === 'en' 
        ? 'Automated trading has been initiated' 
        : 'تم بدء التداول الآلي',
    });
  };
  
  const handleStopTrading = () => {
    setIsTrading(false);
    toast({
      title: lang === 'en' ? 'Trading Stopped' : 'تم إيقاف التداول',
      description: lang === 'en' 
        ? 'Automated trading has been stopped' 
        : 'تم إيقاف التداول الآلي',
    });
  };
  
  const handleSimulate = () => {
    toast({
      title: lang === 'en' ? 'Simulation Started' : 'تم بدء المحاكاة',
      description: lang === 'en' 
        ? 'Trading simulation has been started' 
        : 'تم بدء محاكاة التداول',
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
        <h1 className="text-2xl font-bold">
          {lang === 'en' ? 'Dashboard' : 'لوحة التحكم'}
        </h1>
        
        <TradingControls 
          onStart={handleStartTrading}
          onStop={handleStopTrading}
          onSimulate={handleSimulate}
          isRunning={isTrading}
          lang={lang}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={lang === 'en' ? 'Portfolio Value' : 'قيمة المحفظة'}
          value="$24,685.00"
          change="12.5%"
          isUp={true}
          icon={<PieChart size={24} />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Today Profit' : 'ربح اليوم'}
          value="$1,247.00"
          change="4.5%"
          isUp={true}
          icon={<TrendingUp size={24} />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Active Trades' : 'الصفقات النشطة'}
          value="7"
          icon={<ArrowUpDown size={24} />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Win Rate' : 'معدل الربح'}
          value="93.4%"
          change="2.1%"
          isUp={true}
          icon={<LayoutDashboard size={24} />}
          lang={lang}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CandlestickChart 
            title={lang === 'en' ? 'BTC/USDT Analysis' : 'تحليل بيتكوين/دولار'} 
            lang={lang}
          />
        </div>
        <div>
          <MarketOverview 
            title={lang === 'en' ? 'Market Overview' : 'نظرة عامة على السوق'} 
            items={lang === 'en' ? marketItems : marketItemsAr} 
            lang={lang}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CandlestickChart 
          title={lang === 'en' ? 'Technical Indicators' : 'المؤشرات الفنية'} 
          lang={lang}
        />
        <CandlestickChart 
          title={lang === 'en' ? 'Pattern Recognition' : 'التعرف على الأنماط'} 
          lang={lang}
        />
      </div>
    </div>
  );
}
