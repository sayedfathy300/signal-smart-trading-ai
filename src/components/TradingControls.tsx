
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  PauseCircle, 
  BarChart, 
  Settings,
  Bot,
  TrendingUp,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradingControlsProps {
  onStart: () => void;
  onStop: () => void;
  onSimulate: () => void;
  onOpenBot: () => void;
  onOpenPlatform?: () => void;
  isRunning: boolean;
  className?: string;
  lang?: 'en' | 'ar';
}

export function TradingControls({ 
  onStart, 
  onStop, 
  onSimulate, 
  onOpenBot,
  onOpenPlatform,
  isRunning, 
  className,
  lang = 'en'
}: TradingControlsProps) {
  return (
    <div className={cn("flex gap-3 flex-wrap", className, lang === 'ar' ? 'rtl' : 'ltr')}>
      {!isRunning ? (
        <Button 
          onClick={onStart} 
          className="bg-trading-primary hover:bg-blue-600 text-white flex-1 min-w-[140px]"
        >
          <Play className="ml-2 h-4 w-4" />
          {lang === 'en' ? 'Start Trading' : 'بدء التداول'}
        </Button>
      ) : (
        <Button 
          onClick={onStop} 
          variant="destructive"
          className="flex-1 min-w-[140px]"
        >
          <PauseCircle className="ml-2 h-4 w-4" />
          {lang === 'en' ? 'Stop Trading' : 'إيقاف التداول'}
        </Button>
      )}
      
      <Button 
        onClick={onSimulate} 
        variant="outline"
        className="flex-1 min-w-[120px] border-trading-up text-trading-up hover:bg-trading-up hover:text-white"
      >
        <BarChart className="ml-2 h-4 w-4" />
        {lang === 'en' ? 'Simulate' : 'محاكاة'}
      </Button>

      <Button 
        onClick={onOpenBot} 
        className="bg-purple-600 hover:bg-purple-700 text-white flex-1 min-w-[120px]"
      >
        <Bot className="ml-2 h-4 w-4" />
        {lang === 'en' ? 'AI Bot' : 'بوت الذكاء'}
      </Button>

      {onOpenPlatform && (
        <Button 
          onClick={onOpenPlatform} 
          className="bg-orange-600 hover:bg-orange-700 text-white flex-1 min-w-[140px]"
        >
          <Zap className="ml-2 h-4 w-4" />
          {lang === 'en' ? 'Trading Platform' : 'منصة التداول'}
        </Button>
      )}
    </div>
  );
}
