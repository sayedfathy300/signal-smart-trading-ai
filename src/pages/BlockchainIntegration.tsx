
import React from 'react';
import { Coins, Link, Shield, Zap } from 'lucide-react';

const BlockchainIntegration = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          تكامل البلوك تشين
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Coins className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">العملات المدعومة</h3>
            <p className="text-2xl font-bold text-yellow-400">15</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Link className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">الشبكات المتصلة</h3>
            <p className="text-2xl font-bold text-blue-400">8</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">العقود الذكية</h3>
            <p className="text-2xl font-bold text-green-400">نشط</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg text-center">
            <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">DeFi بروتوكولات</h3>
            <p className="text-2xl font-bold text-purple-400">12</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">العملات المشفرة المدعومة</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                    ₿
                  </div>
                  <span>Bitcoin (BTC)</span>
                </div>
                <span className="text-green-400">متصل</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                    Ξ
                  </div>
                  <span>Ethereum (ETH)</span>
                </div>
                <span className="text-green-400">متصل</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">
                    ◉
                  </div>
                  <span>Binance Smart Chain</span>
                </div>
                <span className="text-green-400">متصل</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    ◎
                  </div>
                  <span>Solana (SOL)</span>
                </div>
                <span className="text-yellow-400">قيد الاتصال</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">إحصائيات التداول</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>حجم التداول اليومي</span>
                  <span className="text-green-400">$2.4M</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>رسوم المعاملات</span>
                  <span className="text-blue-400">0.025%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>سرعة التنفيذ</span>
                  <span className="text-purple-400">2.3s</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>موثوقية الشبكة</span>
                  <span className="text-yellow-400">99.8%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{width: '99.8%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainIntegration;
