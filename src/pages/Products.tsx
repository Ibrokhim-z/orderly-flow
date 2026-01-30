import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockProducts } from '@/store/mockData';
import { Product, ProductStage } from '@/types';
import { Plus, Package, Layers, Trash2 } from 'lucide-react';

const Products = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newStages, setNewStages] = useState<Omit<ProductStage, 'id'>[]>([
    { name: '', payment: 0, order: 1 }
  ]);

  const addStage = () => {
    setNewStages([...newStages, { name: '', payment: 0, order: newStages.length + 1 }]);
  };

  const removeStage = (index: number) => {
    setNewStages(newStages.filter((_, i) => i !== index));
  };

  const calculateTotalStagePayment = (stages: ProductStage[]) => {
    return stages.reduce((sum, stage) => sum + stage.payment, 0);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Товары</h1>
            <p className="text-muted-foreground mt-1">
              Управление товарами и этапами производства
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0">
                <Plus className="w-4 h-4 mr-2" />
                Добавить товар
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Добавить новый товар</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Название товара</Label>
                  <Input placeholder="например, Металлический каркас стола" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Цена продажи (₸)</Label>
                    <Input type="number" placeholder="25000" min={0} />
                  </div>
                  <div className="space-y-2">
                    <Label>Себестоимость (₸)</Label>
                    <Input type="number" placeholder="8000" min={0} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Начальный остаток</Label>
                  <Input type="number" placeholder="10" min={0} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Этапы производства</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addStage}>
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить этап
                    </Button>
                  </div>
                  
                  {newStages.map((stage, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        {index + 1}.
                      </span>
                      <Input
                        placeholder="Название этапа"
                        className="flex-1"
                        value={stage.name}
                        onChange={(e) => {
                          const updated = [...newStages];
                          updated[index].name = e.target.value;
                          setNewStages(updated);
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">₸</span>
                        <Input
                          type="number"
                          placeholder="400"
                          className="w-24"
                          value={stage.payment || ''}
                          onChange={(e) => {
                            const updated = [...newStages];
                            updated[index].payment = Number(e.target.value);
                            setNewStages(updated);
                          }}
                        />
                      </div>
                      {newStages.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStage(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full gradient-primary border-0" onClick={() => setIsCreateOpen(false)}>
                  Создать товар
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        На складе: {product.stockQuantity} шт.
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-financial-sales-bg">
                    <p className="text-xs text-muted-foreground mb-1">Цена продажи</p>
                    <p className="font-bold text-financial-sales">₸{product.price.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-financial-expense-bg">
                    <p className="text-xs text-muted-foreground mb-1">Себестоимость</p>
                    <p className="font-bold text-financial-expense">₸{product.productionCost.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <span>Этапы производства ({product.stages.length})</span>
                    <span className="ml-auto text-primary font-bold">
                      ₸{calculateTotalStagePayment(product.stages).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {product.stages.map((stage) => (
                      <div
                        key={stage.id}
                        className="flex items-center justify-between text-sm py-1.5 px-2 rounded bg-muted/50"
                      >
                        <span className="text-muted-foreground">
                          {stage.order}. {stage.name}
                        </span>
                        <span className="font-medium">₸{stage.payment.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Редактировать товар
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;