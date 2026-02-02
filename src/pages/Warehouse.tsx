import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProducts } from '@/store/mockData';
import { Product } from '@/types';
import { Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

// Симуляция незавершённых товаров с прогрессом этапов
interface InProgressItem {
  id: string;
  productId: string;
  productName: string;
  stages: { name: string; completed: number; total: number }[];
}

const mockInProgressItems: InProgressItem[] = [
  {
    id: 'ip1',
    productId: '1',
    productName: 'Металлический каркасный стол',
    stages: [
      { name: 'Каркас', completed: 5, total: 10 },
      { name: 'Обшивка', completed: 3, total: 10 },
      { name: 'Покраска', completed: 0, total: 10 },
      { name: 'Упаковка', completed: 0, total: 10 },
    ],
  },
  {
    id: 'ip2',
    productId: '2',
    productName: 'Деревянный стул',
    stages: [
      { name: 'Распил', completed: 8, total: 15 },
      { name: 'Сборка', completed: 6, total: 15 },
      { name: 'Полировка', completed: 2, total: 15 },
      { name: 'Упаковка', completed: 0, total: 15 },
    ],
  },
  {
    id: 'ip3',
    productId: '3',
    productName: 'Стальной шкаф',
    stages: [
      { name: 'Резка', completed: 4, total: 5 },
      { name: 'Сварка', completed: 4, total: 5 },
      { name: 'Покраска', completed: 3, total: 5 },
      { name: 'Замки', completed: 2, total: 5 },
      { name: 'Упаковка', completed: 0, total: 5 },
    ],
  },
];

const Warehouse = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [inProgressItems] = useState<InProgressItem[]>(mockInProgressItems);

  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const totalInProgress = inProgressItems.length;
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  const getCompletionPercentage = (item: InProgressItem) => {
    const lastStage = item.stages[item.stages.length - 1];
    return (lastStage.completed / lastStage.total) * 100;
  };

  const isReadyForMainStock = (item: InProgressItem) => {
    const lastStage = item.stages[item.stages.length - 1];
    return lastStage.completed === lastStage.total;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Склад</h1>
            <p className="text-muted-foreground mt-1">Управление запасами и уровнями остатков</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Основной склад</p>
                  <p className="text-2xl font-bold">{totalStock} шт.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">В производстве</p>
                  <p className="text-2xl font-bold text-yellow-600">{totalInProgress} партий</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-financial-sales">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Стоимость запасов</p>
                  <p className="text-2xl font-bold text-financial-sales">₸{totalValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-financial-sales-bg flex items-center justify-center">
                  <Package className="w-6 h-6 text-financial-sales" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`border-l-4 ${lowStockProducts.length > 0 ? 'border-l-financial-expense' : 'border-l-financial-profit'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Мало на складе</p>
                  <p className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-financial-expense' : 'text-financial-profit'}`}>
                    {lowStockProducts.length} товаров
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-financial-expense-bg' : 'bg-financial-profit-bg'}`}>
                  <AlertTriangle className={`w-6 h-6 ${lowStockProducts.length > 0 ? 'text-financial-expense' : 'text-financial-profit'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="main" className="space-y-6">
          <TabsList>
            <TabsTrigger value="main" className="gap-2">
              <Package className="w-4 h-4" />
              Основной склад
            </TabsTrigger>
            <TabsTrigger value="inprogress" className="gap-2">
              <Clock className="w-4 h-4" />
              В производстве
              {inProgressItems.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                  {inProgressItems.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <Card>
              <CardHeader>
                <CardTitle>Основной склад</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => {
                    const stockPercentage = Math.min((product.stockQuantity / 50) * 100, 100);
                    const isLowStock = product.stockQuantity < 10;
                    return (
                      <div
                        key={product.id}
                        className={`p-4 rounded-lg border ${isLowStock ? 'border-financial-expense bg-financial-expense-bg/30' : 'border-border'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLowStock ? 'bg-financial-expense/10' : 'bg-primary/10'}`}>
                              <Package className={`w-5 h-5 ${isLowStock ? 'text-financial-expense' : 'text-primary'}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">Цена: ₸{product.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${isLowStock ? 'text-financial-expense' : ''}`}>{product.stockQuantity}</p>
                            <p className="text-sm text-muted-foreground">шт.</p>
                          </div>
                        </div>
                        <Progress value={stockPercentage} className={`h-2 ${isLowStock ? '[&>div]:bg-financial-expense' : ''}`} />
                        {isLowStock && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-financial-expense">
                            <AlertTriangle className="w-4 h-4" />
                            Низкий остаток - пора пополнить
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inprogress">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  Товары в производстве
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inProgressItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Нет товаров в производстве</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inProgressItems.map((item) => {
                      const isReady = isReadyForMainStock(item);
                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border ${isReady ? 'border-financial-profit bg-financial-profit-bg/30' : 'border-yellow-500/30 bg-yellow-500/5'}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isReady ? 'bg-financial-profit/10' : 'bg-yellow-500/10'}`}>
                                {isReady ? (
                                  <CheckCircle className="w-5 h-5 text-financial-profit" />
                                ) : (
                                  <Clock className="w-5 h-5 text-yellow-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold">{item.productName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {isReady ? 'Готов к перемещению на основной склад' : 'В процессе производства'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {item.stages.map((stage, index) => {
                              const isComplete = stage.completed === stage.total;
                              const hasProgress = stage.completed > 0;
                              return (
                                <div
                                  key={index}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                    isComplete
                                      ? 'bg-financial-profit/10 text-financial-profit'
                                      : hasProgress
                                      ? 'bg-yellow-500/10 text-yellow-600'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {stage.name}-{stage.completed}/{stage.total}
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Прогресс упаковки</span>
                              <span className="font-medium">{getCompletionPercentage(item).toFixed(0)}%</span>
                            </div>
                            <Progress 
                              value={getCompletionPercentage(item)} 
                              className={`h-2 ${isReady ? '[&>div]:bg-financial-profit' : '[&>div]:bg-yellow-500'}`} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Warehouse;