import {
  Card,
  Table,
  Tag,
  Button,
  DatePicker,
  Space,
  Popconfirm,
  Select,
  Row,
  Col,
} from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { format, parseISO } from "date-fns";
import type { Dayjs } from "dayjs";
import { Transactions } from "@/types/transactions-types";

const { RangePicker } = DatePicker;

interface TransactionHistoryProps {
  filteredTransactions: Transactions[];
  dateRange: [Dayjs | null, Dayjs | null] | null;
  filterType: "all" | "income" | "expense";
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  onTypeChange: (value: "all" | "income" | "expense") => void;
  onResetFilters: () => void;
  onExportCSV: () => void;
  onEdit: (transaction: Transactions) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: boolean;
}

export const TransactionHistory = ({
  filteredTransactions,
  dateRange,
  filterType,
  onDateRangeChange,
  onTypeChange,
  onResetFilters,
  onExportCSV,
  onEdit,
  onDelete,
  isLoadingDelete,
}: TransactionHistoryProps) => {
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => format(parseISO(date), "MMM dd, yyyy"),
      sorter: (a: Transactions, b: Transactions) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
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
      filters: Array.from(
        new Set(filteredTransactions.map((t) => t.category))
      ).map((cat) => ({ text: cat, value: cat })),
      onFilter: (value: unknown, record: Transactions) =>
        record.category === value,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
          {record.type === "income" ? "+" : "-"}Rp
          {new Intl.NumberFormat("id-ID").format(parseFloat(amount))}
        </span>
      ),
      sorter: (a: Transactions, b: Transactions) =>
        parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: "right" as const,
      render: (_: unknown, record: Transactions) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete transaction"
            description="Are you sure you want to delete this transaction?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={isLoadingDelete}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Transaction History">
      {/* FILTER SECTION */}
      <div style={{ marginBottom: 16 }}>
        <Space
          direction="vertical"
          size="middle"
          style={{
            width: "100%",
            background: "#fafafa",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterOutlined style={{ fontSize: 16 }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Filters</span>
          </div>

          <Row gutter={[16, 16]}>
            {/* Date Range Filter */}
            <Col xs={24} sm={12} lg={10}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  Date Range
                </label>
                <RangePicker
                  style={{ width: "100%" }}
                  value={dateRange}
                  onChange={onDateRangeChange}
                  format="YYYY-MM-DD"
                  placeholder={["Start Date", "End Date"]}
                />
              </div>
            </Col>

            {/* Type Filter */}
            <Col xs={24} sm={12} lg={8}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  Transaction Type
                </label>
                <Select
                  style={{ width: "100%" }}
                  value={filterType}
                  onChange={onTypeChange}
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "income", label: "Income Only" },
                    { value: "expense", label: "Expense Only" },
                  ]}
                />
              </div>
            </Col>

            {/* Action Buttons */}
            <Col xs={24} sm={24} lg={6}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  height: "100%",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onResetFilters}
                  style={{ flex: 1 }}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={onExportCSV}
                  style={{ flex: 1 }}
                >
                  Export
                </Button>
              </div>
            </Col>
          </Row>

          {/* Active Filters Display */}
          {(dateRange || filterType !== "all") && (
            <div
              style={{
                padding: 12,
                background: "#e6f7ff",
                borderRadius: 6,
                fontSize: 13,
                borderLeft: "3px solid #1890ff",
              }}
            >
              <strong>🔍 Active Filters:</strong>{" "}
              {dateRange && dateRange[0] && dateRange[1] && (
                <span>
                  Date:{" "}
                  <strong>
                    {format(dateRange[0].toDate(), "MMM dd, yyyy")}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {format(dateRange[1].toDate(), "MMM dd, yyyy")}
                  </strong>
                  {filterType !== "all" && " • "}
                </span>
              )}
              {filterType !== "all" && (
                <span>
                  Type:{" "}
                  <strong>
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </strong>
                </span>
              )}
            </div>
          )}
        </Space>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredTransactions}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} transactions`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        scroll={{ x: 1000 }}
        loading={isLoadingDelete}
      />
    </Card>
  );
};
