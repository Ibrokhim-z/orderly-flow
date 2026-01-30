import { MetricCard } from '@/components/ui/MetricCard';
import { FinancialSummary } from '@/types';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface FinancialOverviewProps {
  data: FinancialSummary;
}

export const FinancialOverview = ({ data }: FinancialOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Общие продажи"
        value={`₸${data.totalSales.toLocaleString()}`}
        subtitle="Только выполненные заказы"
        icon={<DollarSign className="w-5 h-5" />}
        variant="sales"
        trend="up"
        trendValue="+12.5%"
      />
      <MetricCard
        title="Общие расходы"
        value={`₸${data.totalExpenses.toLocaleString()}`}
        subtitle="Все типы расходов"
        icon={<TrendingDown className="w-5 h-5" />}
        variant="expense"
        trend="down"
        trendValue="-3.2%"
      />
      <MetricCard
        title="Касса"
        value={`₸${data.cash.toLocaleString()}`}
        subtitle="Продажи - Расходы"
        icon={<Wallet className="w-5 h-5" />}
        variant="cash"
        trend="up"
        trendValue="+8.1%"
      />
      <MetricCard
        title="Чистая прибыль"
        value={`₸${data.netProfit.toLocaleString()}`}
        subtitle="После себестоимости"
        icon={<TrendingUp className="w-5 h-5" />}
        variant="profit"
        trend="up"
        trendValue="+15.3%"
      />
    </div>
  );
};