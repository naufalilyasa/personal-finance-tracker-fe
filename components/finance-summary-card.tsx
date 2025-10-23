"use client";
import { Card, Row, Col, Statistic } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  TransactionSummary,
  TransactionSummaryResponse,
} from "@/types/transactions-types";
import SpinLoading from "./spin-loading";

export const FinanceSummaryCards = () => {
  const [transactionSummary, setTransactionSummary] =
    useState<TransactionSummary | null>({ income: 0, balance: 0, expense: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactionSummary = async () => {
      try {
        const data = await apiFetch<TransactionSummaryResponse>(
          "/transactions/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTransactionSummary(data.data);
      } catch (error) {
        setTransactionSummary(null);
      } finally {
        setIsLoading(false);
      }
    };

    getTransactionSummary();
  }, []);

  if (isLoading) return <SpinLoading />;

  if (!transactionSummary) return <p>No Data</p>;
  return (
    <Row gutter={16}>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Total Income"
            value={transactionSummary.income}
            precision={2}
            valueStyle={{ color: "#10b981" }}
            prefix="Rp"
            suffix={<ArrowUpOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Total Expense"
            value={transactionSummary.expense}
            precision={2}
            valueStyle={{ color: "#ef4444" }}
            suffix={<ArrowDownOutlined />}
            prefix="Rp"
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Balance"
            value={transactionSummary.balance}
            precision={2}
            valueStyle={{
              color: transactionSummary.balance >= 0 ? "#10b981" : "#ef4444",
            }}
            suffix={<WalletOutlined />}
            prefix="Rp"
          />
        </Card>
      </Col>
    </Row>
  );
};
