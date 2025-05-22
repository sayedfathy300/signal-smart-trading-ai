
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  currentLang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

export function LanguageSwitcher({ currentLang, setLang }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLang('en')}
        className={cn(
          "text-sm font-medium",
          currentLang === 'en' 
            ? "text-trading-primary" 
            : "text-trading-light hover:text-trading-dark"
        )}
      >
        English
      </Button>
      <span className="text-trading-light">|</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLang('ar')}
        className={cn(
          "text-sm font-medium",
          currentLang === 'ar' 
            ? "text-trading-primary" 
            : "text-trading-light hover:text-trading-dark"
        )}
      >
        العربية
      </Button>
    </div>
  );
}
