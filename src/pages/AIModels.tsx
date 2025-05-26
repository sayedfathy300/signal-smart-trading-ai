
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Cpu, TrendingUp, Activity, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AIModelsProps {
  lang?: 'en' | 'ar';
}

const AIModels = ({ lang = 'en' }: AIModelsProps) => {
  const models = [
    {
      id: 'transformer-xl',
      name: 'Transformer-XL',
      description: lang === 'en' ? 'Advanced transformer model for sequence prediction' : 'نموذج متحول متقدم للتنبؤ بالتسلسل',
      accuracy: '94.2%',
      status: 'active',
      icon: Brain,
      color: 'text-trading-up'
    },
    {
      id: 'lstm-hybrid',
      name: 'LSTM Hybrid',
      description: lang === 'en' ? 'Long Short-Term Memory neural network' : 'شبكة عصبية ذات ذاكرة قصيرة وطويلة المدى',
      accuracy: '91.8%',
      status: 'active',
      icon: Cpu,
      color: 'text-trading-up'
    },
    {
      id: 'cnn-analyzer',
      name: 'CNN Pattern Analyzer',
      description: lang === 'en' ? 'Convolutional network for pattern recognition' : 'شبكة تطبيقية لتحليل الأنماط',
      accuracy: '89.3%',
      status: 'training',
      icon: TrendingUp,
      color: 'text-yellow-500'
    },
    {
      id: 'gnn-market',
      name: 'Graph Neural Network',
      description: lang === 'en' ? 'Graph-based market relationship analysis' : 'تحليل علاقات السوق القائم على الرسوم البيانية',
      accuracy: '87.6%',
      status: 'active',
      icon: Activity,
      color: 'text-trading-up'
    },
    {
      id: 'reinforcement-trader',
      name: 'RL Trading Agent',
      description: lang === 'en' ? 'Reinforcement learning trading agent' : 'وكيل تداول بالتعلم المعزز',
      accuracy: '93.1%',
      status: 'active',
      icon: Zap,
      color: 'text-trading-up'
    },
    {
      id: 'ensemble-predictor',
      name: 'Ensemble Predictor',
      description: lang === 'en' ? 'Combined multiple models for maximum accuracy' : 'نماذج متعددة مجمعة لأقصى دقة',
      accuracy: '96.5%',
      status: 'active',
      icon: Target,
      color: 'text-trading-up'
    }
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-trading-bg">
      <div className="flex items-center justify-between">
        <h1 className={cn("text-3xl font-bold text-white", lang === 'ar' && 'rtl text-right')}>
          {lang === 'en' ? 'AI Models' : 'نماذج الذكاء الاصطناعي'}
        </h1>
        <Button className="bg-trading-up hover:bg-green-600 text-white">
          {lang === 'en' ? 'Train New Model' : 'تدريب نموذج جديد'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="bg-trading-card border-gray-800 hover:border-trading-up transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <model.icon className={cn("h-8 w-8", model.color)} />
                  <div>
                    <CardTitle className="text-white text-lg">{model.name}</CardTitle>
                    <Badge 
                      variant={model.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        "mt-1",
                        model.status === 'active' 
                          ? 'bg-trading-up text-white' 
                          : 'bg-yellow-500 text-black'
                      )}
                    >
                      {model.status === 'active' 
                        ? (lang === 'en' ? 'Active' : 'نشط')
                        : (lang === 'en' ? 'Training' : 'تدريب')
                      }
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-trading-up">{model.accuracy}</div>
                  <div className="text-xs text-gray-400">
                    {lang === 'en' ? 'Accuracy' : 'الدقة'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                {model.description}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-white hover:bg-trading-secondary">
                  {lang === 'en' ? 'Configure' : 'إعداد'}
                </Button>
                <Button size="sm" className="flex-1 bg-trading-accent hover:bg-red-600 text-white">
                  {lang === 'en' ? 'Deploy' : 'نشر'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-trading-up" />
              {lang === 'en' ? 'Model Performance' : 'أداء النماذج'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{lang === 'en' ? 'Average Accuracy' : 'متوسط الدقة'}</span>
                <span className="text-trading-up font-bold">92.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{lang === 'en' ? 'Active Models' : 'النماذج النشطة'}</span>
                <span className="text-white font-bold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{lang === 'en' ? 'Training Models' : 'النماذج قيد التدريب'}</span>
                <span className="text-yellow-500 font-bold">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-trading-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-trading-up" />
              {lang === 'en' ? 'AI Insights' : 'رؤى الذكاء الاصطناعي'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-trading-secondary rounded-lg">
                <p className="text-sm text-gray-300">
                  {lang === 'en' 
                    ? '🔥 Ensemble model achieving 96.5% accuracy in market predictions'
                    : '🔥 النموذج المجمع يحقق دقة 96.5% في توقعات السوق'
                  }
                </p>
              </div>
              <div className="p-3 bg-trading-secondary rounded-lg">
                <p className="text-sm text-gray-300">
                  {lang === 'en' 
                    ? '📈 RL Agent shows 15% improvement in profit optimization'
                    : '📈 وكيل التعلم المعزز يظهر تحسن 15% في تحسين الأرباح'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIModels;
