
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Bot,
  Eye,
  Zap,
  Activity,
  Users,
  FileX,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { attackPreventionService, AttackDetectionResult, BotDetectionMetrics } from '@/services/attackPreventionService';

interface AttackPreventionDashboardProps {
  lang?: 'en' | 'ar';
}

const AttackPreventionDashboard = ({ lang = 'ar' }: AttackPreventionDashboardProps) => {
  const [securityStats, setSecurityStats] = useState<any>(null);
  const [attackResults, setAttackResults] = useState<AttackDetectionResult[]>([]);
  const [botMetrics, setBotMetrics] = useState<BotDetectionMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Test data states
  const [testIP, setTestIP] = useState('192.168.1.100');
  const [testData, setTestData] = useState('{"action":"login","attempts":6}');
  const [userAgent, setUserAgent] = useState(navigator.userAgent);
  const [inputToSanitize, setInputToSanitize] = useState('<script>alert("XSS")</script>');
  const [sanitizedOutput, setSanitizedOutput] = useState('');

  // Charts data
  const [threatTrends, setThreatTrends] = useState([
    { time: '00:00', threats: 2, blocked: 1, bots: 3 },
    { time: '04:00', threats: 1, blocked: 1, bots: 1 },
    { time: '08:00', threats: 5, blocked: 4, bots: 2 },
    { time: '12:00', threats: 8, blocked: 6, bots: 4 },
    { time: '16:00', threats: 12, blocked: 10, bots: 6 },
    { time: '20:00', threats: 7, blocked: 5, bots: 3 }
  ]);

  const [attackTypes, setAttackTypes] = useState([
    { name: 'محاولات تسجيل دخول', value: 35, color: '#EF4444' },
    { name: 'طلبات API مفرطة', value: 25, color: '#F97316' },
    { name: 'تصفح مشبوه', value: 20, color: '#EAB308' },
    { name: 'بوتات', value: 15, color: '#8B5CF6' },
    { name: 'أخرى', value: 5, color: '#6B7280' }
  ]);

  useEffect(() => {
    loadSecurityStats();
    const interval = setInterval(loadSecurityStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadSecurityStats = () => {
    const stats = attackPreventionService.getSecurityStats();
    setSecurityStats(stats);
  };

  const handleTestAnomalyDetection = () => {
    setLoading(true);
    try {
      const testEventData = {
        ip: testIP,
        userAgent: navigator.userAgent,
        ...JSON.parse(testData)
      };

      const result = attackPreventionService.detectAnomaly('general', testEventData, 'test_user');
      setAttackResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      
      console.log('🔍 نتيجة اختبار كشف الشذوذ:', result);
    } catch (error) {
      console.error('❌ خطأ في اختبار كشف الشذوذ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestBotDetection = () => {
    setLoading(true);
    try {
      const behaviorData = {
        mouseMovements: Array.from({ length: 5 }, (_, i) => ({
          x: Math.random() * 1000,
          y: Math.random() * 600,
          timestamp: Date.now() - i * 1000
        })),
        keyboardPattern: '100,150,120,200,90',
        requests: Array.from({ length: 10 }, (_, i) => ({
          timestamp: Date.now() - i * 5000,
          endpoint: '/api/data'
        }))
      };

      const metrics = attackPreventionService.detectBot(userAgent, behaviorData);
      setBotMetrics(metrics);
      
      console.log('🤖 نتيجة اختبار كشف البوت:', metrics);
    } catch (error) {
      console.error('❌ خطأ في اختبار كشف البوت:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSanitizeInput = () => {
    const sanitized = attackPreventionService.sanitizeInput(inputToSanitize, 'html');
    setSanitizedOutput(sanitized);
  };

  const handleValidateData = () => {
    const testFormData = {
      email: 'test@example.com',
      password: 'WeakPass',
      amount: '1000.50'
    };

    const validation = attackPreventionService.validateData('login', testFormData);
    console.log('✅ نتيجة التحقق من البيانات:', validation);
  };

  const getThreatLevel = (stats: any) => {
    if (!stats) return { level: 'غير محدد', color: 'bg-gray-500', textColor: 'text-gray-400' };
    
    const totalThreats = stats.recentEvents || 0;
    if (totalThreats > 20) return { level: 'عالي', color: 'bg-red-500', textColor: 'text-red-400' };
    if (totalThreats > 10) return { level: 'متوسط', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (totalThreats > 5) return { level: 'منخفض', color: 'bg-blue-500', textColor: 'text-blue-400' };
    return { level: 'آمن', color: 'bg-green-500', textColor: 'text-green-400' };
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ar-SA');
  };

  if (!securityStats) {
    return (
      <div className="p-6 bg-trading-bg min-h-screen flex items-center justify-center">
        <div className="text-white">جاري تحميل إحصائيات الأمان...</div>
      </div>
    );
  }

  const threatLevel = getThreatLevel(securityStats);

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'مكافحة الهجمات والتهديدات' : 'Attack Prevention & Threat Detection'}
          </h1>
          <p className="text-gray-400">
            نظام متقدم لرصد ومنع الهجمات الإلكترونية والأنشطة المشبوهة
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("border-2", threatLevel.textColor)}>
            مستوى التهديد: {threatLevel.level}
          </Badge>
          <Button
            onClick={loadSecurityStats}
            size="sm"
            className="bg-trading-primary hover:bg-blue-600"
          >
            <Activity className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">تهديدات محجوبة</p>
                <p className="text-2xl font-bold text-red-400">
                  {securityStats.threatsBlocked}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                من أصل {securityStats.recentEvents} حدث
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">بوتات مكتشفة</p>
                <p className="text-2xl font-bold text-purple-400">
                  {securityStats.botsDetected}
                </p>
              </div>
              <Bot className="h-8 w-8 text-purple-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                نشاط آلي مشبوه
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">IPs محظورة</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {securityStats.blacklistedIPs}
                </p>
              </div>
              <FileX className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                عناوين محجوبة
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">مستخدمون مشبوهون</p>
                <p className="text-2xl font-bold text-orange-400">
                  {securityStats.suspiciousUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                تحت المراقبة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* اتجاهات التهديدات */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              اتجاهات التهديدات (24 ساعة)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={threatTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threats" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="تهديدات"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="blocked" 
                    stroke="#22C55E" 
                    strokeWidth={2}
                    name="محجوبة"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bots" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="بوتات"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* أنواع الهجمات */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">توزيع أنواع الهجمات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackTypes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {attackTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات الاختبار */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* اختبار كشف الشذوذ */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5" />
              اختبار كشف الشذوذ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testIP" className="text-gray-300">عنوان IP</Label>
              <Input
                id="testIP"
                value={testIP}
                onChange={(e) => setTestIP(e.target.value)}
                className="bg-trading-secondary border-gray-700"
              />
            </div>
            
            <div>
              <Label htmlFor="testData" className="text-gray-300">بيانات الاختبار (JSON)</Label>
              <Input
                id="testData"
                value={testData}
                onChange={(e) => setTestData(e.target.value)}
                className="bg-trading-secondary border-gray-700"
              />
            </div>
            
            <Button
              onClick={handleTestAnomalyDetection}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار كشف الشذوذ'}
            </Button>

            {attackResults.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <Label className="text-gray-300">نتائج الاختبار:</Label>
                {attackResults.slice(0, 3).map((result, index) => (
                  <div key={index} className="p-3 bg-trading-secondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn("text-sm font-medium", 
                        result.threat ? 'text-red-400' : 'text-green-400'
                      )}>
                        {result.threat ? 'تهديد مكتشف' : 'آمن'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(result.timestamp)}
                      </span>
                    </div>
                    {result.threat && (
                      <div className="text-xs text-gray-300">
                        النوع: {result.threatType} | الثقة: {(result.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* اختبار كشف البوت */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              اختبار كشف البوت
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userAgent" className="text-gray-300">User Agent</Label>
              <Input
                id="userAgent"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                className="bg-trading-secondary border-gray-700"
              />
            </div>
            
            <Button
              onClick={handleTestBotDetection}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'جاري الاختبار...' : 'اختبار كشف البوت'}
            </Button>

            {botMetrics && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">هل هو بوت؟</span>
                  <div className="flex items-center gap-2">
                    {botMetrics.isBot ? 
                      <XCircle className="h-4 w-4 text-red-400" /> : 
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    }
                    <span className={cn("text-sm font-medium", 
                      botMetrics.isBot ? 'text-red-400' : 'text-green-400'
                    )}>
                      {botMetrics.isBot ? 'نعم' : 'لا'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">نقاط السلوك:</span>
                    <span className="text-white">{botMetrics.behaviorScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${botMetrics.behaviorScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">مستوى الثقة:</span>
                    <span className="text-white">{(botMetrics.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* أدوات الحماية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* تنظيف البيانات */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              تنظيف البيانات (XSS Protection)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="inputToSanitize" className="text-gray-300">المدخل المشبوه</Label>
              <Input
                id="inputToSanitize"
                value={inputToSanitize}
                onChange={(e) => setInputToSanitize(e.target.value)}
                className="bg-trading-secondary border-gray-700"
              />
            </div>
            
            <Button
              onClick={handleSanitizeInput}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              تنظيف البيانات
            </Button>

            {sanitizedOutput && (
              <div className="space-y-2">
                <Label className="text-gray-300">النتيجة المنظفة:</Label>
                <div className="p-3 bg-trading-secondary rounded-lg text-sm text-green-400 break-all">
                  {sanitizedOutput || 'تم إزالة كل المحتوى الخطير'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* التحقق من البيانات */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              التحقق من البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-300">
              اختبار التحقق من صحة بيانات النماذج مع التنظيف التلقائي
            </div>
            
            <Button
              onClick={handleValidateData}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              اختبار التحقق من البيانات
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                يتم فحص الإيميل وقوة كلمة المرور والمبالغ المالية تلقائياً
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* سجل الأحداث الأمنية */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5" />
            سجل الأحداث الأمنية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '14:32:15', type: 'تهديد محجوب', description: 'محاولة تسجيل دخول مشبوهة من IP: 192.168.1.50', severity: 'high' },
              { time: '14:25:43', type: 'بوت مكتشف', description: 'نشاط آلي مكتشف في تصفح المنتجات', severity: 'medium' },
              { time: '14:18:29', type: 'XSS محجوب', description: 'محاولة حقن سكريبت في حقل التعليقات', severity: 'high' },
              { time: '14:12:07', type: 'API محدود', description: 'تجاوز حد الطلبات للمستخدم user_456', severity: 'low' },
              { time: '14:05:33', type: 'IP محظور', description: 'إضافة 203.0.113.45 للقائمة السوداء', severity: 'medium' }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-trading-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", {
                    'bg-red-500': event.severity === 'high',
                    'bg-yellow-500': event.severity === 'medium',
                    'bg-blue-500': event.severity === 'low'
                  })} />
                  <div>
                    <div className="text-white font-medium">{event.type}</div>
                    <div className="text-sm text-gray-400">{event.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttackPreventionDashboard;
