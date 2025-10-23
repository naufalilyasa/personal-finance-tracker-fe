"use client";

import { FinanceSummaryCards } from "@/components/finance-summary-card";
import { BudgetWarning } from "@/components/budget-warning";
import { IncomeExpenseChart } from "@/components/income-expense-chart";
import { CategoryChart } from "@/components/category-chart";
import { RecentTransactions } from "@/components/recent-transactions";
import { Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { Transactions, TransactionsResponse } from "@/types/transactions-types";
import SpinLoading from "@/components/spin-loading";
import { apiFetch } from "@/lib/api";

const { Title } = Typography;

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transactions[] | null>([
    {
      id: 0,
      user_id: 0,
      type: "expense",
      amount: "0",
      category: "",
      description: "",
      date: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await apiFetch<TransactionsResponse>("/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTransactions(data.data);
      } catch (error) {
        setTransactions(null);
      } finally {
        setIsLoading(false);
      }
    };

    getTransactions();
  }, []);

  if (isLoading) return <SpinLoading />;
  if (!transactions) return <p>No Data</p>;
  return (
    <Space direction="vertical" size="large" className="w-full">
      <Title level={2} className="m-0">
        Dashboard
      </Title>

      <BudgetWarning transactions={transactions} />

      <FinanceSummaryCards />

      <IncomeExpenseChart filteredTransactions={transactions} />

      <CategoryChart filteredTransactions={transactions} />

      <RecentTransactions transactions={transactions} />
    </Space>
  );
};

export default Dashboard;
