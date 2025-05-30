
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Calendar, Filter, Settings, CheckCircle, FileSpreadsheet, Database } from 'lucide-react';
import { toast } from 'sonner';

interface ReportData {
  portfolio: any;
  trades: any[];
  analytics: any;
  performance: any;
  marketData: any[];
}

interface ReportExporterProps {
  lang: 'en' | 'ar';
  data?: ReportData;
}

interface ExportConfig {
  format: 'csv' | 'json' | 'excel' | 'pdf';
  sections: string[];
  dateRange: string;
  groupBy: string;
  includeCharts: boolean;
  compression: boolean;
}

const ReportExporter: React.FC<ReportExporterProps> = ({ lang, data }) => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    sections: ['portfolio', 'trades', 'performance'],
    dateRange: 'month',
    groupBy: 'date',
    includeCharts: false,
    compression: false
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastExport, setLastExport] = useState<string | null>(null);

  // Available sections for export
  const availableSections = [
    {
      id: 'portfolio',
      name: lang === 'ar' ? 'المحفظة' : 'Portfolio',
      icon: <Database className="h-4 w-4" />,
      description: lang === 'ar' ? 'بيانات المحفظة والأصول' : 'Portfolio and asset data'
    },
    {
      id: 'trades',
      name: lang === 'ar' ? 'الصفقات' : 'Trades',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      description: lang === 'ar' ? 'سجل جميع الصفقات' : 'Complete trading history'
    },
    {
      id: 'performance',
      name: lang === 'ar' ? 'الأداء' : 'Performance',
      icon: <FileText className="h-4 w-4" />,
      description: lang === 'ar' ? 'إحصائيات الأداء' : 'Performance statistics'
    },
    {
      id: 'analytics',
      name: lang === 'ar' ? 'التحليلات' : 'Analytics',
      icon: <FileText className="h-4 w-4" />,
      description: lang === 'ar' ? 'تحليلات متقدمة' : 'Advanced analytics'
    },
    {
      id: 'market',
      name: lang === 'ar' ? 'بيانات السوق' : 'Market Data',
      icon: <FileText className="h-4 w-4" />,
      description: lang === 'ar' ? 'بيانات السوق التاريخية' : 'Historical market data'
    }
  ];

  // Generate mock data for demo
  const mockData: ReportData = {
    portfolio: {
      totalValue: 125000,
      dailyChange: 2340,
      assets: [
        { symbol: 'BTC', value: 45000, allocation: 36 },
        { symbol: 'ETH', value: 32000, allocation: 25.6 },
        { symbol: 'AAPL', value: 25000, allocation: 20 },
        { symbol: 'GOOGL', value: 23000, allocation: 18.4 }
      ]
    },
    trades: Array.from({ length: 50 }, (_, i) => ({
      id: `trade_${i}`,
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      symbol: ['BTC', 'ETH', 'AAPL', 'GOOGL'][Math.floor(Math.random() * 4)],
      side: Math.random() > 0.5 ? 'BUY' : 'SELL',
      quantity: Math.random() * 10,
      price: Math.random() * 50000,
      profit: (Math.random() - 0.5) * 5000
    })),
    analytics: {
      sharpeRatio: 1.85,
      maxDrawdown: -8.5,
      winRate: 68.4,
      avgWin: 1250,
      avgLoss: -680
    },
    performance: {
      totalReturn: 23.4,
      annualizedReturn: 18.7,
      volatility: 12.3,
      alpha: 5.2,
      beta: 0.85
    },
    marketData: Array.from({ length: 100 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      open: 45000 + Math.random() * 5000,
      high: 46000 + Math.random() * 5000,
      low: 44000 + Math.random() * 5000,
      close: 45000 + Math.random() * 5000,
      volume: Math.random() * 1000000
    }))
  };

  const finalData = data || mockData;

  const updateConfig = <K extends keyof ExportConfig>(key: K, value: ExportConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleSection = (sectionId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(s => s !== sectionId)
        : [...prev.sections, sectionId]
    }));
  };

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const generateJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    link.click();
  };

  const generateExcel = async (data: any, filename: string) => {
    // Mock Excel generation - in real implementation, use a library like xlsx
    const csvData = typeof data === 'object' && !Array.isArray(data) 
      ? Object.entries(data).map(([key, value]) => ({ section: key, data: JSON.stringify(value) }))
      : data;
    
    generateCSV(csvData, filename);
    toast.info(lang === 'ar' ? 'تم تصدير Excel كـ CSV' : 'Excel exported as CSV (demo)');
  };

  const generatePDF = async (data: any, filename: string) => {
    // Mock PDF generation
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.pdf`;
    link.click();
    toast.info(lang === 'ar' ? 'تم تصدير PDF كـ JSON' : 'PDF exported as JSON (demo)');
  };

  const exportReport = async () => {
    if (config.sections.length === 0) {
      toast.error(lang === 'ar' ? 'يرجى اختيار قسم واحد على الأقل' : 'Please select at least one section');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 20, 90));
      }, 300);

      // Prepare export data
      const exportData: any = {};
      
      config.sections.forEach(section => {
        switch (section) {
          case 'portfolio':
            exportData.portfolio = finalData.portfolio;
            break;
          case 'trades':
            exportData.trades = finalData.trades;
            break;
          case 'performance':
            exportData.performance = finalData.performance;
            break;
          case 'analytics':
            exportData.analytics = finalData.analytics;
            break;
          case 'market':
            exportData.marketData = finalData.marketData;
            break;
        }
      });

      // Add metadata
      exportData.metadata = {
        exportDate: new Date().toISOString(),
        format: config.format,
        sections: config.sections,
        dateRange: config.dateRange,
        language: lang
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      clearInterval(progressInterval);
      setExportProgress(100);

      // Generate file based on format
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `trading-report-${timestamp}`;

      switch (config.format) {
        case 'csv':
          if (config.sections.length === 1 && finalData[config.sections[0] as keyof ReportData]) {
            const sectionData = finalData[config.sections[0] as keyof ReportData];
            if (Array.isArray(sectionData)) {
              generateCSV(sectionData, filename);
            } else {
              generateCSV([sectionData], filename);
            }
          } else {
            // Export multiple sections as separate CSV files
            config.sections.forEach(section => {
              const sectionData = finalData[section as keyof ReportData];
              if (Array.isArray(sectionData)) {
                generateCSV(sectionData, `${filename}-${section}`);
              } else if (sectionData) {
                generateCSV([sectionData], `${filename}-${section}`);
              }
            });
          }
          break;

        case 'json':
          generateJSON(exportData, filename);
          break;

        case 'excel':
          await generateExcel(exportData, filename);
          break;

        case 'pdf':
          await generatePDF(exportData, filename);
          break;
      }

      setLastExport(new Date().toISOString());
      toast.success(lang === 'ar' ? 'تم تصدير التقرير بنجاح' : 'Report exported successfully');

    } catch (error) {
      console.error('Export error:', error);
      toast.error(lang === 'ar' ? 'فشل في تصدير التقرير' : 'Failed to export report');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const getEstimatedSize = () => {
    const baseSize = config.sections.length * 100; // KB per section
    const multiplier = config.format === 'json' ? 1.5 : config.format === 'excel' ? 2 : 1;
    return Math.round(baseSize * multiplier);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-400" />
            {lang === 'ar' ? 'تصدير التقارير المتقدم' : 'Advanced Report Export'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Format */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {lang === 'ar' ? 'تنسيق التصدير' : 'Export Format'}
              </label>
              <Select value={config.format} onValueChange={(value) => updateConfig('format', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {lang === 'ar' ? 'النطاق الزمني' : 'Date Range'}
              </label>
              <Select value={config.dateRange} onValueChange={(value) => updateConfig('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">{lang === 'ar' ? 'اليوم' : 'Today'}</SelectItem>
                  <SelectItem value="week">{lang === 'ar' ? 'الأسبوع' : 'This Week'}</SelectItem>
                  <SelectItem value="month">{lang === 'ar' ? 'الشهر' : 'This Month'}</SelectItem>
                  <SelectItem value="quarter">{lang === 'ar' ? 'الربع' : 'This Quarter'}</SelectItem>
                  <SelectItem value="year">{lang === 'ar' ? 'السنة' : 'This Year'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {lang === 'ar' ? 'تجميع البيانات' : 'Group By'}
              </label>
              <Select value={config.groupBy} onValueChange={(value) => updateConfig('groupBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">{lang === 'ar' ? 'التاريخ' : 'Date'}</SelectItem>
                  <SelectItem value="symbol">{lang === 'ar' ? 'الرمز' : 'Symbol'}</SelectItem>
                  <SelectItem value="type">{lang === 'ar' ? 'النوع' : 'Type'}</SelectItem>
                  <SelectItem value="none">{lang === 'ar' ? 'بدون تجميع' : 'No Grouping'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col justify-end">
              <Button
                onClick={exportReport}
                disabled={isExporting || config.sections.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {lang === 'ar' ? 'جاري التصدير...' : 'Exporting...'}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'تصدير' : 'Export'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <label className="text-sm text-gray-400 mb-3 block">
              {lang === 'ar' ? 'اختر الأقسام للتصدير:' : 'Select Sections to Export:'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    config.sections.includes(section.id)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={config.sections.includes(section.id)}
                      onChange={() => toggleSection(section.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {section.icon}
                        <span className="text-white font-medium">{section.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{section.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-white font-medium mb-3">
              {lang === 'ar' ? 'خيارات إضافية' : 'Additional Options'}
            </h4>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                {lang === 'ar' ? 'تضمين الرسوم البيانية' : 'Include Charts'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeCharts}
                  onChange={(e) => updateConfig('includeCharts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                {lang === 'ar' ? 'ضغط الملفات' : 'File Compression'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.compression}
                  onChange={(e) => updateConfig('compression', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {lang === 'ar' ? 'تقدم التصدير' : 'Export Progress'}
                </span>
                <span className="text-white">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}

          {/* Export Summary */}
          <div className="text-xs text-gray-500 space-y-1 border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <span>{lang === 'ar' ? 'الأقسام المحددة:' : 'Selected sections:'}</span>
              <Badge variant="secondary">{config.sections.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>{lang === 'ar' ? 'التنسيق:' : 'Format:'}</span>
              <span className="uppercase">{config.format}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{lang === 'ar' ? 'الحجم المقدر:' : 'Estimated size:'}</span>
              <span>{getEstimatedSize()} KB</span>
            </div>
            {lastExport && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-green-900/20 border border-green-500/30 rounded">
                <CheckCircle className="h-3 w-3 text-green-400" />
                <span className="text-green-400">
                  {lang === 'ar' 
                    ? `آخر تصدير: ${new Date(lastExport).toLocaleString()}`
                    : `Last export: ${new Date(lastExport).toLocaleString()}`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportExporter;
