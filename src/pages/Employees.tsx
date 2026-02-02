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
import { Plus, Users, Shield, DollarSign, Briefcase, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Администратор', color: 'bg-purple-500/10 text-purple-500' },
  manager: { label: 'Менеджер', color: 'bg-blue-500/10 text-blue-500' },
  employee: { label: 'Сотрудник', color: 'bg-green-500/10 text-green-500' },
  wholesaler: { label: 'Оптовик', color: 'bg-orange-500/10 text-orange-500' },
};

const Employees = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  
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

  const getEmployeeCompletedStages = (employeeId: string) => {
    return mockStageCompletions.filter((sc) => sc.employeeId === employeeId);
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
                  <Label>Телефон</Label>
                  <Input placeholder="+7 7XX XXX XXXX" />
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
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{employee.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {employee.email}
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {employee.phone}
                        </div>
                      )}
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
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedEmployee(member)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </div>
                      )}
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
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedEmployee(wholesaler)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{wholesaler.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {wholesaler.email}
                      </div>
                      {wholesaler.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {wholesaler.phone}
                        </div>
                      )}
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

        {/* Модальное окно с информацией о сотруднике */}
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Информация о сотруднике</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${roleConfig[selectedEmployee.role].color}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">{selectedEmployee.name}</p>
                      <Badge className={roleConfig[selectedEmployee.role].color}>
                        {roleConfig[selectedEmployee.role].label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Электронная почта</p>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                  </div>
                  {selectedEmployee.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Телефон</p>
                        <p className="font-medium">{selectedEmployee.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Дата регистрации</p>
                      <p className="font-medium">{format(new Date(selectedEmployee.createdAt), 'dd MMMM yyyy', { locale: ru })}</p>
                    </div>
                  </div>
                </div>

                {selectedEmployee.role === 'employee' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-financial-profit-bg">
                        <p className="text-sm text-muted-foreground">Общий заработок</p>
                        <p className="text-2xl font-bold text-financial-profit">
                          ₸{getEmployeeEarnings(selectedEmployee.id).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10">
                        <p className="text-sm text-muted-foreground">Выполнено задач</p>
                        <p className="text-2xl font-bold text-primary">
                          {getEmployeeTasksCount(selectedEmployee.id)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Выполненные этапы</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {getEmployeeCompletedStages(selectedEmployee.id).length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">Нет выполненных этапов</p>
                        ) : (
                          getEmployeeCompletedStages(selectedEmployee.id).map((stage) => (
                            <div key={stage.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                              <div>
                                <p className="text-sm font-medium">{stage.stageName}</p>
                                <p className="text-xs text-muted-foreground">{stage.productName}</p>
                              </div>
                              <span className="text-sm font-semibold text-financial-profit">
                                +₸{stage.payment.toLocaleString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Employees;