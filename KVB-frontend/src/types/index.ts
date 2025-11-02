export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

export interface Customer extends User {
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Worker extends User {
  specialization: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Admin extends User {
  createdAt?: string;
  updatedAt?: string;
}

export interface Sales extends User {
  region: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price?: number;
  category?: string;
  stock?: number;
  images?: string[];
  specifications?: Record<string, string>;
  image?: string; // For public view
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  dueDate: string;
  location: string;
  attachments?: Attachment[];
  assignedTo: Worker[];
  assignedBy: Admin;
  customer: Customer;
  product?: Product;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  filename: string;
  url: string;
  publicId: string;
  uploadedAt: string;
}

export interface Comment {
  _id: string;
  user: string;
  userType: "Admin" | "Worker";
  comment: string;
  timestamp: string;
}

export interface AuthContextType {
  user: Customer | Worker | Admin | Sales | null;
  userType: "customer" | "worker" | "admin" | "sales" | null;
  login: (
    email: string,
    password: string,
    type: "customer" | "worker" | "admin" | "sales"
  ) => Promise<void>;
  signup: (
    data: any,
    type: "customer" | "worker" | "admin" | "sales"
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CustomerSignupFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface WorkerSignupFormData {
  fullName: string;
  email: string;
  password: string;
  specialization: string;
}

export interface AdminSignupFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface SalesSignupFormData {
  fullName: string;
  email: string;
  password: string;
  region: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  specifications: Record<string, string>;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignedTo: string[];
  customer: string;
  product?: string;
}

export interface LeadNote {
  _id?: string;
  message: string;
  addedBy?: {
    _id: string;
    fullName: string;
    email: string;
  };
  addedAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  customerId?: string;
  region: string;
  source: string;
  status: "new" | "contacted" | "follow-up pending" | "converted";
  notes: LeadNote[];
  message?: string; // Added message field for customer enquiries
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  _id: string;
  customerId: Customer;
  productId: Product;
  details: string;
  status: "new" | "contacted" | "quotation sent" | "closed" | "converted";
  createdBy: string;
  createdByModel: "Sales" | "Admin";
  price: number;
  region?: string;
  createdAt: string;
  updatedAt: string;
}
