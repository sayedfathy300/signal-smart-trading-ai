
import React from 'react';
import { CandlestickChart } from '@/components/CandlestickChart';
import { MarketOverview } from '@/components/MarketOverview';
import { StatCard } from '@/components/StatCard';
import { TradingControls } from '@/components/TradingControls';
import { ArrowUpDown, BarChart2, DollarSign, TrendingUp } from 'lucide-react';

export interface DashboardProps {
  lang?: 'en' | 'ar';
}

const Dashboard = ({ lang = 'en' }: DashboardProps) => {
  // Hardcoded data for demonstration
  const marketItems = [
    { id: '1', name: 'BTC/USD', price: '$60,142.30', change: '+2.4%', isUp: true },
    { id: '2', name: 'ETH/USD', price: '$3,120.45', change: '+1.8%', isUp: true },
    { id: '3', name: 'XRP/USD', price: '$0.51', change: '-0.7%', isUp: false },
    { id: '4', name: 'LTC/USD', price: '$82.14', change: '+0.3%', isUp: true },
    { id: '5', name: 'BNB/USD', price: '$412.35', change: '-1.2%', isUp: false }
  ];
  
  const handleStartTrading = () => {
    console.log('Start trading');
  };
  
  const handleStopTrading = () => {
    console.log('Stop trading');
  };
  
  const handleSimulate = () => {
    console.log('Simulate trading');
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className={`text-3xl font-bold ${lang === 'ar' ? 'rtl text-right' : ''}`}>
        {lang === 'en' ? 'Trading Dashboard' : 'لوحة التداول'}
      </h1>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={lang === 'en' ? 'Balance' : 'الرصيد'}
          value="$12,459.32" 
          change="2.4%" 
          isUp={true} 
          icon={<DollarSign className="h-5 w-5" />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Active Trades' : 'الصفقات النشطة'}
          value="7" 
          icon={<ArrowUpDown className="h-5 w-5" />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Success Rate' : 'معدل النجاح'}
          value="94.3%" 
          change="1.2%" 
          isUp={true} 
          icon={<TrendingUp className="h-5 w-5" />}
          lang={lang}
        />
        <StatCard 
          title={lang === 'en' ? 'Total Profit' : 'إجمالي الربح'}
          value="$2,351.22" 
          change="12.7%" 
          isUp={true} 
          icon={<BarChart2 className="h-5 w-5" />}
          lang={lang}
        />
      </div>
      
      {/* Chart and Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CandlestickChart 
            title={lang === 'en' ? 'Market Analysis' : 'تحليل السوق'}
            lang={lang}
          />
        </div>
        <div className="lg:col-span-1">
          <MarketOverview 
            title={lang === 'en' ? 'Market Overview' : 'نظرة عامة على السوق'}
            items={marketItems}
            lang={lang}
          />
        </div>
      </div>
      
      {/* Trading Controls */}
      <div className="mt-6">
        <TradingControls 
          onStart={handleStartTrading}
          onStop={handleStopTrading}
          onSimulate={handleSimulate}
          isRunning={false}
          lang={lang}
        />
      </div>
    </div>
  );
};

export default Dashboard;
