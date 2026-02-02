import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockProducts, mockUsers } from '@/store/mockData';
import { Product, ProductStage, User } from '@/types';
import { QrCode, CheckCircle, Package, DollarSign, ScanLine, Users, AlertTriangle } from 'lucide-react';

interface CompletedStage {
  stageId: string;
  stageName: string;
  payment: number;
  productName: string;
  quantity: number;
  isPackaging: boolean;
}

interface EmployeeWork {
  stages: CompletedStage[];
  totalEarnings: number;
}

const WorkStation = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStage, setSelectedStage] = useState<ProductStage | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isScanning, setIsScanning] = useState(false);
  const [employeeWork, setEmployeeWork] = useState<Record<string, EmployeeWork>>({});
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentQuantity, setPaymentQuantity] = useState<number>(1);
  const [selectedPaymentStage, setSelectedPaymentStage] = useState<CompletedStage | null>(null);
  
  const employees = mockUsers.filter((u) => u.role === 'employee');

  const handleProductSelect = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    setSelectedStage(null);
  };

  const handleStageSelect = (stageId: string) => {
    const stage = selectedProduct?.stages.find((s) => s.id === stageId);
    setSelectedStage(stage || null);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    setSelectedEmployee(employee || null);
  };

  const handleCompleteStage = () => {
    if (selectedStage && selectedProduct && selectedEmployee && quantity > 0) {
      const isPackaging = selectedStage.name.toLowerCase().includes('упаковка');
      const newStage: CompletedStage = {
        stageId: `${selectedStage.id}-${Date.now()}`,
        stageName: selectedStage.name,
        payment: selectedStage.payment * quantity,
        productName: selectedProduct.name,
        quantity,
        isPackaging,
      };

      setEmployeeWork((prev) => {
        const current = prev[selectedEmployee.id] || { stages: [], totalEarnings: 0 };
        return {
          ...prev,
          [selectedEmployee.id]: {
            stages: [...current.stages, newStage],
            totalEarnings: current.totalEarnings + newStage.payment,
          },
        };
      });

      setQuantity(1);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const getCurrentEmployeeWork = () => {
    if (!selectedEmployee) return { stages: [], totalEarnings: 0 };
    return employeeWork[selectedEmployee.id] || { stages: [], totalEarnings: 0 };
  };

  const canPay = (stage: CompletedStage) => {
    // Можно платить только если этап Упаковка завершён для этого товара
    const work = getCurrentEmployeeWork();
    const packagingDone = work.stages.some(
      (s) => s.productName === stage.productName && s.isPackaging
    );
    return stage.isPackaging || packagingDone;
  };

  const openPaymentDialog = (stage: CompletedStage) => {
    setSelectedPaymentStage(stage);
    setPaymentQuantity(stage.quantity);
    setIsPaymentOpen(true);
  };

  const handlePayment = () => {
    if (!selectedPaymentStage || !selectedEmployee) return;

    const paymentAmount = (selectedPaymentStage.payment / selectedPaymentStage.quantity) * paymentQuantity;
    const remainingQuantity = selectedPaymentStage.quantity - paymentQuantity;

    setEmployeeWork((prev) => {
      const current = prev[selectedEmployee.id];
      if (!current) return prev;

      let updatedStages = current.stages.filter((s) => s.stageId !== selectedPaymentStage.stageId);
      
      // Если остались невыплаченные единицы, добавляем обратно с меньшим количеством
      if (remainingQuantity > 0) {
        updatedStages.push({
          ...selectedPaymentStage,
          quantity: remainingQuantity,
          payment: selectedPaymentStage.payment - paymentAmount,
        });
      }

      return {
        ...prev,
        [selectedEmployee.id]: {
          stages: updatedStages,
          totalEarnings: current.totalEarnings - paymentAmount,
        },
      };
    });

    setIsPaymentOpen(false);
    setSelectedPaymentStage(null);
  };

  const work = getCurrentEmployeeWork();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Рабочая станция</h1>
            <p className="text-muted-foreground mt-1">
              Регистрация выполненных этапов и выплата зарплаты
            </p>
          </div>
        </div>

        {/* Выбор сотрудника */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Выберите сотрудника
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleEmployeeSelect}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Выберите сотрудника" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedEmployee && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Scanner Section */}
            <Card className="lg:row-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  QR Сканер
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${
                    isScanning
                      ? 'border-primary bg-primary/5 animate-pulse-soft'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  {isScanning ? (
                    <div className="text-center space-y-4">
                      <ScanLine className="w-16 h-16 text-primary mx-auto animate-pulse" />
                      <p className="text-lg font-medium">Сканирование...</p>
                      <p className="text-sm text-muted-foreground">
                        Наведите камеру на QR-код
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <QrCode className="w-16 h-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">
                        Нажмите для сканирования
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full h-14 text-lg gradient-primary border-0"
                  onClick={startScanning}
                  disabled={isScanning}
                >
                  <ScanLine className="w-5 h-5 mr-2" />
                  {isScanning ? 'Сканирование...' : 'Сканировать QR-код'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Или выберите товар и этап вручную</p>
                </div>
              </CardContent>
            </Card>

            {/* Manual Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Выбор задачи
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Товар</Label>
                  <Select onValueChange={handleProductSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите товар" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProduct && (
                  <div className="space-y-2">
                    <Label>Этап производства</Label>
                    <Select onValueChange={handleStageSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите этап" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.order}. {stage.name} - ₸{stage.payment.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedStage && (
                  <>
                    <div className="space-y-2">
                      <Label>Количество</Label>
                      <Input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-financial-profit-bg border border-financial-profit/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Заработок:</span>
                        <span className="text-2xl font-bold text-financial-profit">
                          ₸{(selectedStage.payment * quantity).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {quantity} × "{selectedStage.name}" для {selectedProduct?.name}
                      </p>
                    </div>
                  </>
                )}

                <Button
                  className="w-full h-12 gradient-profit border-0"
                  disabled={!selectedStage}
                  onClick={handleCompleteStage}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Завершить этап
                </Button>
              </CardContent>
            </Card>

            {/* Today's Earnings & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-financial-profit" />
                  Заработок {selectedEmployee.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-financial-profit">
                    ₸{work.totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {work.stages.length} этапов выполнено
                  </p>
                </div>

                {work.stages.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">Невыплаченные этапы:</p>
                    {work.stages.map((stage) => {
                      const payable = canPay(stage);
                      return (
                        <div
                          key={stage.stageId}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            payable ? 'bg-financial-profit-bg' : 'bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {payable ? (
                              <CheckCircle className="w-4 h-4 text-financial-profit" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                            <div>
                              <span className="text-sm font-medium">{stage.stageName}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                × {stage.quantity}
                              </span>
                              {!payable && (
                                <p className="text-xs text-yellow-600">
                                  Ожидает упаковки
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-financial-profit">
                              ₸{stage.payment.toLocaleString()}
                            </span>
                            {payable && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openPaymentDialog(stage)}
                              >
                                Выплатить
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Выплата за этап</DialogTitle>
            </DialogHeader>
            {selectedPaymentStage && (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium">{selectedPaymentStage.stageName}</p>
                  <p className="text-sm text-muted-foreground">{selectedPaymentStage.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    Доступно: {selectedPaymentStage.quantity} шт.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Количество для выплаты</Label>
                  <Input
                    type="number"
                    min={1}
                    max={selectedPaymentStage.quantity}
                    value={paymentQuantity}
                    onChange={(e) =>
                      setPaymentQuantity(
                        Math.min(
                          selectedPaymentStage.quantity,
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      )
                    }
                  />
                </div>

                <div className="p-4 rounded-lg bg-financial-profit-bg border border-financial-profit/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Сумма выплаты:</span>
                    <span className="text-2xl font-bold text-financial-profit">
                      ₸{((selectedPaymentStage.payment / selectedPaymentStage.quantity) * paymentQuantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full gradient-profit border-0"
                  onClick={handlePayment}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Выплатить
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default WorkStation;