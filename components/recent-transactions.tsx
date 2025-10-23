"use client";
import { Card, Table, Tag } from "antd";
import { format, parseISO } from "date-fns";
import { Transactions } from "@/types/transactions-types";

interface RecentTransactionsProps {
  transactions: Transactions[];
}

export const RecentTransactions = ({
  transactions,
}: RecentTransactionsProps) => {
  const recentTransactions = transactions.slice(0, 5);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => format(parseISO(date), "MMM dd, yyyy"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "income" ? "green" : "red"}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string, record: Transactions) => (
        <span
          style={{
            color: record.type === "income" ? "#10b981" : "#ef4444",
            fontWeight: "bold",
          }}
        >
          {record.type === "income" ? "+" : "-"}Rp.{" "}
          {new Intl.NumberFormat("id-ID").format(parseFloat(amount))}
        </span>
      ),
    },
  ];

  return (
    <Card title="Recent Transactions">
      <Table
        columns={columns}
        dataSource={recentTransactions}
        rowKey="id"
        pagination={false}
        scroll={{ x: true }}
      />
    </Card>
  );
};
