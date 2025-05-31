
import React from 'react';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  currentLang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

export function LanguageSwitcher({ currentLang, setLang }: LanguageSwitcherProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentLang === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLang('ar')}
        className="text-sm"
      >
        العربية
      </Button>
      <Button
        variant={currentLang === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLang('en')}
        className="text-sm"
      >
        English
      </Button>
    </div>
  );
}
