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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockExpenses, mockOrders, calculateFinancials } from '@/store/mockData';
import { Expense, ExpenseType } from '@/types';
import { Plus, TrendingDown, Package, Truck, Utensils, Wallet, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const expenseTypeConfig: Record<ExpenseType, { label: string; color: string }> = {
  product_cost: { label: 'Себестоимость', color: 'bg-blue-500/10 text-blue-500' },
  other: { label: 'Прочие расходы', color: 'bg-orange-500/10 text-orange-500' },
};

const categoryLabels: Record<string, string> = {
  Materials: 'Материалы',
  Transport: 'Транспорт',
  Food: 'Питание',
  Utilities: 'Коммунальные',
  Salary: 'Зарплата',
  Other: 'Прочее',
};

const categoryIcons: Record<string, React.ReactNode> = {
  Materials: <Package className="w-4 h-4" />,
  Transport: <Truck className="w-4 h-4" />,
  Food: <Utensils className="w-4 h-4" />,
  Utilities: <Wallet className="w-4 h-4" />,
};

const Expenses = () => {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCashoutOpen, setIsCashoutOpen] = useState(false);

  const financials = calculateFinancials(mockOrders, expenses);
  
  const productCostExpenses = expenses.filter((e) => e.type === 'product_cost');
  const otherExpenses = expenses.filter((e) => e.type === 'other');

  const totalProductCosts = productCostExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalOtherExpenses = otherExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Расходы</h1>
            <p className="text-muted-foreground mt-1">
              Отслеживание и управление всеми расходами цеха
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isCashoutOpen} onOpenChange={setIsCashoutOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Wallet className="w-4 h-4 mr-2" />
                  Отчёт по кассе
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Снятие кассы и сброс</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="p-4 rounded-lg bg-financial-cash-bg">
                    <p className="text-sm text-muted-foreground mb-1">Текущий баланс кассы</p>
                    <p className="text-3xl font-bold text-financial-cash">
                      ₸{financials.cash.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-600">Подтверждение снятия</p>
                        <p className="text-sm text-muted-foreground">
                          Это обнулит баланс кассы. История будет сохранена.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-financial-cash hover:bg-financial-cash/90"
                    onClick={() => setIsCashoutOpen(false)}
                  >
                    Подтвердить и забрать кассу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить расход
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Добавить новый расход</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Input placeholder="На что был потрачен расход?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Сумма (₸)</Label>
                    <Input type="number" placeholder="5000" min={0} />
                  </div>
                  <div className="space-y-2">
                    <Label>Тип расхода</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product_cost">Себестоимость (Материалы)</SelectItem>
                        <SelectItem value="other">Прочие расходы</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full gradient-primary border-0" onClick={() => setIsCreateOpen(false)}>
                    Добавить расход
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Сводные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-financial-expense">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего расходов</p>
                  <p className="text-2xl font-bold text-financial-expense">
                    ₸{financials.totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-financial-expense-bg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-financial-expense" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Себестоимость</p>
                  <p className="text-2xl font-bold text-blue-500">
                    ₸{totalProductCosts.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Прочие расходы</p>
                  <p className="text-2xl font-bold text-orange-500">
                    ₸{totalOtherExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Таблица расходов */}
        <Card>
          <CardHeader>
            <CardTitle>Все расходы</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Описание</th>
                  <th>Сумма</th>
                  <th>Тип</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="animate-fade-in">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          {categoryIcons[expense.category] || <Wallet className="w-4 h-4" />}
                        </div>
                        <span className="font-medium">{expense.description}</span>
                      </div>
                    </td>
                    <td className="font-semibold text-financial-expense">
                      -₸{expense.amount.toLocaleString()}
                    </td>
                    <td>
                      <Badge className={expenseTypeConfig[expense.type].color}>
                        {expenseTypeConfig[expense.type].label}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground">
                      {format(new Date(expense.createdAt), 'dd MMM yyyy', { locale: ru })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Expenses;