
// Attack Prevention Service - مكافحة الهجمات
export interface AttackDetectionResult {
  threat: boolean;
  threatType: string;
  confidence: number;
  source: string;
  timestamp: number;
  details: any;
  blocked: boolean;
}

export interface AnomalyPattern {
  id: string;
  type: 'login' | 'trading' | 'api' | 'navigation' | 'data_access';
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threshold: number;
  description: string;
}

export interface BotDetectionMetrics {
  browserFingerprint: string;
  behaviorScore: number;
  requestPattern: string;
  mouseMovements: Array<{ x: number; y: number; timestamp: number }>;
  keyboardPattern: string;
  isBot: boolean;
  confidence: number;
}

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'email' | 'password' | 'amount' | 'address';
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitizers: string[];
  validators: string[];
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  source: string;
  description: string;
  data: any;
  timestamp: number;
  userId?: string;
  ip: string;
  userAgent: string;
}

class AttackPreventionService {
  private anomalyPatterns: Map<string, AnomalyPattern> = new Map();
  private detectedAnomalies: Map<string, any[]> = new Map();
  private botDetectionData: Map<string, BotDetectionMetrics> = new Map();
  private validationRules: Map<string, ValidationRule[]> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private csrfTokens: Map<string, string> = new Map();
  private rateLimiters: Map<string, any> = new Map();
  private blacklistedIPs: Set<string> = new Set();
  private suspiciousActivities: Map<string, number> = new Map();

  constructor() {
    this.initializeAnomalyPatterns();
    this.initializeValidationRules();
    this.initializeBotDetection();
    this.setupRealTimeMonitoring();
  }

  // تهيئة أنماط اكتشاف الشذوذ
  private initializeAnomalyPatterns() {
    const patterns: AnomalyPattern[] = [
      {
        id: 'rapid_login_attempts',
        type: 'login',
        pattern: 'multiple_failed_logins',
        severity: 'high',
        threshold: 5,
        description: 'محاولات تسجيل دخول متكررة فاشلة'
      },
      {
        id: 'unusual_trading_volume',
        type: 'trading',
        pattern: 'high_volume_trades',
        severity: 'medium',
        threshold: 100000,
        description: 'حجم تداول غير طبيعي'
      },
      {
        id: 'api_abuse',
        type: 'api',
        pattern: 'excessive_requests',
        severity: 'high',
        threshold: 1000,
        description: 'طلبات API مفرطة'
      },
      {
        id: 'suspicious_navigation',
        type: 'navigation',
        pattern: 'rapid_page_changes',
        severity: 'medium',
        threshold: 50,
        description: 'تصفح مشبوه سريع'
      },
      {
        id: 'data_harvesting',
        type: 'data_access',
        pattern: 'bulk_data_requests',
        severity: 'critical',
        threshold: 10,
        description: 'محاولة جمع بيانات بكميات كبيرة'
      }
    ];

    patterns.forEach(pattern => {
      this.anomalyPatterns.set(pattern.id, pattern);
      this.detectedAnomalies.set(pattern.id, []);
    });

    console.log('🛡️ تم تهيئة أنماط اكتشاف الشذوذ');
  }

  // تهيئة قواعد التحقق المتقدمة
  private initializeValidationRules() {
    const rulesSets = [
      {
        form: 'login',
        rules: [
          {
            field: 'email',
            type: 'email' as const,
            required: true,
            maxLength: 255,
            sanitizers: ['trim', 'toLowerCase'],
            validators: ['email', 'domain_whitelist']
          },
          {
            field: 'password',
            type: 'password' as const,
            required: true,
            minLength: 8,
            maxLength: 128,
            sanitizers: ['trim'],
            validators: ['password_strength', 'no_common_passwords']
          }
        ]
      },
      {
        form: 'trading',
        rules: [
          {
            field: 'amount',
            type: 'number' as const,
            required: true,
            sanitizers: ['parseFloat'],
            validators: ['positive_number', 'max_trading_amount', 'decimal_places']
          },
          {
            field: 'symbol',
            type: 'string' as const,
            required: true,
            maxLength: 10,
            pattern: /^[A-Z]{3,10}$/,
            sanitizers: ['trim', 'toUpperCase'],
            validators: ['valid_symbol', 'market_hours']
          }
        ]
      },
      {
        form: 'withdrawal',
        rules: [
          {
            field: 'address',
            type: 'address' as const,
            required: true,
            maxLength: 100,
            sanitizers: ['trim'],
            validators: ['crypto_address', 'address_whitelist']
          },
          {
            field: 'amount',
            type: 'number' as const,
            required: true,
            sanitizers: ['parseFloat'],
            validators: ['positive_number', 'max_withdrawal_amount', 'daily_limit']
          }
        ]
      }
    ];

    rulesSets.forEach(ruleSet => {
      this.validationRules.set(ruleSet.form, ruleSet.rules);
    });

    console.log('✅ تم تهيئة قواعد التحقق المتقدمة');
  }

  // تهيئة كشف البوتات
  private initializeBotDetection() {
    // إعداد متتبعات حركة الماوس ولوحة المفاتيح
    this.setupMouseTracking();
    this.setupKeyboardTracking();
    this.setupBehaviorAnalysis();
    
    console.log('🤖 تم تهيئة نظام كشف البوتات');
  }

  // إعداد مراقبة الوقت الفعلي
  private setupRealTimeMonitoring() {
    // مراقبة الأنشطة المشبوهة كل دقيقة
    setInterval(() => {
      this.analyzeAnomalies();
      this.updateThreatLevel();
      this.cleanupOldData();
    }, 60000);

    console.log('📊 تم تشغيل المراقبة في الوقت الفعلي');
  }

  // كشف الشذوذ المتقدم
  detectAnomaly(eventType: string, data: any, userId?: string): AttackDetectionResult {
    const timestamp = Date.now();
    const userKey = userId || data.ip || 'anonymous';
    
    let threatDetected = false;
    let threatType = 'none';
    let confidence = 0;
    let details: any = {};

    // فحص أنماط الشذوذ المختلفة
    for (const [patternId, pattern] of this.anomalyPatterns) {
      if (pattern.type === eventType || eventType === 'general') {
        const anomalyResult = this.checkPattern(pattern, data, userKey);
        
        if (anomalyResult.detected) {
          threatDetected = true;
          threatType = pattern.pattern;
          confidence = Math.max(confidence, anomalyResult.confidence);
          details = { ...details, ...anomalyResult.details };
          
          // تسجيل الشذوذ
          this.logAnomaly(patternId, userKey, data, anomalyResult);
        }
      }
    }

    // فحص إضافي للـ IP المشبوه
    if (this.blacklistedIPs.has(data.ip)) {
      threatDetected = true;
      threatType = 'blacklisted_ip';
      confidence = 0.95;
    }

    // إنشاء تقرير النتيجة
    const result: AttackDetectionResult = {
      threat: threatDetected,
      threatType,
      confidence,
      source: data.ip || 'unknown',
      timestamp,
      details,
      blocked: confidence > 0.7 // حظر التهديدات عالية الثقة
    };

    if (threatDetected) {
      this.handleThreatDetection(result, userKey);
    }

    return result;
  }

  // فحص الأنماط المحددة
  private checkPattern(pattern: AnomalyPattern, data: any, userKey: string): any {
    const anomalies = this.detectedAnomalies.get(pattern.id) || [];
    const recentAnomalies = anomalies.filter(a => Date.now() - a.timestamp < 3600000); // آخر ساعة

    let detected = false;
    let confidence = 0;
    let details: any = {};

    switch (pattern.pattern) {
      case 'multiple_failed_logins':
        const failedAttempts = recentAnomalies.filter(a => 
          a.userKey === userKey && !a.success
        ).length;
        detected = failedAttempts >= pattern.threshold;
        confidence = Math.min(failedAttempts / pattern.threshold, 1);
        details = { failedAttempts, threshold: pattern.threshold };
        break;

      case 'high_volume_trades':
        const totalVolume = recentAnomalies
          .filter(a => a.userKey === userKey)
          .reduce((sum, a) => sum + (a.amount || 0), 0);
        detected = totalVolume >= pattern.threshold;
        confidence = Math.min(totalVolume / pattern.threshold, 1);
        details = { totalVolume, threshold: pattern.threshold };
        break;

      case 'excessive_requests':
        const requestCount = recentAnomalies.filter(a => 
          a.userKey === userKey
        ).length;
        detected = requestCount >= pattern.threshold;
        confidence = Math.min(requestCount / pattern.threshold, 1);
        details = { requestCount, threshold: pattern.threshold };
        break;

      case 'rapid_page_changes':
        const pageChanges = recentAnomalies.filter(a => 
          a.userKey === userKey && Date.now() - a.timestamp < 60000 // آخر دقيقة
        ).length;
        detected = pageChanges >= pattern.threshold;
        confidence = Math.min(pageChanges / pattern.threshold, 1);
        details = { pageChanges, threshold: pattern.threshold };
        break;

      case 'bulk_data_requests':
        const dataRequests = recentAnomalies.filter(a => 
          a.userKey === userKey && a.dataSize > 1000000 // أكبر من 1MB
        ).length;
        detected = dataRequests >= pattern.threshold;
        confidence = Math.min(dataRequests / pattern.threshold, 1);
        details = { dataRequests, threshold: pattern.threshold };
        break;
    }

    return { detected, confidence, details };
  }

  // كشف البوتات المتقدم
  detectBot(userAgent: string, behaviorData: any): BotDetectionMetrics {
    const fingerprint = this.generateBrowserFingerprint(userAgent, behaviorData);
    let behaviorScore = 0;
    let isBot = false;

    // تحليل نمط الطلبات
    const requestPattern = this.analyzeRequestPattern(behaviorData);
    behaviorScore += this.scoreRequestPattern(requestPattern);

    // تحليل حركة الماوس
    const mouseMovements = behaviorData.mouseMovements || [];
    behaviorScore += this.scoreMouseMovements(mouseMovements);

    // تحليل نمط لوحة المفاتيح
    const keyboardPattern = behaviorData.keyboardPattern || '';
    behaviorScore += this.scoreKeyboardPattern(keyboardPattern);

    // تحليل User Agent
    behaviorScore += this.scoreUserAgent(userAgent);

    // تحليل الوقت بين الأحداث
    behaviorScore += this.scoreTimingPatterns(behaviorData);

    // تحديد ما إذا كان بوت
    const confidence = behaviorScore / 100;
    isBot = confidence > 0.7;

    const metrics: BotDetectionMetrics = {
      browserFingerprint: fingerprint,
      behaviorScore,
      requestPattern,
      mouseMovements,
      keyboardPattern,
      isBot,
      confidence
    };

    this.botDetectionData.set(fingerprint, metrics);

    if (isBot) {
      this.handleBotDetection(metrics);
    }

    return metrics;
  }

  // الحماية من CSRF
  generateCSRFToken(sessionId: string): string {
    const token = this.generateSecureToken(32);
    this.csrfTokens.set(sessionId, token);
    
    // انتهاء صلاحية الرمز بعد ساعة
    setTimeout(() => {
      this.csrfTokens.delete(sessionId);
    }, 3600000);

    return token;
  }

  validateCSRFToken(sessionId: string, token: string): boolean {
    const storedToken = this.csrfTokens.get(sessionId);
    return storedToken === token;
  }

  // الحماية من XSS
  sanitizeInput(input: string, type: 'html' | 'url' | 'script' = 'html'): string {
    if (!input || typeof input !== 'string') return '';

    let sanitized = input;

    switch (type) {
      case 'html':
        // إزالة العلامات الخطيرة
        sanitized = sanitized
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
          .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/vbscript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
        break;

      case 'url':
        // التحقق من صحة الـ URL
        try {
          const url = new URL(sanitized);
          if (!['http:', 'https:'].includes(url.protocol)) {
            sanitized = '';
          }
        } catch {
          sanitized = '';
        }
        break;

      case 'script':
        // إزالة كل الأكواد القابلة للتنفيذ
        sanitized = sanitized
          .replace(/[<>'"]/g, '')
          .replace(/javascript/gi, '')
          .replace(/script/gi, '')
          .replace(/eval/gi, '')
          .replace(/function/gi, '');
        break;
    }

    return sanitized;
  }

  // التحقق المتقدم من البيانات
  validateData(formType: string, data: any): { valid: boolean; errors: string[]; sanitized: any } {
    const rules = this.validationRules.get(formType) || [];
    const errors: string[] = [];
    const sanitized: any = {};

    for (const rule of rules) {
      const value = data[rule.field];
      
      // فحص الحقول المطلوبة
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} مطلوب`);
        continue;
      }

      if (value === undefined || value === null) continue;

      let processedValue = value;

      // تطبيق المنظفات
      for (const sanitizer of rule.sanitizers) {
        processedValue = this.applySanitizer(processedValue, sanitizer);
      }

      // تطبيق المدققات
      for (const validator of rule.validators) {
        const validationResult = this.applyValidator(processedValue, validator, rule);
        if (!validationResult.valid) {
          errors.push(`${rule.field}: ${validationResult.error}`);
        }
      }

      // فحص الطول
      if (rule.minLength && processedValue.length < rule.minLength) {
        errors.push(`${rule.field} يجب أن يكون أطول من ${rule.minLength} أحرف`);
      }
      if (rule.maxLength && processedValue.length > rule.maxLength) {
        errors.push(`${rule.field} يجب أن يكون أقصر من ${rule.maxLength} أحرف`);
      }

      // فحص النمط
      if (rule.pattern && !rule.pattern.test(processedValue)) {
        errors.push(`${rule.field} لا يطابق النمط المطلوب`);
      }

      sanitized[rule.field] = processedValue;
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized
    };
  }

  // تطبيق المنظفات
  private applySanitizer(value: any, sanitizer: string): any {
    switch (sanitizer) {
      case 'trim':
        return typeof value === 'string' ? value.trim() : value;
      case 'toLowerCase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      case 'toUpperCase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      case 'parseFloat':
        return parseFloat(value) || 0;
      case 'parseInt':
        return parseInt(value) || 0;
      default:
        return value;
    }
  }

  // تطبيق المدققات
  private applyValidator(value: any, validator: string, rule: ValidationRule): { valid: boolean; error?: string } {
    switch (validator) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          valid: emailRegex.test(value),
          error: 'عنوان بريد إلكتروني غير صحيح'
        };

      case 'password_strength':
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*]/.test(value);
        return {
          valid: hasUpper && hasLower && hasNumber && hasSpecial,
          error: 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة'
        };

      case 'positive_number':
        return {
          valid: typeof value === 'number' && value > 0,
          error: 'يجب أن يكون رقماً موجباً'
        };

      case 'crypto_address':
        // فحص أساسي لعناوين العملات المشفرة
        const addressRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^0x[a-fA-F0-9]{40}$/;
        return {
          valid: addressRegex.test(value),
          error: 'عنوان عملة مشفرة غير صحيح'
        };

      case 'valid_symbol':
        const symbols = ['BTCUSD', 'ETHUSD', 'ADAUSD', 'DOTUSD', 'SOLUSD'];
        return {
          valid: symbols.includes(value),
          error: 'رمز تداول غير مدعوم'
        };

      default:
        return { valid: true };
    }
  }

  // إعداد تتبع حركة الماوس
  private setupMouseTracking() {
    if (typeof window !== 'undefined') {
      let mouseMovements: Array<{ x: number; y: number; timestamp: number }> = [];
      
      document.addEventListener('mousemove', (e) => {
        mouseMovements.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        });

        // الاحتفاظ بآخر 100 حركة فقط
        if (mouseMovements.length > 100) {
          mouseMovements = mouseMovements.slice(-100);
        }
      });

      // حفظ البيانات كل 30 ثانية
      setInterval(() => {
        if (mouseMovements.length > 0) {
          const fingerprint = this.generateBrowserFingerprint();
          const currentData = this.botDetectionData.get(fingerprint) || {} as BotDetectionMetrics;
          currentData.mouseMovements = [...mouseMovements];
          this.botDetectionData.set(fingerprint, currentData);
        }
      }, 30000);
    }
  }

  // إعداد تتبع لوحة المفاتيح
  private setupKeyboardTracking() {
    if (typeof window !== 'undefined') {
      let keyTimings: number[] = [];
      let lastKeyTime = 0;

      document.addEventListener('keydown', () => {
        const now = Date.now();
        if (lastKeyTime > 0) {
          keyTimings.push(now - lastKeyTime);
        }
        lastKeyTime = now;

        // الاحتفاظ بآخر 50 توقيت
        if (keyTimings.length > 50) {
          keyTimings = keyTimings.slice(-50);
        }
      });

      setInterval(() => {
        if (keyTimings.length > 0) {
          const fingerprint = this.generateBrowserFingerprint();
          const currentData = this.botDetectionData.get(fingerprint) || {} as BotDetectionMetrics;
          currentData.keyboardPattern = keyTimings.join(',');
          this.botDetectionData.set(fingerprint, currentData);
        }
      }, 30000);
    }
  }

  // تحليل السلوك
  private setupBehaviorAnalysis() {
    if (typeof window !== 'undefined') {
      let pageViews = 0;
      let clickCount = 0;
      let scrollEvents = 0;

      // تتبع تغييرات الصفحة
      window.addEventListener('beforeunload', () => pageViews++);
      
      // تتبع النقرات
      document.addEventListener('click', () => clickCount++);
      
      // تتبع التمرير
      window.addEventListener('scroll', () => scrollEvents++);

      setInterval(() => {
        const fingerprint = this.generateBrowserFingerprint();
        const currentData = this.botDetectionData.get(fingerprint) || {} as BotDetectionMetrics;
        currentData.behaviorScore = this.calculateBehaviorScore(pageViews, clickCount, scrollEvents);
        this.botDetectionData.set(fingerprint, currentData);
      }, 60000);
    }
  }

  // حساب نقاط السلوك
  private calculateBehaviorScore(pageViews: number, clickCount: number, scrollEvents: number): number {
    let score = 0;

    // نمط غير طبيعي: الكثير من مشاهدات الصفحة مع قليل من التفاعل
    if (pageViews > 50 && clickCount < 5) score += 30;
    
    // نمط غير طبيعي: الكثير من النقرات بسرعة
    if (clickCount > 100 && pageViews < 5) score += 40;
    
    // نمط غير طبيعي: عدم وجود تمرير
    if (pageViews > 10 && scrollEvents === 0) score += 25;

    return score;
  }

  // إنشاء بصمة المتصفح
  private generateBrowserFingerprint(userAgent?: string, extraData?: any): string {
    if (typeof window === 'undefined') return 'server-side';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 0, 0);
    const canvasFingerprint = canvas.toDataURL();

    const fingerprint = {
      userAgent: userAgent || navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvasFingerprint.slice(-20),
      ...extraData
    };

    return btoa(JSON.stringify(fingerprint)).slice(0, 32);
  }

  // تسجيل الشذوذ
  private logAnomaly(patternId: string, userKey: string, data: any, anomalyResult: any) {
    const anomalies = this.detectedAnomalies.get(patternId) || [];
    anomalies.push({
      userKey,
      timestamp: Date.now(),
      data,
      result: anomalyResult
    });
    this.detectedAnomalies.set(patternId, anomalies);
  }

  // معالجة اكتشاف التهديد
  private handleThreatDetection(result: AttackDetectionResult, userKey: string) {
    // تسجيل الحدث الأمني
    this.logSecurityEvent({
      id: this.generateSecureToken(16),
      type: 'threat_detected',
      severity: result.confidence > 0.8 ? 'critical' : 'warning',
      source: result.source,
      description: `تم اكتشاف تهديد: ${result.threatType}`,
      data: result,
      timestamp: Date.now(),
      ip: result.source,
      userAgent: 'unknown'
    });

    // إضافة IP للقائمة السوداء إذا كان التهديد عالي
    if (result.confidence > 0.8) {
      this.blacklistedIPs.add(result.source);
    }

    // زيادة عداد الأنشطة المشبوهة
    const current = this.suspiciousActivities.get(userKey) || 0;
    this.suspiciousActivities.set(userKey, current + 1);

    console.log(`🚨 تم اكتشاف تهديد: ${result.threatType} (${result.confidence})`);
  }

  // معالجة اكتشاف البوت
  private handleBotDetection(metrics: BotDetectionMetrics) {
    this.logSecurityEvent({
      id: this.generateSecureToken(16),
      type: 'bot_detected',
      severity: 'warning',
      source: 'behavior_analysis',
      description: 'تم اكتشاف نشاط بوت',
      data: metrics,
      timestamp: Date.now(),
      ip: 'unknown',
      userAgent: 'unknown'
    });

    console.log(`🤖 تم اكتشاف بوت: ${metrics.confidence}`);
  }

  // تحليل الأنماط
  private analyzeAnomalies() {
    // تحليل الاتجاهات والأنماط المشبوهة
    for (const [patternId, anomalies] of this.detectedAnomalies) {
      const recentAnomalies = anomalies.filter(a => Date.now() - a.timestamp < 3600000);
      
      if (recentAnomalies.length > 10) {
        console.log(`⚠️ نمط مشبوه متكرر: ${patternId}`);
      }
    }
  }

  // تحديث مستوى التهديد
  private updateThreatLevel() {
    const totalThreats = this.securityEvents
      .filter(event => Date.now() - event.timestamp < 3600000)
      .length;

    let threatLevel = 'low';
    if (totalThreats > 50) threatLevel = 'critical';
    else if (totalThreats > 20) threatLevel = 'high';
    else if (totalThreats > 10) threatLevel = 'medium';

    console.log(`🎯 مستوى التهديد الحالي: ${threatLevel}`);
  }

  // تنظيف البيانات القديمة
  private cleanupOldData() {
    const oneDayAgo = Date.now() - 86400000;
    
    // تنظيف الأحداث الأمنية القديمة
    this.securityEvents = this.securityEvents.filter(event => event.timestamp > oneDayAgo);
    
    // تنظيف بيانات الشذوذ القديمة
    for (const [patternId, anomalies] of this.detectedAnomalies) {
      const recentAnomalies = anomalies.filter(a => a.timestamp > oneDayAgo);
      this.detectedAnomalies.set(patternId, recentAnomalies);
    }
  }

  // تسجيل الأحداث الأمنية
  private logSecurityEvent(event: SecurityEvent) {
    this.securityEvents.push(event);
    
    // حفظ في التخزين المحلي للمراجعة
    localStorage.setItem(
      `security_event_${event.id}`,
      JSON.stringify(event)
    );
  }

  // إنشاء رمز آمن
  private generateSecureToken(length: number = 32): string {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // fallback for server-side
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // دوال مساعدة لتحليل الأنماط
  private analyzeRequestPattern(behaviorData: any): string {
    // تحليل نمط الطلبات
    return 'normal'; // مبسط للتطوير
  }

  private scoreRequestPattern(pattern: string): number {
    return pattern === 'suspicious' ? 30 : 0;
  }

  private scoreMouseMovements(movements: Array<{ x: number; y: number; timestamp: number }>): number {
    if (movements.length < 10) return 25; // قليل جداً من حركة الماوس
    
    // فحص حركة الماوس المتكررة أو غير الطبيعية
    const uniquePositions = new Set(movements.map(m => `${m.x},${m.y}`));
    if (uniquePositions.size < movements.length * 0.5) return 20; // حركة متكررة
    
    return 0;
  }

  private scoreKeyboardPattern(pattern: string): number {
    if (!pattern) return 15; // عدم وجود نشاط لوحة مفاتيح
    
    const timings = pattern.split(',').map(Number);
    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    
    // أوقات متساوية جداً تشير لبوت
    if (avgTiming < 50 || avgTiming > 2000) return 25;
    
    return 0;
  }

  private scoreUserAgent(userAgent: string): number {
    // فحص User Agents المشبوهة
    const botKeywords = ['bot', 'crawler', 'spider', 'scraper'];
    for (const keyword of botKeywords) {
      if (userAgent.toLowerCase().includes(keyword)) return 40;
    }
    
    // فحص User Agents غير شائعة
    if (userAgent.length < 50 || userAgent.length > 500) return 15;
    
    return 0;
  }

  private scoreTimingPatterns(behaviorData: any): number {
    // فحص أنماط التوقيت غير الطبيعية
    const requests = behaviorData.requests || [];
    if (requests.length < 2) return 0;
    
    const intervals = [];
    for (let i = 1; i < requests.length; i++) {
      intervals.push(requests[i].timestamp - requests[i-1].timestamp);
    }
    
    // فترات متساوية جداً تشير لبوت
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    
    if (variance < 100) return 30; // تباين قليل جداً
    
    return 0;
  }

  // الحصول على إحصائيات الأمان
  getSecurityStats() {
    const oneHourAgo = Date.now() - 3600000;
    const recentEvents = this.securityEvents.filter(event => event.timestamp > oneHourAgo);
    
    return {
      totalEvents: this.securityEvents.length,
      recentEvents: recentEvents.length,
      threatsBlocked: recentEvents.filter(e => e.type === 'threat_detected').length,
      botsDetected: recentEvents.filter(e => e.type === 'bot_detected').length,
      blacklistedIPs: this.blacklistedIPs.size,
      activeAnomalies: Array.from(this.detectedAnomalies.values()).reduce((sum, anomalies) => 
        sum + anomalies.filter(a => Date.now() - a.timestamp < 3600000).length, 0
      ),
      suspiciousUsers: this.suspiciousActivities.size
    };
  }

  // إعادة تعيين أمني
  securityReset() {
    this.detectedAnomalies.clear();
    this.securityEvents.length = 0;
    this.suspiciousActivities.clear();
    this.blacklistedIPs.clear();
    this.botDetectionData.clear();
    console.log('🔄 تم إعادة تعيين أنظمة الأمان');
  }
}

export const attackPreventionService = new AttackPreventionService();
