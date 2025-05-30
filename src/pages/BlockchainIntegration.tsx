
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeFiTrading from '@/components/blockchain/DeFiTrading';
import NFTPortfolio from '@/components/blockchain/NFTPortfolio';
import CrossChainArbitrage from '@/components/blockchain/CrossChainArbitrage';
import SmartContracts from '@/components/blockchain/SmartContracts';
import { Coins, Image, Shuffle, FileCode } from 'lucide-react';

interface BlockchainIntegrationProps {
  lang?: 'en' | 'ar';
}

const BlockchainIntegration = ({ lang = 'ar' }: BlockchainIntegrationProps) => {
  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'تكامل البلوك تشين' : 'Blockchain Integration'}
          </h1>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'تداول DeFi وتتبع NFT والمراجحة متعددة السلاسل'
              : 'DeFi trading, NFT tracking, and cross-chain arbitrage'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 rounded-lg border border-green-700">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm">
              {lang === 'ar' ? 'Web3 متصل' : 'Web3 Connected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="defi-trading" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="defi-trading" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            {lang === 'ar' ? 'تداول DeFi' : 'DeFi Trading'}
          </TabsTrigger>
          <TabsTrigger value="nft-portfolio" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            {lang === 'ar' ? 'محفظة NFT' : 'NFT Portfolio'}
          </TabsTrigger>
          <TabsTrigger value="cross-chain" className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            {lang === 'ar' ? 'المراجحة متعددة السلاسل' : 'Cross-Chain Arbitrage'}
          </TabsTrigger>
          <TabsTrigger value="smart-contracts" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            {lang === 'ar' ? 'العقود الذكية' : 'Smart Contracts'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="defi-trading">
          <DeFiTrading lang={lang} />
        </TabsContent>

        <TabsContent value="nft-portfolio">
          <NFTPortfolio lang={lang} />
        </TabsContent>

        <TabsContent value="cross-chain">
          <CrossChainArbitrage lang={lang} />
        </TabsContent>

        <TabsContent value="smart-contracts">
          <SmartContracts lang={lang} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockchainIntegration;
