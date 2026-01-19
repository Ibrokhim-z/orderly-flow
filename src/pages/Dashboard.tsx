import { MainLayout } from '@/components/layout/MainLayout';
import { FinancialOverview } from '@/components/dashboard/FinancialOverview';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { OrderStatusChart } from '@/components/dashboard/OrderStatusChart';
import { TodaysTasks } from '@/components/dashboard/TodaysTasks';
import { mockOrders, mockExpenses, calculateFinancials } from '@/store/mockData';
import { Button } from '@/components/ui/button';
import { Plus, Download, RefreshCcw } from 'lucide-react';

const Dashboard = () => {
  const financials = calculateFinancials(mockOrders, mockExpenses);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening in your workshop.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="gradient-primary border-0">
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Financial Overview */}
        <FinancialOverview data={financials} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrders orders={mockOrders} />
          </div>
          <div>
            <OrderStatusChart orders={mockOrders} />
          </div>
        </div>

        {/* Today's Tasks */}
        <TodaysTasks orders={mockOrders} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
