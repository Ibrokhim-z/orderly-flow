import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockProducts, mockTempStock } from '@/store/mockData';
import { Product, TempStockItem } from '@/types';
import { Package, AlertTriangle, Plus, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Warehouse = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [tempStock, setTempStock] = useState<TempStockItem[]>(mockTempStock);
  const [isAddTempOpen, setIsAddTempOpen] = useState(false);

  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const totalTempStock = tempStock.reduce((sum, t) => sum + t.quantity, 0);
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  const confirmTempStock = (tempStockId: string) => {
    const item = tempStock.find((t) => t.id === tempStockId);
    if (!item) return;
    setProducts((prev) => prev.map((p) => p.id === item.productId ? { ...p, stockQuantity: p.stockQuantity + item.quantity } : p));
    setTempStock((prev) => prev.filter((t) => t.id !== tempStockId));
  };

  const confirmAllTempStock = () => {
    tempStock.forEach((item) => {
      setProducts((prev) => prev.map((p) => p.id === item.productId ? { ...p, stockQuantity: p.stockQuantity + item.quantity } : p));
    });
    setTempStock([]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Склад</h1>
            <p className="text-muted-foreground mt-1">Управление запасами и уровнями остатков</p>
          </div>
          <Dialog open={isAddTempOpen} onOpenChange={setIsAddTempOpen}>
            <DialogTrigger asChild><Button className="gradient-primary border-0"><Plus className="w-4 h-4 mr-2" />Добавить на врем. склад</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Добавить на временный склад</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Товар</Label><Select><SelectTrigger><SelectValue placeholder="Выберите товар" /></SelectTrigger><SelectContent>{products.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Количество</Label><Input type="number" placeholder="Введите количество" min={1} /></div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"><div className="flex items-start gap-2"><Clock className="w-5 h-5 text-yellow-600 mt-0.5" /><div><p className="font-medium text-yellow-600">Временное хранение</p><p className="text-sm text-muted-foreground">Товар будет добавлен на временный склад. После проверки его можно подтвердить.</p></div></div></div>
                <Button className="w-full gradient-primary border-0" onClick={() => setIsAddTempOpen(false)}>Добавить</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Основной склад</p><p className="text-2xl font-bold">{totalStock} шт.</p></div><div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Package className="w-6 h-6 text-primary" /></div></div></CardContent></Card>
          <Card className="border-l-4 border-l-yellow-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Временный склад</p><p className="text-2xl font-bold text-yellow-600">{totalTempStock} шт.</p></div><div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div></div></CardContent></Card>
          <Card className="border-l-4 border-l-financial-sales"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Стоимость запасов</p><p className="text-2xl font-bold text-financial-sales">₸{totalValue.toLocaleString()}</p></div><div className="w-12 h-12 rounded-full bg-financial-sales-bg flex items-center justify-center"><Package className="w-6 h-6 text-financial-sales" /></div></div></CardContent></Card>
          <Card className={`border-l-4 ${lowStockProducts.length > 0 ? 'border-l-financial-expense' : 'border-l-financial-profit'}`}><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Мало на складе</p><p className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-financial-expense' : 'text-financial-profit'}`}>{lowStockProducts.length} товаров</p></div><div className={`w-12 h-12 rounded-full flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-financial-expense-bg' : 'bg-financial-profit-bg'}`}><AlertTriangle className={`w-6 h-6 ${lowStockProducts.length > 0 ? 'text-financial-expense' : 'text-financial-profit'}`} /></div></div></CardContent></Card>
        </div>

        <Tabs defaultValue="main" className="space-y-6">
          <TabsList><TabsTrigger value="main" className="gap-2"><Package className="w-4 h-4" />Основной склад</TabsTrigger><TabsTrigger value="temp" className="gap-2"><Clock className="w-4 h-4" />Временный склад{tempStock.length > 0 && <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">{tempStock.length}</span>}</TabsTrigger></TabsList>

          <TabsContent value="main">
            <Card><CardHeader><CardTitle>Основной склад</CardTitle></CardHeader><CardContent><div className="space-y-4">
              {products.map((product) => {
                const stockPercentage = Math.min((product.stockQuantity / 50) * 100, 100);
                const isLowStock = product.stockQuantity < 10;
                return (
                  <div key={product.id} className={`p-4 rounded-lg border ${isLowStock ? 'border-financial-expense bg-financial-expense-bg/30' : 'border-border'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLowStock ? 'bg-financial-expense/10' : 'bg-primary/10'}`}><Package className={`w-5 h-5 ${isLowStock ? 'text-financial-expense' : 'text-primary'}`} /></div><div><h3 className="font-semibold">{product.name}</h3><p className="text-sm text-muted-foreground">Цена: ₸{product.price.toLocaleString()}</p></div></div>
                      <div className="text-right"><p className={`text-2xl font-bold ${isLowStock ? 'text-financial-expense' : ''}`}>{product.stockQuantity}</p><p className="text-sm text-muted-foreground">шт.</p></div>
                    </div>
                    <Progress value={stockPercentage} className={`h-2 ${isLowStock ? '[&>div]:bg-financial-expense' : ''}`} />
                    {isLowStock && <div className="flex items-center gap-2 mt-2 text-sm text-financial-expense"><AlertTriangle className="w-4 h-4" />Низкий остаток - пора пополнить</div>}
                  </div>
                );
              })}
            </div></CardContent></Card>
          </TabsContent>

          <TabsContent value="temp">
            <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-600" />Временный склад</CardTitle>{tempStock.length > 0 && <Button onClick={confirmAllTempStock} className="bg-financial-profit hover:bg-financial-profit/90"><CheckCircle className="w-4 h-4 mr-2" />Подтвердить все</Button>}</CardHeader><CardContent>
              {tempStock.length === 0 ? <div className="text-center py-12"><Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Временный склад пуст</p></div> : <div className="space-y-4">
                {tempStock.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-600" /></div><div><h3 className="font-semibold">{item.productName}</h3><p className="text-sm text-muted-foreground">Добавил: {item.addedBy} • {format(new Date(item.addedAt), 'd MMM yyyy', { locale: ru })}</p></div></div>
                      <div className="flex items-center gap-4"><div className="text-right"><p className="text-2xl font-bold text-yellow-600">{item.quantity}</p><p className="text-sm text-muted-foreground">шт.</p></div><Button onClick={() => confirmTempStock(item.id)} className="bg-financial-profit hover:bg-financial-profit/90"><CheckCircle className="w-4 h-4 mr-2" />Подтвердить</Button></div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><ArrowRight className="w-4 h-4" /><span>После подтверждения будет перенесено на основной склад</span></div>
                  </div>
                ))}
              </div>}
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Warehouse;
