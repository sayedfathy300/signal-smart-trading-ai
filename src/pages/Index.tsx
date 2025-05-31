
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
    <div className="min-h-screen bg-trading-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <Card className="bg-trading-card border-gray-800 hover:border-blue-500 transition-colors">
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
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  استكشاف التحليل
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800 hover:border-green-500 transition-colors">
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
                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                  عرض الرسوم البيانية
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800 hover:border-purple-500 transition-colors">
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
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                  نماذج الذكاء الاصطناعي
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800 hover:border-yellow-500 transition-colors">
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
                <Button className="mt-4 bg-yellow-600 hover:bg-yellow-700">
                  روبوت التداول
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800 hover:border-red-500 transition-colors">
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
                <Button className="mt-4 bg-red-600 hover:bg-red-700">
                  إدارة المخاطر
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-800 hover:border-cyan-500 transition-colors">
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
                <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700">
                  التحليل التفاعلي
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-trading-secondary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">25+</div>
            <div className="text-sm text-gray-400">استراتيجية تداول</div>
          </div>
          <div className="bg-trading-secondary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">50+</div>
            <div className="text-sm text-gray-400">مؤشر فني</div>
          </div>
          <div className="bg-trading-secondary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">10+</div>
            <div className="text-sm text-gray-400">نموذج ذكاء اصطناعي</div>
          </div>
          <div className="bg-trading-secondary p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-400">24/7</div>
            <div className="text-sm text-gray-400">مراقبة الأسواق</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
