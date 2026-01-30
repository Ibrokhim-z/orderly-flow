import { Order } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface RecentOrdersProps {
  orders: Order[];
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const recentOrders = orders.slice(0, 5);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Последние заказы</CardTitle>
        <Link to="/orders">
          <Button variant="ghost" size="sm" className="text-primary">
            Смотреть все <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{order.productName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Кол-во: {order.quantity}</span>
                    <span>•</span>
                    <span>{order.wholesalerName || 'Прямой заказ'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">₸{order.totalPrice.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(order.deadline), 'dd MMM', { locale: ru })}</span>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};