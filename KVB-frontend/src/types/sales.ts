// Types for leads and quotations
export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: "North" | "South" | "East" | "West" | "Central";
  source: string;
  status: "new" | "contacted" | "follow-up pending" | "converted";
  notes?: string;
  message?: string; // Added message field for customer enquiries
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface Quotation {
  _id: string;
  customerId: Customer;
  productId: Product;
  price: number;
  status: "new" | "quotation sent" | "accepted" | "rejected";
  validUntil: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Component prop types
export interface LeadsQuotationsPanelProps {
  leads: Lead[];
  quotations: Quotation[];
  updateLeadStatus: (id: string, status: string, notes: string) => void;
  setSelectedLead: (lead: Lead) => void;
  createQuotation: (leadId: string) => void;
}
