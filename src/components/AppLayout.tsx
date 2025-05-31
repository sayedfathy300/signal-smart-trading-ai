
import React from 'react';
import { Outlet } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface AppLayoutProps {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

export function AppLayout({ lang, setLang }: AppLayoutProps) {
  console.log('AppLayout rendering, lang:', lang);

  return (
    <div className="flex flex-col min-h-screen bg-trading-bg">
      <header className="bg-trading-card border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">
              {lang === 'ar' ? 'منصة التداول الذكي' : 'AI Trading Platform'}
            </h1>
          </div>
          <LanguageSwitcher currentLang={lang} setLang={setLang} />
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
