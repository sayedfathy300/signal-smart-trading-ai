
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function AppLayout() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  
  // Set the lang attribute on the html element for proper font family selection
  React.useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="border-b border-gray-800 p-4 bg-trading-card flex justify-end items-center">
        <LanguageSwitcher currentLang={lang} setLang={setLang} />
      </header>
      <main className="flex-1 overflow-auto bg-trading-bg">
        <Outlet context={{ lang }} />
      </main>
    </div>
  );
}
