
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Bot, 
  AlertTriangle, 
  Eye,
  Activity,
  Lock,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { attackPreventionService, type AttackDetectionResult, type BotDetectionMetrics } from '@/services/attackPreventionService';

interface AttackPreventionDashboardProps {
  lang: 'en' | 'ar';
}

const AttackPreventionDashboard = ({ lang }: AttackPreventionDashboardProps) => {
  const [stats, setStats] = useState<any>(null);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [validationTest, setValidationTest] = useState({ email: '', password: '', amount: '' });
  const [validationResult, setValidationResult] = useState<any>(null);
  const [botMetrics, setBotMetrics] = useState<BotDetectionMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);

  useEffect(() => {
    loadSecurityStats();
    const interval = setInterval(loadSecurityStats, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // محاكاة البيانات في الوقت الفعلي
    const interval = setInterval(() => {
      const newData = {
        time: new Date().toLocaleTimeString(),
        threats: Math.floor(Math.random() * 10),
        blocked: Math.floor(Math.random() * 20),
        bots: Math.floor(Math.random() * 5)
      };
      
      setRealTimeData(prev => [...prev.slice(-20), newData]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadSecurityStats = () => {
    const securityStats = attackPreventionService.getSecurityStats();
    setStats(securityStats);
  };

  const handleAnomalyTest = () => {
    setLoading(true);
    try {
      const result = attackPreventionService.detectAnomaly('general', {
        ip: '192.168.1.100',
        userAgent: navigator.userAgent,
        action: testInput,
        timestamp: Date.now()
      }, 'test_user');
      
      setTestResult(result);
    } catch (error) {
      console.error('خطأ في اختبار كشف الشذوذ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBotDetection = () => {
    setLoading(true);
    try {
      const result = attackPreventionService.detectBot(navigator.userAgent, {
        mouseMovements: [{x: 100, y: 200, timestamp: Date.now()}],
        keyboardPattern: '100,150,120',
        requests: []
      });
      
      setBotMetrics(result);
    } catch (error) {
      console.error('خطأ في كشف البوتات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidationTest = () => {
    setLoading(true);
    try {
      const result = attackPreventionService.validateData('login', validationTest);
      setValidationResult(result);
    } catch (error) {
      console.error('خطأ في اختبار التحقق:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSRFTest = () => {
    const token = attackPreventionService.generateCSRFToken('test_session');
    const isValid = attackPreventionService.validateCSRFToken('test_session', token);
    alert(`CSRF Token: ${token}\nValidation: ${isValid ? 'صحيح' : 'خطأ'}`);
  };

  const handleXSSTest = () => {
    const maliciousInput = '<script>alert("XSS")</script>Hello World';
    const sanitized = attackPreventionService.sanitizeInput(maliciousInput, 'html');
    alert(`Input: ${maliciousInput}\nSanitized: ${sanitized}`);
  };

  const threatData = [
    { name: 'SQL Injection', value: 15, color: '#ff6b6b' },
    { name: 'XSS', value: 25, color: '#feca57' },
    { name: 'CSRF', value: 10, color: '#48dbfb' },
    { name: 'Bot Traffic', value: 30, color: '#ff9ff3' },
    { name: 'Brute Force', value: 20, color: '#54a0ff' }
  ];

  const anomalyTrends = [
    { time: '00:00', anomalies: 5, blocked: 12 },
    { time: '04:00', anomalies: 8, blocked: 15 },
    { time: '08:00', anomalies: 15, blocked: 28 },
    { time: '12:00', anomalies: 22, blocked: 35 },
    { time: '16:00', anomalies: 18, blocked: 30 },
    { time: '20:00', anomalies: 12, blocked: 20 }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 p-6 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {lang === 'ar' ? 'لوحة مكافحة الهجمات' : 'Attack Prevention Dashboard'}
            </h1>
            <p className="text-gray-300">
              {lang === 'ar' ? 'حماية متقدمة ضد التهديدات السيبرانية' : 'Advanced protection against cyber threats'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadSecurityStats} variant="outline" className="text-white border-white/20">
              <Activity className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تحديث' : 'Refresh'}
            </Button>
            <Button onClick={() => attackPreventionService.securityReset()} variant="destructive">
              <Shield className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
            </Button>
          </div>
        </div>

        {/* Security Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'التهديدات المحجوبة' : 'Threats Blocked'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.threatsBlocked || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-500/20">
                  <Shield className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'البوتات المكتشفة' : 'Bots Detected'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.botsDetected || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-500/20">
                  <Bot className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'IPs محجوبة' : 'Blacklisted IPs'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.blacklistedIPs || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'الشذوذ النشط' : 'Active Anomalies'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.activeAnomalies || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-500/20">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="overview" className="text-white">
              {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="anomaly" className="text-white">
              {lang === 'ar' ? 'كشف الشذوذ' : 'Anomaly Detection'}
            </TabsTrigger>
            <TabsTrigger value="bot" className="text-white">
              {lang === 'ar' ? 'كشف البوتات' : 'Bot Detection'}
            </TabsTrigger>
            <TabsTrigger value="validation" className="text-white">
              {lang === 'ar' ? 'التحقق' : 'Validation'}
            </TabsTrigger>
            <TabsTrigger value="protection" className="text-white">
              {lang === 'ar' ? 'الحماية' : 'Protection'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {lang === 'ar' ? 'اتجاهات التهديدات' : 'Threat Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={anomalyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="anomalies" stroke="#ff6b6b" strokeWidth={2} name="Anomalies" />
                      <Line type="monotone" dataKey="blocked" stroke="#4ecdc4" strokeWidth={2} name="Blocked" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {lang === 'ar' ? 'أنواع التهديدات' : 'Threat Types'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={threatData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {threatData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Real-time monitoring */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {lang === 'ar' ? 'المراقبة في الوقت الفعلي' : 'Real-time Monitoring'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={realTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }} />
                    <Line type="monotone" dataKey="threats" stroke="#ff6b6b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="blocked" stroke="#4ecdc4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anomaly Detection Tab */}
          <TabsContent value="anomaly">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {lang === 'ar' ? 'اختبار كشف الشذوذ' : 'Anomaly Detection Test'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'اختبار نظام كشف الأنشطة المشبوهة' : 'Test suspicious activity detection system'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="testInput" className="text-white">
                      {lang === 'ar' ? 'نمط النشاط المراد اختباره:' : 'Activity pattern to test:'}
                    </Label>
                    <Input
                      id="testInput"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder={lang === 'ar' ? 'أدخل نمط النشاط...' : 'Enter activity pattern...'}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button onClick={handleAnomalyTest} disabled={loading || !testInput.trim()}>
                    <Eye className="h-4 w-4 mr-2" />
                    {loading ? (lang === 'ar' ? 'جاري الفحص...' : 'Testing...') : (lang === 'ar' ? 'اختبار الكشف' : 'Test Detection')}
                  </Button>
                </div>

                {testResult && (
                  <div className={`p-4 rounded-lg ${testResult.threat ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      {testResult.threat ? (
                        <XCircle className="h-5 w-5 text-red-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      <h4 className="text-white font-medium">
                        {testResult.threat ? 
                          (lang === 'ar' ? 'تم اكتشاف تهديد!' : 'Threat Detected!') : 
                          (lang === 'ar' ? 'لا توجد تهديدات' : 'No Threats Detected')
                        }
                      </h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{lang === 'ar' ? 'نوع التهديد:' : 'Threat Type:'}</span>
                        <span className="text-white">{testResult.threatType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">{lang === 'ar' ? 'مستوى الثقة:' : 'Confidence:'}</span>
                        <span className="text-white">{(testResult.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">{lang === 'ar' ? 'محجوب:' : 'Blocked:'}</span>
                        <span className={testResult.blocked ? 'text-red-400' : 'text-green-400'}>
                          {testResult.blocked ? (lang === 'ar' ? 'نعم' : 'Yes') : (lang === 'ar' ? 'لا' : 'No')}
                        </span>
                      </div>
                    </div>
                    
                    <Progress value={testResult.confidence * 100} className="mt-4" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bot Detection Tab */}
          <TabsContent value="bot">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  {lang === 'ar' ? 'كشف البوتات المتقدم' : 'Advanced Bot Detection'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'تحليل السلوك لكشف الأنشطة الآلية' : 'Behavioral analysis for automated activity detection'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button onClick={handleBotDetection} disabled={loading}>
                  <Bot className="h-4 w-4 mr-2" />
                  {loading ? (lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...') : (lang === 'ar' ? 'فحص البوتات' : 'Detect Bots')}
                </Button>

                {botMetrics && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${botMetrics.isBot ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                      <div className="flex items-center gap-2 mb-4">
                        {botMetrics.isBot ? (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        <h4 className="text-white font-medium">
                          {botMetrics.isBot ? 
                            (lang === 'ar' ? 'تم اكتشاف بوت!' : 'Bot Detected!') : 
                            (lang === 'ar' ? 'مستخدم حقيقي' : 'Human User')
                          }
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-300">{lang === 'ar' ? 'نقاط السلوك:' : 'Behavior Score:'}</span>
                          <p className="text-white font-mono">{botMetrics.behaviorScore}/100</p>
                        </div>
                        <div>
                          <span className="text-gray-300">{lang === 'ar' ? 'مستوى الثقة:' : 'Confidence:'}</span>
                          <p className="text-white font-mono">{(botMetrics.confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="text-gray-300">{lang === 'ar' ? 'بصمة المتصفح:' : 'Browser Fingerprint:'}</span>
                          <p className="text-white font-mono text-xs">{botMetrics.browserFingerprint}</p>
                        </div>
                        <div>
                          <span className="text-gray-300">{lang === 'ar' ? 'حركات الماوس:' : 'Mouse Movements:'}</span>
                          <p className="text-white font-mono">{botMetrics.mouseMovements.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Validation Tab */}
          <TabsContent value="validation">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {lang === 'ar' ? 'التحقق المتقدم من البيانات' : 'Advanced Data Validation'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'اختبار نظام التحقق وتنظيف البيانات' : 'Test data validation and sanitization system'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-white">
                      {lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={validationTest.email}
                      onChange={(e) => setValidationTest({...validationTest, email: e.target.value})}
                      placeholder="test@example.com"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">
                      {lang === 'ar' ? 'كلمة المرور:' : 'Password:'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={validationTest.password}
                      onChange={(e) => setValidationTest({...validationTest, password: e.target.value})}
                      placeholder="Password123!"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount" className="text-white">
                      {lang === 'ar' ? 'المبلغ:' : 'Amount:'}
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={validationTest.amount}
                      onChange={(e) => setValidationTest({...validationTest, amount: e.target.value})}
                      placeholder="1000.50"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <Button onClick={handleValidationTest} disabled={loading}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {loading ? (lang === 'ar' ? 'جاري التحقق...' : 'Validating...') : (lang === 'ar' ? 'اختبار التحقق' : 'Test Validation')}
                </Button>

                {validationResult && (
                  <div className={`p-4 rounded-lg ${validationResult.valid ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      {validationResult.valid ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <h4 className="text-white font-medium">
                        {validationResult.valid ? 
                          (lang === 'ar' ? 'البيانات صحيحة' : 'Data Valid') : 
                          (lang === 'ar' ? 'أخطاء في البيانات' : 'Data Errors')
                        }
                      </h4>
                    </div>
                    
                    {!validationResult.valid && (
                      <div className="space-y-2">
                        <h5 className="text-red-300 font-medium">{lang === 'ar' ? 'الأخطاء:' : 'Errors:'}</h5>
                        {validationResult.errors.map((error: string, index: number) => (
                          <p key={index} className="text-red-300 text-sm">• {error}</p>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h5 className="text-green-300 font-medium">{lang === 'ar' ? 'البيانات المنظفة:' : 'Sanitized Data:'}</h5>
                      <pre className="text-white text-xs bg-black/20 p-2 rounded mt-2 overflow-auto">
                        {JSON.stringify(validationResult.sanitized, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Protection Tab */}
          <TabsContent value="protection">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {lang === 'ar' ? 'حماية CSRF' : 'CSRF Protection'}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {lang === 'ar' ? 'اختبار نظام حماية Cross-Site Request Forgery' : 'Test Cross-Site Request Forgery protection'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleCSRFTest} className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'اختبار CSRF' : 'Test CSRF'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {lang === 'ar' ? 'حماية XSS' : 'XSS Protection'}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {lang === 'ar' ? 'اختبار نظام حماية Cross-Site Scripting' : 'Test Cross-Site Scripting protection'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleXSSTest} className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    {lang === 'ar' ? 'اختبار XSS' : 'Test XSS'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Security Metrics */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {lang === 'ar' ? 'مقاييس الأمان' : 'Security Metrics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">{lang === 'ar' ? 'إجمالي الأحداث' : 'Total Events'}</p>
                    <p className="text-2xl font-bold text-white">{stats?.totalEvents || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">{lang === 'ar' ? 'الأحداث الأخيرة' : 'Recent Events'}</p>
                    <p className="text-2xl font-bold text-white">{stats?.recentEvents || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">{lang === 'ar' ? 'المستخدمون المشبوهون' : 'Suspicious Users'}</p>
                    <p className="text-2xl font-bold text-white">{stats?.suspiciousUsers || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">{lang === 'ar' ? 'نسبة الحجب' : 'Block Rate'}</p>
                    <p className="text-2xl font-bold text-white">
                      {stats?.totalEvents > 0 ? ((stats.threatsBlocked / stats.totalEvents) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttackPreventionDashboard;
