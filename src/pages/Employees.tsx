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
import { mockUsers, mockStageCompletions } from '@/store/mockData';
import { User, UserRole } from '@/types';
import { Plus, Users, Shield, DollarSign, Briefcase } from 'lucide-react';

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Администратор', color: 'bg-purple-500/10 text-purple-500' },
  manager: { label: 'Менеджер', color: 'bg-blue-500/10 text-blue-500' },
  employee: { label: 'Сотрудник', color: 'bg-green-500/10 text-green-500' },
  wholesaler: { label: 'Оптовик', color: 'bg-orange-500/10 text-orange-500' },
};

const Employees = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const employees = mockUsers.filter((u) => u.role === 'employee');
  const staff = mockUsers.filter((u) => u.role === 'admin' || u.role === 'manager');
  const wholesalers = mockUsers.filter((u) => u.role === 'wholesaler');

  const getEmployeeEarnings = (employeeId: string) => {
    return mockStageCompletions
      .filter((sc) => sc.employeeId === employeeId)
      .reduce((sum, sc) => sum + sc.payment, 0);
  };

  const getEmployeeTasksCount = (employeeId: string) => {
    return mockStageCompletions.filter((sc) => sc.employeeId === employeeId).length;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Команда</h1>
            <p className="text-muted-foreground mt-1">
              Управление сотрудниками, персоналом и оптовиками
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0">
                <Plus className="w-4 h-4 mr-2" />
                Добавить участника
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Добавить участника команды</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>ФИО</Label>
                  <Input placeholder="Введите полное имя" />
                </div>
                <div className="space-y-2">
                  <Label>Электронная почта</Label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Роль</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Сотрудник</SelectItem>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="wholesaler">Оптовик</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gradient-primary border-0" onClick={() => setIsCreateOpen(false)}>
                  Добавить участника
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Секция сотрудников */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Сотрудники ({employees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                    <Badge className={roleConfig[employee.role].color}>
                      {roleConfig[employee.role].label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-financial-profit-bg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <DollarSign className="w-3 h-3" />
                        Заработок
                      </div>
                      <p className="font-bold text-financial-profit">
                        ₸{getEmployeeEarnings(employee.id).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Briefcase className="w-3 h-3" />
                        Задачи
                      </div>
                      <p className="font-bold text-primary">
                        {getEmployeeTasksCount(employee.id)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Секция персонала */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Персонал ({staff.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge className={roleConfig[member.role].color}>
                      {roleConfig[member.role].label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Секция оптовиков */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Оптовики ({wholesalers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wholesalers.map((wholesaler) => (
                <div
                  key={wholesaler.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{wholesaler.name}</h3>
                      <p className="text-sm text-muted-foreground">{wholesaler.email}</p>
                    </div>
                    <Badge className={roleConfig[wholesaler.role].color}>
                      {roleConfig[wholesaler.role].label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Employees;