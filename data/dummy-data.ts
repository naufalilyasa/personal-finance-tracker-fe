export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Dummy users for authentication (password is "password123" for all)
export const dummyUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password_hash: "password123", // In real app, this would be hashed
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password_hash: "password123",
  },
];

export const currentUser: User = dummyUsers[0];

export const transactions: Transaction[] = [
  // January transactions
  {
    id: 1,
    user_id: 1,
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2025-01-01",
  },
  {
    id: 2,
    user_id: 1,
    type: "expense",
    amount: 1200,
    category: "Rent",
    description: "Monthly rent",
    date: "2025-01-05",
  },
  {
    id: 3,
    user_id: 1,
    type: "expense",
    amount: 300,
    category: "Food",
    description: "Groceries",
    date: "2025-01-08",
  },
  {
    id: 4,
    user_id: 1,
    type: "expense",
    amount: 150,
    category: "Transportation",
    description: "Gas and maintenance",
    date: "2025-01-10",
  },
  {
    id: 5,
    user_id: 1,
    type: "expense",
    amount: 200,
    category: "Entertainment",
    description: "Movies and dining",
    date: "2025-01-15",
  },
  {
    id: 6,
    user_id: 1,
    type: "income",
    amount: 500,
    category: "Freelance",
    description: "Side project",
    date: "2025-01-20",
  },

  // February transactions
  {
    id: 7,
    user_id: 1,
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2025-02-01",
  },
  {
    id: 8,
    user_id: 1,
    type: "expense",
    amount: 1200,
    category: "Rent",
    description: "Monthly rent",
    date: "2025-02-05",
  },
  {
    id: 9,
    user_id: 1,
    type: "expense",
    amount: 400,
    category: "Food",
    description: "Groceries",
    date: "2025-02-10",
  },
  {
    id: 10,
    user_id: 1,
    type: "expense",
    amount: 180,
    category: "Transportation",
    description: "Gas",
    date: "2025-02-12",
  },
  {
    id: 11,
    user_id: 1,
    type: "expense",
    amount: 250,
    category: "Entertainment",
    description: "Concert tickets",
    date: "2025-02-14",
  },
  {
    id: 12,
    user_id: 1,
    type: "expense",
    amount: 100,
    category: "Utilities",
    description: "Electricity bill",
    date: "2025-02-18",
  },

  // March transactions
  {
    id: 13,
    user_id: 1,
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2025-03-01",
  },
  {
    id: 14,
    user_id: 1,
    type: "expense",
    amount: 1200,
    category: "Rent",
    description: "Monthly rent",
    date: "2025-03-05",
  },
  {
    id: 15,
    user_id: 1,
    type: "expense",
    amount: 350,
    category: "Food",
    description: "Groceries",
    date: "2025-03-08",
  },
  {
    id: 16,
    user_id: 1,
    type: "expense",
    amount: 200,
    category: "Transportation",
    description: "Gas and parking",
    date: "2025-03-10",
  },
  {
    id: 17,
    user_id: 1,
    type: "income",
    amount: 800,
    category: "Freelance",
    description: "Consulting work",
    date: "2025-03-15",
  },
  {
    id: 18,
    user_id: 1,
    type: "expense",
    amount: 500,
    category: "Healthcare",
    description: "Medical checkup",
    date: "2025-03-20",
  },
  {
    id: 19,
    user_id: 1,
    type: "expense",
    amount: 150,
    category: "Entertainment",
    description: "Streaming services",
    date: "2025-03-25",
  },

  // April transactions (current month with budget warning)
  {
    id: 20,
    user_id: 1,
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2025-04-01",
  },
  {
    id: 21,
    user_id: 1,
    type: "expense",
    amount: 1200,
    category: "Rent",
    description: "Monthly rent",
    date: "2025-04-05",
  },
  {
    id: 22,
    user_id: 1,
    type: "expense",
    amount: 600,
    category: "Food",
    description: "Groceries and dining",
    date: "2025-04-10",
  },
  {
    id: 23,
    user_id: 1,
    type: "expense",
    amount: 250,
    category: "Transportation",
    description: "Gas",
    date: "2025-04-12",
  },
  {
    id: 24,
    user_id: 1,
    type: "expense",
    amount: 800,
    category: "Shopping",
    description: "New laptop",
    date: "2025-04-15",
  },
  {
    id: 25,
    user_id: 1,
    type: "expense",
    amount: 300,
    category: "Entertainment",
    description: "Weekend trip",
    date: "2025-04-18",
  },
  {
    id: 26,
    user_id: 1,
    type: "expense",
    amount: 1500,
    category: "Healthcare",
    description: "Dental work",
    date: "2025-04-20",
  },
];

export const monthlyBudget = 4000; // Monthly budget limit
