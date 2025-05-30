import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, FileText, Search, Lightbulb, Building, Users, Calendar, Filter } from 'lucide-react';

interface PatentData {
  id: string;
  title: string;
  company: string;
  filingDate: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  score: number;
  citations: number;
  claims: number;
  marketRelevance: number;
  technicalComplexity: number;
}

interface PatentAnalysisProps {
  lang: 'en' | 'ar';
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

const PatentAnalysis: React.FC<PatentAnalysisProps> = ({ lang }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('year');
  const [loading, setLoading] = useState(false);

  // Generate mock patent data
  const patentData: PatentData[] = useMemo(() => {
    const companies = ['Apple', 'Google', 'Microsoft', 'Amazon', 'Tesla', 'Meta', 'Samsung', 'IBM'];
    const categories = ['AI/ML', 'Blockchain', 'IoT', 'Biotech', 'Renewable Energy', 'Quantum Computing', 'Robotics'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `PAT-${String(i + 1).padStart(3, '0')}`,
      title: `${lang === 'ar' ? 'براءة اختراع' : 'Patent'} ${i + 1}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      filingDate: new Date(2024 - Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      category: categories[Math.floor(Math.random() * categories.length)],
      impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      score: Math.floor(Math.random() * 100) + 1,
      citations: Math.floor(Math.random() * 50),
      claims: Math.floor(Math.random() * 20) + 5,
      marketRelevance: Math.floor(Math.random() * 100) + 1,
      technicalComplexity: Math.floor(Math.random() * 100) + 1
    }));
  }, [lang]);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return patentData.filter(patent => {
      if (selectedCompany !== 'all' && patent.company !== selectedCompany) return false;
      if (selectedCategory !== 'all' && patent.category !== selectedCategory) return false;
      return true;
    });
  }, [patentData, selectedCompany, selectedCategory]);

  // Prepare chart data
  const companyPatentCounts = useMemo(() => {
    const counts = filteredData.reduce((acc, patent) => {
      acc[patent.company] = (acc[patent.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([company, count]) => ({
      company,
      count,
      averageScore: filteredData.filter(p => p.company === company).reduce((sum, p) => sum + p.score, 0) / count
    }));
  }, [filteredData]);

  const categoryDistribution = useMemo(() => {
    const distribution = filteredData.reduce((acc, patent) => {
      acc[patent.category] = (acc[patent.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([category, count]) => ({
      name: category,
      value: count,
      percentage: (count / filteredData.length) * 100
    }));
  }, [filteredData]);

  const monthlyTrends = useMemo(() => {
    const trends = filteredData.reduce((acc, patent) => {
      const month = patent.filingDate.substring(0, 7);
      if (!acc[month]) {
        acc[month] = { month, count: 0, totalScore: 0, highImpact: 0 };
      }
      acc[month].count++;
      acc[month].totalScore += patent.score;
      if (patent.impact === 'high') acc[month].highImpact++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(trends).map((trend: any) => ({
      ...trend,
      averageScore: trend.totalScore / trend.count
    })).sort((a: any, b: any) => a.month.localeCompare(b.month));
  }, [filteredData]);

  const impactAnalysis = useMemo(() => {
    const analysis = filteredData.reduce((acc, patent) => {
      acc[patent.impact] = (acc[patent.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { impact: lang === 'ar' ? 'عالي' : 'High', count: analysis.high || 0, color: '#ef4444' },
      { impact: lang === 'ar' ? 'متوسط' : 'Medium', count: analysis.medium || 0, color: '#f59e0b' },
      { impact: lang === 'ar' ? 'منخفض' : 'Low', count: analysis.low || 0, color: '#10b981' }
    ];
  }, [filteredData, lang]);

  const scatterData = useMemo(() => {
    return filteredData.map(patent => ({
      x: patent.marketRelevance,
      y: patent.technicalComplexity,
      size: patent.score,
      name: patent.title,
      company: patent.company,
      impact: patent.impact
    }));
  }, [filteredData]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return lang === 'ar' ? 'عالي' : 'High';
      case 'medium': return lang === 'ar' ? 'متوسط' : 'Medium';
      case 'low': return lang === 'ar' ? 'منخفض' : 'Low';
      default: return impact;
    }
  };

  const companies = [...new Set(patentData.map(p => p.company))];
  const categories = [...new Set(patentData.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            {lang === 'ar' ? 'تحليل براءات الاختراع' : 'Patent Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder={lang === 'ar' ? 'اختر الشركة' : 'Select Company'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === 'ar' ? 'جميع الشركات' : 'All Companies'}</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={lang === 'ar' ? 'اختر الفئة' : 'Select Category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === 'ar' ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">{lang === 'ar' ? 'هذا الشهر' : 'This Month'}</SelectItem>
                <SelectItem value="quarter">{lang === 'ar' ? 'هذا الربع' : 'This Quarter'}</SelectItem>
                <SelectItem value="year">{lang === 'ar' ? 'هذا العام' : 'This Year'}</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setLoading(!loading)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تحليل' : 'Analyze'}
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{filteredData.length}</div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'إجمالي البراءات' : 'Total Patents'}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(filteredData.reduce((sum, p) => sum + p.score, 0) / filteredData.length) || 0}
              </div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'متوسط النقاط' : 'Avg Score'}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {filteredData.filter(p => p.impact === 'high').length}
              </div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'تأثير عالي' : 'High Impact'}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">
                {categories.length}
              </div>
              <div className="text-sm text-gray-400">{lang === 'ar' ? 'الفئات' : 'Categories'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5 bg-trading-card">
          <TabsTrigger value="overview">{lang === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="companies">{lang === 'ar' ? 'الشركات' : 'Companies'}</TabsTrigger>
          <TabsTrigger value="trends">{lang === 'ar' ? 'الاتجاهات' : 'Trends'}</TabsTrigger>
          <TabsTrigger value="impact">{lang === 'ar' ? 'التأثير' : 'Impact'}</TabsTrigger>
          <TabsTrigger value="patents">{lang === 'ar' ? 'البراءات' : 'Patents'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{lang === 'ar' ? 'توزيع الفئات' : 'Category Distribution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">{lang === 'ar' ? 'تحليل الأهمية مقابل التعقيد' : 'Relevance vs Complexity'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="x" 
                        stroke="#9CA3AF"
                        label={{ value: lang === 'ar' ? 'الأهمية السوقية' : 'Market Relevance', position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        dataKey="y" 
                        stroke="#9CA3AF"
                        label={{ value: lang === 'ar' ? 'التعقيد التقني' : 'Technical Complexity', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value, name) => [value, name === 'size' ? 'Score' : name]}
                      />
                      <Scatter dataKey="size" fill="#3B82F6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'براءات الاختراع حسب الشركة' : 'Patents by Company'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyPatentCounts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="company" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                    <Bar dataKey="averageScore" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'الاتجاهات الشهرية' : 'Monthly Trends'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="highImpact" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="averageScore" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'توزيع التأثير' : 'Impact Distribution'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {impactAnalysis.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: item.color }}></div>
                      <span className="text-white font-medium">{item.impact}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-white">{item.count}</span>
                      <Progress 
                        value={(item.count / filteredData.length) * 100} 
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patents">
          <Card className="bg-trading-card border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{lang === 'ar' ? 'قائمة البراءات' : 'Patent List'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredData.slice(0, 20).map((patent) => (
                  <div key={patent.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{patent.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {patent.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {patent.filingDate}
                          </span>
                          <span>{patent.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getImpactColor(patent.impact)} text-white`}>
                          {getImpactLabel(patent.impact)}
                        </Badge>
                        <div className="text-right">
                          <div className="text-white font-bold">{patent.score}</div>
                          <div className="text-xs text-gray-400">Score</div>
                        </div>
                      </div>
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
};

export default PatentAnalysis;
