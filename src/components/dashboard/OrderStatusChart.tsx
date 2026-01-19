import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, OrderStatus } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OrderStatusChartProps {
  orders: Order[];
}

const statusColors: Record<OrderStatus, string> = {
  waiting: 'hsl(45, 93%, 47%)',
  accepted: 'hsl(221, 83%, 53%)',
  in_progress: 'hsl(25, 95%, 53%)',
  done: 'hsl(142, 71%, 45%)',
  delivered: 'hsl(262, 83%, 58%)',
};

const statusLabels: Record<OrderStatus, string> = {
  waiting: 'Waiting',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  done: 'Done',
  delivered: 'Delivered',
};

export const OrderStatusChart = ({ orders }: OrderStatusChartProps) => {
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: statusLabels[status as OrderStatus],
    value: count,
    status: status as OrderStatus,
  }));

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Order Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
