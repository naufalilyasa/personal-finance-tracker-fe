"use client";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";
import { Transactions } from "@/types/transactions-types";
import { formatCurrency } from "@/utils/format-currency";

interface IncomeExpenseChartProps {
  filteredTransactions: Transactions[];
}

export const IncomeExpenseChart = ({
  filteredTransactions,
}: IncomeExpenseChartProps) => {
  // Get current date
  const now = new Date();

  // Calculate 3 months ago from now
  const threeMonthsAgo = startOfMonth(subMonths(now, 2));

  // Filter transactions for last 3 months
  const recentTransactions = filteredTransactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return transactionDate >= threeMonthsAgo;
  });

  // Group by month
  const monthlyData = recentTransactions.reduce((acc, transaction) => {
    const month = format(parseISO(transaction.date), "MMM yyyy");

    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }

    if (transaction.type === "income") {
      acc[month].income += parseFloat(transaction.amount);
    } else {
      acc[month].expense += parseFloat(transaction.amount);
    }

    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  // Convert to array and sort by date
  const chartData = Object.values(monthlyData).sort((a, b) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime();
  });

  // Show message if no data
  if (chartData.length === 0) {
    return (
      <Card title="Income vs Expense by Month" style={{ marginBottom: 16 }}>
        <div className="text-center py-8 text-gray-500">
          No transaction data available for the last 3 months
        </div>
      </Card>
    );
  }

  // Format currency for tooltip

  return (
    <Card
      title={`Income vs Expense by Month (Last ${chartData.length} month${
        chartData.length > 1 ? "s" : ""
      })`}
      style={{ marginBottom: 16 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelStyle={{ color: "#000" }}
          />
          <Legend />
          <Bar
            dataKey="income"
            fill="#10b981"
            name="Income"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="expense"
            fill="#ef4444"
            name="Expense"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
