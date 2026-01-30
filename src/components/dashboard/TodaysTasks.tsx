import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Clock, AlertCircle } from 'lucide-react';
import { format, isToday, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TodaysTasksProps {
  orders: Order[];
}

export const TodaysTasks = ({ orders }: TodaysTasksProps) => {
  const activeOrders = orders.filter(
    (o) => o.status !== 'done' && o.status !== 'delivered'
  );

  const urgentOrders = activeOrders.filter(
    (o) => isToday(new Date(o.deadline)) || isBefore(new Date(o.deadline), new Date())
  );

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Активные заказы на сегодня
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeOrders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Нет активных заказов</p>
        ) : (
          <div className="space-y-3">
            {activeOrders.map((order) => {
              const isUrgent = urgentOrders.includes(order);
              return (
                <div
                  key={order.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isUrgent ? 'border-financial-expense bg-financial-expense-bg' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isUrgent && <AlertCircle className="w-4 h-4 text-financial-expense" />}
                    <div>
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Кол-во: {order.quantity} • Срок: {format(new Date(order.deadline), 'dd MMM', { locale: ru })}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};