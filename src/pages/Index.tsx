
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Zap, 
  Satellite,
  Activity,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-400" />,
      title: 'التحليل التقني المتقدم',
      titleEn: 'Advanced Technical Analysis',
      description: 'تحليل شامل للرسوم البيانية مع مؤشرات متقدمة وإشارات دقيقة',
      descriptionEn: 'Comprehensive chart analysis with advanced indicators and precise signals',
      path: '/charts'
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-400" />,
      title: 'الذكاء الاصطناعي',
      titleEn: 'AI Trading Models',
      description: 'نماذج ذكية للتداول الآلي والتنبؤ بحركة الأسواق',
      descriptionEn: 'Smart models for automated trading and market prediction',
      path: '/ai-models'
    },
    {
      icon: <Activity className="h-8 w-8 text-green-400" />,
      title: 'تحليل المشاعر',
      titleEn: 'Sentiment Analysis',
      description: 'تحليل المشاعر من مصادر متعددة: تويتر، ريديت، والأخبار',
      descriptionEn: 'Multi-source sentiment analysis: Twitter, Reddit, and news',
      path: '/analysis'
    },
    {
      icon: <Satellite className="h-8 w-8 text-yellow-400" />,
      title: 'البيانات البديلة',
      titleEn: 'Alternative Data',
      description: 'بيانات الأقمار الصناعية، IoT، والبلوك تشين للتحليل المتقدم',
      descriptionEn: 'Satellite, IoT, and blockchain data for advanced analysis',
      path: '/alternative-data'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-red-400" />,
      title: 'إدارة المحفظة',
      titleEn: 'Portfolio Management',
      description: 'إدارة ذكية للمحفظة مع تحليل المخاطر والعوائد',
      descriptionEn: 'Smart portfolio management with risk and return analysis',
      path: '/portfolio'
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-400" />,
      title: 'روبوت التداول',
      titleEn: 'Trading Bot',
      description: 'تداول آلي ذكي مع استراتيجيات متقدمة',
      descriptionEn: 'Intelligent automated trading with advanced strategies',
      path: '/trading-bot'
    }
  ];

  const stats = [
    { value: '94.2%', label: 'دقة التنبؤات', labelEn: 'Prediction Accuracy' },
    { value: '12+', label: 'مصادر البيانات', labelEn: 'Data Sources' },
    { value: '500+', label: 'أدوات التحليل', labelEn: 'Analysis Tools' },
    { value: '24/7', label: 'المراقبة المستمرة', labelEn: 'Continuous Monitoring' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-trading-bg via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-trading-primary/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-trading-primary/20 text-trading-primary border-trading-primary">
              <Star className="h-4 w-4 mr-2" />
              منصة التداول الذكي المتقدمة
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Signal <span className="text-trading-primary">Block</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              منصة شاملة للتداول الذكي تجمع بين التحليل التقني المتقدم والذكاء الاصطناعي 
              والبيانات البديلة لتحقيق أفضل النتائج في الأسواق المالية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-trading-primary hover:bg-trading-primary/90 text-white px-8 py-3"
                onClick={() => navigate('/dashboard')}
              >
                ابدأ التداول الآن
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3"
                onClick={() => navigate('/charts')}
              >
                استكشف المنصة
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-trading-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            مميزات متقدمة للتداول الاحترافي
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            نقدم مجموعة شاملة من الأدوات والتقنيات المتطورة لمساعدتك في اتخاذ قرارات تداول مدروسة ومربحة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-trading-card border-gray-800 hover:border-trading-primary/50 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-trading-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white group-hover:text-trading-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="flex items-center text-trading-primary group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">استكشف المزيد</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-trading-card to-gray-800 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                تقنيات متطورة لتحليل شامل
              </h3>
              <div className="space-y-4">
                {[
                  'تحليل البيانات بالذكاء الاصطناعي',
                  'معالجة اللغات الطبيعية للمشاعر',
                  'بيانات الأقمار الصناعية الحية',
                  'شبكات إنترنت الأشياء المتصلة',
                  'تحليل البلوك تشين والعملات الرقمية',
                  'العقود الآجلة والمشتقات المالية'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-trading-primary" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-trading-primary mb-2">AI/ML</div>
                <div className="text-gray-400">الذكاء الاصطناعي</div>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">IoT</div>
                <div className="text-gray-400">إنترنت الأشياء</div>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">DeFi</div>
                <div className="text-gray-400">التمويل اللامركزي</div>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">SAT</div>
                <div className="text-gray-400">الأقمار الصناعية</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center bg-gradient-to-r from-trading-primary to-purple-600 rounded-2xl p-12">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            جاهز للبدء في التداول الذكي؟
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المتداولين الذين يستخدمون Signal Block لتحقيق أرباح استثنائية
          </p>
          <Button 
            size="lg" 
            className="bg-white text-trading-primary hover:bg-gray-100 px-8 py-3"
            onClick={() => navigate('/dashboard')}
          >
            ابدأ رحلة التداول
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
