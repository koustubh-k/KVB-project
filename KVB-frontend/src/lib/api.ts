import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
export const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:5001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Customer auth
  customerSignup: (data: any) => api.post("/customer-auth/signup", data),
  customerLogin: (data: any) => api.post("/customer-auth/login", data),
  customerLogout: () => api.post("/customer-auth/logout"),

  // Worker auth
  workerSignup: (data: any) => api.post("/worker-auth/signup", data),
  workerLogin: (data: any) => api.post("/worker-auth/login", data),
  workerLogout: () => api.post("/worker-auth/logout"),

  // Admin auth
  adminSignup: (data: any) => api.post("/admin-auth/signup", data),
  adminLogin: (data: any) => api.post("/admin-auth/login", data),
  adminLogout: () => api.post("/admin-auth/logout"),

  // Sales auth
  salesSignup: (data: any) => api.post("/sales-auth/signup", data),
  salesLogin: (data: any) => api.post("/sales-auth/login", data),
  salesLogout: () => api.post("/sales-auth/logout"),
  salesForgotPassword: (data: any) =>
    api.post("/sales-auth/forgot-password", data),
  salesResetPassword: (token: string, data: any) =>
    api.put(`/sales-auth/reset-password/${token}`, data),
};

// Products API
export const productsAPI = {
  getPublicProducts: () => api.get("/products/public"),
  getPublicProductById: (id: string) => api.get(`/products/public/${id}`),
  getCustomerProducts: () => api.get("/products/customer"),
  getCustomerProductById: (id: string) => api.get(`/products/customer/${id}`),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard"),

  // Customers
  getAllCustomers: () => api.get("/admin/customers"),
  getCustomerById: (id: string) => api.get(`/admin/customers/${id}`),
  createCustomer: (data: any) => api.post("/admin/customers", data),
  updateCustomer: (id: string, data: any) =>
    api.put(`/admin/customers/${id}`, data),
  deleteCustomer: (id: string) => api.delete(`/admin/customers/${id}`),

  // Workers
  getAllWorkers: () => api.get("/admin/workers"),
  getWorkerById: (id: string) => api.get(`/admin/workers/${id}`),
  createWorker: (data: any) => api.post("/admin/workers", data),
  updateWorker: (id: string, data: any) =>
    api.put(`/admin/workers/${id}`, data),
  deleteWorker: (id: string) => api.delete(`/admin/workers/${id}`),

  // Sales
  getAllSales: () => api.get("/admin/sales"),

  // Leads
  getAllLeads: () => api.get("/admin/leads"),
  getLeadById: (id: string) => api.get(`/admin/leads/${id}`),
  updateLead: (id: string, data: any) => api.put(`/admin/leads/${id}`, data),
  sendLeadEmail: (id: string, data: any) =>
    api.post(`/admin/leads/${id}/email`, data),

  // Quotations
  getAllQuotations: () => api.get("/admin/quotations"),
  getQuotationById: (id: string) => api.get(`/admin/quotations/${id}`),
  updateQuotation: (id: string, data: any) =>
    api.put(`/admin/quotations/${id}`, data),
  sendQuotationEmail: (id: string, data: any) =>
    api.post(`/admin/quotations/${id}/email`, data),

  // Products
  getAllProducts: () => api.get("/admin/products"),
  createProduct: (data: FormData) => api.post("/admin/products", data),
  updateProduct: (id: string, data: FormData) =>
    api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),

  // Tasks
  getAllTasks: () => api.get("/admin/tasks"),
  createTask: (data: any) => api.post("/admin/tasks", data),
  updateTask: (id: string, data: any) => api.put(`/admin/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/admin/tasks/${id}`),

  // Bulk operations
  bulkImportProducts: (data: FormData) =>
    api.post("/admin/bulk-import/products", data),
  bulkImportTasks: (data: FormData) =>
    api.post("/admin/bulk-import/tasks", data),
  bulkImportCustomers: (data: FormData) =>
    api.post("/admin/bulk-import/customers", data),
  exportData: (type: string) => api.get(`/admin/export/${type}`),
};

// Worker/Tasks API
export const tasksAPI = {
  getWorkerTasks: () => api.get("/tasks/worker/assigned"),
  markTaskComplete: (taskId: string) =>
    api.put(`/tasks/worker/complete/${taskId}`),
  updateTaskStatus: (taskId: string, data: any) =>
    api.put(`/tasks/worker/update-status/${taskId}`, data),
};

// Sales API
export const salesAPI = {
  // Leads
  getLeads: () => api.get("/sales/leads"),
  getLeadById: (id: string) => api.get(`/sales/leads/${id}`),
  createLead: (data: any) => api.post("/sales/leads", data),
  updateLead: (id: string, data: any) => api.put(`/sales/leads/${id}`, data),
  deleteLead: (id: string) => api.delete(`/sales/leads/${id}`),
  sendLeadEmail: (id: string, data: any) =>
    api.post(`/sales/leads/${id}/email`, data),
  addLeadNote: (leadId: string, data: any) =>
    api.post(`/sales/leads/${leadId}/notes`, data),

  // Email follow-up
  sendFollowUpEmail: (data: any) => api.post("/sales/send-email", data),

  // Quotations
  getQuotations: () => api.get("/sales/quotations"),
  getQuotationById: (id: string) => api.get(`/sales/quotations/${id}`),
  createQuotation: (data: {
    productId: string;
    details: string;
    price: number;
  }) => api.post("/sales/quotations", data),
  updateQuotation: (
    id: string,
    data: {
      productId?: string;
      details?: string;
      status?: string;
      price?: number;
    }
  ) => api.put(`/sales/quotations/${id}`, data),
  deleteQuotation: (id: string) => api.delete(`/sales/quotations/${id}`),
  sendQuotationEmail: (id: string, data: any) =>
    api.post(`/sales/quotations/${id}/email`, data),

  // Products
  getProducts: () => api.get("/products"),
};

// Customer API
export const customerAPI = {
  // Enquiries
  submitEnquiry: (data: FormData) => api.post("/customer/enquiries", data),
  getEnquiries: () => api.get("/customer/enquiries"),

  // Projects
  getProjects: () => api.get("/customer/projects"),
};

export default api;
