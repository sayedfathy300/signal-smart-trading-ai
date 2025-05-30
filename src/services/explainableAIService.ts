
import { DecisionExplanation } from "@/types/types";

export interface BiasAnalysis {
  overallBias: number;
  biasFactors: Array<{
    factor: string;
    bias: number;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  fairnessMetrics: {
    demographicParity: number;
    equalizedOdds: number;
    calibration: number;
  };
}

export interface CounterfactualAnalysis {
  originalDecision: string;
  alternativeDecision: string;
  requiredChanges: Array<{
    feature: string;
    originalValue: number;
    requiredValue: number;
    impact: number;
  }>;
  confidence: number;
  feasibility: number;
}

export interface FeatureImportance {
  name: string;
  importance: number;
  direction: 'positive' | 'negative';
  description: string;
}

class ExplainableAIService {
  async explainDecision(modelOutput: any, inputData: any, modelType: string): Promise<DecisionExplanation> {
    console.log('🔍 شرح القرار للنموذج:', modelType);

    // محاكاة شرح القرار
    const factors = [
      { name: 'السعر الحالي', value: inputData.price || 50000, impact: 0.35, description: 'السعر الحالي للأصل' },
      { name: 'الحجم', value: inputData.volume || 1000000, impact: 0.25, description: 'حجم التداول' },
      { name: 'RSI', value: inputData.rsi || 65, impact: 0.20, description: 'مؤشر القوة النسبية' },
      { name: 'MACD', value: inputData.macd || 0.1, impact: 0.20, description: 'مؤشر MACD' }
    ];

    return {
      decision: modelOutput.prediction || 'BUY',
      confidence: modelOutput.confidence || 0.85,
      reasoning: 'القرار مبني على تحليل المؤشرات الفنية والاتجاه الصاعد',
      factors,
      model: {
        name: modelType,
        version: '1.0.0',
        accuracy: 0.89
      },
      alternatives: [
        { decision: 'HOLD', probability: 0.30, reasoning: 'انتظار إشارات أوضح' },
        { decision: 'SELL', probability: 0.15, reasoning: 'مخاطر انعكاس الاتجاه' }
      ],
      timestamp: Date.now()
    };
  }

  async getFeatureImportance(modelType: string): Promise<FeatureImportance[]> {
    console.log('📊 حساب أهمية الميزات للنموذج:', modelType);

    return [
      { name: 'السعر', importance: 0.35, direction: 'positive', description: 'تأثير السعر على القرار' },
      { name: 'الحجم', importance: 0.25, direction: 'positive', description: 'تأثير حجم التداول' },
      { name: 'RSI', importance: 0.20, direction: 'negative', description: 'مؤشر القوة النسبية' },
      { name: 'MACD', importance: 0.20, direction: 'positive', description: 'مؤشر MACD' }
    ];
  }

  async analyzeBias(modelPredictions: any[], actualOutcomes: any[]): Promise<BiasAnalysis> {
    console.log('⚖️ تحليل التحيز في النموذج...');

    const biasFactors = [
      { factor: 'تحيز التأكيد', bias: 0.15, severity: 'medium' as const, recommendation: 'تنويع مصادر البيانات' },
      { factor: 'تحيز البقاء', bias: 0.08, severity: 'low' as const, recommendation: 'تضمين البيانات المحذوفة' }
    ];

    return {
      overallBias: 0.12,
      biasFactors,
      fairnessMetrics: {
        demographicParity: 0.85,
        equalizedOdds: 0.80,
        calibration: 0.88
      }
    };
  }

  async generateCounterfactual(originalInput: any, desiredOutput: string): Promise<CounterfactualAnalysis> {
    console.log('🔄 توليد التحليل المضاد...');

    return {
      originalDecision: 'SELL',
      alternativeDecision: desiredOutput,
      requiredChanges: [
        { feature: 'RSI', originalValue: 75, requiredValue: 45, impact: 0.4 },
        { feature: 'Volume', originalValue: 500000, requiredValue: 1500000, impact: 0.3 }
      ],
      confidence: 0.75,
      feasibility: 0.60
    };
  }
}

export const explainableAIService = new ExplainableAIService();
