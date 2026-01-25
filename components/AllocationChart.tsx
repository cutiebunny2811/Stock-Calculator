import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Stock } from '../types';

interface AllocationChartProps {
  stocks: Stock[];
  remainingCash: number;
  totalCapital: number;
  isOverBudget: boolean;
  currency: 'THB' | 'USD';
}

const COLORS = [
  '#0891b2', // cyan-600
  '#2563eb', // blue-600
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#e11d48', // rose-600
  '#d97706', // amber-600
  '#059669', // emerald-600
];

const CustomTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const symbol = currency === 'THB' ? '฿' : '$';
    return (
      <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-lg shadow-2xl">
        <p className="text-white font-bold mb-1">{data.name}</p>
        <p className="text-sm text-cyan-400">
          {symbol}{data.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
           {data.percentage.toFixed(1)}% of portfolio
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  if (percent < 0.05) return null; // Don't show label if segment is too small

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const AllocationChart: React.FC<AllocationChartProps> = ({ 
  stocks, 
  remainingCash, 
  totalCapital,
  isOverBudget,
  currency
}) => {
  
  const data = React.useMemo(() => {
    // Basic stock data
    const chartData = stocks
      .filter(s => s.percentage > 0)
      .map(s => ({
        name: s.ticker || 'UNTITLED',
        value: (totalCapital * s.percentage) / 100,
        percentage: s.percentage
      }));

    // Add remaining cash segment if valid and not over budget
    if (!isOverBudget && remainingCash > 0) {
      chartData.push({
        name: 'CASH',
        value: remainingCash,
        percentage: (remainingCash / totalCapital) * 100
      });
    }

    return chartData;
  }, [stocks, remainingCash, totalCapital, isOverBudget]);

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-zinc-600 text-sm">
        Add stocks to see visualization
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={105}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
          label={renderCustomLabel}
          labelLine={false}
        >
          {data.map((entry, index) => {
            if (entry.name === 'CASH') {
              return <Cell key={`cell-cash`} fill="#27272a" />; // zinc-800
            }
            return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
          })}
        </Pie>
        <Tooltip content={(props) => <CustomTooltip {...props} currency={currency} />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          formatter={(value) => <span className="text-zinc-400 text-xs ml-1 font-medium">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};