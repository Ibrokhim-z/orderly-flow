import { Order, Product, Expense, User, StageCompletion, CashoutHistory, FinancialSummary, TempStockItem } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Металлический каркасный стол',
    price: 25000,
    productionCost: 8000,
    stockQuantity: 15,
    tempStockQuantity: 5,
    stages: [
      { id: 's1', name: 'Сборка каркаса', payment: 400, order: 1 },
      { id: 's2', name: 'Обшивка', payment: 900, order: 2 },
      { id: 's3', name: 'Покраска', payment: 1000, order: 3 },
      { id: 's4', name: 'Упаковка', payment: 300, order: 4 },
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Деревянный стул',
    price: 12000,
    productionCost: 4500,
    stockQuantity: 32,
    tempStockQuantity: 8,
    stages: [
      { id: 's5', name: 'Распил дерева', payment: 500, order: 1 },
      { id: 's6', name: 'Сборка', payment: 800, order: 2 },
      { id: 's7', name: 'Полировка', payment: 600, order: 3 },
      { id: 's8', name: 'Упаковка', payment: 200, order: 4 },
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Стальной шкаф',
    price: 45000,
    productionCost: 15000,
    stockQuantity: 8,
    tempStockQuantity: 3,
    stages: [
      { id: 's9', name: 'Резка стали', payment: 1200, order: 1 },
      { id: 's10', name: 'Сварка', payment: 2000, order: 2 },
      { id: 's11', name: 'Покраска', payment: 1500, order: 3 },
      { id: 's12', name: 'Установка замков', payment: 800, order: 4 },
      { id: 's13', name: 'Упаковка', payment: 400, order: 5 },
    ],
    createdAt: new Date('2024-02-01'),
  },
];

export const mockTempStock: TempStockItem[] = [
  { id: 'ts1', productId: '1', productName: 'Металлический каркасный стол', quantity: 5, addedAt: new Date('2024-02-08'), addedBy: 'Ерболат' },
  { id: 'ts2', productId: '2', productName: 'Деревянный стул', quantity: 8, addedAt: new Date('2024-02-09'), addedBy: 'Динара' },
  { id: 'ts3', productId: '3', productName: 'Стальной шкаф', quantity: 3, addedAt: new Date('2024-02-10'), addedBy: 'Ерболат' },
];

export const mockOrders: Order[] = [
  { id: 'ord1', productId: '1', productName: 'Металлический каркасный стол', quantity: 5, deadline: new Date('2024-02-10'), status: 'done', totalPrice: 125000, createdAt: new Date('2024-02-01'), createdBy: 'Админ' },
  { id: 'ord2', productId: '2', productName: 'Деревянный стул', quantity: 10, deadline: new Date('2024-02-15'), status: 'in_progress', wholesalerId: 'w1', wholesalerName: 'Астана Мебель', totalPrice: 120000, createdAt: new Date('2024-02-05'), createdBy: 'Менеджер' },
  { id: 'ord3', productId: '3', productName: 'Стальной шкаф', quantity: 2, deadline: new Date('2024-02-20'), status: 'accepted', totalPrice: 90000, createdAt: new Date('2024-02-08'), createdBy: 'Админ' },
  { id: 'ord4', productId: '1', productName: 'Металлический каркасный стол', quantity: 3, deadline: new Date('2024-02-25'), status: 'waiting', wholesalerId: 'w2', wholesalerName: 'Алматы Трейд', totalPrice: 75000, createdAt: new Date('2024-02-10'), createdBy: 'Система' },
];

export const mockExpenses: Expense[] = [
  { id: 'e1', description: 'Закупка стальных листов', amount: 50000, type: 'product_cost', category: 'Материалы', createdAt: new Date('2024-02-01') },
  { id: 'e2', description: 'Электричество цеха', amount: 15000, type: 'other', category: 'Коммунальные', createdAt: new Date('2024-02-05') },
  { id: 'e3', description: 'Такси для доставщика', amount: 5000, type: 'other', category: 'Транспорт', createdAt: new Date('2024-02-07') },
  { id: 'e4', description: 'Деревянные доски', amount: 25000, type: 'product_cost', category: 'Материалы', createdAt: new Date('2024-02-08') },
  { id: 'e5', description: 'Обед для команды', amount: 8000, type: 'other', category: 'Питание', createdAt: new Date('2024-02-09') },
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Арман Султанов', email: 'arman@workshop.kz', phone: '+7 701 111 2233', role: 'admin', salary: 0, createdAt: new Date('2024-01-01') },
  { id: 'u2', name: 'Аида Нурсултанова', email: 'aida@workshop.kz', phone: '+7 702 222 3344', role: 'manager', salary: 0, createdAt: new Date('2024-01-05') },
  { id: 'u3', name: 'Ерболат Касымов', email: 'yerbol@workshop.kz', phone: '+7 703 333 4455', role: 'employee', salary: 45600, createdAt: new Date('2024-01-10') },
  { id: 'u4', name: 'Динара Жансеитова', email: 'dinara@workshop.kz', phone: '+7 704 444 5566', role: 'employee', salary: 38200, createdAt: new Date('2024-01-12') },
  { id: 'u5', name: 'Астана Мебель', email: 'contact@astanamebel.kz', phone: '+7 7172 55 66 77', role: 'wholesaler', salary: 0, createdAt: new Date('2024-01-20') },
  { id: 'u6', name: 'Алматы Трейд', email: 'orders@almatytrade.kz', phone: '+7 727 88 99 00', role: 'wholesaler', salary: 0, createdAt: new Date('2024-01-25') },
];

export const mockStageCompletions: StageCompletion[] = [
  { id: 'sc1', employeeId: 'u3', employeeName: 'Ерболат Касымов', productId: '1', productName: 'Металлический каркасный стол', stageId: 's1', stageName: 'Сборка каркаса', payment: 400, completedAt: new Date('2024-02-03') },
  { id: 'sc2', employeeId: 'u3', employeeName: 'Ерболат Касымов', productId: '1', productName: 'Металлический каркасный стол', stageId: 's2', stageName: 'Обшивка', payment: 900, completedAt: new Date('2024-02-03') },
  { id: 'sc3', employeeId: 'u3', employeeName: 'Ерболат Касымов', productId: '2', productName: 'Деревянный стул', stageId: 's5', stageName: 'Распил дерева', payment: 500, completedAt: new Date('2024-02-05') },
  { id: 'sc4', employeeId: 'u3', employeeName: 'Ерболат Касымов', productId: '2', productName: 'Деревянный стул', stageId: 's6', stageName: 'Сборка', payment: 800, completedAt: new Date('2024-02-05') },
  { id: 'sc5', employeeId: 'u4', employeeName: 'Динара Жансеитова', productId: '1', productName: 'Металлический каркасный стол', stageId: 's3', stageName: 'Покраска', payment: 1000, completedAt: new Date('2024-02-04') },
  { id: 'sc6', employeeId: 'u4', employeeName: 'Динара Жансеитова', productId: '1', productName: 'Металлический каркасный стол', stageId: 's4', stageName: 'Упаковка', payment: 300, completedAt: new Date('2024-02-04') },
  { id: 'sc7', employeeId: 'u4', employeeName: 'Динара Жансеитова', productId: '3', productName: 'Стальной шкаф', stageId: 's9', stageName: 'Резка стали', payment: 1200, completedAt: new Date('2024-02-06') },
  { id: 'sc8', employeeId: 'u4', employeeName: 'Динара Жансеитова', productId: '3', productName: 'Стальной шкаф', stageId: 's10', stageName: 'Сварка', payment: 2000, completedAt: new Date('2024-02-06') },
  { id: 'sc9', employeeId: 'u4', employeeName: 'Динара Жансеитова', productId: '2', productName: 'Деревянный стул', stageId: 's7', stageName: 'Полировка', payment: 600, completedAt: new Date('2024-02-07') },
];

export const mockCashoutHistory: CashoutHistory[] = [
  { id: 'ch1', amount: 150000, previousCash: 150000, createdAt: new Date('2024-01-31'), createdBy: 'Админ' },
];

export const calculateFinancials = (orders: Order[], expenses: Expense[]): FinancialSummary => {
  const totalSales = orders.filter(o => o.status === 'done' || o.status === 'delivered').reduce((sum, o) => sum + o.totalPrice, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const cash = totalSales - totalExpenses;
  const productCosts = expenses.filter(e => e.type === 'product_cost').reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - productCosts;
  return { totalSales, totalExpenses, cash, netProfit };
};
