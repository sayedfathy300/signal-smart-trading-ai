
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
  Lock, 
  Key, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  Download,
  Upload,
  Settings,
  BarChart3,
  Users,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { securityService, type SecurityMetrics, type MFASetup, type EncryptionResult } from '@/services/securityService';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';

interface SecurityDashboardProps {
  lang: 'en' | 'ar';
}

const SecurityDashboard = ({ lang }: SecurityDashboardProps) => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [mfaSetup, setMfaSetup] = useState<MFASetup | null>(null);
  const [mfaToken, setMfaToken] = useState('');
  const [encryptionTest, setEncryptionTest] = useState('');
  const [encryptedData, setEncryptedData] = useState<EncryptionResult | null>(null);
  const [decryptedData, setDecryptedData] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [penetrationResults, setPenetrationResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSecurityMetrics();
  }, []);

  const loadSecurityMetrics = () => {
    const securityMetrics = securityService.getSecurityMetrics();
    setMetrics(securityMetrics);
  };

  const handleSetupMFA = () => {
    setLoading(true);
    try {
      const setup = securityService.setupMFA('demo_user');
      setMfaSetup(setup);
      securityService.auditSecurityEvent('MFA_SETUP', 'demo_user');
      loadSecurityMetrics();
    } catch (error) {
      console.error('خطأ في إعداد MFA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = () => {
    if (mfaToken.length === 6) {
      const isValid = securityService.verifyMFA('demo_user', mfaToken);
      securityService.auditSecurityEvent('MFA_VERIFICATION', 'demo_user', { success: isValid });
      
      if (isValid) {
        alert(lang === 'ar' ? 'تم التحقق بنجاح!' : 'Verification successful!');
      } else {
        alert(lang === 'ar' ? 'رمز غير صحيح!' : 'Invalid token!');
      }
      setMfaToken('');
    }
  };

  const handleEncryptData = async () => {
    if (!encryptionTest.trim()) return;
    
    setLoading(true);
    try {
      const result = await securityService.encryptData(encryptionTest);
      setEncryptedData(result);
      securityService.auditSecurityEvent('DATA_ENCRYPTION', 'demo_user');
    } catch (error) {
      console.error('خطأ في التشفير:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecryptData = async () => {
    if (!encryptedData) return;
    
    setLoading(true);
    try {
      const result = await securityService.decryptData(encryptedData);
      setDecryptedData(result);
      securityService.auditSecurityEvent('DATA_DECRYPTION', 'demo_user');
    } catch (error) {
      console.error('خطأ في فك التشفير:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePenetrationTest = async () => {
    setLoading(true);
    try {
      const results = await securityService.runPenetrationTest();
      setPenetrationResults(results);
      securityService.auditSecurityEvent('PENETRATION_TEST', 'demo_user');
    } catch (error) {
      console.error('خطأ في اختبار الاختراق:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKeys = async () => {
    setLoading(true);
    try {
      await securityService.generateKeyPair('demo_user');
      securityService.auditSecurityEvent('KEY_GENERATION', 'demo_user');
      loadSecurityMetrics();
    } catch (error) {
      console.error('خطأ في إنشاء المفاتيح:', error);
    } finally {
      setLoading(false);
    }
  };

  const securityData = [
    { name: 'Jan', threats: 12, blocked: 45 },
    { name: 'Feb', threats: 8, blocked: 52 },
    { name: 'Mar', threats: 15, blocked: 38 },
    { name: 'Apr', threats: 6, blocked: 61 },
    { name: 'May', threats: 9, blocked: 48 },
    { name: 'Jun', threats: 4, blocked: 55 }
  ];

  const rateLimitData = [
    { endpoint: '/api/trading', current: 85, limit: 100 },
    { endpoint: '/api/market', current: 320, limit: 1000 },
    { endpoint: '/api/portfolio', current: 12, limit: 50 },
    { endpoint: '/api/auth', current: 2, limit: 5 }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {lang === 'ar' ? 'لوحة تحكم الأمان' : 'Security Dashboard'}
            </h1>
            <p className="text-gray-300">
              {lang === 'ar' ? 'إدارة وحماية النظام المتقدمة' : 'Advanced system protection and management'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadSecurityMetrics} variant="outline" className="text-white border-white/20">
              <Settings className="h-4 w-4 mr-2" />
              {lang === 'ar' ? 'تحديث' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'حالة التشفير' : 'Encryption Status'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {metrics?.encryptionStatus === 'active' ? 
                      (lang === 'ar' ? 'نشط' : 'Active') : 
                      (lang === 'ar' ? 'غير نشط' : 'Inactive')
                    }
                  </p>
                </div>
                <div className={`p-3 rounded-full ${metrics?.encryptionStatus === 'active' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <Lock className={`h-6 w-6 ${metrics?.encryptionStatus === 'active' ? 'text-green-400' : 'text-red-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'المصادقة متعددة العوامل' : 'Multi-Factor Auth'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {metrics?.mfaEnabled ? 
                      (lang === 'ar' ? 'مفعل' : 'Enabled') : 
                      (lang === 'ar' ? 'معطل' : 'Disabled')
                    }
                  </p>
                </div>
                <div className={`p-3 rounded-full ${metrics?.mfaEnabled ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                  <Smartphone className={`h-6 w-6 ${metrics?.mfaEnabled ? 'text-green-400' : 'text-yellow-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'معدل API المتبقي' : 'API Rate Remaining'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {metrics?.apiRateLimit?.remaining || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/20">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">
                    {lang === 'ar' ? 'الجلسات النشطة' : 'Active Sessions'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {metrics?.sessionSecurity?.active ? '1' : '0'}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Users className="h-6 w-6 text-purple-400" />
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
            <TabsTrigger value="encryption" className="text-white">
              {lang === 'ar' ? 'التشفير' : 'Encryption'}
            </TabsTrigger>
            <TabsTrigger value="mfa" className="text-white">
              {lang === 'ar' ? 'MFA' : 'MFA'}
            </TabsTrigger>
            <TabsTrigger value="signatures" className="text-white">
              {lang === 'ar' ? 'التوقيعات' : 'Signatures'}
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="text-white">
              {lang === 'ar' ? 'المراقبة' : 'Monitoring'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {lang === 'ar' ? 'اتجاهات الأمان' : 'Security Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={securityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="threats" stroke="#ff6b6b" strokeWidth={2} name="Threats" />
                      <Line type="monotone" dataKey="blocked" stroke="#4ecdc4" strokeWidth={2} name="Blocked" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {lang === 'ar' ? 'حدود معدل API' : 'API Rate Limits'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={rateLimitData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="endpoint" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="current" fill="#3b82f6" name="Current" />
                      <Bar dataKey="limit" fill="#1e40af" name="Limit" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Penetration Test Results */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {lang === 'ar' ? 'اختبار الاختراق' : 'Penetration Testing'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'فحص نقاط الضعف الأمنية' : 'Security vulnerability assessment'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Button onClick={handlePenetrationTest} disabled={loading} className="bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {loading ? (lang === 'ar' ? 'جاري الفحص...' : 'Testing...') : (lang === 'ar' ? 'بدء الفحص' : 'Start Test')}
                  </Button>
                </div>

                {penetrationResults && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-white">
                        <span className="text-sm text-gray-300">{lang === 'ar' ? 'نقاط الأمان:' : 'Security Score:'}</span>
                        <span className="text-2xl font-bold ml-2">{penetrationResults.score}/100</span>
                      </div>
                      <Progress value={penetrationResults.score} className="flex-1" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-medium">{lang === 'ar' ? 'نقاط الضعف المكتشفة:' : 'Vulnerabilities Found:'}</h4>
                      {penetrationResults.vulnerabilities.map((vuln: any, index: number) => (
                        <Alert key={index} className="bg-white/5 border-white/20">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle className="text-white">
                            <Badge variant={vuln.severity === 'critical' ? 'destructive' : vuln.severity === 'high' ? 'destructive' : 'secondary'}>
                              {vuln.severity.toUpperCase()}
                            </Badge>
                          </AlertTitle>
                          <AlertDescription className="text-gray-300">
                            <p>{vuln.description}</p>
                            <p className="text-sm mt-1 text-green-400">{lang === 'ar' ? 'التوصية:' : 'Recommendation:'} {vuln.recommendation}</p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Encryption Tab */}
          <TabsContent value="encryption">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {lang === 'ar' ? 'تشفير AES-256' : 'AES-256 Encryption'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'تشفير وفك تشفير البيانات الحساسة' : 'Encrypt and decrypt sensitive data'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="encryptText" className="text-white">
                      {lang === 'ar' ? 'النص المراد تشفيره:' : 'Text to encrypt:'}
                    </Label>
                    <Input
                      id="encryptText"
                      value={encryptionTest}
                      onChange={(e) => setEncryptionTest(e.target.value)}
                      placeholder={lang === 'ar' ? 'أدخل النص هنا...' : 'Enter text here...'}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button onClick={handleEncryptData} disabled={loading || !encryptionTest.trim()}>
                    <Lock className="h-4 w-4 mr-2" />
                    {loading ? (lang === 'ar' ? 'جاري التشفير...' : 'Encrypting...') : (lang === 'ar' ? 'تشفير' : 'Encrypt')}
                  </Button>
                </div>

                {encryptedData && (
                  <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium">{lang === 'ar' ? 'البيانات المشفرة:' : 'Encrypted Data:'}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-300">{lang === 'ar' ? 'البيانات:' : 'Data:'}</span>
                        <p className="text-white font-mono break-all bg-black/20 p-2 rounded">{encryptedData.encrypted}</p>
                      </div>
                      <div>
                        <span className="text-gray-300">{lang === 'ar' ? 'المتجه الأولي:' : 'IV:'}</span>
                        <p className="text-white font-mono break-all bg-black/20 p-2 rounded">{encryptedData.iv}</p>
                      </div>
                      <div>
                        <span className="text-gray-300">{lang === 'ar' ? 'العلامة:' : 'Tag:'}</span>
                        <p className="text-white font-mono break-all bg-black/20 p-2 rounded">{encryptedData.tag}</p>
                      </div>
                    </div>
                    <Button onClick={handleDecryptData} disabled={loading}>
                      <Key className="h-4 w-4 mr-2" />
                      {loading ? (lang === 'ar' ? 'جاري فك التشفير...' : 'Decrypting...') : (lang === 'ar' ? 'فك التشفير' : 'Decrypt')}
                    </Button>
                  </div>
                )}

                {decryptedData && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-medium">{lang === 'ar' ? 'البيانات المفكوكة التشفير:' : 'Decrypted Data:'}</h4>
                    <p className="text-white">{decryptedData}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* MFA Tab */}
          <TabsContent value="mfa">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  {lang === 'ar' ? 'المصادقة متعددة العوامل' : 'Multi-Factor Authentication'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'إعداد والتحقق من MFA' : 'Setup and verify MFA'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Button onClick={handleSetupMFA} disabled={loading}>
                    <Smartphone className="h-4 w-4 mr-2" />
                    {loading ? (lang === 'ar' ? 'جاري الإعداد...' : 'Setting up...') : (lang === 'ar' ? 'إعداد MFA' : 'Setup MFA')}
                  </Button>
                </div>

                {mfaSetup && (
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h4 className="text-white font-medium mb-4">{lang === 'ar' ? 'إعداد MFA:' : 'MFA Setup:'}</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white">{lang === 'ar' ? 'المفتاح السري:' : 'Secret Key:'}</Label>
                          <p className="text-white font-mono bg-black/20 p-2 rounded break-all">{mfaSetup.secret}</p>
                        </div>
                        
                        <div>
                          <Label className="text-white">{lang === 'ar' ? 'رابط QR:' : 'QR Code URL:'}</Label>
                          <p className="text-blue-400 text-sm break-all">{mfaSetup.qrCode}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Label className="text-white">{lang === 'ar' ? 'الرموز الاحتياطية:' : 'Backup Codes:'}</Label>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowBackupCodes(!showBackupCodes)}
                            >
                              {showBackupCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          {showBackupCodes && (
                            <div className="grid grid-cols-2 gap-2">
                              {mfaSetup.backupCodes.map((code, index) => (
                                <p key={index} className="text-white font-mono bg-black/20 p-2 rounded text-center">
                                  {code}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-white">{lang === 'ar' ? 'التحقق من رمز MFA:' : 'Verify MFA Token:'}</Label>
                      <div className="flex items-center gap-4">
                        <InputOTP
                          maxLength={6}
                          value={mfaToken}
                          onChange={(value) => setMfaToken(value)}
                          onComplete={handleVerifyMFA}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className="bg-white/10 border-white/20 text-white" />
                            <InputOTPSlot index={1} className="bg-white/10 border-white/20 text-white" />
                            <InputOTPSlot index={2} className="bg-white/10 border-white/20 text-white" />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} className="bg-white/10 border-white/20 text-white" />
                            <InputOTPSlot index={4} className="bg-white/10 border-white/20 text-white" />
                            <InputOTPSlot index={5} className="bg-white/10 border-white/20 text-white" />
                          </InputOTPGroup>
                        </InputOTP>
                        <Button onClick={handleVerifyMFA} disabled={mfaToken.length !== 6}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {lang === 'ar' ? 'تحقق' : 'Verify'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Digital Signatures Tab */}
          <TabsContent value="signatures">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  {lang === 'ar' ? 'التوقيعات الرقمية' : 'Digital Signatures'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {lang === 'ar' ? 'إنشاء والتحقق من التوقيعات الرقمية' : 'Create and verify digital signatures'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button onClick={handleGenerateKeys} disabled={loading}>
                  <Key className="h-4 w-4 mr-2" />
                  {loading ? (lang === 'ar' ? 'جاري إنشاء المفاتيح...' : 'Generating Keys...') : (lang === 'ar' ? 'إنشاء مفاتيح RSA' : 'Generate RSA Keys')}
                </Button>

                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{lang === 'ar' ? 'حالة التوقيع الرقمي:' : 'Digital Signature Status:'}</h4>
                  <div className="flex items-center gap-2">
                    {metrics?.digitalSignature?.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                    <span className="text-white">
                      {metrics?.digitalSignature?.verified ? 
                        (lang === 'ar' ? 'جاهز للتوقيع' : 'Ready for signing') : 
                        (lang === 'ar' ? 'غير جاهز' : 'Not ready')
                      }
                    </span>
                  </div>
                  {metrics?.digitalSignature?.algorithm && (
                    <p className="text-gray-300 text-sm mt-2">
                      {lang === 'ar' ? 'الخوارزمية:' : 'Algorithm:'} {metrics.digitalSignature.algorithm}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {lang === 'ar' ? 'الأنشطة الأمنية الأخيرة' : 'Recent Security Activities'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { event: 'MFA Setup', time: '2 min ago', status: 'success' },
                      { event: 'Key Generation', time: '5 min ago', status: 'success' },
                      { event: 'Data Encryption', time: '8 min ago', status: 'success' },
                      { event: 'Login Attempt', time: '12 min ago', status: 'warning' },
                      { event: 'Rate Limit Hit', time: '15 min ago', status: 'error' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-green-400' :
                            activity.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                          <span className="text-white">{activity.event}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {lang === 'ar' ? 'إحصائيات الجلسات' : 'Session Statistics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{lang === 'ar' ? 'الجلسات النشطة:' : 'Active Sessions:'}</span>
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{lang === 'ar' ? 'انتهاء الصلاحية:' : 'Session Expires:'}</span>
                      <span className="text-white">
                        {metrics?.sessionSecurity?.expiryTime ? 
                          new Date(metrics.sessionSecurity.expiryTime).toLocaleTimeString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{lang === 'ar' ? 'آخر نشاط:' : 'Last Activity:'}</span>
                      <span className="text-white">
                        {metrics?.sessionSecurity?.lastActivity ? 
                          new Date(metrics.sessionSecurity.lastActivity).toLocaleTimeString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityDashboard;
