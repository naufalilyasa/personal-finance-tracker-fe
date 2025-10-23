/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { Dayjs } from "dayjs";
import { useState, useMemo, useEffect } from "react";
import { Typography, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TransactionHistory } from "@/components/transaction-history";
import { TransactionFormModal } from "@/components/transaction-form-modal";
import { exportToCSV } from "@/utils/csv-export";
import { format } from "date-fns";
import { useNotificationContext } from "@/hooks/use-notification";
import { Transactions, TransactionsResponse } from "@/types/transactions-types";
import { apiFetch } from "@/lib/api";
import SpinLoading from "@/components/spin-loading";
import { TransactionFilters } from "@/types/transactions-types";

const { Title } = Typography;

const TransactionsContent = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    startDate: null,
    endDate: null,
    type: "all",
  });
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [transactions, setTransactions] = useState<Transactions[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transactions | undefined
  >();

  const [isLoadingGetTransactions, setIsLoadingGetTransactions] =
    useState<boolean>(true);
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const { openNotificationWithIcon } = useNotificationContext();

  // Fetch transactions with filters
  useEffect(() => {
    const getTransactions = async () => {
      setIsLoadingGetTransactions(true);
      try {
        const params = new URLSearchParams();

        if (filters.startDate) {
          params.append("start", filters.startDate);
        }

        if (filters.endDate) {
          params.append("end", filters.endDate);
        }

        if (filters.type !== "all") {
          params.append("type", filters.type);
        }

        const queryString = params.toString();
        const url = queryString
          ? `/transactions?${queryString}`
          : "/transactions";

        const data = await apiFetch<TransactionsResponse>(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setTransactions(data.data);
      } catch (error) {
        openNotificationWithIcon(
          "error",
          "Failed to fetch transactions",
          "Could not load transactions"
        );
        setTransactions(null);
      } finally {
        setIsLoadingGetTransactions(false);
      }
    };
    getTransactions();
  }, [filters, openNotificationWithIcon]);

  // Handle date range change
  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    setDateRange(dates);

    if (dates && dates[0] && dates[1]) {
      setFilters({
        ...filters,
        startDate: format(dates[0].toDate(), "yyyy-MM-dd"),
        endDate: format(dates[1].toDate(), "yyyy-MM-dd"),
      });
    } else {
      setFilters({
        ...filters,
        startDate: null,
        endDate: null,
      });
    }
  };

  // Handle type filter change
  const handleTypeChange = (value: "all" | "income" | "expense") => {
    setFilters({
      ...filters,
      type: value,
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      type: "all",
    });
    setDateRange(null);
  };

  const filteredTransactions = useMemo(() => {
    return transactions || [];
  }, [transactions]);

  if (isLoadingGetTransactions) return <SpinLoading />;
  if (!transactions) return <p>No Data</p>;

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions);
  };

  const handleCreateTransaction = async (
    transactionData: Omit<Transactions, "id" | "user_id">
  ) => {
    setIsLoadingCreate(true);
    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch<{ success: boolean; data: Transactions }>(
        "/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: transactionData.type,
            amount: transactionData.amount,
            category: transactionData.category,
            description: transactionData.description,
            date: transactionData.date,
          }),
        }
      );

      setTransactions([...transactions, response.data]);

      openNotificationWithIcon(
        "success",
        "Transaction created",
        "Your transaction has been created successfully."
      );

      return { success: true };
    } catch (error: any) {
      openNotificationWithIcon(
        "error",
        "Failed to create transaction",
        error.message || "Something went wrong"
      );
      return { success: false };
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleEditTransaction = async (
    transactionData: Omit<Transactions, "id" | "user_id">
  ) => {
    if (!editingTransaction) return;

    setIsLoadingUpdate(true);
    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch<{ success: boolean; data: Transactions }>(
        `/transactions/${editingTransaction.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: transactionData.type,
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            description: transactionData.description,
            date: transactionData.date,
          }),
        }
      );

      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id ? response.data : t
        )
      );

      setEditingTransaction(undefined);

      openNotificationWithIcon(
        "success",
        "Transaction updated",
        "Your transaction has been updated successfully."
      );

      return { success: true };
    } catch (error: any) {
      openNotificationWithIcon(
        "error",
        "Failed to update transaction",
        error.message || "Something went wrong"
      );
      return { success: false };
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    setIsLoadingDelete(true);
    try {
      const token = localStorage.getItem("token");

      await apiFetch<{ success: boolean; message: string }>(
        `/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(transactions.filter((t) => t.id !== id));

      openNotificationWithIcon(
        "success",
        "Transaction deleted",
        "Your transaction has been deleted successfully."
      );

      return { success: true };
    } catch (error: any) {
      openNotificationWithIcon(
        "error",
        "Failed to delete transaction",
        error.message || "Something went wrong"
      );
      return { success: false };
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const openEditModal = (transaction: Transactions) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            All Transactions
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            size="large"
          >
            Create Transaction
          </Button>
        </div>

        <TransactionHistory
          filteredTransactions={filteredTransactions}
          dateRange={dateRange}
          filterType={filters.type}
          onDateRangeChange={handleDateRangeChange}
          onTypeChange={handleTypeChange}
          onResetFilters={handleResetFilters}
          onExportCSV={handleExportCSV}
          onEdit={openEditModal}
          onDelete={handleDeleteTransaction}
          isLoadingDelete={isLoadingDelete}
        />
      </Space>

      <TransactionFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={
          editingTransaction ? handleEditTransaction : handleCreateTransaction
        }
        initialData={editingTransaction}
        mode={editingTransaction ? "edit" : "create"}
        isLoading={editingTransaction ? isLoadingUpdate : isLoadingCreate}
      />
    </>
  );
};

export default TransactionsContent;
