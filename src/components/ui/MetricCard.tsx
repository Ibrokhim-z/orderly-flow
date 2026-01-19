import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'profit' | 'expense' | 'cash' | 'sales';
  className?: string;
}

const variantStyles = {
  default: 'text-foreground',
  profit: 'text-financial-profit',
  expense: 'text-financial-expense',
  cash: 'text-financial-cash',
  sales: 'text-financial-sales',
};

const variantBgStyles = {
  default: 'bg-secondary',
  profit: 'bg-financial-profit-bg',
  expense: 'bg-financial-expense-bg',
  cash: 'bg-financial-cash-bg',
  sales: 'bg-financial-sales-bg',
};

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}: MetricCardProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={cn('metric-card animate-fade-in', className)}>
      <div className="flex items-start justify-between mb-4">
        <span className="metric-label">{title}</span>
        {icon && (
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', variantBgStyles[variant])}>
            <div className={variantStyles[variant]}>{icon}</div>
          </div>
        )}
      </div>
      
      <div className={cn('metric-value', variantStyles[variant])}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className="flex items-center justify-between mt-2">
        {subtitle && (
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        )}
        {trend && trendValue && (
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium',
            trend === 'up' && 'text-financial-profit',
            trend === 'down' && 'text-financial-expense',
            trend === 'neutral' && 'text-muted-foreground'
          )}>
            <TrendIcon className="w-4 h-4" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};
