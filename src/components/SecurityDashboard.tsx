
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Key, 
  Lock, 
  Unlock,
  AlertTriangle, 
  CheckCircle,
  Eye,
  EyeOff,
  Smartphone,
  FileKey,
  Clock,
  Activity,
  AlertCircle,
  Users,
  Monitor,
  Database
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';
import { securityService, SecurityMetrics, MFASetup, DigitalSignature, EncryptionResult } from '@/services/securityService';

interface SecurityDashboardProps {
  lang?: 'en' | 'ar';
}

const SecurityDashboard = ({ lang = 'ar' }: SecurityDashboardProps) => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [mfaSetup, setMfaSetup] = useState<MFASetup | null>(null);
  const [encryptionDemo, setEncryptionDemo] = useState<EncryptionResult | null>(null);
  const [digitalSignature, setDigitalSignature] = useState<DigitalSignature | null>(null);
  const [loading, setLoading] = useState(false);
  
  // States for demos
  const [userId, setUserId] = useState('user123');
  const [mfaToken, setMfaToken] = useState('');
  const [dataToEncrypt, setDataToEncrypt] = useState('بيانات حساسة للتشفير');
  const [encryptedVisible, setEncryptedVisible] = useState(false);
  const [dataToSign, setDataToSign] = useState('مستند مهم للتوقيع الرقمي');
  
  // Security events data for charts
  const [securityEvents, setSecurityEvents] = useState([
    { time: '00:00', threats: 2, logins: 15, encryption: 45 },
    { time: '04:00', threats: 1, logins: 8, encryption: 32 },
    { time: '08:00', threats: 5, logins: 25, encryption: 78 },
    { time: '12:00', threats: 3, logins: 42, encryption: 95 },
    { time: '16:00', threats: 7, logins: 38, encryption: 88 },
    { time: '20:00', threats: 4, logins: 29, encryption: 65 }
  ]);

  const [penetrationTestResults, setPenetrationTestResults] = useState<any>(null);

  useEffect(() => {
    loadSecurityMetrics();
    const interval = setInterval(loadSecurityMetrics, 30000); // تحديث كل 30 ثانية
    
    return () => clearInterval(interval);
  }, []);

  const loadSecurityMetrics = () => {
    const metrics = securityService.getSecurityMetrics();
    setSecurityMetrics(metrics);
  };

  const handleSetupMFA = async () => {
    setLoading(true);
    try {
      const setup = securityService.setupMFA(userId);
      setMfaSetup(setup);
      loadSecurityMetrics(); // تحديث المقاييس
      console.log('✅ تم إعداد MFA بنجاح');
    } catch (error) {
      console.error('❌ خطأ في إعداد MFA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!mfaToken.trim()) return;
    
    setLoading(true);
    try {
      const verified = await securityService.verifyMFA(userId, mfaToken);
      if (verified) {
        console.log('✅ تم التحقق من MFA بنجاح');
        securityService.auditSecurityEvent('mfa_verified', userId);
      } else {
        console.log('❌ فشل في التحقق من MFA');
        securityService.auditSecurityEvent('mfa_failed', userId);
      }
      setMfaToken('');
    } catch (error) {
      console.error('❌ خطأ في التحقق من MFA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEncryptData = async () => {
    if (!dataToEncrypt.trim()) return;
    
    setLoading(true);
    try {
      const encrypted = await securityService.encryptData(dataToEncrypt);
      setEncryptionDemo(encrypted);
      securityService.auditSecurityEvent('data_encrypted', userId, { dataLength: dataToEncrypt.length });
      console.log('✅ تم تشفير البيانات بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تشفير البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecryptData = async () => {
    if (!encryptionDemo) return;
    
    setLoading(true);
    try {
      const decrypted = await securityService.decryptData(encryptionDemo);
      console.log('🔓 البيانات المفكوكة:', decrypted);
      securityService.auditSecurityEvent('data_decrypted', userId);
    } catch (error) {
      console.error('❌ خطأ في فك تشفير البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKeyPair = async () => {
    setLoading(true);
    try {
      const keyPair = await securityService.generateKeyPair(userId);
      console.log('🔑 تم إنشاء زوج المفاتيح:', keyPair);
      securityService.auditSecurityEvent('keypair_generated', userId);
      loadSecurityMetrics();
    } catch (error) {
      console.error('❌ خطأ في إنشاء زوج المفاتيح:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSignature = () => {
    if (!dataToSign.trim()) return;
    
    setLoading(true);
    try {
      const signature = securityService.createDigitalSignature(userId, dataToSign);
      setDigitalSignature(signature);
      securityService.auditSecurityEvent('signature_created', userId, { dataLength: dataToSign.length });
      console.log('✍️ تم إنشاء التوقيع الرقمي بنجاح');
    } catch (error) {
      console.error('❌ خطأ في إنشاء التوقيع الرقمي:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignature = () => {
    if (!digitalSignature) return;
    
    const verified = securityService.verifyDigitalSignature(dataToSign, digitalSignature);
    if (verified) {
      console.log('✅ تم التحقق من التوقيع الرقمي بنجاح');
      securityService.auditSecurityEvent('signature_verified', userId);
    } else {
      console.log('❌ فشل في التحقق من التوقيع الرقمي');
      securityService.auditSecurityEvent('signature_verification_failed', userId);
    }
  };

  const handleRunPenetrationTest = async () => {
    setLoading(true);
    try {
      const results = await securityService.runPenetrationTest();
      setPenetrationTestResults(results);
      securityService.auditSecurityEvent('penetration_test_run', userId, results);
      console.log('🔍 تم تشغيل اختبار الاختراق:', results);
    } catch (error) {
      console.error('❌ خطأ في تشغيل اختبار الاختراق:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSecurityScore = () => {
    if (!securityMetrics) return 0;
    
    let score = 0;
    if (securityMetrics.encryptionStatus === 'active') score += 25;
    if (securityMetrics.mfaEnabled) score += 25;
    if (securityMetrics.sessionSecurity.active) score += 25;
    if (securityMetrics.digitalSignature.verified) score += 25;
    
    return score;
  };

  const getSecurityLevel = (score: number) => {
    if (score >= 80) return { level: 'ممتاز', color: 'bg-green-500', textColor: 'text-green-400' };
    if (score >= 60) return { level: 'جيد', color: 'bg-blue-500', textColor: 'text-blue-400' };
    if (score >= 40) return { level: 'متوسط', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    return { level: 'ضعيف', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  if (!securityMetrics) {
    return (
      <div className="p-6 bg-trading-bg min-h-screen flex items-center justify-center">
        <div className="text-white">جاري تحميل مقاييس الأمان...</div>
      </div>
    );
  }

  const securityScore = getSecurityScore();
  const securityLevel = getSecurityLevel(securityScore);

  return (
    <div className="p-6 space-y-6 bg-trading-bg min-h-screen">
      {/* الرأس */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
            {lang === 'ar' ? 'لوحة الأمان والموثوقية' : 'Security & Reliability Dashboard'}
          </h1>
          <p className="text-gray-400">
            نظام متكامل للحماية والتشفير وكشف التهديدات
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("border-2", securityLevel.textColor)}>
            مستوى الأمان: {securityLevel.level}
          </Badge>
          <Button
            onClick={loadSecurityMetrics}
            size="sm"
            className="bg-trading-primary hover:bg-blue-600"
          >
            <Activity className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* نقاط الأمان الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">تشفير AES-256</p>
                <p className={cn("text-lg font-bold", 
                  securityMetrics.encryptionStatus === 'active' ? 'text-green-400' : 'text-red-400'
                )}>
                  {securityMetrics.encryptionStatus === 'active' ? 'نشط' : 'غير نشط'}
                </p>
              </div>
              {securityMetrics.encryptionStatus === 'active' ? 
                <Lock className="h-8 w-8 text-green-400" /> : 
                <Unlock className="h-8 w-8 text-red-400" />
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">مصادقة ثنائية</p>
                <p className={cn("text-lg font-bold", 
                  securityMetrics.mfaEnabled ? 'text-green-400' : 'text-red-400'
                )}>
                  {securityMetrics.mfaEnabled ? 'مفعل' : 'غير مفعل'}
                </p>
              </div>
              <Smartphone className={cn("h-8 w-8", 
                securityMetrics.mfaEnabled ? 'text-green-400' : 'text-red-400'
              )} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">التوقيع الرقمي</p>
                <p className={cn("text-lg font-bold", 
                  securityMetrics.digitalSignature.verified ? 'text-green-400' : 'text-red-400'
                )}>
                  {securityMetrics.digitalSignature.verified ? 'جاهز' : 'غير جاهز'}
                </p>
              </div>
              <FileKey className={cn("h-8 w-8", 
                securityMetrics.digitalSignature.verified ? 'text-green-400' : 'text-red-400'
              )} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">نقاط الأمان</p>
                <p className={cn("text-lg font-bold", securityLevel.textColor)}>
                  {securityScore}/100
                </p>
              </div>
              <Shield className={cn("h-8 w-8", securityLevel.textColor)} />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${securityLevel.color}`}
                  style={{ width: `${securityScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">الأحداث الأمنية (24 ساعة)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={securityEvents}>
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
                    name="التهديدات"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="logins" 
                    stroke="#22C55E" 
                    strokeWidth={2}
                    name="تسجيل الدخول"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="encryption" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="عمليات التشفير"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">إحصائيات API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { endpoint: 'Trading', current: securityMetrics.apiRateLimit.current || 45, limit: 100 },
                  { endpoint: 'Market', current: 780, limit: 1000 },
                  { endpoint: 'Portfolio', current: 23, limit: 50 },
                  { endpoint: 'Auth', current: 2, limit: 5 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="endpoint" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="current" fill="#3B82F6" name="الحالي" />
                  <Bar dataKey="limit" fill="#6B7280" name="الحد الأقصى" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات الأمان */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MFA Setup */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              المصادقة الثنائية (MFA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userId" className="text-gray-300">معرف المستخدم</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="bg-trading-secondary border-gray-700"
              />
            </div>
            
            <Button
              onClick={handleSetupMFA}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'جاري الإعداد...' : 'إعداد MFA'}
            </Button>

            {mfaSetup && (
              <div className="space-y-3">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    تم إنشاء سر MFA بنجاح. استخدم QR Code لإعداد التطبيق.
                  </AlertDescription>
                </Alert>
                
                <div className="text-xs text-gray-400 break-all">
                  Secret: {mfaSetup.secret}
                </div>
                
                <div>
                  <Label htmlFor="mfaToken" className="text-gray-300">رمز التحقق</Label>
                  <div className="flex gap-2">
                    <Input
                      id="mfaToken"
                      value={mfaToken}
                      onChange={(e) => setMfaToken(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="bg-trading-secondary border-gray-700"
                    />
                    <Button
                      onClick={handleVerifyMFA}
                      disabled={loading || !mfaToken}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      تحقق
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Encryption Demo */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              تشفير AES-256
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dataToEncrypt" className="text-gray-300">البيانات للتشفير</Label>
              <Input
                id="dataToEncrypt"
                value={dataToEncrypt}
                onChange={(e) => setDataToEncrypt(e.target.value)}
                className="bg-trading-secondary border-gray-700"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleEncryptData}
                disabled={loading || !dataToEncrypt}
                className="bg-blue-600 hover:bg-blue-700"
              >
                تشفير
              </Button>
              
              {encryptionDemo && (
                <Button
                  onClick={handleDecryptData}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  فك التشفير
                </Button>
              )}
            </div>

            {encryptionDemo && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">البيانات المشفرة</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEncryptedVisible(!encryptedVisible)}
                  >
                    {encryptedVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="text-xs text-gray-400 break-all bg-trading-secondary p-2 rounded">
                  {encryptedVisible ? encryptionDemo.encrypted : '••••••••••••••••••••'}
                </div>
                
                <div className="text-xs text-gray-500">
                  IV: {encryptionDemo.iv.slice(0, 16)}... | Tag: {encryptionDemo.tag.slice(0, 16)}...
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Digital Signature & Penetration Testing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Signature */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileKey className="h-5 w-5" />
              التوقيع الرقمي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dataToSign" className="text-gray-300">البيانات للتوقيع</Label>
              <Input
                id="dataToSign"
                value={dataToSign}
                onChange={(e) => setDataToSign(e.target.value)}
                className="bg-trading-secondary border-gray-700"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGenerateKeyPair}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                إنشاء مفاتيح
              </Button>
              
              <Button
                onClick={handleCreateSignature}
                disabled={loading || !dataToSign}
                className="bg-blue-600 hover:bg-blue-700"
              >
                توقيع
              </Button>
              
              {digitalSignature && (
                <Button
                  onClick={handleVerifySignature}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  تحقق
                </Button>
              )}
            </div>

            {digitalSignature && (
              <div className="space-y-2">
                <Label className="text-gray-300">التوقيع الرقمي</Label>
                <div className="text-xs text-gray-400 break-all bg-trading-secondary p-2 rounded">
                  {digitalSignature.signature.slice(0, 50)}...
                </div>
                <div className="text-xs text-gray-500">
                  الخوارزمية: {digitalSignature.algorithm} | الوقت: {new Date(digitalSignature.timestamp).toLocaleString('ar-SA')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Penetration Testing */}
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              اختبار الاختراق
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleRunPenetrationTest}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? 'جاري التشغيل...' : 'تشغيل اختبار الاختراق'}
            </Button>

            {penetrationTestResults && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">نقاط الأمان:</span>
                  <span className={cn("font-bold", 
                    penetrationTestResults.score >= 80 ? 'text-green-400' : 
                    penetrationTestResults.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                  )}>
                    {penetrationTestResults.score}/100
                  </span>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">الثغرات المكتشفة:</Label>
                  {penetrationTestResults.vulnerabilities.map((vuln: any, index: number) => (
                    <Alert key={index} className="border-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium">{vuln.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{vuln.recommendation}</div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Management */}
      <Card className="bg-trading-card border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            إدارة الجلسات النشطة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-trading-secondary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-blue-300">الجلسة النشطة</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">الحالة:</span>
                  <span className={cn(securityMetrics.sessionSecurity.active ? 'text-green-400' : 'text-red-400')}>
                    {securityMetrics.sessionSecurity.active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">آخر نشاط:</span>
                  <span className="text-white">
                    {securityMetrics.sessionSecurity.lastActivity ? 
                      new Date(securityMetrics.sessionSecurity.lastActivity).toLocaleTimeString('ar-SA') : 
                      'غير محدد'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">انتهاء الصلاحية:</span>
                  <span className="text-yellow-400">
                    {securityMetrics.sessionSecurity.expiryTime ? 
                      new Date(securityMetrics.sessionSecurity.expiryTime).toLocaleTimeString('ar-SA') : 
                      'غير محدد'
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-trading-secondary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="h-5 w-5 text-green-400" />
                <span className="font-bold text-green-300">حدود API</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">الحالي:</span>
                  <span className="text-white">{securityMetrics.apiRateLimit.current}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">الحد الأقصى:</span>
                  <span className="text-white">{securityMetrics.apiRateLimit.limit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">المتبقي:</span>
                  <span className="text-green-400">{securityMetrics.apiRateLimit.remaining}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-trading-secondary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-purple-400" />
                <span className="font-bold text-purple-300">التدقيق الأمني</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">أحداث اليوم:</span>
                  <span className="text-white">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">تهديدات محتملة:</span>
                  <span className="text-yellow-400">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">تحديث أخير:</span>
                  <span className="text-gray-400">{new Date().toLocaleTimeString('ar-SA')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
