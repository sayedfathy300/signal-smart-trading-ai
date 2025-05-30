
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CopyTrading from '@/components/social-trading/CopyTrading';
import Leaderboards from '@/components/social-trading/Leaderboards';
import StrategySharing from '@/components/social-trading/StrategySharing';
import CommunityFeatures from '@/components/social-trading/CommunityFeatures';
import { Users, Copy, Trophy, Share2 } from 'lucide-react';

interface SocialTradingProps {
  lang?: 'en' | 'ar';
}

const SocialTrading = ({ lang = 'ar' }: SocialTradingProps) => {
  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'التداول الاجتماعي' : 'Social Trading'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'انسخ أفضل المتداولين وشارك استراتيجياتك مع المجتمع'
              : 'Copy top traders and share your strategies with the community'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">15,247</span>
          <span className="text-gray-400 text-sm">
            {lang === 'ar' ? 'متداول نشط' : 'Active Traders'}
          </span>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="copy-trading" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="copy-trading" className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            {lang === 'ar' ? 'نسخ التداول' : 'Copy Trading'}
          </TabsTrigger>
          <TabsTrigger value="leaderboards" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {lang === 'ar' ? 'المتصدرين' : 'Leaderboards'}
          </TabsTrigger>
          <TabsTrigger value="strategy-sharing" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            {lang === 'ar' ? 'مشاركة الاستراتيجيات' : 'Strategy Sharing'}
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {lang === 'ar' ? 'المجتمع' : 'Community'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copy-trading">
          <CopyTrading lang={lang} />
        </TabsContent>

        <TabsContent value="leaderboards">
          <Leaderboards lang={lang} />
        </TabsContent>

        <TabsContent value="strategy-sharing">
          <StrategySharing lang={lang} />
        </TabsContent>

        <TabsContent value="community">
          <CommunityFeatures lang={lang} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialTrading;
