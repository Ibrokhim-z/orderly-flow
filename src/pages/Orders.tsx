import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockOrders, mockProducts } from '@/store/mockData';
import { Order, OrderStatus } from '@/types';
import { Plus, Calendar, Package, User, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const statusLabels: Record<OrderStatus, string> = {
  waiting: 'Ожидание',
  accepted: 'Принят',
  in_progress: 'В работе',
  done: 'Готов',
  delivered: 'Доставлен',
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const statusOrder: OrderStatus[] = ['waiting', 'accepted', 'in_progress', 'done', 'delivered'];

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
            <p className="text-muted-foreground mt-1">
              Управление и отслеживание всех заказов
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0">
                <Plus className="w-4 h-4 mr-2" />
                Создать заказ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Создать новый заказ</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Товар</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите товар" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ₸{product.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Количество</Label>
                  <Input type="number" placeholder="Введите количество" min={1} />
                </div>
                <div className="space-y-2">
                  <Label>Дедлайн</Label>
                  <Input type="date" />
                </div>
                <Button className="w-full gradient-primary border-0" onClick={() => setIsCreateOpen(false)}>
                  Создать заказ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Фильтры */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск заказов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as OrderStatus | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Фильтр по статусу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="waiting">Ожидание</SelectItem>
                    <SelectItem value="accepted">Принят</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="done">Готов</SelectItem>
                    <SelectItem value="delivered">Доставлен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Таблица заказов */}
        <Card>
          <CardHeader>
            <CardTitle>Все заказы ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Кол-во</th>
                  <th>Сумма</th>
                  <th>Дедлайн</th>
                  <th>Оптовик</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <tr key={order.id} className="animate-fade-in">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{order.productName}</span>
                        </div>
                      </td>
                      <td>{order.quantity}</td>
                      <td className="font-semibold">₸{order.totalPrice.toLocaleString()}</td>
                      <td>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(order.deadline), 'dd MMM yyyy', { locale: ru })}
                        </div>
                      </td>
                      <td>
                        {order.wholesalerName ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            {order.wholesalerName}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">–</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        {nextStatus && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, nextStatus)}
                          >
                            → {statusLabels[nextStatus]}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Orders;