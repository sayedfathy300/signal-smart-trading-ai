
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface AppLayoutProps {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  children?: React.ReactNode;
}

export function AppLayout({ lang, setLang, children }: AppLayoutProps) {
  console.log('AppLayout rendering, lang:', lang);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white w-full">
      <header className="bg-slate-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-slate-700" />
            <h1 className="text-xl font-bold text-white">
              {lang === 'ar' ? 'منصة التداول الذكي' : 'AI Trading Platform'}
            </h1>
          </div>
          <LanguageSwitcher currentLang={lang} setLang={setLang} />
        </div>
      </header>
      
      <main className="flex-1 p-6 bg-slate-900">
        {children || <Outlet context={{ lang }} />}
      </main>
    </div>
  );
}
