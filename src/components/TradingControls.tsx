
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  PauseCircle, 
  BarChart 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradingControlsProps {
  onStart: () => void;
  onStop: () => void;
  onSimulate: () => void;
  isRunning: boolean;
  className?: string;
  lang?: 'en' | 'ar';
}

export function TradingControls({ 
  onStart, 
  onStop, 
  onSimulate, 
  isRunning, 
  className,
  lang = 'en'
}: TradingControlsProps) {
  return (
    <div className={cn("flex gap-3", className, lang === 'ar' ? 'rtl' : 'ltr')}>
      {!isRunning ? (
        <Button 
          onClick={onStart} 
          className="bg-trading-primary hover:bg-blue-600 text-white"
        >
          <Play className="mr-2 h-4 w-4" />
          {lang === 'en' ? 'Start Trading' : 'بدء التداول'}
        </Button>
      ) : (
        <Button 
          onClick={onStop} 
          variant="destructive"
        >
          <PauseCircle className="mr-2 h-4 w-4" />
          {lang === 'en' ? 'Stop Trading' : 'إيقاف التداول'}
        </Button>
      )}
      
      <Button 
        onClick={onSimulate} 
        variant="outline"
      >
        <BarChart className="mr-2 h-4 w-4" />
        {lang === 'en' ? 'Simulate' : 'محاكاة'}
      </Button>
    </div>
  );
}
