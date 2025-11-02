import api from "./api";

// Sales-specific API endpoints
export const salesApi = {
  // Leads
  getLeads: () => api.get("/sales/leads"),
  createLead: (data: {
    name: string;
    email: string;
    phone: string;
    region: string;
    source: string;
    notes?: string;
  }) => api.post("/sales/leads", data),
  updateLead: (id: string, data: { status: string; notes?: string }) =>
    api.put(`/sales/leads/${id}`, data),

  // Quotations
  getQuotations: () => api.get("/sales/quotations"),
  createQuotation: (data: {
    productId: string;
    customerId: string;
    price: number;
    terms: string;
    validUntil: string;
  }) => api.post("/sales/quotations", data),
  updateQuotation: (
    id: string,
    data: {
      status: string;
      price?: number;
      terms?: string;
      validUntil?: string;
    }
  ) => api.put(`/sales/quotations/${id}`, data),

  // Follow-up Emails
  sendFollowUpEmail: (data: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) => api.post("/sales/send-email", data),

  // Convert Lead to Quotation
  convertLeadToQuotation: (
    leadId: string,
    data: {
      productId: string;
      price: number;
      terms: string;
      validUntil: string;
    }
  ) => api.post(`/sales/leads/${leadId}/convert`, data),

  // Products
  getProducts: () => api.get("/products"),
};
