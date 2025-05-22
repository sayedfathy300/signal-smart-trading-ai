
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MarketItem {
  id: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
}

interface MarketOverviewProps {
  title: string;
  items: MarketItem[];
  className?: string;
  lang?: 'en' | 'ar';
}

export function MarketOverview({ title, items, className, lang = 'en' }: MarketOverviewProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className={cn("pb-2", lang === 'ar' ? 'rtl' : 'ltr')}>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("space-y-2", lang === 'ar' ? 'rtl' : 'ltr')}>
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-2 hover:bg-trading-secondary rounded-md transition-colors animated-element"
            >
              <span className="font-medium">{item.name}</span>
              <div>
                <div className="text-right font-medium">{item.price}</div>
                <div className={cn(
                  "text-sm",
                  item.isUp ? "text-trading-up" : "text-trading-down"
                )}>
                  {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
