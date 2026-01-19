export type UserRole = 'admin' | 'manager' | 'employee' | 'wholesaler';

export type OrderStatus = 'waiting' | 'accepted' | 'in_progress' | 'done' | 'delivered';

export type ExpenseType = 'product_cost' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  salary: number;
  createdAt: Date;
}

export interface ProductStage {
  id: string;
  name: string;
  payment: number;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  productionCost: number;
  stages: ProductStage[];
  stockQuantity: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  deadline: Date;
  status: OrderStatus;
  wholesalerId?: string;
  wholesalerName?: string;
  totalPrice: number;
  createdAt: Date;
  createdBy: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  type: ExpenseType;
  category: string;
  createdAt: Date;
}

export interface StageCompletion {
  id: string;
  employeeId: string;
  employeeName: string;
  productId: string;
  productName: string;
  stageId: string;
  stageName: string;
  payment: number;
  completedAt: Date;
}

export interface FinancialSummary {
  totalSales: number;
  totalExpenses: number;
  cash: number;
  netProfit: number;
}

export interface CashoutHistory {
  id: string;
  amount: number;
  previousCash: number;
  createdAt: Date;
  createdBy: string;
}
