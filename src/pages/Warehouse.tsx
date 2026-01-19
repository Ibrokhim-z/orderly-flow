import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProducts } from '@/store/mockData';
import { Product } from '@/types';
import { Package, AlertTriangle, Plus, Minus, ArrowUpDown } from 'lucide-react';

const Warehouse = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Warehouse</h1>
            <p className="text-muted-foreground mt-1">
              Manage inventory and stock levels
            </p>
          </div>
          <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Adjust Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adjust Stock</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (Current: {product.stockQuantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Adjustment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Add Stock</SelectItem>
                      <SelectItem value="remove">Remove Stock</SelectItem>
                      <SelectItem value="set">Set to Exact Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="Enter quantity" min={0} />
                </div>
                <div className="space-y-2">
                  <Label>Reason (Optional)</Label>
                  <Input placeholder="e.g., New production batch" />
                </div>
                <Button className="w-full gradient-primary border-0" onClick={() => setIsAdjustOpen(false)}>
                  Apply Adjustment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="text-2xl font-bold">{totalStock} units</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-financial-sales">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                  <p className="text-2xl font-bold text-financial-sales">
                    ₸{totalValue.toLocaleString()}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
                  <p className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-financial-expense' : 'text-financial-profit'}`}>
                    {lowStockProducts.length} products
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-financial-expense-bg' : 'bg-financial-profit-bg'}`}>
                  <AlertTriangle className={`w-6 h-6 ${lowStockProducts.length > 0 ? 'text-financial-expense' : 'text-financial-profit'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => {
                const stockPercentage = Math.min((product.stockQuantity / 50) * 100, 100);
                const isLowStock = product.stockQuantity < 10;
                
                return (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg border ${
                      isLowStock ? 'border-financial-expense bg-financial-expense-bg/30' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isLowStock ? 'bg-financial-expense/10' : 'bg-primary/10'
                        }`}>
                          <Package className={`w-5 h-5 ${isLowStock ? 'text-financial-expense' : 'text-primary'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Unit value: ₸{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${isLowStock ? 'text-financial-expense' : ''}`}>
                          {product.stockQuantity}
                        </p>
                        <p className="text-sm text-muted-foreground">units</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress
                        value={stockPercentage}
                        className={`flex-1 h-2 ${isLowStock ? '[&>div]:bg-financial-expense' : ''}`}
                      />
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-financial-expense">
                        <AlertTriangle className="w-4 h-4" />
                        Low stock - consider restocking soon
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Warehouse;
