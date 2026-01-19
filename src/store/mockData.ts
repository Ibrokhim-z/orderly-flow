import { Order, Product, Expense, User, StageCompletion, CashoutHistory, FinancialSummary } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Metal Frame Table',
    price: 25000,
    productionCost: 8000,
    stockQuantity: 15,
    stages: [
      { id: 's1', name: 'Build frame', payment: 400, order: 1 },
      { id: 's2', name: 'Cover', payment: 900, order: 2 },
      { id: 's3', name: 'Paint', payment: 1000, order: 3 },
      { id: 's4', name: 'Pack', payment: 300, order: 4 },
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Wooden Chair',
    price: 12000,
    productionCost: 4500,
    stockQuantity: 32,
    stages: [
      { id: 's5', name: 'Cut wood', payment: 500, order: 1 },
      { id: 's6', name: 'Assemble', payment: 800, order: 2 },
      { id: 's7', name: 'Polish', payment: 600, order: 3 },
      { id: 's8', name: 'Pack', payment: 200, order: 4 },
    ],
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Steel Cabinet',
    price: 45000,
    productionCost: 15000,
    stockQuantity: 8,
    stages: [
      { id: 's9', name: 'Cut steel', payment: 1200, order: 1 },
      { id: 's10', name: 'Weld', payment: 2000, order: 2 },
      { id: 's11', name: 'Paint', payment: 1500, order: 3 },
      { id: 's12', name: 'Install locks', payment: 800, order: 4 },
      { id: 's13', name: 'Pack', payment: 400, order: 5 },
    ],
    createdAt: new Date('2024-02-01'),
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord1',
    productId: '1',
    productName: 'Metal Frame Table',
    quantity: 5,
    deadline: new Date('2024-02-10'),
    status: 'done',
    totalPrice: 125000,
    createdAt: new Date('2024-02-01'),
    createdBy: 'Admin',
  },
  {
    id: 'ord2',
    productId: '2',
    productName: 'Wooden Chair',
    quantity: 10,
    deadline: new Date('2024-02-15'),
    status: 'in_progress',
    wholesalerId: 'w1',
    wholesalerName: 'Astana Furniture Co.',
    totalPrice: 120000,
    createdAt: new Date('2024-02-05'),
    createdBy: 'Manager',
  },
  {
    id: 'ord3',
    productId: '3',
    productName: 'Steel Cabinet',
    quantity: 2,
    deadline: new Date('2024-02-20'),
    status: 'accepted',
    totalPrice: 90000,
    createdAt: new Date('2024-02-08'),
    createdBy: 'Admin',
  },
  {
    id: 'ord4',
    productId: '1',
    productName: 'Metal Frame Table',
    quantity: 3,
    deadline: new Date('2024-02-25'),
    status: 'waiting',
    wholesalerId: 'w2',
    wholesalerName: 'Almaty Trade LLC',
    totalPrice: 75000,
    createdAt: new Date('2024-02-10'),
    createdBy: 'System',
  },
];

export const mockExpenses: Expense[] = [
  { id: 'e1', description: 'Steel sheets bulk purchase', amount: 50000, type: 'product_cost', category: 'Materials', createdAt: new Date('2024-02-01') },
  { id: 'e2', description: 'Workshop electricity', amount: 15000, type: 'other', category: 'Utilities', createdAt: new Date('2024-02-05') },
  { id: 'e3', description: 'Delivery driver taxi', amount: 5000, type: 'other', category: 'Transport', createdAt: new Date('2024-02-07') },
  { id: 'e4', description: 'Wood planks', amount: 25000, type: 'product_cost', category: 'Materials', createdAt: new Date('2024-02-08') },
  { id: 'e5', description: 'Team lunch', amount: 8000, type: 'other', category: 'Food', createdAt: new Date('2024-02-09') },
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Arman Sultanov', email: 'arman@workshop.kz', role: 'admin', salary: 0, createdAt: new Date('2024-01-01') },
  { id: 'u2', name: 'Aida Nursultanova', email: 'aida@workshop.kz', role: 'manager', salary: 0, createdAt: new Date('2024-01-05') },
  { id: 'u3', name: 'Yerbol Kasymov', email: 'yerbol@workshop.kz', role: 'employee', salary: 45600, createdAt: new Date('2024-01-10') },
  { id: 'u4', name: 'Dinara Zhanseitova', email: 'dinara@workshop.kz', role: 'employee', salary: 38200, createdAt: new Date('2024-01-12') },
  { id: 'u5', name: 'Astana Furniture Co.', email: 'contact@astanafurniture.kz', role: 'wholesaler', salary: 0, createdAt: new Date('2024-01-20') },
  { id: 'u6', name: 'Almaty Trade LLC', email: 'orders@almatytrade.kz', role: 'wholesaler', salary: 0, createdAt: new Date('2024-01-25') },
];

export const mockStageCompletions: StageCompletion[] = [
  { id: 'sc1', employeeId: 'u3', employeeName: 'Yerbol Kasymov', productId: '1', productName: 'Metal Frame Table', stageId: 's1', stageName: 'Build frame', payment: 400, completedAt: new Date('2024-02-03') },
  { id: 'sc2', employeeId: 'u3', employeeName: 'Yerbol Kasymov', productId: '1', productName: 'Metal Frame Table', stageId: 's2', stageName: 'Cover', payment: 900, completedAt: new Date('2024-02-03') },
  { id: 'sc3', employeeId: 'u4', employeeName: 'Dinara Zhanseitova', productId: '1', productName: 'Metal Frame Table', stageId: 's3', stageName: 'Paint', payment: 1000, completedAt: new Date('2024-02-04') },
  { id: 'sc4', employeeId: 'u4', employeeName: 'Dinara Zhanseitova', productId: '1', productName: 'Metal Frame Table', stageId: 's4', stageName: 'Pack', payment: 300, completedAt: new Date('2024-02-04') },
];

export const mockCashoutHistory: CashoutHistory[] = [
  { id: 'ch1', amount: 150000, previousCash: 150000, createdAt: new Date('2024-01-31'), createdBy: 'Admin' },
];

export const calculateFinancials = (orders: Order[], expenses: Expense[]): FinancialSummary => {
  const totalSales = orders
    .filter(o => o.status === 'done' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const cash = totalSales - totalExpenses;
  
  const productCosts = expenses
    .filter(e => e.type === 'product_cost')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const netProfit = totalSales - productCosts;
  
  return { totalSales, totalExpenses, cash, netProfit };
};
