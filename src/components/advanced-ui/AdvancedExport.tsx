
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart,
  TrendingUp,
  Activity,
  Settings,
  CheckCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface ExportOptions {
  includeCharts: boolean;
  includeStats: boolean;
  includePortfolio: boolean;
  includeTrades: boolean;
  includeAnalysis: boolean;
  format: 'pdf' | 'csv' | 'excel' | 'json';
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  chartResolution: 'low' | 'medium' | 'high';
  language: 'en' | 'ar';
}

interface AdvancedExportProps {
  lang: 'en' | 'ar';
  onExport: (options: ExportOptions) => void;
}

const AdvancedExport: React.FC<AdvancedExportProps> = ({ lang, onExport }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeCharts: true,
    includeStats: true,
    includePortfolio: true,
    includeTrades: false,
    includeAnalysis: false,
    format: 'pdf',
    dateRange: 'month',
    chartResolution: 'high',
    language: lang
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportSections = [
    {
      key: 'includeCharts' as keyof ExportOptions,
      title: lang === 'ar' ? 'الرسوم البيانية' : 'Charts',
      icon: <BarChart3 className="h-4 w-4" />,
      description: lang === 'ar' ? 'رسوم الأسعار والمؤشرات الفنية' : 'Price charts and technical indicators'
    },
    {
      key: 'includeStats' as keyof ExportOptions,
      title: lang === 'ar' ? 'الإحصائيات' : 'Statistics',
      icon: <TrendingUp className="h-4 w-4" />,
      description: lang === 'ar' ? 'إحصائيات الأداء والأرباح' : 'Performance and profit statistics'
    },
    {
      key: 'includePortfolio' as keyof ExportOptions,
      title: lang === 'ar' ? 'المحفظة' : 'Portfolio',
      icon: <PieChart className="h-4 w-4" />,
      description: lang === 'ar' ? 'تفاصيل المحفظة والأصول' : 'Portfolio details and assets'
    },
    {
      key: 'includeTrades' as keyof ExportOptions,
      title: lang === 'ar' ? 'الصفقات' : 'Trades',
      icon: <Activity className="h-4 w-4" />,
      description: lang === 'ar' ? 'سجل جميع الصفقات' : 'Complete trading history'
    },
    {
      key: 'includeAnalysis' as keyof ExportOptions,
      title: lang === 'ar' ? 'التحليل' : 'Analysis',
      icon: <Settings className="h-4 w-4" />,
      description: lang === 'ar' ? 'تقارير التحليل والتوصيات' : 'Analysis reports and recommendations'
    }
  ];

  const dateRangeOptions = [
    { value: 'today', label: lang === 'ar' ? 'اليوم' : 'Today' },
    { value: 'week', label: lang === 'ar' ? 'هذا الأسبوع' : 'This Week' },
    { value: 'month', label: lang === 'ar' ? 'هذا الشهر' : 'This Month' },
    { value: 'quarter', label: lang === 'ar' ? 'هذا الربع' : 'This Quarter' },
    { value: 'year', label: lang === 'ar' ? 'هذا العام' : 'This Year' },
    { value: 'custom', label: lang === 'ar' ? 'مخصص' : 'Custom' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF', description: lang === 'ar' ? 'تقرير كامل مع الرسوم' : 'Complete report with charts' },
    { value: 'csv', label: 'CSV', description: lang === 'ar' ? 'بيانات جدولية' : 'Tabular data' },
    { value: 'excel', label: 'Excel', description: lang === 'ar' ? 'جداول بيانات متقدمة' : 'Advanced spreadsheets' },
    { value: 'json', label: 'JSON', description: lang === 'ar' ? 'بيانات خام للمطورين' : 'Raw data for developers' }
  ];

  const resolutionOptions = [
    { value: 'low', label: lang === 'ar' ? 'منخفضة' : 'Low', description: '72 DPI' },
    { value: 'medium', label: lang === 'ar' ? 'متوسطة' : 'Medium', description: '150 DPI' },
    { value: 'high', label: lang === 'ar' ? 'عالية' : 'High', description: '300 DPI' }
  ];

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateMockData = () => {
    return {
      portfolio: {
        totalValue: 125000,
        dailyChange: 2340,
        positions: [
          { symbol: 'BTC/USD', value: 45000, change: 5.2 },
          { symbol: 'ETH/USD', value: 3200, change: -1.8 },
          { symbol: 'AAPL', value: 15000, change: 2.1 }
        ]
      },
      trades: [
        { date: '2024-01-15', symbol: 'BTC/USD', type: 'BUY', amount: 0.5, price: 45000, profit: 2250 },
        { date: '2024-01-14', symbol: 'ETH/USD', type: 'SELL', amount: 2, price: 3200, profit: -320 }
      ],
      statistics: {
        totalProfit: 12500,
        winRate: 68.5,
        totalTrades: 145,
        avgHoldTime: '4.2 days'
      }
    };
  };

  const generatePDFReport = async () => {
    const pdf = new jsPDF();
    const data = generateMockData();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text(lang === 'ar' ? 'تقرير التداول الشامل' : 'Comprehensive Trading Report', 20, 30);
    
    // Add date
    pdf.setFontSize(12);
    const currentDate = new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US');
    pdf.text(`${lang === 'ar' ? 'التاريخ:' : 'Date:'} ${currentDate}`, 20, 45);
    
    let yPosition = 60;
    
    if (exportOptions.includeStats) {
      pdf.setFontSize(16);
      pdf.text(lang === 'ar' ? 'الإحصائيات الأساسية' : 'Key Statistics', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.text(`${lang === 'ar' ? 'إجمالي الربح:' : 'Total Profit:'} $${data.statistics.totalProfit}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`${lang === 'ar' ? 'معدل الفوز:' : 'Win Rate:'} ${data.statistics.winRate}%`, 20, yPosition);
      yPosition += 10;
      pdf.text(`${lang === 'ar' ? 'إجمالي الصفقات:' : 'Total Trades:'} ${data.statistics.totalTrades}`, 20, yPosition);
      yPosition += 20;
    }
    
    if (exportOptions.includePortfolio) {
      pdf.setFontSize(16);
      pdf.text(lang === 'ar' ? 'نظرة عامة على المحفظة' : 'Portfolio Overview', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.text(`${lang === 'ar' ? 'القيمة الإجمالية:' : 'Total Value:'} $${data.portfolio.totalValue}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`${lang === 'ar' ? 'التغيير اليومي:' : 'Daily Change:'} $${data.portfolio.dailyChange}`, 20, yPosition);
      yPosition += 20;
    }
    
    if (exportOptions.includeTrades && yPosition < 250) {
      pdf.setFontSize(16);
      pdf.text(lang === 'ar' ? 'الصفقات الأخيرة' : 'Recent Trades', 20, yPosition);
      yPosition += 15;
      
      data.trades.forEach((trade, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
        pdf.setFontSize(10);
        pdf.text(`${trade.date} - ${trade.symbol} ${trade.type} - $${trade.profit}`, 20, yPosition);
        yPosition += 8;
      });
    }
    
    return pdf;
  };

  const exportData = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      if (exportOptions.format === 'pdf') {
        const pdf = await generatePDFReport();
        pdf.save(`trading-report-${new Date().toISOString().split('T')[0]}.pdf`);
      } else if (exportOptions.format === 'csv') {
        const data = generateMockData();
        const csvContent = `Date,Symbol,Type,Amount,Price,Profit\n${data.trades.map(t => 
          `${t.date},${t.symbol},${t.type},${t.amount},${t.price},${t.profit}`
        ).join('\n')}`;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trading-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else if (exportOptions.format === 'json') {
        const data = generateMockData();
        const jsonContent = JSON.stringify(data, null, 2);
        
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trading-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      
      onExport(exportOptions);
      toast.success(lang === 'ar' ? 'تم تصدير التقرير بنجاح' : 'Report exported successfully');
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error(lang === 'ar' ? 'خطأ في تصدير التقرير' : 'Export failed');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {lang === 'ar' ? 'تصدير متقدم' : 'Advanced Export'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Sections */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            {lang === 'ar' ? 'أقسام التقرير:' : 'Report Sections:'}
          </h4>
          <div className="space-y-3">
            {exportSections.map((section) => (
              <div key={section.key} className="flex items-start space-x-3">
                <Checkbox
                  id={section.key}
                  checked={exportOptions[section.key] as boolean}
                  onCheckedChange={(checked) => handleOptionChange(section.key, checked)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="text-sm font-medium text-white">{section.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            {lang === 'ar' ? 'تنسيق التصدير:' : 'Export Format:'}
          </h4>
          <Select 
            value={exportOptions.format} 
            onValueChange={(value) => handleOptionChange('format', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  <div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-gray-500">{format.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            {lang === 'ar' ? 'النطاق الزمني:' : 'Date Range:'}
          </h4>
          <Select 
            value={exportOptions.dateRange} 
            onValueChange={(value) => handleOptionChange('dateRange', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chart Resolution */}
        {exportOptions.format === 'pdf' && exportOptions.includeCharts && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">
              {lang === 'ar' ? 'دقة الرسوم البيانية:' : 'Chart Resolution:'}
            </h4>
            <Select 
              value={exportOptions.chartResolution} 
              onValueChange={(value) => handleOptionChange('chartResolution', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolutionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                {lang === 'ar' ? 'جاري التصدير...' : 'Exporting...'}
              </span>
              <span className="text-white">{exportProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-trading-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Export Button */}
        <Button
          onClick={exportData}
          disabled={isExporting}
          className="w-full bg-trading-primary hover:bg-trading-primary/90"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {lang === 'ar' ? 'جاري التصدير...' : 'Exporting...'}
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تصدير التقرير' : 'Export Report'}
            </>
          )}
        </Button>

        {/* Export Summary */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>{lang === 'ar' ? 'الأقسام المحددة:' : 'Selected sections:'}</span>
            <Badge variant="secondary">
              {Object.values(exportOptions).filter(v => v === true).length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>{lang === 'ar' ? 'التنسيق:' : 'Format:'}</span>
            <span className="uppercase">{exportOptions.format}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{lang === 'ar' ? 'النطاق:' : 'Range:'}</span>
            <span>{dateRangeOptions.find(o => o.value === exportOptions.dateRange)?.label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedExport;
