import React, { useState } from "react";
import {
  Users,
  Package,
  ClipboardList,
  UserCheck,
  Plus,
  Settings,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CustomersTab from "@/components/admin/CustomersTab";
import WorkersTab from "@/components/admin/WorkersTab";
import ProductsTab from "@/components/admin/ProductsTab";
import TaskManager from "@/components/admin/TaskManager";
import SalesTab from "@/components/admin/SalesTab";
import QuotationsTab from "@/components/admin/QuotationsTab";
import UserManagementTab from "@/components/admin/UserManagementTab";
import DashboardStats from "@/components/admin/DashboardStats";

type TabType =
  | "overview"
  | "customers"
  | "workers"
  | "products"
  | "tasks"
  | "sales"
  | "quotations"
  | "users";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Settings },
    { id: "customers", label: "Customers", icon: Users },
    { id: "workers", label: "Workers", icon: UserCheck },
    { id: "products", label: "Products", icon: Package },
    { id: "tasks", label: "Tasks", icon: ClipboardList },
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "quotations", label: "Quotations", icon: FileText },
    { id: "users", label: "Users", icon: UserCheck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardStats />;
      case "customers":
        return <CustomersTab />;
      case "workers":
        return <WorkersTab />;
      case "products":
        return <ProductsTab />;
      case "tasks":
        return <TaskManager />;
      case "sales":
        return <SalesTab />;
      case "quotations":
        return <QuotationsTab />;
      case "users":
        return <UserManagementTab />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300 mt-2">
              Welcome back, {user?.fullName}. Manage your system from here.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Settings button removed as per requirements */}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 mb-6">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">{renderTabContent()}</div>
    </div>
  );
};

export default AdminDashboard;
