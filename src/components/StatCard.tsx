
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isUp?: boolean;
  icon?: React.ReactNode;
  className?: string;
  lang?: 'en' | 'ar';
}

export function StatCard({ 
  title, 
  value, 
  change, 
  isUp = true, 
  icon,
  className,
  lang = 'en'
}: StatCardProps) {
  return (
    <Card className={cn("shadow-sm animated-element", className)}>
      <CardContent className="p-4">
        <div className={cn("flex justify-between items-start", lang === 'ar' ? 'rtl' : 'ltr')}>
          <div>
            <p className="text-sm text-trading-light font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && (
              <p className={cn(
                "text-sm mt-1 flex items-center",
                isUp ? "text-trading-up" : "text-trading-down"
              )}>
                {isUp ? '↑' : '↓'} {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-trading-primary rounded-full p-2 bg-blue-50">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
