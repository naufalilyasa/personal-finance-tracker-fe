"use client";
import { useState, useEffect } from "react";
import { Alert, Button, Input, Modal, Progress, Card, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { Transactions } from "@/types/transactions-types";

interface BudgetWarningProps {
  transactions: Transactions[];
}

export const BudgetWarning = ({ transactions }: BudgetWarningProps) => {
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputBudget, setInputBudget] = useState<string>("");

  // Load budget from localStorage on mount
  useEffect(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");
    if (savedBudget) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMonthlyBudget(parseFloat(savedBudget));
    }
  }, []);

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

  const percentageUsed =
    monthlyBudget > 0 ? (currentMonthExpenses / monthlyBudget) * 100 : 0;

  const handleSetBudget = () => {
    const budget = parseFloat(inputBudget);
    if (!isNaN(budget) && budget > 0) {
      setMonthlyBudget(budget);
      localStorage.setItem("monthlyBudget", budget.toString());
      setIsModalOpen(false);
      setInputBudget("");
    }
  };

  const openModal = () => {
    setInputBudget(monthlyBudget > 0 ? monthlyBudget.toString() : "");
    setIsModalOpen(true);
  };

  const getProgressColor = () => {
    if (percentageUsed >= 100) return "#ff4d4f";
    if (percentageUsed >= 80) return "#faad14";
    return "#52c41a";
  };

  const getProgressStatus = (): "success" | "exception" | "normal" => {
    if (percentageUsed >= 100) return "exception";
    if (percentageUsed >= 80) return "normal";
    return "success";
  };

  // Show setup message if no budget is set
  if (monthlyBudget === 0) {
    return (
      <>
        <Alert
          message="No Budget Set"
          description={
            <Space direction="vertical">
              <span>Set your monthly budget to track your expenses.</span>
              <Button type="primary" onClick={openModal}>
                Set Monthly Budget
              </Button>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Modal
          title="Set Monthly Budget"
          open={isModalOpen}
          onOk={handleSetBudget}
          onCancel={() => setIsModalOpen(false)}
          okText="Save"
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <label>Enter your monthly budget:</label>
            <Input
              prefix="Rp. "
              type="number"
              placeholder="e.g., 5000"
              value={inputBudget}
              onChange={(e) => setInputBudget(e.target.value)}
              onPressEnter={handleSetBudget}
              size="large"
            />
          </Space>
        </Modal>
      </>
    );
  }

  const remainingBudget = monthlyBudget - currentMonthExpenses;

  return (
    <>
      <Card style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 12 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
              Monthly Budget Tracker
            </h3>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={openModal}
              size="small"
            >
              Edit
            </Button>
          </div>

          <Progress
            percent={Math.min(percentageUsed, 100)}
            status={getProgressStatus()}
            strokeColor={getProgressColor()}
            format={(percent) => `${percent?.toFixed(1)}%`}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              fontSize: "14px",
            }}
          >
            <div>
              <div style={{ color: "#8c8c8c", marginBottom: 4 }}>Budget</div>
              <div style={{ fontWeight: 600, fontSize: "16px" }}>
                Rp.{" "}
                {new Intl.NumberFormat("id-ID").format(
                  parseFloat(monthlyBudget.toFixed(2))
                )}
              </div>
            </div>
            <div>
              <div style={{ color: "#8c8c8c", marginBottom: 4 }}>Spent</div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: getProgressColor(),
                }}
              >
                Rp.{" "}
                {new Intl.NumberFormat("id-ID").format(
                  parseFloat(currentMonthExpenses.toFixed(2))
                )}
              </div>
            </div>
            <div>
              <div style={{ color: "#8c8c8c", marginBottom: 4 }}>Remaining</div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: remainingBudget >= 0 ? "#52c41a" : "#ff4d4f",
                }}
              >
                Rp.{" "}
                {new Intl.NumberFormat("id-ID").format(
                  parseFloat(Math.abs(remainingBudget).toFixed(2))
                )}
              </div>
            </div>
          </div>
        </Space>
      </Card>

      {currentMonthExpenses >= monthlyBudget && (
        <Alert
          message="Budget Exceeded!"
          description={`You have exceeded your budget by Rp.${(
            currentMonthExpenses - monthlyBudget
          ).toFixed(2)}. Consider reviewing your expenses.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {percentageUsed >= 80 && percentageUsed < 100 && (
        <Alert
          message="Budget Warning"
          description={`You've used ${percentageUsed.toFixed(
            0
          )}% of your budget. You have Rp. ${remainingBudget.toFixed(
            2
          )} remaining for this month.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Modal
        title="Edit Monthly Budget"
        open={isModalOpen}
        onOk={handleSetBudget}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <label>Enter your monthly budget:</label>
          <Input
            prefix="Rp"
            type="number"
            placeholder="e.g., 5000"
            value={inputBudget}
            onChange={(e) => setInputBudget(e.target.value)}
            onPressEnter={handleSetBudget}
            size="large"
          />
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
            Current expenses this month: ${currentMonthExpenses.toFixed(2)}
          </div>
        </Space>
      </Modal>
    </>
  );
};
