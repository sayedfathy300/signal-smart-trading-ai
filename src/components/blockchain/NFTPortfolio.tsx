
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Image, 
  TrendingUp, 
  Eye, 
  Heart,
  Share2,
  Filter,
  Search,
  Grid3X3,
  List,
  Star,
  Calendar,
  DollarSign,
  Activity,
  Trophy,
  Zap,
  BarChart3
} from 'lucide-react';

interface NFTPortfolioProps {
  lang?: 'en' | 'ar';
}

const NFTPortfolio = ({ lang = 'ar' }: NFTPortfolioProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // بيانات مجموعات NFT
  const nftCollections = [
    {
      id: '1',
      name: 'Bored Ape Yacht Club',
      symbol: 'BAYC',
      owned: 3,
      floorPrice: 45.2,
      totalValue: 135.6,
      change24h: 5.7,
      image: '/api/placeholder/80/80',
      verified: true
    },
    {
      id: '2',
      name: 'CryptoPunks',
      symbol: 'PUNKS',
      owned: 1,
      floorPrice: 78.9,
      totalValue: 78.9,
      change24h: -2.1,
      image: '/api/placeholder/80/80',
      verified: true
    },
    {
      id: '3',
      name: 'Azuki',
      symbol: 'AZUKI',
      owned: 2,
      floorPrice: 12.4,
      totalValue: 24.8,
      change24h: 8.3,
      image: '/api/placeholder/80/80',
      verified: true
    },
    {
      id: '4',
      name: 'Mutant Ape Yacht Club',
      symbol: 'MAYC',
      owned: 5,
      floorPrice: 8.7,
      totalValue: 43.5,
      change24h: 3.2,
      image: '/api/placeholder/80/80',
      verified: true
    }
  ];

  // بيانات NFTs الفردية
  const nftItems = [
    {
      id: '1',
      name: 'Bored Ape #1234',
      collection: 'Bored Ape Yacht Club',
      image: '/api/placeholder/200/200',
      rarity: 'Rare',
      rank: 456,
      traits: [
        { trait: 'Background', value: 'Blue', rarity: 12 },
        { trait: 'Fur', value: 'Golden Brown', rarity: 8 },
        { trait: 'Eyes', value: 'Laser Eyes', rarity: 3 },
        { trait: 'Hat', value: 'Crown', rarity: 1 }
      ],
      purchasePrice: 42.5,
      currentPrice: 45.2,
      lastSale: 43.8,
      listed: false,
      favorite: true
    },
    {
      id: '2',
      name: 'CryptoPunk #5678',
      collection: 'CryptoPunks',
      image: '/api/placeholder/200/200',
      rarity: 'Legendary',
      rank: 89,
      traits: [
        { trait: 'Type', value: 'Alien', rarity: 0.09 },
        { trait: 'Accessories', value: 'Pipe', rarity: 2.1 },
        { trait: 'Hair', value: 'Wild Hair', rarity: 1.5 }
      ],
      purchasePrice: 75.0,
      currentPrice: 78.9,
      lastSale: 76.5,
      listed: true,
      favorite: false
    },
    {
      id: '3',
      name: 'Azuki #9012',
      collection: 'Azuki',
      image: '/api/placeholder/200/200',
      rarity: 'Uncommon',
      rank: 1234,
      traits: [
        { trait: 'Type', value: 'Human', rarity: 45 },
        { trait: 'Hair', value: 'Pink Hairband', rarity: 8 },
        { trait: 'Eyes', value: 'Closed', rarity: 12 },
        { trait: 'Clothing', value: 'Red Jacket', rarity: 6 }
      ],
      purchasePrice: 10.2,
      currentPrice: 12.4,
      lastSale: 11.8,
      listed: false,
      favorite: true
    }
  ];

  // إحصائيات المحفظة
  const portfolioStats = {
    totalValue: 282.8,
    totalItems: 11,
    totalCollections: 4,
    unrealizedGains: 45.6,
    realizedGains: 23.4,
    avgHoldPeriod: 147,
    topGainer: 'Azuki #9012',
    topGainerPercent: 21.6
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-900/30 border-gray-700 text-gray-300';
      case 'uncommon': return 'bg-green-900/30 border-green-700 text-green-300';
      case 'rare': return 'bg-blue-900/30 border-blue-700 text-blue-300';
      case 'epic': return 'bg-purple-900/30 border-purple-700 text-purple-300';
      case 'legendary': return 'bg-yellow-900/30 border-yellow-700 text-yellow-300';
      default: return 'bg-gray-900/30 border-gray-700 text-gray-300';
    }
  };

  const handleFavoriteNFT = (nftId: string) => {
    console.log(`Toggle favorite for NFT: ${nftId}`);
  };

  const handleListNFT = (nftId: string) => {
    console.log(`List NFT for sale: ${nftId}`);
  };

  const filteredNFTs = nftItems.filter(nft => {
    const matchesCollection = selectedCollection === 'all' || 
                             nft.collection.toLowerCase().includes(selectedCollection.toLowerCase());
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCollection && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {portfolioStats.totalValue} ETH
                </div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'إجمالي القيمة' : 'Total Value'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Image className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{portfolioStats.totalItems}</div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'إجمالي العناصر' : 'Total Items'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  +{portfolioStats.unrealizedGains} ETH
                </div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'الأرباح غير المحققة' : 'Unrealized Gains'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{portfolioStats.totalCollections}</div>
                <div className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'المجموعات' : 'Collections'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-trading-card">
          <TabsTrigger value="portfolio">
            {lang === 'ar' ? 'المحفظة' : 'Portfolio'}
          </TabsTrigger>
          <TabsTrigger value="collections">
            {lang === 'ar' ? 'المجموعات' : 'Collections'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {lang === 'ar' ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            {lang === 'ar' ? 'السوق' : 'Marketplace'}
          </TabsTrigger>
        </TabsList>

        {/* Portfolio View */}
        <TabsContent value="portfolio" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={lang === 'ar' ? 'البحث في NFTs...' : 'Search NFTs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-trading-secondary border-gray-700 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'فلاتر' : 'Filters'}
              </Button>
              <div className="flex items-center border border-gray-600 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* NFT Items */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map((nft) => (
                <Card key={nft.id} className="bg-trading-card border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="relative">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFavoriteNFT(nft.id)}
                        className={`bg-black/50 hover:bg-black/70 ${nft.favorite ? 'text-red-400' : 'text-white'}`}
                      >
                        <Heart className={`h-4 w-4 ${nft.favorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={getRarityBadge(nft.rarity)}>
                        {nft.rarity}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium text-white">{nft.name}</h3>
                      <p className="text-gray-400 text-sm">{nft.collection}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'الترتيب:' : 'Rank:'} #{nft.rank}
                      </span>
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'السعر الحالي:' : 'Current:'} {nft.currentPrice} ETH
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'الربح/الخسارة:' : 'P&L:'}
                        </span>
                        <span className={`ml-1 ${nft.currentPrice > nft.purchasePrice ? 'text-green-400' : 'text-red-400'}`}>
                          {((nft.currentPrice - nft.purchasePrice) / nft.purchasePrice * 100).toFixed(1)}%
                        </span>
                      </div>
                      {nft.listed && (
                        <Badge className="bg-green-900/30 border-green-700 text-green-300">
                          {lang === 'ar' ? 'معروض' : 'Listed'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600"
                        onClick={() => handleListNFT(nft.id)}
                      >
                        {nft.listed 
                          ? (lang === 'ar' ? 'إلغاء العرض' : 'Unlist')
                          : (lang === 'ar' ? 'عرض للبيع' : 'List')
                        }
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600">
                        <Share2 className="h-3 w-3 mr-1" />
                        {lang === 'ar' ? 'مشاركة' : 'Share'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-trading-card border-gray-800">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredNFTs.map((nft, index) => (
                    <div 
                      key={nft.id} 
                      className={`flex items-center gap-4 p-4 ${index !== filteredNFTs.length - 1 ? 'border-b border-gray-700' : ''}`}
                    >
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{nft.name}</h3>
                          <Badge className={getRarityBadge(nft.rarity)}>
                            {nft.rarity}
                          </Badge>
                          {nft.favorite && <Heart className="h-4 w-4 text-red-400 fill-current" />}
                        </div>
                        <p className="text-gray-400 text-sm">{nft.collection}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{nft.currentPrice} ETH</div>
                        <div className={`text-sm ${nft.currentPrice > nft.purchasePrice ? 'text-green-400' : 'text-red-400'}`}>
                          {((nft.currentPrice - nft.purchasePrice) / nft.purchasePrice * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-gray-600">
                          {lang === 'ar' ? 'عرض' : 'View'}
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600">
                          {lang === 'ar' ? 'بيع' : 'Sell'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Collections View */}
        <TabsContent value="collections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftCollections.map((collection) => (
              <Card key={collection.id} className="bg-trading-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{collection.name}</h3>
                        {collection.verified && (
                          <Badge className="bg-blue-900/30 border-blue-700 text-blue-300">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{collection.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-blue-400 text-lg font-bold">{collection.owned}</div>
                      <div className="text-gray-400 text-xs">
                        {lang === 'ar' ? 'مملوك' : 'Owned'}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-trading-secondary rounded-lg">
                      <div className="text-green-400 text-lg font-bold">{collection.floorPrice} ETH</div>
                      <div className="text-gray-400 text-xs">
                        {lang === 'ar' ? 'أدنى سعر' : 'Floor Price'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'إجمالي القيمة' : 'Total Value'}
                      </span>
                      <span className="text-white">{collection.totalValue} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {lang === 'ar' ? 'التغيير 24 ساعة' : '24h Change'}
                      </span>
                      <span className={`${collection.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {collection.change24h >= 0 ? '+' : ''}{collection.change24h}%
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setSelectedCollection(collection.name)}
                  >
                    {lang === 'ar' ? 'عرض المجموعة' : 'View Collection'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'تحليلات المحفظة' : 'Portfolio Analytics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">
                    {lang === 'ar' ? 'أفضل مكسب' : 'Top Gainer'}
                  </div>
                  <div className="text-white font-medium">{portfolioStats.topGainer}</div>
                  <div className="text-green-400">+{portfolioStats.topGainerPercent}%</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">
                    {lang === 'ar' ? 'متوسط فترة الاحتفاظ' : 'Avg Hold Period'}
                  </div>
                  <div className="text-white font-medium">{portfolioStats.avgHoldPeriod} days</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">
                    {lang === 'ar' ? 'الأرباح المحققة' : 'Realized Gains'}
                  </div>
                  <div className="text-green-400 font-medium">+{portfolioStats.realizedGains} ETH</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace */}
        <TabsContent value="marketplace" className="space-y-6">
          <Card className="bg-trading-card border-gray-800">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">
                {lang === 'ar' ? 'السوق قريباً' : 'Marketplace Coming Soon'}
              </h3>
              <p className="text-gray-400 mb-4">
                {lang === 'ar' 
                  ? 'ستتمكن قريباً من شراء وبيع NFTs مباشرة من المنصة'
                  : 'You will soon be able to buy and sell NFTs directly from the platform'}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {lang === 'ar' ? 'إشعاري عند الإطلاق' : 'Notify Me on Launch'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFTPortfolio;
