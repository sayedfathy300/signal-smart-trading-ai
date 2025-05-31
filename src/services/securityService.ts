
import * as rs from 'jsrsasign';

// Browser-compatible TOTP implementation
class BrowserTOTP {
  private static base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  static generateSecret(length: number = 32): string {
    const buffer = new Uint8Array(length);
    crypto.getRandomValues(buffer);
    let result = '';
    for (let i = 0; i < buffer.length; i++) {
      result += this.base32Chars[buffer[i] % 32];
    }
    return result;
  }

  static async generateTOTP(secret: string, timeStep: number = 30): Promise<string> {
    const key = this.base32ToBytes(secret);
    const time = Math.floor(Date.now() / 1000 / timeStep);
    const timeBytes = new ArrayBuffer(8);
    const timeView = new DataView(timeBytes);
    timeView.setUint32(4, time, false);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, timeBytes);
    const hmac = new Uint8Array(signature);
    
    const offset = hmac[19] & 0xf;
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    ) % 1000000;

    return code.toString().padStart(6, '0');
  }

  static async verifyTOTP(token: string, secret: string, window: number = 2): Promise<boolean> {
    const timeStep = 30;
    const currentTime = Math.floor(Date.now() / 1000 / timeStep);
    
    for (let i = -window; i <= window; i++) {
      const time = currentTime + i;
      const timeBytes = new ArrayBuffer(8);
      const timeView = new DataView(timeBytes);
      timeView.setUint32(4, time, false);

      const key = this.base32ToBytes(secret);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, timeBytes);
      const hmac = new Uint8Array(signature);
      
      const offset = hmac[19] & 0xf;
      const code = (
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff)
      ) % 1000000;

      if (code.toString().padStart(6, '0') === token) {
        return true;
      }
    }
    return false;
  }

  private static base32ToBytes(base32: string): Uint8Array {
    const cleanedBase32 = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
    const bytes = new Uint8Array(Math.floor(cleanedBase32.length * 5 / 8));
    let index = 0;
    let bits = 0;
    let value = 0;

    for (let i = 0; i < cleanedBase32.length; i++) {
      const char = cleanedBase32[i];
      const charIndex = this.base32Chars.indexOf(char);
      
      if (charIndex === -1) continue;
      
      value = (value << 5) | charIndex;
      bits += 5;
      
      if (bits >= 8) {
        bytes[index++] = (value >>> (bits - 8)) & 255;
        bits -= 8;
      }
    }
    
    return bytes;
  }
}

export interface SecurityMetrics {
  encryptionStatus: 'active' | 'inactive';
  mfaEnabled: boolean;
  apiRateLimit: {
    current: number;
    limit: number;
    remaining: number;
    resetTime: number;
  };
  sessionSecurity: {
    active: boolean;
    expiryTime: number;
    lastActivity: number;
  };
  digitalSignature: {
    verified: boolean;
    algorithm: string;
    timestamp: number;
  };
}

export interface EncryptionResult {
  encrypted: string;
  iv: string;
  tag: string;
}

export interface MFASetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface DigitalSignature {
  signature: string;
  publicKey: string;
  algorithm: string;
  timestamp: number;
}

export interface APIRateLimit {
  endpoint: string;
  limit: number;
  window: number;
  requests: Array<{
    timestamp: number;
    ip: string;
    userId?: string;
  }>;
}

class SecurityService {
  private encryptionKey: CryptoKey | null = null;
  private mfaSecrets: Map<string, string> = new Map();
  private rateLimits: Map<string, APIRateLimit> = new Map();
  private activeSessions: Map<string, any> = new Map();
  private keyPairs: Map<string, CryptoKeyPair> = new Map();

  constructor() {
    this.initializeRateLimits();
  }

  // تهيئة حدود معدل API
  private initializeRateLimits() {
    const endpoints = [
      { endpoint: '/api/trading/execute', limit: 100, window: 60000 }, // 100 requests per minute
      { endpoint: '/api/market/data', limit: 1000, window: 60000 }, // 1000 requests per minute
      { endpoint: '/api/portfolio/balance', limit: 50, window: 60000 }, // 50 requests per minute
      { endpoint: '/api/auth/login', limit: 5, window: 300000 }, // 5 attempts per 5 minutes
      { endpoint: '/api/withdraw', limit: 3, window: 3600000 } // 3 withdrawals per hour
    ];

    endpoints.forEach(config => {
      this.rateLimits.set(config.endpoint, {
        ...config,
        requests: []
      });
    });
  }

  // تشفير AES-256 باستخدام Web Crypto API
  async generateEncryptionKey(): Promise<CryptoKey> {
    if (this.encryptionKey) return this.encryptionKey;

    this.encryptionKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    console.log('🔐 تم إنشاء مفتاح التشفير AES-256');
    return this.encryptionKey;
  }

  // تشفير البيانات
  async encryptData(data: string): Promise<EncryptionResult> {
    try {
      const key = await this.generateEncryptionKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);

      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        encodedData
      );

      const encryptedArray = new Uint8Array(encrypted);
      const tag = encryptedArray.slice(-16); // آخر 16 بايت للمصادقة
      const ciphertext = encryptedArray.slice(0, -16);

      return {
        encrypted: this.arrayBufferToBase64(ciphertext),
        iv: this.arrayBufferToBase64(iv),
        tag: this.arrayBufferToBase64(tag)
      };
    } catch (error) {
      console.error('خطأ في التشفير:', error);
      throw new Error('فشل في تشفير البيانات');
    }
  }

  // فك تشفير البيانات
  async decryptData(encryptionResult: EncryptionResult): Promise<string> {
    try {
      const key = await this.generateEncryptionKey();
      const iv = this.base64ToArrayBuffer(encryptionResult.iv);
      const ciphertext = this.base64ToArrayBuffer(encryptionResult.encrypted);
      const tag = this.base64ToArrayBuffer(encryptionResult.tag);

      // دمج النص المشفر مع العلامة
      const encryptedWithTag = new Uint8Array(ciphertext.byteLength + tag.byteLength);
      encryptedWithTag.set(new Uint8Array(ciphertext));
      encryptedWithTag.set(new Uint8Array(tag), ciphertext.byteLength);

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        encryptedWithTag
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('خطأ في فك التشفير:', error);
      throw new Error('فشل في فك تشفير البيانات');
    }
  }

  // Updated MFA methods using browser-compatible TOTP
  setupMFA(userId: string): MFASetup {
    try {
      const secret = BrowserTOTP.generateSecret(32);
      this.mfaSecrets.set(userId, secret);

      const backupCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );

      const issuer = 'AI Trading Platform';
      const accountName = `Trading Platform (${userId})`;
      const qrCodeUrl = `otpauth://totp/${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

      console.log(`🔒 تم إعداد MFA للمستخدم: ${userId}`);

      return {
        secret,
        qrCode: qrCodeUrl,
        backupCodes
      };
    } catch (error) {
      console.error('خطأ في إعداد MFA:', error);
      throw new Error('فشل في إعداد المصادقة متعددة العوامل');
    }
  }

  async verifyMFA(userId: string, token: string): Promise<boolean> {
    try {
      const secret = this.mfaSecrets.get(userId);
      if (!secret) {
        throw new Error('لم يتم العثور على سر MFA للمستخدم');
      }

      const verified = await BrowserTOTP.verifyTOTP(token, secret, 2);
      console.log(`🔐 تحقق MFA للمستخدم ${userId}: ${verified ? 'نجح' : 'فشل'}`);
      return verified;
    } catch (error) {
      console.error('خطأ في التحقق من MFA:', error);
      return false;
    }
  }

  // إنشاء زوج مفاتيح للتوقيع الرقمي
  async generateKeyPair(userId: string): Promise<{publicKey: string, privateKey: string}> {
    try {
      // إنشاء زوج مفاتيح RSA
      const keyPair = rs.KEYUTIL.generateKeypair("RSA", 2048);
      
      this.keyPairs.set(userId, keyPair as any);

      const publicKeyPem = rs.KEYUTIL.getPEM(keyPair.pubKeyObj);
      const privateKeyPem = rs.KEYUTIL.getPEM(keyPair.prvKeyObj, "PKCS1PRV");

      console.log(`🔑 تم إنشاء زوج مفاتيح للمستخدم: ${userId}`);

      return {
        publicKey: publicKeyPem,
        privateKey: privateKeyPem
      };
    } catch (error) {
      console.error('خطأ في إنشاء زوج المفاتيح:', error);
      throw new Error('فشل في إنشاء زوج المفاتيح');
    }
  }

  // إنشاء توقيع رقمي
  createDigitalSignature(userId: string, data: string, privateKeyPem?: string): DigitalSignature {
    try {
      const timestamp = Date.now();
      const dataToSign = `${data}|${timestamp}`;

      // إنشاء التوقيع باستخدام RSA-SHA256
      const signature = new rs.KJUR.crypto.Signature({alg: "SHA256withRSA"});
      
      let privateKey;
      if (privateKeyPem) {
        privateKey = rs.KEYUTIL.getKey(privateKeyPem);
      } else {
        const keyPair = this.keyPairs.get(userId);
        if (!keyPair) throw new Error('لم يتم العثور على مفتاح خاص للمستخدم');
        privateKey = (keyPair as any).prvKeyObj;
      }

      signature.init(privateKey);
      signature.updateString(dataToSign);
      const signatureHex = signature.sign();

      const publicKeyPem = privateKeyPem ? 
        rs.KEYUTIL.getPEM(rs.KEYUTIL.getKey(privateKeyPem, "pkcs1")) :
        rs.KEYUTIL.getPEM((this.keyPairs.get(userId) as any)?.pubKeyObj);

      console.log(`✍️ تم إنشاء توقيع رقمي للمستخدم: ${userId}`);

      return {
        signature: signatureHex,
        publicKey: publicKeyPem,
        algorithm: 'SHA256withRSA',
        timestamp
      };
    } catch (error) {
      console.error('خطأ في إنشاء التوقيع الرقمي:', error);
      throw new Error('فشل في إنشاء التوقيع الرقمي');
    }
  }

  // التحقق من التوقيع الرقمي
  verifyDigitalSignature(data: string, signature: DigitalSignature): boolean {
    try {
      const dataToVerify = `${data}|${signature.timestamp}`;
      
      const verifier = new rs.KJUR.crypto.Signature({alg: signature.algorithm});
      const publicKey = rs.KEYUTIL.getKey(signature.publicKey);
      
      verifier.init(publicKey);
      verifier.updateString(dataToVerify);
      const isValid = verifier.verify(signature.signature);

      console.log(`🔍 تحقق التوقيع الرقمي: ${isValid ? 'صحيح' : 'غير صحيح'}`);
      return isValid;
    } catch (error) {
      console.error('خطأ في التحقق من التوقيع الرقمي:', error);
      return false;
    }
  }

  // فحص حدود معدل API
  checkRateLimit(endpoint: string, clientIP: string, userId?: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const config = this.rateLimits.get(endpoint);
    if (!config) {
      return { allowed: true, remaining: Infinity, resetTime: 0 };
    }

    const now = Date.now();
    const windowStart = now - config.window;

    // تنظيف الطلبات القديمة
    config.requests = config.requests.filter(req => req.timestamp > windowStart);

    const currentRequests = config.requests.length;
    const remaining = Math.max(0, config.limit - currentRequests);
    const allowed = currentRequests < config.limit;

    if (allowed) {
      // إضافة الطلب الحالي
      config.requests.push({
        timestamp: now,
        ip: clientIP,
        userId
      });
    }

    const resetTime = windowStart + config.window;

    console.log(`🚦 فحص حد المعدل ${endpoint}: ${allowed ? 'مسموح' : 'مرفوض'} (${remaining} متبقي)`);

    return {
      allowed,
      remaining,
      resetTime
    };
  }

  // إدارة الجلسات الآمنة
  createSecureSession(userId: string, duration: number = 3600000): string {
    const sessionId = this.generateSecureToken();
    const session = {
      userId,
      created: Date.now(),
      expires: Date.now() + duration,
      lastActivity: Date.now(),
      ipAddress: '127.0.0.1', // سيتم تحديثه في التطبيق الحقيقي
      userAgent: navigator.userAgent
    };

    this.activeSessions.set(sessionId, session);
    console.log(`🎫 تم إنشاء جلسة آمنة للمستخدم: ${userId}`);
    
    return sessionId;
  }

  // التحقق من صحة الجلسة
  validateSession(sessionId: string): { valid: boolean; userId?: string } {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return { valid: false };
    }

    const now = Date.now();
    if (now > session.expires) {
      this.activeSessions.delete(sessionId);
      console.log(`⏰ انتهت صلاحية الجلسة: ${sessionId}`);
      return { valid: false };
    }

    // تحديث آخر نشاط
    session.lastActivity = now;
    this.activeSessions.set(sessionId, session);

    return { valid: true, userId: session.userId };
  }

  // إلغاء الجلسة
  invalidateSession(sessionId: string): void {
    this.activeSessions.delete(sessionId);
    console.log(`🚪 تم إلغاء الجلسة: ${sessionId}`);
  }

  // إنشاء رمز آمن
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // تدقيق الأنشطة الأمنية
  auditSecurityEvent(event: string, userId?: string, details?: any): void {
    const auditLog = {
      timestamp: new Date().toISOString(),
      event,
      userId,
      details,
      ip: '127.0.0.1', // سيتم تحديثه في التطبيق الحقيقي
      userAgent: navigator.userAgent
    };

    console.log('🔍 حدث أمني:', auditLog);
    
    // في التطبيق الحقيقي، سيتم حفظ هذا في قاعدة البيانات
    localStorage.setItem(
      `security_audit_${Date.now()}`, 
      JSON.stringify(auditLog)
    );
  }

  // الحصول على مقاييس الأمان
  getSecurityMetrics(): SecurityMetrics {
    const now = Date.now();
    const activeSessions = Array.from(this.activeSessions.values())
      .filter(session => session.expires > now);

    return {
      encryptionStatus: this.encryptionKey ? 'active' : 'inactive',
      mfaEnabled: this.mfaSecrets.size > 0,
      apiRateLimit: {
        current: 0,
        limit: 1000,
        remaining: 1000,
        resetTime: now + 60000
      },
      sessionSecurity: {
        active: activeSessions.length > 0,
        expiryTime: activeSessions[0]?.expires || 0,
        lastActivity: activeSessions[0]?.lastActivity || 0
      },
      digitalSignature: {
        verified: this.keyPairs.size > 0,
        algorithm: 'SHA256withRSA',
        timestamp: now
      }
    };
  }

  // محاكاة اختبار الاختراق
  async runPenetrationTest(): Promise<{
    vulnerabilities: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      recommendation: string;
    }>;
    score: number;
  }> {
    console.log('🔍 تشغيل اختبار الاختراق...');

    const vulnerabilities = [
      {
        severity: 'low' as const,
        description: 'عدم وجود تدوير دوري لمفاتيح التشفير',
        recommendation: 'تنفيذ تدوير مفاتيح كل 90 يوم'
      },
      {
        severity: 'medium' as const,
        description: 'عدم وجود حماية من هجمات البروت فورس المتقدمة',
        recommendation: 'تنفيذ تأخير متزايد وحظر IP'
      }
    ];

    const score = Math.max(0, 100 - (vulnerabilities.length * 10));

    return { vulnerabilities, score };
  }

  // تنظيف البيانات الحساسة من الذاكرة
  secureCleanup(): void {
    this.mfaSecrets.clear();
    this.keyPairs.clear();
    this.activeSessions.clear();
    this.encryptionKey = null;
    
    console.log('🧹 تم تنظيف البيانات الحساسة من الذاكرة');
  }

  // دوال مساعدة
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export const securityService = new SecurityService();
