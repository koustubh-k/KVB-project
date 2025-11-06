import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Plus, Search, Edit, Trash2, Mail, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Lead, Quotation } from "@/types";
import { adminAPI } from "@/lib/api";
import toast from "react-hot-toast";

const SalesTab: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] =
    useState<"leads" | "quotations">("leads");
  const [searchTerm, setSearchTerm] = useState("");

  // Add Lead modal + form
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: "",
    email: "",
    phone: "",
    region: "",
    source: "",
    message: "",
  });

  // Fetch leads
  const {
    data: leads,
    isLoading: leadsLoading,
    error: leadsError,
  } = useQuery<Lead[]>("admin-leads", () =>
    adminAPI.getAllLeads().then((res) => res.data)
  );

  // Fetch quotations
  const {
    data: quotations,
    isLoading: quotationsLoading,
    error: quotationsError,
  } = useQuery<Quotation[]>("admin-quotations", () =>
    adminAPI.getAllQuotations().then((res) => res.data)
  );

  // Create lead (uses new adminAPI.createLead -> proxies to /sales/leads)
  const createLeadMutation = useMutation(
    (leadData: Partial<Lead>) => adminAPI.createLead(leadData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-leads");
        toast.success("Lead created successfully");
        setShowAddLead(false);
        setNewLead({
          name: "",
          email: "",
          phone: "",
          region: "",
          source: "",
          message: "",
        });
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create lead";
        console.error("Failed to create lead:", err);
        toast.error(msg);
      },
    }
  );

  // Delete lead (soft delete via status)
  const deleteLeadMutation = useMutation(
    (leadId: string) => adminAPI.updateLead(leadId, { status: "deleted" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-leads");
        toast.success("Lead deleted successfully");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to delete lead";
        toast.error(msg);
      },
    }
  );

  // Cancel quotation
  const deleteQuotationMutation = useMutation(
    (quotationId: string) =>
      adminAPI.updateQuotation(quotationId, { status: "cancelled" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-quotations");
        toast.success("Quotation cancelled successfully");
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to cancel quotation";
        toast.error(msg);
      },
    }
  );

  // Send lead email
  const sendLeadEmailMutation = useMutation(
    ({ leadId, emailData }: { leadId: string; emailData: any }) =>
      adminAPI.sendLeadEmail(leadId, emailData),
    {
      onSuccess: () => {
        toast.success("Email sent successfully to lead");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Failed to send email";
        console.error("Failed to send email to lead:", error);
        toast.error(msg);
      },
    }
  );

  // Send quotation email
  const sendQuotationEmailMutation = useMutation(
    ({ quotationId, emailData }: { quotationId: string; emailData: any }) =>
      adminAPI.sendQuotationEmail(quotationId, emailData),
    {
      onSuccess: () => {
        toast.success("Email sent successfully about quotation");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Failed to send email";
        console.error("Failed to send quotation email:", error);
        toast.error(msg);
      },
    }
  );

  const filteredLeads = (leads || []).filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.message || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuotations = (quotations || []).filter(
    (quotation) =>
      (quotation.customerId?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (quotation.productId?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500 text-white";
      case "contacted":
        return "bg-yellow-500 text-black";
      case "follow-up pending":
        return "bg-orange-500 text-white";
      case "converted":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getQuotationStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500 text-white";
      case "contacted":
        return "bg-yellow-500 text-black";
      case "quotation sent":
        return "bg-purple-500 text-white";
      case "closed":
        return "bg-red-500 text-white";
      case "converted":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

  const handleDeleteLead = (leadId: string, leadName: string) => {
    if (window.confirm(`Are you sure you want to delete lead "${leadName}"?`)) {
      deleteLeadMutation.mutate(leadId);
    }
  };

  const handleDeleteQuotation = (quotationId: string, customerName: string) => {
    if (window.confirm(`Are you sure you want to cancel quotation for "${customerName}"?`)) {
      deleteQuotationMutation.mutate(quotationId);
    }
  };

  const handleSendLeadEmail = (lead: Lead) => {
    const subject = `Follow-up regarding your enquiry - KVB Green Energies`;
    const message = `Dear ${lead.name},\n\nThank you for your interest in our products. We'd like to follow up on your recent enquiry.\n\nPlease let us know if you have any questions or need further information.\n\nBest regards,\nKVB Sales Team`;
    sendLeadEmailMutation.mutate({ leadId: lead._id, emailData: { subject, message } });
  };

  const handleSendQuotationEmail = (quotation: Quotation) => {
    const customerName = quotation.customerId?.fullName || "Customer";
    const productName = quotation.productId?.name || "Product";
    const subject = `Quotation for ${productName} (ID: ${quotation._id}) - KVB Green Energies`;
    const message = `Dear ${customerName},\n\nPlease find attached your quotation for ${productName}.\n\nDetails:\nProduct: ${productName}\nPrice: ${formatPrice(quotation.price)}\nStatus: ${quotation.status}\n\nWe look forward to hearing from you.\n\nBest regards,\nKVB Sales Team`;
    sendQuotationEmailMutation.mutate({ quotationId: quotation._id, emailData: { subject, message } });
  };

  // Create lead submit
  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) {
      toast.error("Name and email are required");
      return;
    }
    // Clean payload to avoid backend 500s from unexpected shapes
    const payload = {
      name: newLead.name.trim(),
      email: newLead.email.trim(),
      phone: (newLead.phone || "").toString().trim(),
      region: (newLead.region || "").trim(),
      source: (newLead.source || "").trim(),
      message: (newLead.message || "").trim(),
      // If your backend expects a default status, uncomment:
      // status: "new",
    };
    createLeadMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Sales Management</h2>
          <p className="text-gray-300 mt-1">Manage leads and quotations across all regions</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-primary" onClick={() => setShowAddLead(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <nav className="flex space-x-8 px-6" aria-label="Sub-tabs">
          {[
            { id: "leads", label: "Leads", count: (leads || []).length },
            { id: "quotations", label: "Quotations", count: (quotations || []).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as "leads" | "quotations")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeSubTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-400 hover:text-gray-2 00 hover:border-gray-600"
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Content */}
      {activeSubTab === "leads" ? (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {(filteredLeads || []).map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{lead.name}</div>
                      <div className="text-sm text-gray-300">{lead.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{lead.email}</div>
                      <div className="text-sm text-gray-300">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{lead.region}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white max-w-xs truncate">{lead.message || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 p-1" title="View Lead">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300 p-1" title="Edit Lead">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-400 hover:text-green-300 p-1"
                          title="Send Email"
                          onClick={() => handleSendLeadEmail(lead)}
                          disabled={sendLeadEmailMutation.isLoading}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Lead"
                          onClick={() => handleDeleteLead(lead._id, lead.name)}
                          disabled={deleteLeadMutation.isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {(filteredQuotations || []).map((quotation) => (
                  <tr key={quotation._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {quotation.customerId?.fullName || "No Customer"}
                      </div>
                      <div className="text-sm text-gray-300">{quotation.customerId?.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{quotation.productId?.name || "No Product"}</div>
                      <div className="text-sm text-gray-300">{quotation.details}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{formatPrice(quotation.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQuotationStatusColor(
                          quotation.status
                        )}`}
                      >
                        {quotation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 p-1" title="View Quotation">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300 p-1" title="Edit Quotation">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-400 hover:text-green-300 p-1"
                          title="Send Email"
                          onClick={() => handleSendQuotationEmail(quotation)}
                          disabled={sendQuotationEmailMutation.isLoading}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Cancel Quotation"
                          onClick={() =>
                            handleDeleteQuotation(
                              quotation._id,
                              quotation.customerId?.fullName || "Customer"
                            )
                          }
                          disabled={deleteQuotationMutation.isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              if (!createLeadMutation.isLoading) setShowAddLead(false);
            }}
          />
          <div className="relative w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6 z-10 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Add Lead</h3>
            <form onSubmit={handleCreateLeadSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-300">Name</label>
                <input
                  className="input w-full mt-1"
                  value={newLead.name}
                  onChange={(e) => setNewLead((s) => ({ ...s, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Email</label>
                <input
                  className="input w-full mt-1"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead((s) => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-300">Phone</label>
                  <input
                    className="input w-full mt-1"
                    value={newLead.phone}
                    onChange={(e) => setNewLead((s) => ({ ...s, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300">Region</label>
                  <input
                    className="input w-full mt-1"
                    value={newLead.region}
                    onChange={(e) => setNewLead((s) => ({ ...s, region: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300">Source</label>
                <input
                  className="input w-full mt-1"
                  value={newLead.source}
                  onChange={(e) => setNewLead((s) => ({ ...s, source: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Message</label>
                <textarea
                  className="input w-full mt-1 min-h-[80px]"
                  value={newLead.message}
                  onChange={(e) => setNewLead((s) => ({ ...s, message: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    if (!createLeadMutation.isLoading) setShowAddLead(false);
                  }}
                  disabled={createLeadMutation.isLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createLeadMutation.isLoading}>
                  {createLeadMutation.isLoading ? "Creating..." : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTab;
