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
import { mockOrders } from '@/store/mockData';
import { Order } from '@/types';
import { Plus, Truck, MapPin, Phone, Clock, CheckCircle, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Delivery {
  id: string;
  orderId: string;
  orderProductName: string;
  address: string;
  phone: string;
  driverName: string;
  status: 'pending' | 'in_transit' | 'delivered';
  scheduledDate: Date;
  deliveredAt?: Date;
}

const mockDeliveries: Delivery[] = [
  {
    id: 'd1',
    orderId: 'ord1',
    orderProductName: 'Металлический каркасный стол',
    address: 'г. Астана, ул. Кабанбай батыра, 15',
    phone: '+7 701 123 4567',
    driverName: 'Азамат Серіков',
    status: 'delivered',
    scheduledDate: new Date('2024-02-09'),
    deliveredAt: new Date('2024-02-09'),
  },
  {
    id: 'd2',
    orderId: 'ord2',
    orderProductName: 'Деревянный стул',
    address: 'г. Алматы, пр. Абая, 42',
    phone: '+7 702 234 5678',
    driverName: 'Бекзат Омаров',
    status: 'in_transit',
    scheduledDate: new Date('2024-02-15'),
  },
  {
    id: 'd3',
    orderId: 'ord3',
    orderProductName: 'Стальной шкаф',
    address: 'г. Шымкент, ул. Тауке хана, 8',
    phone: '+7 703 345 6789',
    driverName: '',
    status: 'pending',
    scheduledDate: new Date('2024-02-20'),
  },
];

const statusLabels: Record<Delivery['status'], string> = {
  pending: 'Ожидает',
  in_transit: 'В пути',
  delivered: 'Доставлено',
};

const statusColors: Record<Delivery['status'], string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  in_transit: 'bg-blue-500/10 text-blue-500',
  delivered: 'bg-green-500/10 text-green-500',
};

const Logistics = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Delivery['status'] | 'all'>('all');

  const filteredDeliveries = deliveries.filter((d) =>
    filterStatus === 'all' ? true : d.status === filterStatus
  );

  const pendingCount = deliveries.filter((d) => d.status === 'pending').length;
  const inTransitCount = deliveries.filter((d) => d.status === 'in_transit').length;
  const deliveredCount = deliveries.filter((d) => d.status === 'delivered').length;

  const updateDeliveryStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              status: newStatus,
              deliveredAt: newStatus === 'delivered' ? new Date() : d.deliveredAt,
            }
          : d
      )
    );
  };

  const doneOrders = mockOrders.filter((o) => o.status === 'done');

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Логистика</h1>
            <p className="text-muted-foreground mt-1">
              Управление доставками и отслеживание грузов
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0">
                <Plus className="w-4 h-4 mr-2" />
                Создать доставку
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Создать новую доставку</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Заказ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите заказ" />
                    </SelectTrigger>
                    <SelectContent>
                      {doneOrders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.productName} ({order.quantity} шт.)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Адрес доставки</Label>
                  <Input placeholder="Введите адрес" />
                </div>
                <div className="space-y-2">
                  <Label>Телефон получателя</Label>
                  <Input placeholder="+7 7XX XXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Водитель</Label>
                  <Input placeholder="Имя водителя" />
                </div>
                <div className="space-y-2">
                  <Label>Дата доставки</Label>
                  <Input type="date" />
                </div>
                <Button
                  className="w-full gradient-primary border-0"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Создать доставку
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:border-yellow-500/50 transition-colors" onClick={() => setFilterStatus('pending')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ожидают</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setFilterStatus('in_transit')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">В пути</p>
                  <p className="text-2xl font-bold">{inTransitCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-green-500/50 transition-colors" onClick={() => setFilterStatus('delivered')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Доставлено</p>
                  <p className="text-2xl font-bold">{deliveredCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Фильтр */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Фильтр:</span>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as Delivery['status'] | 'all')}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все доставки</SelectItem>
                  <SelectItem value="pending">Ожидают</SelectItem>
                  <SelectItem value="in_transit">В пути</SelectItem>
                  <SelectItem value="delivered">Доставлено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Список доставок */}
        <Card>
          <CardHeader>
            <CardTitle>Доставки ({filteredDeliveries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{delivery.orderProductName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Заказ #{delivery.orderId}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[delivery.status]}`}>
                          {statusLabels[delivery.status]}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{delivery.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{delivery.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(delivery.scheduledDate), 'dd MMM yyyy', { locale: ru })}
                          </span>
                        </div>
                      </div>
                      {delivery.driverName && (
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          <span>Водитель: {delivery.driverName}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {delivery.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                        >
                          Отправить
                        </Button>
                      )}
                      {delivery.status === 'in_transit' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                        >
                          Доставлено
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredDeliveries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Нет доставок
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Logistics;
