
import React, { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  
  // Set the lang attribute on the html element for proper font family selection
  React.useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar lang={lang} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b p-4 bg-white flex justify-end items-center">
            <LanguageSwitcher currentLang={lang} setLang={setLang} />
          </header>
          <main className="flex-1 overflow-auto">
            {/* Pass the language to all child components */}
            {React.cloneElement(children as React.ReactElement, { lang })}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
