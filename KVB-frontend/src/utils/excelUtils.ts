import * as XLSX from "xlsx";

interface TaskRow {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  location: string;
  dueDate: string;
  assignedToId: string;
  customerId: string;
  productId?: string;
}

export const generateTaskTemplate = () => {
  const headers = [
    "Title",
    "Description",
    "Priority",
    "Status",
    "Location",
    "Due Date",
    "Assigned To ID",
    "Customer ID",
    "Product ID",
  ];

  const sampleData = [
    {
      Title: "Install Solar Cooker",
      Description: "Install and test solar cooker at customer location",
      Priority: "high",
      Status: "pending",
      Location: "123 Main St, Mumbai",
      "Due Date": "2025-12-31",
      "Assigned To ID": "worker123",
      "Customer ID": "customer456",
      "Product ID": "product789",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData, {
    header: headers,
  });

  // Add validation rules and formatting
  ws["!cols"] = headers.map(() => ({ width: 15 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tasks");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
};

export const parseTasksExcel = (buffer: ArrayBuffer): TaskRow[] => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data.map((row: any) => ({
    title: row.Title,
    description: row.Description,
    priority: row.Priority?.toLowerCase() || "medium",
    status: row.Status?.toLowerCase() || "pending",
    location: row.Location,
    dueDate: row["Due Date"],
    assignedToId: row["Assigned To ID"],
    customerId: row["Customer ID"],
    productId: row["Product ID"],
  }));
};

export const exportTasksToExcel = (tasks: any[]) => {
  const headers = [
    "Title",
    "Description",
    "Priority",
    "Status",
    "Location",
    "Due Date",
    "Assigned To",
    "Customer",
    "Product",
  ];

  const data = tasks.map((task) => ({
    Title: task.title,
    Description: task.description,
    Priority: task.priority,
    Status: task.status,
    Location: task.location,
    "Due Date": task.dueDate,
    "Assigned To": task.assignedTo?.fullName || "",
    Customer: task.customer?.fullName || "",
    Product: task.product?.name || "",
  }));

  const ws = XLSX.utils.json_to_sheet(data, {
    header: headers,
  });

  ws["!cols"] = headers.map(() => ({ width: 15 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tasks");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
};
