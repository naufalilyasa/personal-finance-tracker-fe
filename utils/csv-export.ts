import { Transactions } from "@/types/transactions-types";

export const exportToCSV = (
  transactions: Transactions[],
  filename: string = "transactions.csv"
) => {
  // Define CSV headers
  const headers = ["ID", "Date", "Type", "Category", "Description", "Amount"];

  // Convert transactions to CSV rows
  const csvRows = [
    headers.join(","),
    ...transactions.map((t) =>
      [
        t.id,
        t.date,
        t.type,
        t.category,
        `"${t.description}"`, // Wrap in quotes to handle commas in description
        parseFloat(t.amount).toFixed(2),
      ].join(",")
    ),
  ];

  // Create CSV string
  const csvString = csvRows.join("\n");

  // Create blob and download
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
