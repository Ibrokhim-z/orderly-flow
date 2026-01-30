import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  waiting: { label: 'Ожидание', className: 'status-waiting' },
  accepted: { label: 'Принят', className: 'status-accepted' },
  in_progress: { label: 'В работе', className: 'status-in-progress' },
  done: { label: 'Готов', className: 'status-done' },
  delivered: { label: 'Доставлен', className: 'status-delivered' },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
};