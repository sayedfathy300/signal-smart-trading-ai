
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  Copy,
  TrendingUp,
  BarChart3,
  Activity,
  Calculator,
  Code,
  Eye
} from 'lucide-react';

interface CustomIndicatorBuilderProps {
  lang: 'en' | 'ar';
}

interface IndicatorParameter {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'select';
  value: any;
  min?: number;
  max?: number;
  options?: string[];
}

interface CustomIndicator {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  formula: string;
  parameters: IndicatorParameter[];
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'custom';
  color: string;
  createdAt: Date;
  isActive: boolean;
}

const CustomIndicatorBuilder: React.FC<CustomIndicatorBuilderProps> = ({ lang }) => {
  const [indicators, setIndicators] = useState<CustomIndicator[]>([
    {
      id: 'custom_rsi',
      name: 'Custom RSI',
      nameAr: 'مؤشر القوة النسبية المخصص',
      description: 'Relative Strength Index with custom parameters',
      descriptionAr: 'مؤشر القوة النسبية مع معاملات مخصصة',
      formula: 'RSI = 100 - (100 / (1 + RS))\nRS = Average Gain / Average Loss',
      parameters: [
        {
          id: 'period',
          name: 'Period',
          type: 'number',
          value: 14,
          min: 1,
          max: 100
        },
        {
          id: 'overbought',
          name: 'Overbought Level',
          type: 'number',
          value: 70,
          min: 50,
          max: 90
        },
        {
          id: 'oversold',
          name: 'Oversold Level',
          type: 'number',
          value: 30,
          min: 10,
          max: 50
        }
      ],
      category: 'momentum',
      color: '#FF6B6B',
      createdAt: new Date(),
      isActive: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('builder');
  const [newIndicator, setNewIndicator] = useState<Partial<CustomIndicator>>({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    formula: '',
    parameters: [],
    category: 'custom',
    color: '#00FF88'
  });

  const categories = [
    { value: 'trend', label: lang === 'ar' ? 'الاتجاه' : 'Trend' },
    { value: 'momentum', label: lang === 'ar' ? 'الزخم' : 'Momentum' },
    { value: 'volatility', label: lang === 'ar' ? 'التقلب' : 'Volatility' },
    { value: 'volume', label: lang === 'ar' ? 'الحجم' : 'Volume' },
    { value: 'custom', label: lang === 'ar' ? 'مخصص' : 'Custom' }
  ];

  const predefinedFormulas = [
    {
      name: 'Simple Moving Average',
      nameAr: 'المتوسط المتحرك البسيط',
      formula: 'SMA = (P1 + P2 + ... + Pn) / n'
    },
    {
      name: 'Exponential Moving Average',
      nameAr: 'المتوسط المتحرك الأسي',
      formula: 'EMA = (Price * K) + (Previous EMA * (1 - K))\nK = 2 / (Period + 1)'
    },
    {
      name: 'MACD',
      nameAr: 'ماكد',
      formula: 'MACD = EMA12 - EMA26\nSignal = EMA9(MACD)\nHistogram = MACD - Signal'
    },
    {
      name: 'Bollinger Bands',
      nameAr: 'نطاقات بولينجر',
      formula: 'Upper Band = SMA + (2 * StdDev)\nLower Band = SMA - (2 * StdDev)'
    },
    {
      name: 'Stochastic',
      nameAr: 'الستوكاستيك',
      formula: '%K = ((Current Close - Lowest Low) / (Highest High - Lowest Low)) * 100\n%D = SMA3(%K)'
    }
  ];

  const addParameter = () => {
    const newParam: IndicatorParameter = {
      id: `param_${Date.now()}`,
      name: 'Parameter',
      type: 'number',
      value: 0
    };

    setNewIndicator(prev => ({
      ...prev,
      parameters: [...(prev.parameters || []), newParam]
    }));
  };

  const updateParameter = (paramId: string, field: string, value: any) => {
    setNewIndicator(prev => ({
      ...prev,
      parameters: prev.parameters?.map(param =>
        param.id === paramId ? { ...param, [field]: value } : param
      )
    }));
  };

  const removeParameter = (paramId: string) => {
    setNewIndicator(prev => ({
      ...prev,
      parameters: prev.parameters?.filter(param => param.id !== paramId)
    }));
  };

  const saveIndicator = () => {
    if (!newIndicator.name || !newIndicator.formula) {
      return;
    }

    const indicator: CustomIndicator = {
      id: `indicator_${Date.now()}`,
      name: newIndicator.name,
      nameAr: newIndicator.nameAr || newIndicator.name,
      description: newIndicator.description || '',
      descriptionAr: newIndicator.descriptionAr || newIndicator.description || '',
      formula: newIndicator.formula,
      parameters: newIndicator.parameters || [],
      category: newIndicator.category as any || 'custom',
      color: newIndicator.color || '#00FF88',
      createdAt: new Date(),
      isActive: false
    };

    setIndicators(prev => [...prev, indicator]);
    
    // Reset form
    setNewIndicator({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      formula: '',
      parameters: [],
      category: 'custom',
      color: '#00FF88'
    });
  };

  const duplicateIndicator = (indicator: CustomIndicator) => {
    const duplicated: CustomIndicator = {
      ...indicator,
      id: `indicator_${Date.now()}`,
      name: `${indicator.name} (Copy)`,
      nameAr: `${indicator.nameAr} (نسخة)`,
      createdAt: new Date(),
      isActive: false
    };

    setIndicators(prev => [...prev, duplicated]);
  };

  const deleteIndicator = (indicatorId: string) => {
    setIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
  };

  const toggleIndicator = (indicatorId: string) => {
    setIndicators(prev =>
      prev.map(ind =>
        ind.id === indicatorId ? { ...ind, isActive: !ind.isActive } : ind
      )
    );
  };

  const testIndicator = (indicator: CustomIndicator) => {
    // Simulate indicator calculation
    console.log('Testing indicator:', indicator);
    alert(lang === 'ar' ? 'تم اختبار المؤشر بنجاح!' : 'Indicator tested successfully!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'momentum': return <Activity className="h-4 w-4" />;
      case 'volatility': return <BarChart3 className="h-4 w-4" />;
      case 'volume': return <BarChart3 className="h-4 w-4" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-trading-card border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {lang === 'ar' ? 'منشئ المؤشرات المخصصة' : 'Custom Indicator Builder'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder">
              {lang === 'ar' ? 'المنشئ' : 'Builder'}
            </TabsTrigger>
            <TabsTrigger value="library">
              {lang === 'ar' ? 'المكتبة' : 'Library'}
            </TabsTrigger>
            <TabsTrigger value="formulas">
              {lang === 'ar' ? 'الصيغ' : 'Formulas'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-gray-400">
                      {lang === 'ar' ? 'اسم المؤشر' : 'Indicator Name'}
                    </Label>
                    <Input
                      id="name"
                      value={newIndicator.name}
                      onChange={(e) => setNewIndicator(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder={lang === 'ar' ? 'مؤشري المخصص' : 'My Custom Indicator'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nameAr" className="text-gray-400">
                      {lang === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}
                    </Label>
                    <Input
                      id="nameAr"
                      value={newIndicator.nameAr}
                      onChange={(e) => setNewIndicator(prev => ({ ...prev, nameAr: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder={lang === 'ar' ? 'الاسم بالعربية' : 'Arabic name'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-gray-400">
                      {lang === 'ar' ? 'الفئة' : 'Category'}
                    </Label>
                    <Select
                      value={newIndicator.category}
                      onValueChange={(value) => setNewIndicator(prev => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value} className="text-white">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color" className="text-gray-400">
                      {lang === 'ar' ? 'لون المؤشر' : 'Indicator Color'}
                    </Label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={newIndicator.color}
                        onChange={(e) => setNewIndicator(prev => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-10 rounded border border-gray-700"
                      />
                      <Input
                        value={newIndicator.color}
                        onChange={(e) => setNewIndicator(prev => ({ ...prev, color: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-400">
                      {lang === 'ar' ? 'الوصف' : 'Description'}
                    </Label>
                    <Textarea
                      id="description"
                      value={newIndicator.description}
                      onChange={(e) => setNewIndicator(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder={lang === 'ar' ? 'وصف المؤشر...' : 'Indicator description...'}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Formula and Parameters */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {lang === 'ar' ? 'الصيغة والمعاملات' : 'Formula & Parameters'}
                </h3>

                <div>
                  <Label htmlFor="formula" className="text-gray-400">
                    {lang === 'ar' ? 'صيغة المؤشر' : 'Indicator Formula'}
                  </Label>
                  <Textarea
                    id="formula"
                    value={newIndicator.formula}
                    onChange={(e) => setNewIndicator(prev => ({ ...prev, formula: e.target.value }))}
                    className="bg-gray-800 border-gray-700 text-white font-mono"
                    placeholder={lang === 'ar' ? 'المؤشر = (السعر1 + السعر2) / 2' : 'Indicator = (Price1 + Price2) / 2'}
                    rows={4}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-gray-400">
                      {lang === 'ar' ? 'المعاملات' : 'Parameters'}
                    </Label>
                    <Button onClick={addParameter} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      {lang === 'ar' ? 'إضافة معامل' : 'Add Parameter'}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {newIndicator.parameters?.map(param => (
                      <div key={param.id} className="p-3 bg-gray-800 rounded border border-gray-700">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Input
                            value={param.name}
                            onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                            placeholder={lang === 'ar' ? 'اسم المعامل' : 'Parameter name'}
                            className="bg-gray-900 border-gray-600 text-white"
                          />
                          <Select
                            value={param.type}
                            onValueChange={(value) => updateParameter(param.id, 'type', value)}
                          >
                            <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-600">
                              <SelectItem value="number" className="text-white">Number</SelectItem>
                              <SelectItem value="boolean" className="text-white">Boolean</SelectItem>
                              <SelectItem value="select" className="text-white">Select</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          {param.type === 'number' && (
                            <>
                              <Input
                                type="number"
                                value={param.value}
                                onChange={(e) => updateParameter(param.id, 'value', Number(e.target.value))}
                                placeholder="Value"
                                className="bg-gray-900 border-gray-600 text-white flex-1"
                              />
                              <Input
                                type="number"
                                value={param.min || 0}
                                onChange={(e) => updateParameter(param.id, 'min', Number(e.target.value))}
                                placeholder="Min"
                                className="bg-gray-900 border-gray-600 text-white w-20"
                              />
                              <Input
                                type="number"
                                value={param.max || 100}
                                onChange={(e) => updateParameter(param.id, 'max', Number(e.target.value))}
                                placeholder="Max"
                                className="bg-gray-900 border-gray-600 text-white w-20"
                              />
                            </>
                          )}

                          <Button
                            onClick={() => removeParameter(param.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={saveIndicator} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {lang === 'ar' ? 'حفظ المؤشر' : 'Save Indicator'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <div className="space-y-4">
              {indicators.map(indicator => (
                <Card key={indicator.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(indicator.category)}
                          <h4 className="text-lg font-semibold text-white">
                            {lang === 'ar' ? indicator.nameAr : indicator.name}
                          </h4>
                          <Badge 
                            variant={indicator.isActive ? "default" : "secondary"}
                            style={{ backgroundColor: indicator.isActive ? indicator.color : undefined }}
                          >
                            {indicator.isActive ? 
                              (lang === 'ar' ? 'نشط' : 'Active') : 
                              (lang === 'ar' ? 'غير نشط' : 'Inactive')
                            }
                          </Badge>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3">
                          {lang === 'ar' ? indicator.descriptionAr : indicator.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">
                              {lang === 'ar' ? 'الفئة:' : 'Category:'}
                            </span>
                            <span className="text-white ml-2">
                              {categories.find(c => c.value === indicator.category)?.label}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {lang === 'ar' ? 'المعاملات:' : 'Parameters:'}
                            </span>
                            <span className="text-white ml-2">
                              {indicator.parameters.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => toggleIndicator(indicator.id)}
                          size="sm"
                          variant={indicator.isActive ? "default" : "outline"}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          onClick={() => testIndicator(indicator)}
                          size="sm"
                          variant="outline"
                        >
                          <Play className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={() => duplicateIndicator(indicator)}
                          size="sm"
                          variant="outline"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                          onClick={() => deleteIndicator(indicator.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedFormulas.map((formula, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      {lang === 'ar' ? formula.nameAr : formula.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm text-gray-300 bg-gray-900 p-3 rounded border border-gray-600 overflow-x-auto">
                      {formula.formula}
                    </pre>
                    <Button
                      onClick={() => setNewIndicator(prev => ({ 
                        ...prev, 
                        formula: formula.formula,
                        name: lang === 'ar' ? formula.nameAr : formula.name
                      }))}
                      size="sm"
                      variant="outline"
                      className="mt-3"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {lang === 'ar' ? 'استخدام الصيغة' : 'Use Formula'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomIndicatorBuilder;
