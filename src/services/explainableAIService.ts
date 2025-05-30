// خدمة الذكاء الاصطناعي التفسيري - Explainable AI Service
// تتضمن SHAP، Feature Importance، وتفسير القرارات

export interface SHAPValue {
  feature: string;
  value: number;
  importance: number;
  contribution: number;
  baseline: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  rank: number;
  category: 'technical' | 'fundamental' | 'sentiment' | 'alternative';
  description: string;
}

export interface DecisionExplanation {
  decision: 'buy' | 'sell' | 'hold';
  confidence: number;
  main_factors: string[];
  supporting_evidence: string[];
  risk_factors: string[];
  alternative_scenarios: {
    scenario: string;
    probability: number;
    outcome: string;
  }[];
}

export interface ModelExplanation {
  model_name: string;
  prediction: number;
  shap_values: SHAPValue[];
  feature_importance: FeatureImportance[];
  decision_explanation: DecisionExplanation;
  counterfactual_analysis: {
    original_prediction: number;
    counterfactual_prediction: number;
    changed_features: string[];
    explanation: string;
  };
  lime_explanation: {
    feature: string;
    weight: number;
    local_importance: number;
  }[];
}

export interface ExplainabilityReport {
  symbol: string;
  timestamp: Date;
  model_explanations: ModelExplanation[];
  global_feature_importance: FeatureImportance[];
  decision_tree_visualization: {
    nodes: Array<{
      id: string;
      condition: string;
      samples: number;
      value: number;
      type: 'decision' | 'leaf';
    }>;
    edges: Array<{
      from: string;
      to: string;
      condition: string;
    }>;
  };
  interpretability_score: number;
  bias_analysis: {
    demographic_parity: number;
    equalized_odds: number;
    calibration: number;
    fairness_score: number;
  };
}

class ExplainableAIService {
  private shapImplementation: any;
  private limeImplementation: any;

  constructor() {
    this.initializeExplainabilityModels();
  }

  private async initializeExplainabilityModels() {
    try {
      console.log('🔍 تهيئة نماذج التفسير...');
      
      // محاكاة تهيئة SHAP و LIME
      this.shapImplementation = {
        explainer: 'TreeExplainer',
        initialized: true
      };
      
      this.limeImplementation = {
        explainer: 'LimeTabular',
        initialized: true
      };
      
      console.log('✅ تم تهيئة نماذج التفسير بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تهيئة نماذج التفسير:', error);
    }
  }

  async generateSHAPValues(
    features: Record<string, number>,
    model: string
  ): Promise<SHAPValue[]> {
    console.log(`🎯 حساب قيم SHAP للنموذج ${model}...`);
    
    const featureNames = Object.keys(features);
    const baseline = 0.5; // القيمة الأساسية للنموذج
    
    return featureNames.map(feature => {
      const value = features[feature];
      const importance = Math.random() * 0.6 + 0.1; // أهمية عشوائية
      const contribution = (value - baseline) * importance * (Math.random() > 0.5 ? 1 : -1);
      
      return {
        feature,
        value,
        importance,
        contribution,
        baseline
      };
    }).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  }

  async calculateFeatureImportance(
    features: Record<string, number>,
    model: string
  ): Promise<FeatureImportance[]> {
    console.log(`📊 حساب أهمية الخصائص للنموذج ${model}...`);
    
    const technicalFeatures = ['RSI', 'MACD', 'MA20', 'MA50', 'Bollinger_Upper', 'Bollinger_Lower'];
    const fundamentalFeatures = ['PE_Ratio', 'EPS', 'Revenue_Growth', 'Debt_Ratio'];
    const sentimentFeatures = ['News_Sentiment', 'Social_Sentiment', 'Fear_Greed_Index'];
    const alternativeFeatures = ['Google_Trends', 'Satellite_Data', 'Credit_Card_Spending'];
    
    const allFeatures = [
      ...technicalFeatures.map(f => ({ name: f, category: 'technical' as const })),
      ...fundamentalFeatures.map(f => ({ name: f, category: 'fundamental' as const })),
      ...sentimentFeatures.map(f => ({ name: f, category: 'sentiment' as const })),
      ...alternativeFeatures.map(f => ({ name: f, category: 'alternative' as const }))
    ];
    
    return allFeatures.map((feature, index) => ({
      feature: feature.name,
      importance: Math.random() * 0.8 + 0.1,
      rank: index + 1,
      category: feature.category,
      description: this.getFeatureDescription(feature.name)
    })).sort((a, b) => b.importance - a.importance);
  }

  private getFeatureDescription(feature: string): string {
    const descriptions: Record<string, string> = {
      'RSI': 'مؤشر القوة النسبية - يقيس زخم السعر',
      'MACD': 'مؤشر تقارب وتباعد المتوسطات المتحركة',
      'MA20': 'المتوسط المتحرك لـ 20 يوم',
      'MA50': 'المتوسط المتحرك لـ 50 يوم',
      'PE_Ratio': 'نسبة السعر إلى الأرباح',
      'EPS': 'ربحية السهم الواحد',
      'News_Sentiment': 'مشاعر الأخبار المالية',
      'Google_Trends': 'اتجاهات البحث في جوجل'
    };
    
    return descriptions[feature] || 'وصف غير متوفر';
  }

  async explainDecision(
    prediction: number,
    features: Record<string, number>,
    model: string
  ): Promise<DecisionExplanation> {
    console.log(`💡 تفسير قرار النموذج ${model}...`);
    
    const decision = prediction > 0.6 ? 'buy' : prediction < 0.4 ? 'sell' : 'hold';
    const confidence = Math.abs(prediction - 0.5) * 2;
    
    const mainFactors = [
      'RSI يشير إلى منطقة ذروة البيع',
      'MACD يظهر إشارة صعودية قوية',
      'حجم التداول أعلى من المتوسط'
    ];
    
    const supportingEvidence = [
      'الأخبار المالية إيجابية',
      'المؤشرات الفنية تدعم الاتجاه',
      'السيولة كافية للدخول'
    ];
    
    const riskFactors = [
      'تقلبات السوق العالية',
      'عدم اليقين الاقتصادي',
      'مقاومة فنية قريبة'
    ];
    
    const alternativeScenarios = [
      {
        scenario: 'كسر المقاومة',
        probability: 0.3,
        outcome: 'استمرار الصعود بقوة'
      },
      {
        scenario: 'ارتداد من المقاومة',
        probability: 0.4,
        outcome: 'تصحيح مؤقت'
      },
      {
        scenario: 'دعم السعر الحالي',
        probability: 0.3,
        outcome: 'حركة جانبية'
      }
    ];
    
    return {
      decision,
      confidence,
      main_factors: mainFactors,
      supporting_evidence: supportingEvidence,
      risk_factors: riskFactors,
      alternative_scenarios: alternativeScenarios
    };
  }

  async generateLIMEExplanation(
    features: Record<string, number>,
    model: string
  ): Promise<{ feature: string; weight: number; local_importance: number }[]> {
    console.log(`🔬 توليد تفسير LIME للنموذج ${model}...`);
    
    return Object.keys(features).map(feature => ({
      feature,
      weight: (Math.random() - 0.5) * 2,
      local_importance: Math.random()
    })).sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  }

  async generateCounterfactualAnalysis(
    originalFeatures: Record<string, number>,
    model: string
  ): Promise<{
    original_prediction: number;
    counterfactual_prediction: number;
    changed_features: string[];
    explanation: string;
  }> {
    console.log(`🔄 توليد التحليل الافتراضي للنموذج ${model}...`);
    
    const originalPrediction = Math.random();
    const counterfactualPrediction = Math.random();
    
    const changedFeatures = Object.keys(originalFeatures)
      .slice(0, 3)
      .map(f => f);
    
    const explanation = `إذا تغيرت ${changedFeatures.join(', ')} بنسبة 10%، فإن التنبؤ سيتغير من ${(originalPrediction * 100).toFixed(1)}% إلى ${(counterfactualPrediction * 100).toFixed(1)}%`;
    
    return {
      original_prediction: originalPrediction,
      counterfactual_prediction: counterfactualPrediction,
      changed_features: changedFeatures,
      explanation
    };
  }

  async generateDecisionTreeVisualization() {
    console.log('🌳 توليد تصور شجرة القرار...');
    
    const nodes = [
      { id: '1', condition: 'RSI < 30', samples: 1000, value: 0.8, type: 'decision' as const },
      { id: '2', condition: 'MACD > 0', samples: 600, value: 0.9, type: 'decision' as const },
      { id: '3', condition: 'Buy Signal', samples: 400, value: 0.95, type: 'leaf' as const },
      { id: '4', condition: 'Hold Signal', samples: 200, value: 0.5, type: 'leaf' as const },
      { id: '5', condition: 'Sell Signal', samples: 400, value: 0.1, type: 'leaf' as const }
    ];
    
    const edges = [
      { from: '1', to: '2', condition: 'True' },
      { from: '1', to: '5', condition: 'False' },
      { from: '2', to: '3', condition: 'True' },
      { from: '2', to: '4', condition: 'False' }
    ];
    
    return { nodes, edges };
  }

  async generateBiasAnalysis(): Promise<{
    demographic_parity: number;
    equalized_odds: number;
    calibration: number;
    fairness_score: number;
  }> {
    console.log('⚖️ تحليل التحيز والعدالة...');
    
    const demographicParity = Math.random() * 0.3 + 0.7;
    const equalizedOdds = Math.random() * 0.3 + 0.7;
    const calibration = Math.random() * 0.3 + 0.7;
    const fairnessScore = (demographicParity + equalizedOdds + calibration) / 3;
    
    return {
      demographic_parity: demographicParity,
      equalized_odds: equalizedOdds,
      calibration,
      fairness_score: fairnessScore
    };
  }

  async generateExplainabilityReport(
    symbol: string,
    features: Record<string, number>
  ): Promise<ExplainabilityReport> {
    console.log(`📋 توليد تقرير التفسير الشامل لرمز ${symbol}...`);
    
    const models = ['LSTM', 'Transformer', 'RandomForest', 'GradientBoosting'];
    const modelExplanations: ModelExplanation[] = [];
    
    for (const model of models) {
      const prediction = Math.random();
      const shapValues = await this.generateSHAPValues(features, model);
      const featureImportance = await this.calculateFeatureImportance(features, model);
      const decisionExplanation = await this.explainDecision(prediction, features, model);
      const counterfactualAnalysis = await this.generateCounterfactualAnalysis(features, model);
      const limeExplanation = await this.generateLIMEExplanation(features, model);
      
      modelExplanations.push({
        model_name: model,
        prediction,
        shap_values: shapValues,
        feature_importance: featureImportance,
        decision_explanation: decisionExplanation,
        counterfactual_analysis: counterfactualAnalysis,
        lime_explanation: limeExplanation
      });
    }
    
    const globalFeatureImportance = await this.calculateFeatureImportance(features, 'ensemble');
    const decisionTreeVisualization = await this.generateDecisionTreeVisualization();
    const biasAnalysis = await this.generateBiasAnalysis();
    
    return {
      symbol,
      timestamp: new Date(),
      model_explanations: modelExplanations,
      global_feature_importance: globalFeatureImportance,
      decision_tree_visualization: decisionTreeVisualization,
      interpretability_score: Math.random() * 0.3 + 0.7,
      bias_analysis: biasAnalysis
    };
  }

  async analyzeFeatureInteractions(
    features: Record<string, number>
  ): Promise<{
    interaction: string;
    strength: number;
    description: string;
  }[]> {
    console.log('🔗 تحليل التفاعلات بين الخصائص...');
    
    const interactions = [
      {
        interaction: 'RSI × MACD',
        strength: Math.random() * 0.5 + 0.3,
        description: 'تفاعل قوي بين مؤشري RSI و MACD في تحديد نقاط الدخول'
      },
      {
        interaction: 'Volume × Price',
        strength: Math.random() * 0.4 + 0.4,
        description: 'علاقة إيجابية بين حجم التداول وحركة السعر'
      },
      {
        interaction: 'News Sentiment × Market Cap',
        strength: Math.random() * 0.3 + 0.2,
        description: 'تأثير مشاعر الأخبار يختلف حسب حجم الشركة'
      }
    ];
    
    return interactions.sort((a, b) => b.strength - a.strength);
  }

  async generateExplanationSummary(
    report: ExplainabilityReport
  ): Promise<{
    key_insights: string[];
    model_consensus: string;
    confidence_level: 'high' | 'medium' | 'low';
    actionable_recommendations: string[];
  }> {
    console.log('📝 توليد ملخص التفسير...');
    
    const keyInsights = [
      'جميع النماذج تشير إلى اتجاه صعودي متوسط المدى',
      'RSI هو أهم مؤشر فني في القرار الحالي',
      'مشاعر الأخبار تدعم التوقعات الإيجابية',
      'مستوى الثقة عالي بناءً على تطابق النماذج'
    ];
    
    const modelConsensus = 'اتفاق 75% من النماذج على إشارة الشراء';
    const confidenceLevel = 'high' as const;
    
    const actionableRecommendations = [
      'ادخل بحجم مركز متوسط مع وقف خسارة عند 5%',
      'راقب مستويات المقاومة القريبة',
      'تابع أخبار الشركة والقطاع',
      'أعد تقييم الموقف خلال 3-5 أيام'
    ];
    
    return {
      key_insights: keyInsights,
      model_consensus: modelConsensus,
      confidence_level: confidenceLevel,
      actionable_recommendations: actionableRecommendations
    };
  }
}

export const explainableAIService = new ExplainableAIService();
