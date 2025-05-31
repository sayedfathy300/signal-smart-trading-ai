
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  BarChart3, 
  Activity,
  Shield,
  Brain,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  console.log('Index page rendering...');

  return (
    <div className="space-y-8" style={{ minHeight: '100vh', color: 'white' }}>
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          منصة التداول الذكي
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          منصة تداول متقدمة مدعومة بالذكاء الاصطناعي لتحليل الأسواق والتداول الآلي
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              التحليل المتقدم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              تحليل فني ومالي متقدم باستخدام خوارزميات الذكاء الاصطناعي
            </p>
            <Link to="/analysis">
              <Button className="mt-4" style={{ backgroundColor: '#2563eb' }}>
                استكشاف التحليل
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              الرسوم البيانية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              رسوم بيانية تفاعلية متقدمة لمتابعة الأسواق المالية
            </p>
            <Link to="/charts">
              <Button className="mt-4" style={{ backgroundColor: '#16a34a' }}>
                عرض الرسوم البيانية
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              الذكاء الاصطناعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              نماذج ذكاء اصطناعي متطورة للتنبؤ بحركة الأسواق
            </p>
            <Link to="/ai-models">
              <Button className="mt-4" style={{ backgroundColor: '#9333ea' }}>
                نماذج الذكاء الاصطناعي
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-yellow-400" />
              التداول الآلي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              روبوتات تداول ذكية لتنفيذ الصفقات تلقائياً
            </p>
            <Link to="/trading-bot">
              <Button className="mt-4" style={{ backgroundColor: '#ca8a04' }}>
                روبوت التداول
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-400" />
              إدارة المخاطر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              أدوات متقدمة لإدارة المخاطر وحماية رأس المال
            </p>
            <Link to="/risk-management">
              <Button className="mt-4" style={{ backgroundColor: '#dc2626' }}>
                إدارة المخاطر
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#374151' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              التحليل التفاعلي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              أدوات تحليل تفاعلية وباك تيست للاستراتيجيات
            </p>
            <Link to="/interactive-analysis">
              <Button className="mt-4" style={{ backgroundColor: '#0891b2' }}>
                التحليل التفاعلي
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div style={{ backgroundColor: 'rgba(51, 65, 85, 0.6)', padding: '1rem', borderRadius: '0.5rem' }} className="text-center">
          <div className="text-2xl font-bold text-blue-400">25+</div>
          <div className="text-sm text-gray-400">استراتيجية تداول</div>
        </div>
        <div style={{ backgroundColor: 'rgba(51, 65, 85, 0.6)', padding: '1rem', borderRadius: '0.5rem' }} className="text-center">
          <div className="text-2xl font-bold text-green-400">50+</div>
          <div className="text-sm text-gray-400">مؤشر فني</div>
        </div>
        <div style={{ backgroundColor: 'rgba(51, 65, 85, 0.6)', padding: '1rem', borderRadius: '0.5rem' }} className="text-center">
          <div className="text-2xl font-bold text-purple-400">10+</div>
          <div className="text-sm text-gray-400">نموذج ذكاء اصطناعي</div>
        </div>
        <div style={{ backgroundColor: 'rgba(51, 65, 85, 0.6)', padding: '1rem', borderRadius: '0.5rem' }} className="text-center">
          <div className="text-2xl font-bold text-yellow-400">24/7</div>
          <div className="text-sm text-gray-400">مراقبة الأسواق</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
