import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProducts, mockUsers } from '@/store/mockData';
import { Product, ProductStage, User } from '@/types';
import { QrCode, CheckCircle, Package, DollarSign, Layers, ScanLine } from 'lucide-react';

const WorkStation = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStage, setSelectedStage] = useState<ProductStage | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  
  const currentEmployee = mockUsers.find((u) => u.role === 'employee');

  const handleProductSelect = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    setSelectedStage(null);
  };

  const handleStageSelect = (stageId: string) => {
    const stage = selectedProduct?.stages.find((s) => s.id === stageId);
    setSelectedStage(stage || null);
  };

  const handleCompleteStage = () => {
    if (selectedStage && !completedStages.includes(selectedStage.id)) {
      setCompletedStages([...completedStages, selectedStage.id]);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    // Simulate QR scan
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Work Station</h1>
            <p className="text-muted-foreground mt-1">
              Scan QR codes to log completed production stages
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="font-semibold">{currentEmployee?.name || 'Employee'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Scanner Section */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                QR Scanner
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
                    <p className="text-lg font-medium">Scanning...</p>
                    <p className="text-sm text-muted-foreground">
                      Point camera at the QR code
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <QrCode className="w-16 h-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Click scan to start camera
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
                {isScanning ? 'Scanning...' : 'Scan QR Code'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>Or manually select product and stage below</p>
              </div>
            </CardContent>
          </Card>

          {/* Manual Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Select Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <Select onValueChange={handleProductSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
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
                  <label className="text-sm font-medium">Production Stage</label>
                  <Select onValueChange={handleStageSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
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
                <div className="p-4 rounded-lg bg-financial-profit-bg border border-financial-profit/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">You will earn:</span>
                    <span className="text-2xl font-bold text-financial-profit">
                      ₸{selectedStage.payment.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For completing "{selectedStage.name}" on {selectedProduct?.name}
                  </p>
                </div>
              )}

              <Button
                className="w-full h-12 gradient-profit border-0"
                disabled={!selectedStage || completedStages.includes(selectedStage.id)}
                onClick={handleCompleteStage}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Stage
              </Button>
            </CardContent>
          </Card>

          {/* Today's Earnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-financial-profit" />
                Today's Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-4xl font-bold text-financial-profit">
                  ₸{(completedStages.length * 500).toLocaleString()}
                </p>
                <p className="text-muted-foreground mt-2">
                  {completedStages.length} stages completed
                </p>
              </div>

              {completedStages.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground">Completed today:</p>
                  {completedStages.map((stageId) => {
                    const stage = mockProducts
                      .flatMap((p) => p.stages)
                      .find((s) => s.id === stageId);
                    return (
                      <div
                        key={stageId}
                        className="flex items-center justify-between p-2 rounded-lg bg-financial-profit-bg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-financial-profit" />
                          <span className="text-sm">{stage?.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-financial-profit">
                          +₸{stage?.payment.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default WorkStation;
