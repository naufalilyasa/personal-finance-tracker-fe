import { GenericResponse } from "./auth-types";

export type TransactionsResponse = GenericResponse & {
  data: Transactions[];
};

export type Transactions = {
  id: number;
  user_id: number;
  type: "expense" | "income";
  amount: string;
  category: string;
  description: string;
  date: string;
};

export type TransactionSummaryResponse = GenericResponse & {
  data: TransactionSummary;
};

export type TransactionSummary = {
  income: number;
  expense: number;
  balance: number;
};

export type TransactionFilters = {
  startDate: string | null;
  endDate: string | null;
  type: "all" | "income" | "expense";
};
