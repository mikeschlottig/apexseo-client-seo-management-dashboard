import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: number;
  changeType?: 'increase' | 'decrease';
  description?: string;
  isLoading?: boolean;
}
export function StatCard({ title, value, icon: Icon, change, changeType, description, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-6" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mt-1" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold transition-all duration-300 hover:bg-gradient-to-r hover:from-primary hover:to-chart-2 hover:bg-clip-text hover:text-transparent">
          {value}
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          {change && changeType && (
            <span className={cn(
              "flex items-center mr-2",
              changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'
            )}>
              {changeType === 'increase' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {change.toFixed(1)}%
            </span>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}