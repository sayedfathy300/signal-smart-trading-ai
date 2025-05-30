
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SidebarProvider } from '@/components/ui/sidebar';

export function AppLayout() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  
  // Set the lang attribute on the html element for proper font family selection
  React.useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-trading-bg">
        <AppSidebar lang={lang} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b border-gray-800 p-4 bg-trading-card flex justify-end items-center">
            <LanguageSwitcher currentLang={lang} setLang={setLang} />
          </header>
          <main className="flex-1 overflow-auto bg-trading-bg">
            <Outlet context={{ lang }} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
