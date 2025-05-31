
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Brain, Target, Zap, Activity, PieChart, Settings } from 'lucide-react';

interface AnalysisProps {
  lang: 'en' | 'ar';
}

const Analysis = ({ lang }: AnalysisProps) => {
  const [activeTab, setActiveTab] = useState('technical');

  const tabs = [
    { id: 'technical', name: lang === 'ar' ? 'التحليل الفني' : 'Technical Analysis', icon: BarChart3 },
    { id: 'fundamental', name: lang === 'ar' ? 'التحليل الأساسي' : 'Fundamental Analysis', icon: Target },
    { id: 'sentiment', name: lang === 'ar' ? 'تحليل المشاعر' : 'Sentiment Analysis', icon: Brain },
    { id: 'quantitative', name: lang === 'ar' ? 'التحليل الكمي' : 'Quantitative Analysis', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {lang === 'ar' ? 'التحليل متعدد الأبعاد' : 'Multi-Dimensional Analysis'}
        </h1>

        {/* Analysis Tabs */}
        <div className="bg-slate-800 p-6 rounded-lg mb-6 border border-slate-700">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Technical Analysis */}
          {activeTab === 'technical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    {lang === 'ar' ? 'المؤشرات الزخمية' : 'Momentum Indicators'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>RSI (14)</span>
                      <span className="text-yellow-400 font-bold">68.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stochastic %K</span>
                      <span className="text-green-400 font-bold">72.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Williams %R</span>
                      <span className="text-red-400 font-bold">-28.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CCI (20)</span>
                      <span className="text-blue-400 font-bold">145.3</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    {lang === 'ar' ? 'مؤشرات الاتجاه' : 'Trend Indicators'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>SMA (20)</span>
                      <span className="text-green-400 font-bold">$44,850</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EMA (12)</span>
                      <span className="text-green-400 font-bold">$45,120</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MACD</span>
                      <span className="text-green-400 font-bold">+0.12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ADX (14)</span>
                      <span className="text-purple-400 font-bold">35.8</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-400" />
                    {lang === 'ar' ? 'مؤشرات التقلب' : 'Volatility Indicators'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>ATR (14)</span>
                      <span className="text-yellow-400 font-bold">1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bollinger Width</span>
                      <span className="text-blue-400 font-bold">0.085</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VIX</span>
                      <span className="text-red-400 font-bold">18.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Historical Vol</span>
                      <span className="text-green-400 font-bold">22.3%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pattern Recognition */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-400" />
                  {lang === 'ar' ? 'كشف الأنماط التلقائي' : 'Automated Pattern Recognition'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-green-900/30 border border-green-700 rounded">
                    <h4 className="font-medium text-green-400 mb-2">
                      {lang === 'ar' ? 'الرأس والكتفين' : 'Head & Shoulders'}
                    </h4>
                    <p className="text-sm text-green-300">
                      {lang === 'ar' ? 'احتمالية: 87%' : 'Confidence: 87%'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {lang === 'ar' ? 'إشارة هبوطية' : 'Bearish Signal'}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-900/30 border border-blue-700 rounded">
                    <h4 className="font-medium text-blue-400 mb-2">
                      {lang === 'ar' ? 'مثلث صاعد' : 'Ascending Triangle'}
                    </h4>
                    <p className="text-sm text-blue-300">
                      {lang === 'ar' ? 'احتمالية: 72%' : 'Confidence: 72%'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {lang === 'ar' ? 'إشارة صاعدة' : 'Bullish Signal'}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded">
                    <h4 className="font-medium text-yellow-400 mb-2">
                      {lang === 'ar' ? 'علم صاعد' : 'Bull Flag'}
                    </h4>
                    <p className="text-sm text-yellow-300">
                      {lang === 'ar' ? 'احتمالية: 65%' : 'Confidence: 65%'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {lang === 'ar' ? 'إشارة استمرار' : 'Continuation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fundamental Analysis */}
          {activeTab === 'fundamental' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    {lang === 'ar' ? 'المؤشرات الاقتصادية' : 'Economic Indicators'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'معدل التضخم' : 'Inflation Rate'}</span>
                      <span className="text-yellow-400 font-bold">3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'معدل الفائدة' : 'Interest Rate'}</span>
                      <span className="text-blue-400 font-bold">5.25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'نمو الناتج المحلي' : 'GDP Growth'}</span>
                      <span className="text-green-400 font-bold">2.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'معدل البطالة' : 'Unemployment'}</span>
                      <span className="text-red-400 font-bold">3.8%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    {lang === 'ar' ? 'تقييم الأصول' : 'Asset Valuation'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>P/E Ratio</span>
                      <span className="text-green-400 font-bold">18.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>P/B Ratio</span>
                      <span className="text-blue-400 font-bold">2.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROE</span>
                      <span className="text-purple-400 font-bold">15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Debt/Equity</span>
                      <span className="text-yellow-400 font-bold">0.65</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sentiment Analysis */}
          {activeTab === 'sentiment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    {lang === 'ar' ? 'مشاعر وسائل التواصل' : 'Social Sentiment'}
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">72%</div>
                    <p className="text-green-400 font-medium">
                      {lang === 'ar' ? 'إيجابي' : 'Bullish'}
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Twitter</span>
                        <span className="text-green-400">+68%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reddit</span>
                        <span className="text-green-400">+75%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>News</span>
                        <span className="text-yellow-400">+58%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    {lang === 'ar' ? 'مؤشر الخوف والطمع' : 'Fear & Greed Index'}
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">68</div>
                    <p className="text-yellow-400 font-medium">
                      {lang === 'ar' ? 'طمع' : 'Greed'}
                    </p>
                    <div className="w-full bg-slate-600 rounded-full h-3 mt-3">
                      <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full" style={{width: '100%'}}></div>
                      <div className="relative">
                        <div className="absolute bg-white h-4 w-1 rounded" style={{left: '68%', top: '-2px'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    {lang === 'ar' ? 'نشاط المؤسسات' : 'Institutional Activity'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'تدفق رؤوس الأموال' : 'Money Flow'}</span>
                      <span className="text-green-400 font-bold">+$2.1B</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'نشاط الحيتان' : 'Whale Activity'}</span>
                      <span className="text-blue-400 font-bold">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'ar' ? 'عمليات الشراء' : 'Large Buys'}</span>
                      <span className="text-green-400 font-bold">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quantitative Analysis */}
          {activeTab === 'quantitative' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    {lang === 'ar' ? 'نماذج التنبؤ' : 'Predictive Models'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>LSTM Model</span>
                      <span className="text-green-400 font-bold">92.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Random Forest</span>
                      <span className="text-blue-400 font-bold">87.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SVM</span>
                      <span className="text-yellow-400 font-bold">84.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ensemble</span>
                      <span className="text-purple-400 font-bold">89.7%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    {lang === 'ar' ? 'مؤشرات الأداء' : 'Performance Metrics'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Sharpe Ratio</span>
                      <span className="text-green-400 font-bold">2.15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sortino Ratio</span>
                      <span className="text-blue-400 font-bold">3.21</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Drawdown</span>
                      <span className="text-red-400 font-bold">-8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate</span>
                      <span className="text-green-400 font-bold">78.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            {lang === 'ar' ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-400">
                  {lang === 'ar' ? 'شراء قوي' : 'Strong Buy'}
                </h3>
                <div className="text-green-400 font-bold">87%</div>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {lang === 'ar' ? 'نقطة الدخول: $45,200' : 'Entry: $45,200'}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                {lang === 'ar' ? 'الهدف: $48,500' : 'Target: $48,500'}
              </p>
              <p className="text-sm text-gray-300">
                {lang === 'ar' ? 'وقف الخسارة: $44,000' : 'Stop Loss: $44,000'}
              </p>
            </div>

            <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-400">
                  {lang === 'ar' ? 'شراء' : 'Buy'}
                </h3>
                <div className="text-blue-400 font-bold">72%</div>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {lang === 'ar' ? 'نقطة الدخول: $45,100' : 'Entry: $45,100'}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                {lang === 'ar' ? 'الهدف: $47,200' : 'Target: $47,200'}
              </p>
              <p className="text-sm text-gray-300">
                {lang === 'ar' ? 'وقف الخسارة: $43,800' : 'Stop Loss: $43,800'}
              </p>
            </div>

            <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-yellow-400">
                  {lang === 'ar' ? 'انتظار' : 'Hold'}
                </h3>
                <div className="text-yellow-400 font-bold">65%</div>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {lang === 'ar' ? 'مراقبة المستوى: $45,000' : 'Watch Level: $45,000'}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                {lang === 'ar' ? 'الكسر العلوي: $46,000' : 'Break Above: $46,000'}
              </p>
              <p className="text-sm text-gray-300">
                {lang === 'ar' ? 'الكسر السفلي: $44,200' : 'Break Below: $44,200'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
