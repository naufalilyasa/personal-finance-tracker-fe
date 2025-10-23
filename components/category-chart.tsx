import { Card, Segmented } from "antd";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Transactions } from "@/types/transactions-types";
import { formatCurrency } from "@/utils/format-currency";

interface CategoryChartProps {
  filteredTransactions: Transactions[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export const CategoryChart = ({ filteredTransactions }: CategoryChartProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");

  const categoryData = filteredTransactions
    .filter((t) => t.type === type)
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += parseFloat(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card
      title={`${type === "income" ? "Income" : "Expense"} by Category`}
      extra={
        <Segmented
          options={[
            { label: "Expense", value: "expense" },
            { label: "Income", value: "income" },
          ]}
          value={type}
          onChange={(value) => setType(value as "income" | "expense")}
        />
      }
      style={{ marginBottom: 16 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
