
export interface DecisionExplanation {
  decision: string;
  confidence: number;
  reasoning: string;
  factors: Array<{
    name: string;
    value: number;
    impact: number;
    description: string;
  }>;
  model: {
    name: string;
    version: string;
    accuracy: number;
  };
  alternatives: Array<{
    decision: string;
    probability: number;
    reasoning: string;
  }>;
  timestamp: number;
}

export interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  timestamp: number;
  strategy: string;
  reasoning: string;
}

export interface SecurityConfig {
  encryptionKey: string;
  mfaSecret: string;
  apiRateLimit: number;
  sessionTimeout: number;
}
