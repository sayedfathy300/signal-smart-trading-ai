
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CandlestickChartProps {
  title: string;
  className?: string;
  lang?: 'en' | 'ar';
}

export function CandlestickChart({ title, className, lang = 'en' }: CandlestickChartProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className={cn("pb-2", lang === 'ar' ? 'rtl' : 'ltr')}>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full flex items-center justify-center text-trading-light">
          <div className="text-center">
            <p>{lang === 'en' ? 'Chart data will be displayed here' : 'سيتم عرض بيانات الرسم البياني هنا'}</p>
            <div className="mt-4 h-[200px] bg-trading-secondary rounded-md animate-pulse-light"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
