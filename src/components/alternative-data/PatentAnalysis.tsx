
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  TreeMap
} from 'recharts';
import { 
  FileText, 
  Lightbulb, 
  TrendingUp, 
  Search, 
  Filter,
  Building,
  Calendar,
  Eye,
  Star,
  Target,
  Zap
} from 'lucide-react';

interface PatentAnalysisProps {
  lang?: 'en' | 'ar';
}

interface Patent {
  id: string;
  title: string;
  applicant: string;
  inventor: string;
  applicationDate: string;
  publicationDate: string;
  status: 'pending' | 'granted' | 'expired' | 'rejected';
  category: string;
  technology: string;
  claims: number;
  citations: number;
  marketImpact: 'high' | 'medium' | 'low';
  commercialPotential: number;
  innovationScore: number;
  competitiveAdvantage: number;
}

interface TechnologyTrend {
  technology: string;
  patentCount: number;
  growthRate: number;
  marketSize: number;
  companies: string[];
  hotness: number;
  futureOutlook: 'positive' | 'negative' | 'neutral';
}

interface CompanyInnovation {
  company: string;
  patentCount: number;
  categories: { [key: string]: number };
  innovationIndex: number;
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  recentActivity: number;
  collaborations: string[];
}

interface MarketInsight {
  sector: string;
  patentActivity: number;
  innovationTrend: number;
  competitiveIntensity: number;
  timeToMarket: number;
  investmentFlow: number;
  riskLevel: 'low' | 'medium' | 'high';
  opportunities: string[];
}

const PatentAnalysis = ({ lang = 'ar' }: PatentAnalysisProps) => {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [technologyTrends, setTechnologyTrends] = useState<TechnologyTrend[]>([]);
  const [companyData, setCompanyData] = useState<CompanyInnovation[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // محاكاة بيانات براءات الاختراع
    setPatents([
      {
        id: 'US2024001234',
        title: 'Advanced AI-Powered Trading Algorithm with Risk Management',
        applicant: 'TechTrade Inc.',
        inventor: 'Dr. Sarah Johnson',
        applicationDate: '2024-01-15',
        publicationDate: '2024-03-15',
        status: 'pending',
        category: 'Financial Technology',
        technology: 'Artificial Intelligence',
        claims: 25,
        citations: 8,
        marketImpact: 'high',
        commercialPotential: 92,
        innovationScore: 88,
        competitiveAdvantage: 85
      },
      {
        id: 'EP2024005678',
        title: 'Quantum Computing Optimization for Portfolio Management',
        applicant: 'QuantumFinance Ltd.',
        inventor: 'Prof. Ahmed Al-Rashid',
        applicationDate: '2024-02-20',
        publicationDate: '2024-04-20',
        status: 'granted',
        category: 'Financial Technology',
        technology: 'Quantum Computing',
        claims: 18,
        citations: 15,
        marketImpact: 'high',
        commercialPotential: 95,
        innovationScore: 94,
        competitiveAdvantage: 91
      },
      {
        id: 'CN2024009876',
        title: 'Blockchain-Based Decentralized Trading Platform',
        applicant: 'CryptoTech Solutions',
        inventor: 'Li Wei Zhang',
        applicationDate: '2024-03-10',
        publicationDate: '2024-05-10',
        status: 'pending',
        category: 'Blockchain Technology',
        technology: 'Distributed Ledger',
        claims: 22,
        citations: 12,
        marketImpact: 'medium',
        commercialPotential: 78,
        innovationScore: 82,
        competitiveAdvantage: 76
      }
    ]);

    setTechnologyTrends([
      {
        technology: 'Artificial Intelligence',
        patentCount: 2847,
        growthRate: 45.2,
        marketSize: 89.5,
        companies: ['Google', 'Microsoft', 'IBM', 'OpenAI'],
        hotness: 95,
        futureOutlook: 'positive'
      },
      {
        technology: 'Quantum Computing',
        patentCount: 542,
        growthRate: 78.9,
        marketSize: 12.3,
        companies: ['IBM', 'Google', 'IonQ', 'Rigetti'],
        hotness: 88,
        futureOutlook: 'positive'
      },
      {
        technology: 'Blockchain',
        patentCount: 1234,
        growthRate: 23.6,
        marketSize: 45.2,
        companies: ['Coinbase', 'Binance', 'Ethereum', 'Ripple'],
        hotness: 72,
        futureOutlook: 'neutral'
      },
      {
        technology: 'Edge Computing',
        patentCount: 876,
        growthRate: 56.3,
        marketSize: 34.7,
        companies: ['Amazon', 'Microsoft', 'Google', 'Cloudflare'],
        hotness: 81,
        futureOutlook: 'positive'
      }
    ]);

    setCompanyData([
      {
        company: 'TechTrade Inc.',
        patentCount: 342,
        categories: {
          'AI/ML': 145,
          'Financial Tech': 98,
          'Data Analytics': 67,
          'Security': 32
        },
        innovationIndex: 89,
        marketPosition: 'leader',
        recentActivity: 15,
        collaborations: ['MIT', 'Stanford', 'Goldman Sachs']
      },
      {
        company: 'QuantumFinance Ltd.',
        patentCount: 87,
        categories: {
          'Quantum Computing': 45,
          'Cryptography': 23,
          'Financial Modeling': 19
        },
        innovationIndex: 94,
        marketPosition: 'challenger',
        recentActivity: 8,
        collaborations: ['IBM Research', 'Oxford University']
      }
    ]);

    setMarketInsights([
      {
        sector: 'Financial Technology',
        patentActivity: 87,
        innovationTrend: 92,
        competitiveIntensity: 78,
        timeToMarket: 18,
        investmentFlow: 15.6,
        riskLevel: 'medium',
        opportunities: [
          'AI-powered risk assessment',
          'Real-time fraud detection',
          'Automated compliance systems'
        ]
      },
      {
        sector: 'Quantum Computing',
        patentActivity: 45,
        innovationTrend: 98,
        competitiveIntensity: 89,
        timeToMarket: 60,
        investmentFlow: 8.9,
        riskLevel: 'high',
        opportunities: [
          'Quantum encryption',
          'Portfolio optimization',
          'Risk modeling acceleration'
        ]
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'expired':
        return 'bg-gray-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-500 text-red-400';
      case 'medium':
        return 'border-yellow-500 text-yellow-400';
      case 'low':
        return 'border-green-500 text-green-400';
      default:
        return 'border-gray-500 text-gray-400';
    }
  };

  const formatArabicNumber = (num: number) => {
    return num.toLocaleString('ar-EG');
  };

  const getOutlookIcon = (outlook: string) => {
    switch (outlook) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'negative':
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-400" />
            {lang === 'ar' ? 'تحليل براءات الاختراع' : 'Patent Analysis'}
          </h2>
          <p className="text-gray-400">
            {lang === 'ar' 
              ? 'تتبع الابتكارات والاتجاهات التكنولوجية من خلال براءات الاختراع'
              : 'Track innovations and technology trends through patent filings'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-600">
            {lang === 'ar' ? 'قاعدة بيانات عالمية' : 'Global Database'}
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-400">
            {lang === 'ar' ? 'محدث يومياً' : 'Daily Updates'}
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={lang === 'ar' ? 'البحث في براءات الاختراع...' : 'Search patents...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-trading-card border-gray-600 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600">
          <Filter className="h-4 w-4 mr-2" />
          {lang === 'ar' ? 'تصفية' : 'Filter'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">
            {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="patents">
            {lang === 'ar' ? 'براءات الاختراع' : 'Patents'}
          </TabsTrigger>
          <TabsTrigger value="trends">
            {lang === 'ar' ? 'الاتجاهات' : 'Trends'}
          </TabsTrigger>
          <TabsTrigger value="companies">
            {lang === 'ar' ? 'الشركات' : 'Companies'}
          </TabsTrigger>
          <TabsTrigger value="insights">
            {lang === 'ar' ? 'رؤى السوق' : 'Market Insights'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'براءات جديدة (30 يوم)' : 'New Patents (30d)'}
                    </p>
                    <p className="text-2xl font-bold text-white">1,247</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+12.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'التقنيات الناشئة' : 'Emerging Technologies'}
                    </p>
                    <p className="text-2xl font-bold text-white">34</p>
                  </div>
                  <Lightbulb className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+8.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'الشركات النشطة' : 'Active Companies'}
                    </p>
                    <p className="text-2xl font-bold text-white">892</p>
                  </div>
                  <Building className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+5.7%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'مؤشر الابتكار' : 'Innovation Index'}
                    </p>
                    <p className="text-2xl font-bold text-white">87.3</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-xs">+3.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technology Hotness Heatmap */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'خريطة حرارية للتقنيات الساخنة' : 'Technology Hotness Heatmap'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <TreeMap
                  data={technologyTrends.map(tech => ({
                    name: tech.technology,
                    size: tech.hotness,
                    fill: tech.hotness > 90 ? '#EF4444' : tech.hotness > 70 ? '#F59E0B' : '#10B981'
                  }))}
                  dataKey="size"
                  ratio={4/3}
                  stroke="#374151"
                  fill="#8884d8"
                />
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Patent Activity Timeline */}
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ar' ? 'نشاط براءات الاختراع' : 'Patent Activity Timeline'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { month: 'Jan', ai: 245, quantum: 45, blockchain: 123, edge: 87 },
                  { month: 'Feb', ai: 267, quantum: 52, blockchain: 134, edge: 94 },
                  { month: 'Mar', ai: 289, quantum: 58, blockchain: 145, edge: 101 },
                  { month: 'Apr', ai: 312, quantum: 65, blockchain: 156, edge: 108 },
                  { month: 'May', ai: 334, quantum: 72, blockchain: 167, edge: 115 },
                  { month: 'Jun', ai: 356, quantum: 79, blockchain: 178, edge: 122 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
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
                    dataKey="ai"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="AI"
                  />
                  <Area
                    type="monotone"
                    dataKey="quantum"
                    stackId="1"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                    name="Quantum"
                  />
                  <Area
                    type="monotone"
                    dataKey="blockchain"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                    name="Blockchain"
                  />
                  <Area
                    type="monotone"
                    dataKey="edge"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.6}
                    name="Edge Computing"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patents Tab */}
        <TabsContent value="patents" className="space-y-4">
          {patents.map((patent) => (
            <Card key={patent.id} className="bg-trading-card border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">{patent.title}</h3>
                      <Badge className={getStatusColor(patent.status)}>
                        {lang === 'ar' ? 
                          (patent.status === 'granted' ? 'ممنوحة' :
                           patent.status === 'pending' ? 'قيد المراجعة' :
                           patent.status === 'expired' ? 'منتهية الصلاحية' : 'مرفوضة') :
                          patent.status}
                      </Badge>
                      <Badge variant="outline" className={getImpactColor(patent.marketImpact)}>
                        {lang === 'ar' ? 
                          (patent.marketImpact === 'high' ? 'تأثير عالي' :
                           patent.marketImpact === 'medium' ? 'تأثير متوسط' : 'تأثير منخفض') :
                          patent.marketImpact + ' impact'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-2">
                      {lang === 'ar' ? 'رقم البراءة:' : 'Patent ID:'} {patent.id}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">
                          {lang === 'ar' ? 'مقدم الطلب' : 'Applicant'}
                        </p>
                        <p className="text-white font-medium">{patent.applicant}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {lang === 'ar' ? 'المخترع' : 'Inventor'}
                        </p>
                        <p className="text-white font-medium">{patent.inventor}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {lang === 'ar' ? 'التقنية' : 'Technology'}
                        </p>
                        <p className="text-white font-medium">{patent.technology}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {lang === 'ar' ? 'الفئة' : 'Category'}
                        </p>
                        <p className="text-white font-medium">{patent.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <Button size="sm" variant="outline" className="border-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      {lang === 'ar' ? 'عرض' : 'View'}
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Target className="h-4 w-4 mr-1" />
                      {lang === 'ar' ? 'تحليل' : 'Analyze'}
                    </Button>
                  </div>
                </div>

                {/* Patent Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {formatArabicNumber(patent.claims)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'مطالبات' : 'Claims'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {formatArabicNumber(patent.citations)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'اقتباسات' : 'Citations'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {formatArabicNumber(patent.commercialPotential)}%
                    </p>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'إمكانية تجارية' : 'Commercial Potential'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {formatArabicNumber(patent.innovationScore)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {lang === 'ar' ? 'درجة الابتكار' : 'Innovation Score'}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {lang === 'ar' ? 'تاريخ التقديم:' : 'Filed:'} {patent.applicationDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {lang === 'ar' ? 'تاريخ النشر:' : 'Published:'} {patent.publicationDate}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {technologyTrends.map((trend, index) => (
              <Card key={index} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      {trend.technology}
                    </div>
                    <div className="flex items-center gap-2">
                      {getOutlookIcon(trend.futureOutlook)}
                      <Badge className={
                        trend.hotness > 90 ? 'bg-red-600' :
                        trend.hotness > 70 ? 'bg-orange-600' : 'bg-green-600'
                      }>
                        {lang === 'ar' ? 'ساخن' : 'Hot'} {formatArabicNumber(trend.hotness)}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'عدد البراءات' : 'Patent Count'}
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {formatArabicNumber(trend.patentCount)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'معدل النمو' : 'Growth Rate'}
                        </p>
                        <p className="text-green-400 font-semibold text-lg">
                          +{formatArabicNumber(trend.growthRate)}%
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'حجم السوق (مليار $)' : 'Market Size (B$)'}
                        </p>
                        <p className="text-white font-semibold text-lg">
                          ${formatArabicNumber(trend.marketSize)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'النظرة المستقبلية' : 'Future Outlook'}
                        </p>
                        <p className={`font-semibold text-lg ${
                          trend.futureOutlook === 'positive' ? 'text-green-400' :
                          trend.futureOutlook === 'negative' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {lang === 'ar' ? 
                            (trend.futureOutlook === 'positive' ? 'إيجابية' :
                             trend.futureOutlook === 'negative' ? 'سلبية' : 'محايدة') :
                            trend.futureOutlook}
                        </p>
                      </div>
                    </div>

                    {/* Leading Companies */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        {lang === 'ar' ? 'الشركات الرائدة' : 'Leading Companies'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {trend.companies.map((company, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Innovation Index Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">
                          {lang === 'ar' ? 'مؤشر الابتكار' : 'Innovation Index'}
                        </span>
                        <span className="text-white font-semibold">
                          {formatArabicNumber(trend.hotness)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            trend.hotness > 90 ? 'bg-red-500' :
                            trend.hotness > 70 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${trend.hotness}%` }}
                        />
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      {lang === 'ar' ? 'تحليل مفصل' : 'Detailed Analysis'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {companyData.map((company, index) => (
              <Card key={index} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-400" />
                      {company.company}
                    </div>
                    <Badge className={
                      company.marketPosition === 'leader' ? 'bg-green-600' :
                      company.marketPosition === 'challenger' ? 'bg-blue-600' :
                      company.marketPosition === 'follower' ? 'bg-yellow-600' : 'bg-purple-600'
                    }>
                      {lang === 'ar' ? 
                        (company.marketPosition === 'leader' ? 'رائد' :
                         company.marketPosition === 'challenger' ? 'منافس' :
                         company.marketPosition === 'follower' ? 'تابع' : 'متخصص') :
                        company.marketPosition}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {formatArabicNumber(company.patentCount)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'براءات اختراع' : 'Patents'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-2xl font-bold text-blue-400">
                          {formatArabicNumber(company.innovationIndex)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'مؤشر الابتكار' : 'Innovation Index'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-2xl font-bold text-green-400">
                          {formatArabicNumber(company.recentActivity)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'نشاط حديث' : 'Recent Activity'}
                        </p>
                      </div>
                    </div>

                    {/* Patent Categories */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">
                        {lang === 'ar' ? 'توزيع البراءات حسب الفئة' : 'Patent Distribution by Category'}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(company.categories).map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">{category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-700 rounded-full h-1">
                                <div
                                  className="bg-blue-500 h-1 rounded-full"
                                  style={{ width: `${(count / company.patentCount) * 100}%` }}
                                />
                              </div>
                              <span className="text-white text-sm w-8">
                                {formatArabicNumber(count)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Collaborations */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        {lang === 'ar' ? 'التعاونات' : 'Collaborations'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {company.collaborations.map((collaboration, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-blue-500 text-blue-400">
                            {collaboration}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      {lang === 'ar' ? 'ملف الشركة الكامل' : 'Full Company Profile'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketInsights.map((insight, index) => (
              <Card key={index} className="bg-trading-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-400" />
                      {insight.sector}
                    </div>
                    <Badge className={
                      insight.riskLevel === 'low' ? 'bg-green-600' :
                      insight.riskLevel === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                    }>
                      {lang === 'ar' ? 
                        (insight.riskLevel === 'low' ? 'مخاطر منخفضة' :
                         insight.riskLevel === 'medium' ? 'مخاطر متوسطة' : 'مخاطر عالية') :
                        insight.riskLevel + ' risk'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'نشاط البراءات' : 'Patent Activity'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${insight.patentActivity}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(insight.patentActivity)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'اتجاه الابتكار' : 'Innovation Trend'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${insight.innovationTrend}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(insight.innovationTrend)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'شدة المنافسة' : 'Competitive Intensity'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${insight.competitiveIntensity}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">
                            {formatArabicNumber(insight.competitiveIntensity)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">
                          {lang === 'ar' ? 'الوقت إلى السوق (شهر)' : 'Time to Market (months)'}
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {formatArabicNumber(insight.timeToMarket)}
                        </p>
                      </div>
                    </div>

                    {/* Investment Flow */}
                    <div>
                      <p className="text-gray-400 text-sm mb-2">
                        {lang === 'ar' ? 'تدفق الاستثمارات (مليار $)' : 'Investment Flow (B$)'}
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        ${formatArabicNumber(insight.investmentFlow)}
                      </p>
                    </div>

                    {/* Opportunities */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        {lang === 'ar' ? 'الفرص الناشئة' : 'Emerging Opportunities'}
                      </h4>
                      <ul className="space-y-1">
                        {insight.opportunities.map((opportunity, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1 h-1 bg-green-400 rounded-full" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      {lang === 'ar' ? 'تحليل القطاع الكامل' : 'Full Sector Analysis'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatentAnalysis;
