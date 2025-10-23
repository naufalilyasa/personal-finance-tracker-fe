"use client";
import { Alert } from "antd";
import { monthlyBudget } from "@/data/dummy-data";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { Transactions } from "@/types/transactions-types";

interface BudgetWarningProps {
  transactions: Transactions[];
}

export const BudgetWarning = ({ transactions }: BudgetWarningProps) => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const currentMonthExpenses = transactions
    .filter((t) => {
      const transactionDate = parseISO(t.date);
      return (
        t.type === "expense" &&
        isWithinInterval(transactionDate, { start: monthStart, end: monthEnd })
      );
    })
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const percentageUsed = (currentMonthExpenses / monthlyBudget) * 100;

  if (currentMonthExpenses >= monthlyBudget) {
    return (
      <Alert
        message="Budget Exceeded!"
        description={`You have spent $${currentMonthExpenses.toFixed(
          2
        )} this month, which exceeds your budget of $${monthlyBudget.toFixed(
          2
        )} by $${(currentMonthExpenses - monthlyBudget).toFixed(2)}.`}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  } else if (percentageUsed >= 80) {
    return (
      <Alert
        message="Budget Warning"
        description={`You have used ${percentageUsed.toFixed(
          0
        )}% of your monthly budget ($${currentMonthExpenses.toFixed(
          2
        )} of $${monthlyBudget.toFixed(2)}).`}
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  return null;
};
