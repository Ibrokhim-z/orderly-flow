import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  waiting: { label: 'Waiting', className: 'status-waiting' },
  accepted: { label: 'Accepted', className: 'status-accepted' },
  in_progress: { label: 'In Progress', className: 'status-in-progress' },
  done: { label: 'Done', className: 'status-done' },
  delivered: { label: 'Delivered', className: 'status-delivered' },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
};
