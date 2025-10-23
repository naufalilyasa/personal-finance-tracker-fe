import { Transactions } from "@/types/transactions-types";
import { Modal, Form, Input, Select, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transactions, "id" | "user_id">) => void;
  initialData?: Transactions;
  mode: "create" | "edit";
  isLoading: boolean;
}

export const TransactionFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading,
}: TransactionFormModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          type: initialData.type,
          amount: initialData.amount,
          category: initialData.category,
          description: initialData.description,
          date: dayjs(initialData.date),
        });
      } else {
        form.resetFields(); // untuk create mode
        form.setFieldsValue({
          type: "expense",
          amount: 0,
          date: dayjs(),
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        type: values.type,
        amount: values.amount,
        category: values.category,
        description: values.description,
        date: values.date.format("YYYY-MM-DD"),
      });
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={mode === "create" ? "Create Transaction" : "Edit Transaction"}
      open={open}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      onCancel={handleCancel}
      okText={mode === "create" ? "Create" : "Update"}
    >
      <Form
        form={form}
        layout="vertical"
        // initialValues={
        //   initialData
        //     ? {
        //         type: initialData.type,
        //         amount: initialData.amount,
        //         category: initialData.category,
        //         description: initialData.description,
        //         date: dayjs(initialData.date),
        //       }
        //     : {
        //         type: "expense",
        //         amount: 0,
        //         date: dayjs(),
        //       }
        // }
      >
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select type" }]}
        >
          <Select>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={2}
            prefix="Rp"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please enter category" }]}
        >
          <Input placeholder="e.g., Salary, Food, Rent" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
