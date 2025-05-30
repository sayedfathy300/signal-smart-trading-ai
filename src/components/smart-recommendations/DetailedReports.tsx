
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { smartRecommendationsService, DetailedReport } from '@/services/smartRecommendationsService';
import { FileText, Download, Share, TrendingUp, Shield, Target, Clock, User, Tag } from 'lucide-react';

interface DetailedReportsProps {
  lang?: 'en' | 'ar';
}

export const DetailedReports: React.FC<DetailedReportsProps> = ({ lang = 'ar' }) => {
  const [reports, setReports] = useState<DetailedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DetailedReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const marketReport = await smartRecommendationsService.generateDetailedReport('market_analysis', ['BTCUSD', 'EURUSD', 'AAPL']);
      const portfolioReport = await smartRecommendationsService.generateDetailedReport('portfolio_review', ['GOOGL', 'TSLA', 'MSFT']);
      const riskReport = await smartRecommendationsService.generateDetailedReport('risk_assessment', ['SPY', 'QQQ', 'IWM']);
      
      setReports([marketReport, portfolioReport, riskReport]);
      setSelectedReport(marketReport);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewReport = async (type: string) => {
    setLoading(true);
    try {
      const symbols = ['BTCUSD', 'EURUSD', 'AAPL', 'GOOGL', 'TSLA'];
      const randomSymbols = symbols.sort(() => 0.5 - Math.random()).slice(0, 3);
      const newReport = await smartRecommendationsService.generateDetailedReport(type, randomSymbols);
      setReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'market_analysis': return <TrendingUp className="h-4 w-4" />;
      case 'portfolio_review': return <Target className="h-4 w-4" />;
      case 'risk_assessment': return <Shield className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'market_analysis': return lang === 'ar' ? 'تحليل السوق' : 'Market Analysis';
      case 'portfolio_review': return lang === 'ar' ? 'مراجعة المحفظة' : 'Portfolio Review';
      case 'risk_assessment': return lang === 'ar' ? 'تقييم المخاطر' : 'Risk Assessment';
      case 'opportunity_scan': return lang === 'ar' ? 'مسح الفرص' : 'Opportunity Scan';
      default: return type;
    }
  };

  const getAuthorName = (author: string) => {
    switch (author) {
      case 'AI_Analyst': return lang === 'ar' ? 'محلل الذكاء الاصطناعي' : 'AI Analyst';
      case 'Risk_Manager': return lang === 'ar' ? 'مدير المخاطر' : 'Risk Manager';
      case 'Strategy_Bot': return lang === 'ar' ? 'بوت الاستراتيجية' : 'Strategy Bot';
      default: return author;
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-500';
    if (score <= 6) return 'text-yellow-500';
    if (score <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading && reports.length === 0) {
    return (
      <Card className="bg-trading-card border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-trading-light animate-pulse">
              {lang === 'ar' ? 'جاري إنشاء التقارير المفصلة...' : 'Generating detailed reports...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              {lang === 'ar' ? 'التقارير المفصلة' : 'Detailed Reports'}
            </CardTitle>
            
            <div className="flex gap-2">
              <Button
                onClick={() => generateNewReport('market_analysis')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تحليل السوق' : 'Market Analysis'}
              </Button>
              <Button
                onClick={() => generateNewReport('portfolio_review')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Target className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'مراجعة المحفظة' : 'Portfolio Review'}
              </Button>
              <Button
                onClick={() => generateNewReport('risk_assessment')}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                <Shield className="h-4 w-4 mr-2" />
                {lang === 'ar' ? 'تقييم المخاطر' : 'Risk Assessment'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Reports List */}
        <Card className="lg:col-span-1 bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              {lang === 'ar' ? 'قائمة التقارير' : 'Reports List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {reports.map((report, index) => (
                  <div
                    key={report.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedReport?.id === report.id 
                        ? 'bg-blue-600/20 border border-blue-500' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {getReportTypeIcon(report.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {getReportTypeName(report.type)}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {new Date(report.timestamp).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="secondary" className="text-xs">
                        {getAuthorName(report.author)}
                      </Badge>
                      <span className={`font-bold ${getRiskColor(report.riskScore)}`}>
                        {report.riskScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Card className="lg:col-span-3 bg-trading-card border-gray-800">
          {selectedReport ? (
            <>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl text-white flex items-center gap-2 mb-2">
                      {getReportTypeIcon(selectedReport.type)}
                      {selectedReport.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {getAuthorName(selectedReport.author)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(selectedReport.timestamp).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className={`h-4 w-4 ${getRiskColor(selectedReport.riskScore)}`} />
                        {lang === 'ar' ? 'مخاطر:' : 'Risk:'} {selectedReport.riskScore.toFixed(1)}/10
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-blue-400" />
                        {lang === 'ar' ? 'ثقة:' : 'Confidence:'} {(selectedReport.confidenceLevel * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      {lang === 'ar' ? 'تحميل' : 'Download'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="h-4 w-4 mr-2" />
                      {lang === 'ar' ? 'مشاركة' : 'Share'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="content" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                    <TabsTrigger value="content">
                      {lang === 'ar' ? 'المحتوى' : 'Content'}
                    </TabsTrigger>
                    <TabsTrigger value="findings">
                      {lang === 'ar' ? 'النتائج' : 'Findings'}
                    </TabsTrigger>
                    <TabsTrigger value="recommendations">
                      {lang === 'ar' ? 'التوصيات' : 'Recommendations'}
                    </TabsTrigger>
                    <TabsTrigger value="charts">
                      {lang === 'ar' ? 'الرسوم' : 'Charts'}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {lang === 'ar' ? 'الملخص' : 'Summary'}
                      </h4>
                      <p className="text-gray-300">{selectedReport.summary}</p>
                    </div>
                    
                    <ScrollArea className="h-96">
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-gray-300">
                          {selectedReport.content}
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="findings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedReport.keyFindings.map((finding, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <p className="text-gray-300 flex-1">{finding}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">
                        {lang === 'ar' ? 'الرموز المحللة' : 'Analyzed Symbols'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedReport.symbols.map((symbol, index) => (
                          <Badge key={index} variant="secondary">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedReport.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-bold text-white">{rec.title}</h5>
                            <Badge className={`${
                              rec.type === 'buy' ? 'bg-green-500' :
                              rec.type === 'sell' ? 'bg-red-500' :
                              rec.type === 'hold' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            } text-white`}>
                              {rec.type.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-3">{rec.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-400">{lang === 'ar' ? 'الثقة:' : 'Confidence:'}</span>
                              <span className="text-white ml-1">{(rec.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400">{lang === 'ar' ? 'العائد:' : 'Return:'}</span>
                              <span className="text-green-400 ml-1">{rec.expectedReturn.toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-gray-400">{lang === 'ar' ? 'المخاطر:' : 'Risk:'}</span>
                              <span className={`ml-1 ${getRiskColor(rec.riskLevel)}`}>
                                {rec.riskLevel.toFixed(1)}/10
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">{lang === 'ar' ? 'الأولوية:' : 'Priority:'}</span>
                              <span className="text-blue-400 ml-1">{rec.priority}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="charts" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedReport.charts.map((chart, index) => (
                        <div key={index} className="p-4 bg-gray-800 rounded-lg text-center">
                          <h5 className="font-semibold text-white mb-2">{chart.title}</h5>
                          <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-sm">
                              {lang === 'ar' ? 'رسم بياني' : 'Chart'} - {chart.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Tags */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {lang === 'ar' ? 'العلامات:' : 'Tags:'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedReport.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-6">
              <div className="text-center text-gray-400">
                {lang === 'ar' ? 'اختر تقريراً لعرضه' : 'Select a report to view'}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
