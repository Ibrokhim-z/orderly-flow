import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockUsers, mockOrders } from '@/store/mockData';
import { User, Order } from '@/types';
import { Plus, Users, ShoppingCart, TrendingUp, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Wholesalers = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedWholesaler, setSelectedWholesaler] = useState<User | null>(null);

  const wholesalers = mockUsers.filter((u) => u.role === 'wholesaler');

  const getWholesalerOrders = (wholesalerId: string) => {
    return mockOrders.filter((o) => o.wholesalerId === wholesalerId);
  };

  const getWholesalerStats = (wholesalerId: string) => {
    const orders = getWholesalerOrders(wholesalerId);
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const completedOrders = orders.filter((o) => o.status === 'done' || o.status === 'delivered').length;
    return { totalOrders, totalSpent, completedOrders };
  };

  const totalWholesalers = wholesalers.length;
  const totalWholesalerOrders = wholesalers.reduce((sum, w) => sum + getWholesalerOrders(w.id).length, 0);
  const totalWholesalerRevenue = wholesalers.reduce((sum, w) => sum + getWholesalerStats(w.id).totalSpent, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Оптовики</h1>
            <p className="text-muted-foreground mt-1">
              Управление оптовыми клиентами и их заказами
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0">
                <Plus className="w-4 h-4 mr-2" />
                Добавить оптовика
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Добавить нового оптовика</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Название компании</Label>
                  <Input placeholder="ООО Компания" />
                </div>
                <div className="space-y-2">
                  <Label>Контактное лицо</Label>
                  <Input placeholder="ФИО" />
                </div>
                <div className="space-y-2">
                  <Label>Электронная почта</Label>
                  <Input type="email" placeholder="email@company.kz" />
                </div>
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input placeholder="+7 7XX XXX XXXX" />
                </div>
                <Button className="w-full gradient-primary border-0" onClick={() => setIsCreateOpen(false)}>
                  Добавить оптовика
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего оптовиков</p>
                  <p className="text-2xl font-bold">{totalWholesalers}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Оптовых заказов</p>
                  <p className="text-2xl font-bold">{totalWholesalerOrders}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-financial-profit">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Общая выручка</p>
                  <p className="text-2xl font-bold text-financial-profit">₸{totalWholesalerRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-financial-profit-bg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-financial-profit" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Список оптовиков */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Список оптовиков ({wholesalers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wholesalers.map((wholesaler) => {
                const stats = getWholesalerStats(wholesaler.id);
                return (
                  <div
                    key={wholesaler.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedWholesaler(wholesaler)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{wholesaler.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Mail className="w-3 h-3" />
                          {wholesaler.email}
                        </div>
                      </div>
                      <Badge className="bg-orange-500/10 text-orange-500">
                        Оптовик
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Заказов</p>
                        <p className="font-bold">{stats.totalOrders}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Выполнено</p>
                        <p className="font-bold text-financial-profit">{stats.completedOrders}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Сумма</p>
                        <p className="font-bold text-sm">₸{(stats.totalSpent / 1000).toFixed(0)}к</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Модальное окно с информацией об оптовике */}
        <Dialog open={!!selectedWholesaler} onOpenChange={() => setSelectedWholesaler(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedWholesaler?.name}</DialogTitle>
            </DialogHeader>
            {selectedWholesaler && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedWholesaler.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {selectedWholesaler.email}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">История заказов</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {getWholesalerOrders(selectedWholesaler.id).length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">Нет заказов</p>
                    ) : (
                      getWholesalerOrders(selectedWholesaler.id).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{order.productName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: ru })}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₸{order.totalPrice.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{order.quantity} шт.</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Wholesalers;