import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useClientStore } from '@/store/client-store';
import { useMemo } from 'react';
const COLORS = ['#1E40AF', '#10B981', '#F59E0B', '#64748B', '#EF4444', '#8B5CF6'];
export function ClientIndustryChart() {
  const clients = useClientStore((state) => state.clients);
  const data = useMemo(() => {
    const industryCounts = clients.reduce((acc, client) => {
      acc[client.industry] = (acc[client.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(industryCounts).map(([name, value]) => ({ name, value }));
  }, [clients]);
  if (data.length === 0) {
    return null;
  }
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Clients by Industry</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} client(s)`, 'Count']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}