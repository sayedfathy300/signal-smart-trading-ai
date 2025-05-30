
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, FileImage, Printer, Share2, Settings, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface ChartExporterProps {
  chartRef?: React.RefObject<HTMLDivElement>;
  lang: 'en' | 'ar';
  chartTitle?: string;
}

interface ExportOptions {
  format: 'png' | 'jpeg' | 'pdf' | 'svg';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  size: 'small' | 'medium' | 'large' | 'custom';
  includeWatermark: boolean;
  backgroundColor: 'transparent' | 'white' | 'dark';
  customWidth?: number;
  customHeight?: number;
}

const ChartExporter: React.FC<ChartExporterProps> = ({ 
  chartRef, 
  lang, 
  chartTitle = 'Trading Chart' 
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 'high',
    size: 'large',
    includeWatermark: false,
    backgroundColor: 'dark',
    customWidth: 1920,
    customHeight: 1080
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const mockChartRef = useRef<HTMLDivElement>(null);

  // Quality settings
  const qualitySettings = {
    low: { scale: 1, quality: 0.7 },
    medium: { scale: 2, quality: 0.85 },
    high: { scale: 3, quality: 0.95 },
    ultra: { scale: 4, quality: 1.0 }
  };

  // Size presets
  const sizePresets = {
    small: { width: 800, height: 600 },
    medium: { width: 1280, height: 720 },
    large: { width: 1920, height: 1080 },
    custom: { width: exportOptions.customWidth || 1920, height: exportOptions.customHeight || 1080 }
  };

  const updateOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const exportChart = async () => {
    const targetRef = chartRef || mockChartRef;
    
    if (!targetRef.current) {
      toast.error(lang === 'ar' ? 'لا يوجد رسم بياني للتصدير' : 'No chart available for export');
      return;
    }

    setIsExporting(true);

    try {
      const quality = qualitySettings[exportOptions.quality];
      const size = sizePresets[exportOptions.size];
      
      // Configure html2canvas options
      const canvas = await html2canvas(targetRef.current, {
        scale: quality.scale,
        backgroundColor: exportOptions.backgroundColor === 'transparent' ? null : 
                        exportOptions.backgroundColor === 'white' ? '#ffffff' : '#1a1a1a',
        width: size.width,
        height: size.height,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // Add watermark if enabled
      if (exportOptions.includeWatermark) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.textAlign = 'right';
          ctx.fillText('Signal Black Super Trading', canvas.width - 20, canvas.height - 20);
        }
      }

      // Convert to desired format and download
      if (exportOptions.format === 'pdf') {
        await exportToPDF(canvas);
      } else {
        const mimeType = exportOptions.format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const dataURL = canvas.toDataURL(mimeType, quality.quality);
        downloadImage(dataURL, `${chartTitle}.${exportOptions.format}`);
      }

      setLastExport(new Date().toISOString());
      toast.success(lang === 'ar' ? 'تم تصدير الرسم البياني بنجاح' : 'Chart exported successfully');

    } catch (error) {
      console.error('Export error:', error);
      toast.error(lang === 'ar' ? 'فشل في تصدير الرسم البياني' : 'Failed to export chart');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async (canvas: HTMLCanvasElement) => {
    const jsPDF = (await import('jspdf')).default;
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${chartTitle}.pdf`);
  };

  const downloadImage = (dataURL: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareChart = async () => {
    if (!navigator.share) {
      toast.error(lang === 'ar' ? 'المشاركة غير مدعومة' : 'Sharing not supported');
      return;
    }

    try {
      await navigator.share({
        title: chartTitle,
        text: lang === 'ar' ? 'شاهد هذا الرسم البياني' : 'Check out this chart',
        url: window.location.href
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const printChart = () => {
    const targetRef = chartRef || mockChartRef;
    if (!targetRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const chartHTML = targetRef.current.outerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>${chartTitle}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .print-header { text-align: center; margin-bottom: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>${chartTitle}</h1>
            <p>${new Date().toLocaleDateString()}</p>
          </div>
          ${chartHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Mock Chart for Demo */}
      {!chartRef && (
        <div ref={mockChartRef} className="hidden">
          <Card className="bg-trading-card border-gray-800 w-full h-96">
            <CardHeader>
              <CardTitle className="text-white">{chartTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-800 rounded flex items-center justify-center">
                <div className="text-gray-400">
                  {lang === 'ar' ? 'رسم بياني تجريبي للتصدير' : 'Demo Chart for Export'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileImage className="h-5 w-5 text-blue-400" />
            {lang === 'ar' ? 'تصدير الرسوم البيانية المتقدم' : 'Advanced Chart Export'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {lang === 'ar' ? 'التنسيق' : 'Format'}
              </label>
              <Select value={exportOptions.format} onValueChange={(value) => updateOption('format', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {lang === 'ar' ? 'الجودة' : 'Quality'}
              </label>
              <Select value={exportOptions.quality} onValueChange={(value) => updateOption('quality', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{lang === 'ar' ? 'منخفضة' : 'Low'}</SelectItem>
                  <SelectItem value="medium">{lang === 'ar' ? 'متوسطة' : 'Medium'}</SelectItem>
                  <SelectItem value="high">{lang === 'ar' ? 'عالية' : 'High'}</SelectItem>
                  <SelectItem value="ultra">{lang === 'ar' ? 'فائقة' : 'Ultra'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {lang === 'ar' ? 'الحجم' : 'Size'}
              </label>
              <Select value={exportOptions.size} onValueChange={(value) => updateOption('size', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{lang === 'ar' ? 'صغير' : 'Small'} (800×600)</SelectItem>
                  <SelectItem value="medium">{lang === 'ar' ? 'متوسط' : 'Medium'} (1280×720)</SelectItem>
                  <SelectItem value="large">{lang === 'ar' ? 'كبير' : 'Large'} (1920×1080)</SelectItem>
                  <SelectItem value="custom">{lang === 'ar' ? 'مخصص' : 'Custom'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                {lang === 'ar' ? 'الخلفية' : 'Background'}
              </label>
              <Select value={exportOptions.backgroundColor} onValueChange={(value) => updateOption('backgroundColor', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">{lang === 'ar' ? 'داكنة' : 'Dark'}</SelectItem>
                  <SelectItem value="white">{lang === 'ar' ? 'بيضاء' : 'White'}</SelectItem>
                  <SelectItem value="transparent">{lang === 'ar' ? 'شفافة' : 'Transparent'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom Size Options */}
          {exportOptions.size === 'custom' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  {lang === 'ar' ? 'العرض' : 'Width'} (px)
                </label>
                <input
                  type="number"
                  value={exportOptions.customWidth}
                  onChange={(e) => updateOption('customWidth', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  min="100"
                  max="4000"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  {lang === 'ar' ? 'الارتفاع' : 'Height'} (px)
                </label>
                <input
                  type="number"
                  value={exportOptions.customHeight}
                  onChange={(e) => updateOption('customHeight', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  min="100"
                  max="4000"
                />
              </div>
            </div>
          )}

          {/* Additional Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                {lang === 'ar' ? 'إضافة العلامة المائية' : 'Include Watermark'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeWatermark}
                  onChange={(e) => updateOption('includeWatermark', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              onClick={exportChart}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
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

            <Button
              onClick={printChart}
              variant="outline"
              className="border-gray-600"
            >
              <Printer className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'طباعة' : 'Print'}
            </Button>

            <Button
              onClick={shareChart}
              variant="outline"
              className="border-gray-600"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'مشاركة' : 'Share'}
            </Button>
          </div>

          {/* Export Status */}
          {lastExport && (
            <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">
                {lang === 'ar' 
                  ? `تم التصدير بنجاح في ${new Date(lastExport).toLocaleTimeString()}`
                  : `Successfully exported at ${new Date(lastExport).toLocaleTimeString()}`}
              </span>
            </div>
          )}

          {/* Format Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>{lang === 'ar' ? 'الحجم المقدر:' : 'Estimated size:'}</span>
              <Badge variant="secondary">
                {exportOptions.quality === 'ultra' ? '5-10MB' : 
                 exportOptions.quality === 'high' ? '2-5MB' :
                 exportOptions.quality === 'medium' ? '1-2MB' : '500KB-1MB'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>{lang === 'ar' ? 'الدقة:' : 'Resolution:'}</span>
              <span>
                {sizePresets[exportOptions.size].width} × {sizePresets[exportOptions.size].height}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartExporter;
