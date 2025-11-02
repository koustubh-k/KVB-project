import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { salesAPI } from "@/lib/api";
import { Lead, Quotation } from "@/types";
import {
  Mail,
  Plus,
  Users,
  FileText,
  Filter,
  TrendingUp,
  DollarSign,
  Target,
  MapPin,
  Send,
  Eye,
  Edit,
  MessageSquare,
  Trash2,
  Search,
  MoreHorizontal,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const SalesDashboard: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  );
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCreateQuotation, setShowCreateQuotation] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Filters and search
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form data
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "North",
    source: "website",
    message: "",
  });

  const [quotationData, setQuotationData] = useState({
    productId: "",
    details: "",
    price: 0,
    leadId: "",
  });

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    text: "",
    html: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, quotationsRes] = await Promise.all([
        salesAPI.getLeads(),
        salesAPI.getQuotations(),
      ]);
      setLeads(leadsRes.data);
      setQuotations(quotationsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Lead operations
  const createLead = async () => {
    try {
      await salesAPI.createLead(leadData);
      setShowCreateLead(false);
      setLeadData({
        name: "",
        email: "",
        phone: "",
        region: "North",
        source: "website",
        message: "",
      });
      fetchData();
      toast.success("Lead created successfully!");
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead");
    }
  };

  const updateLead = async () => {
    if (!selectedLead) return;
    try {
      await salesAPI.updateLead(selectedLead._id, leadData);
      setShowLeadModal(false);
      setSelectedLead(null);
      fetchData();
      toast.success("Lead updated successfully!");
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const deleteLead = async (leadId: string, leadName: string) => {
    if (!window.confirm(`Are you sure you want to delete lead "${leadName}"?`))
      return;
    try {
      await salesAPI.deleteLead(leadId);
      fetchData();
      toast.success("Lead deleted successfully!");
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  const sendLeadEmail = async () => {
    try {
      if (selectedLead) {
        await salesAPI.sendLeadEmail(selectedLead._id, emailData);
      } else {
        await salesAPI.sendFollowUpEmail(emailData);
      }
      setShowEmailModal(false);
      setEmailData({ to: "", subject: "", text: "", html: "" });
      setSelectedLead(null);
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  // Quotation operations
  const createQuotation = async () => {
    try {
      await salesAPI.createQuotation(quotationData);
      setShowCreateQuotation(false);
      setQuotationData({
        productId: "",
        details: "",
        price: 0,
        leadId: "",
      });
      fetchData();
      toast.success("Quotation created successfully!");
    } catch (error) {
      console.error("Error creating quotation:", error);
      toast.error("Failed to create quotation");
    }
  };

  const updateQuotation = async () => {
    if (!selectedQuotation) return;
    try {
      await salesAPI.updateQuotation(selectedQuotation._id, quotationData);
      setShowQuotationModal(false);
      setSelectedQuotation(null);
      fetchData();
      toast.success("Quotation updated successfully!");
    } catch (error) {
      console.error("Error updating quotation:", error);
      toast.error("Failed to update quotation");
    }
  };

  const deleteQuotation = async (quotationId: string) => {
    if (!window.confirm("Are you sure you want to delete this quotation?"))
      return;
    try {
      await salesAPI.deleteQuotation(quotationId);
      fetchData();
      toast.success("Quotation deleted successfully!");
    } catch (error) {
      console.error("Error deleting quotation:", error);
      toast.error("Failed to delete quotation");
    }
  };

  const sendQuotationEmail = async () => {
    if (!selectedQuotation) return;
    try {
      await salesAPI.sendQuotationEmail(selectedQuotation._id, emailData);
      setShowEmailModal(false);
      setEmailData({ to: "", subject: "", text: "", html: "" });
      setSelectedQuotation(null);
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  // Modal handlers
  const openLeadModal = (lead: Lead, mode: "view" | "edit" = "view") => {
    setSelectedLead(lead);
    setLeadData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      region: lead.region,
      source: lead.source,
      message: lead.message || "",
    });
    setShowLeadModal(true);
  };

  const openQuotationModal = (
    quotation: Quotation,
    mode: "view" | "edit" = "view"
  ) => {
    setSelectedQuotation(quotation);
    setQuotationData({
      productId: quotation.productId?._id || "",
      details: quotation.details || "",
      price: quotation.price || 0,
      leadId: "",
    });
    setShowQuotationModal(true);
  };

  const openEmailModal = (target: Lead | Quotation) => {
    if ("email" in target) {
      // It's a lead
      setSelectedLead(target);
      setEmailData({ ...emailData, to: target.email });
    } else {
      // It's a quotation
      setSelectedQuotation(target);
      setEmailData({ ...emailData, to: target.customerId?.email || "" });
    }
    setShowEmailModal(true);
  };

  // Filter leads based on region, status, and search
  const filteredLeads = leads.filter((lead) => {
    const matchesRegion =
      regionFilter === "all" || lead.region === regionFilter;
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesStatus && matchesSearch;
  });

  // Calculate pipeline analytics
  const pipelineStats = {
    totalRevenue: quotations
      .filter((q) => q.status === "converted")
      .reduce((sum, q) => sum + (q.price || 0), 0),
    conversionRate:
      leads.length > 0
        ? (
            (leads.filter((l) => l.status === "converted").length /
              leads.length) *
            100
          ).toFixed(1)
        : "0",
    avgQuotationValue:
      quotations.length > 0
        ? (
            quotations.reduce((sum, q) => sum + (q.price || 0), 0) /
            quotations.length
          ).toFixed(2)
        : "0",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Dashboard</h1>
          <p className="text-gray-300 mt-2">Welcome back, {user?.fullName}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreateLead(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
          <button
            onClick={() => setShowCreateQuotation(true)}
            className="btn btn-outline flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            New Quotation
          </button>
        </div>
      </div>

      {/* Pipeline Analytics */}
      <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Pipeline Analytics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-w-max">
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              ${pipelineStats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Total Revenue</p>
          </div>
          <div className="text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {pipelineStats.conversionRate}%
            </p>
            <p className="text-sm text-gray-400">Conversion Rate</p>
          </div>
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              ${pipelineStats.avgQuotationValue}
            </p>
            <p className="text-sm text-gray-400">Avg Quotation Value</p>
          </div>
          <div className="text-center">
            <MapPin className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {new Set(leads.map((l) => l.region)).size}
            </p>
            <p className="text-sm text-gray-400">Active Regions</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors duration-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Leads</p>
              <p className="text-2xl font-bold text-white">{leads.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors duration-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Quotations</p>
              <p className="text-2xl font-bold text-white">
                {quotations.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-750 transition-colors duration-200">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Follow-ups</p>
              <p className="text-2xl font-bold text-white">
                {leads.filter((l) => l.status === "follow-up pending").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">Leads Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full sm:w-64"
              />
            </div>
            {/* Filters */}
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="Central">Central</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow-up pending">Follow-up Pending</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-96">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Region</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 font-medium">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                      {lead.region}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        lead.status === "new"
                          ? "bg-blue-500 text-white"
                          : lead.status === "contacted"
                            ? "bg-yellow-500 text-black"
                            : lead.status === "follow-up pending"
                              ? "bg-orange-500 text-white"
                              : "bg-green-500 text-white"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openLeadModal(lead, "view")}
                        className="text-blue-500 hover:text-blue-400 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openLeadModal(lead, "edit")}
                        className="text-yellow-500 hover:text-yellow-400 p-1"
                        title="Edit Lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowChatModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="View Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEmailModal(lead)}
                        className="text-green-500 hover:text-green-400 p-1"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setQuotationData({
                            productId: "",
                            details: "",
                            price: 0,
                            leadId: lead._id,
                          });
                          setShowCreateQuotation(true);
                        }}
                        className="text-purple-500 hover:text-purple-400 p-1"
                        title="Create Quotation"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLead(lead._id, lead.name)}
                        className="text-red-500 hover:text-red-400 p-1"
                        title="Delete Lead"
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
        {filteredLeads.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {searchTerm || regionFilter !== "all" || statusFilter !== "all"
                ? "No leads found matching your filters."
                : "No leads available."}
            </p>
          </div>
        )}
      </div>

      {/* Quotations Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">
            Quotations Management
          </h2>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-96">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr
                  key={quotation._id}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 font-medium">
                    {quotation.productId?.name}
                  </td>
                  <td className="px-6 py-4">
                    {quotation.customerId?.fullName}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    {quotation.details}
                  </td>
                  <td className="px-6 py-4">${quotation.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        quotation.status === "new"
                          ? "bg-blue-500 text-white"
                          : quotation.status === "quotation sent"
                            ? "bg-yellow-500 text-black"
                            : quotation.status === "converted"
                              ? "bg-green-500 text-white"
                              : quotation.status === "closed"
                                ? "bg-red-500 text-white"
                                : "bg-gray-500 text-white"
                      }`}
                    >
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openQuotationModal(quotation, "view")}
                        className="text-blue-500 hover:text-blue-400 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openQuotationModal(quotation, "edit")}
                        className="text-yellow-500 hover:text-yellow-400 p-1"
                        title="Edit Quotation"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEmailModal(quotation)}
                        className="text-green-500 hover:text-green-400 p-1"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuotation(quotation._id)}
                        className="text-red-500 hover:text-red-400 p-1"
                        title="Delete Quotation"
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
        {quotations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No quotations available.</p>
          </div>
        )}
      </div>

      {/* Create Lead Modal */}
      {showCreateLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Create New Lead
                </h3>
                <button
                  onClick={() => setShowCreateLead(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={leadData.name}
                    onChange={(e) =>
                      setLeadData({ ...leadData, name: e.target.value })
                    }
                    className="input w-full"
                    placeholder="Enter lead name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={leadData.email}
                    onChange={(e) =>
                      setLeadData({ ...leadData, email: e.target.value })
                    }
                    className="input w-full"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={leadData.phone}
                    onChange={(e) =>
                      setLeadData({ ...leadData, phone: e.target.value })
                    }
                    className="input w-full"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={leadData.region}
                    onChange={(e) =>
                      setLeadData({ ...leadData, region: e.target.value })
                    }
                    className="input w-full"
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source
                  </label>
                  <select
                    value={leadData.source}
                    onChange={(e) =>
                      setLeadData({ ...leadData, source: e.target.value })
                    }
                    className="input w-full"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                    <option value="cold-call">Cold Call</option>
                    <option value="trade-show">Trade Show</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={leadData.message}
                    onChange={(e) =>
                      setLeadData({ ...leadData, message: e.target.value })
                    }
                    placeholder="Additional notes or requirements..."
                    className="input w-full h-24"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateLead(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={createLead} className="btn btn-primary">
                  Create Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Modal (View/Edit) */}
      {showLeadModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedLead ? "Edit Lead" : "View Lead"}
                </h3>
                <button
                  onClick={() => {
                    setShowLeadModal(false);
                    setSelectedLead(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={leadData.name}
                    onChange={(e) =>
                      setLeadData({ ...leadData, name: e.target.value })
                    }
                    className="input w-full"
                    disabled={!selectedLead}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={leadData.email}
                    onChange={(e) =>
                      setLeadData({ ...leadData, email: e.target.value })
                    }
                    className="input w-full"
                    disabled={!selectedLead}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={leadData.phone}
                    onChange={(e) =>
                      setLeadData({ ...leadData, phone: e.target.value })
                    }
                    className="input w-full"
                    disabled={!selectedLead}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={leadData.region}
                    onChange={(e) =>
                      setLeadData({ ...leadData, region: e.target.value })
                    }
                    className="input w-full"
                    disabled={!selectedLead}
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source
                  </label>
                  <select
                    value={leadData.source}
                    onChange={(e) =>
                      setLeadData({ ...leadData, source: e.target.value })
                    }
                    className="input w-full"
                    disabled={!selectedLead}
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                    <option value="cold-call">Cold Call</option>
                    <option value="trade-show">Trade Show</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedLead?.status || ""}
                    onChange={(e) => {
                      if (selectedLead) {
                        const updatedLead = {
                          ...selectedLead,
                          status: e.target.value as Lead["status"],
                        };
                        setSelectedLead(updatedLead);
                      }
                    }}
                    className="input w-full"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow-up pending">Follow-up Pending</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={leadData.message}
                    onChange={(e) =>
                      setLeadData({ ...leadData, message: e.target.value })
                    }
                    placeholder="Additional notes or requirements..."
                    className="input w-full h-24"
                    disabled={!selectedLead}
                  />
                </div>
              </div>
              {selectedLead && (
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setShowLeadModal(false);
                      setSelectedLead(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button onClick={updateLead} className="btn btn-primary">
                    Update Lead
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Quotation Modal */}
      {showCreateQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Create Quotation{" "}
                  {selectedLead ? `for ${selectedLead.name}` : ""}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateQuotation(false);
                    setSelectedLead(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product *
                  </label>
                  <select
                    value={quotationData.productId}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        productId: e.target.value,
                      })
                    }
                    className="input w-full"
                    required
                  >
                    <option value="">Select a product</option>
                    {/* Note: In a real app, you'd fetch products from API */}
                    <option value="507f1f77bcf86cd799439011">
                      Solar Cooker Dish
                    </option>
                    <option value="507f1f77bcf86cd799439012">
                      Solar Dryer
                    </option>
                    <option value="507f1f77bcf86cd799439013">
                      Solar Tunnel Dryer
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={quotationData.price}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="input w-full"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Details
                  </label>
                  <textarea
                    value={quotationData.details}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        details: e.target.value,
                      })
                    }
                    placeholder="Enter quotation details..."
                    className="input w-full h-24"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowCreateQuotation(false);
                    setSelectedLead(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={createQuotation} className="btn btn-primary">
                  Create Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Modal (View/Edit) */}
      {showQuotationModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedQuotation ? "Edit Quotation" : "View Quotation"}
                </h3>
                <button
                  onClick={() => {
                    setShowQuotationModal(false);
                    setSelectedQuotation(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product
                  </label>
                  <select
                    value={quotationData.productId}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        productId: e.target.value,
                      })
                    }
                    className="input w-full"
                    disabled={!selectedQuotation}
                  >
                    <option value="">Select a product</option>
                    <option value="507f1f77bcf86cd799439011">
                      Solar Cooker Dish
                    </option>
                    <option value="507f1f77bcf86cd799439012">
                      Solar Dryer
                    </option>
                    <option value="507f1f77bcf86cd799439013">
                      Solar Tunnel Dryer
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={quotationData.price}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="input w-full"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    disabled={!selectedQuotation}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedQuotation?.status || ""}
                    onChange={(e) => {
                      if (selectedQuotation) {
                        const updatedQuotation = {
                          ...selectedQuotation,
                          status: e.target.value as Quotation["status"],
                        };
                        setSelectedQuotation(updatedQuotation);
                      }
                    }}
                    className="input w-full"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="quotation sent">Quotation Sent</option>
                    <option value="closed">Closed</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Details
                  </label>
                  <textarea
                    value={quotationData.details}
                    onChange={(e) =>
                      setQuotationData({
                        ...quotationData,
                        details: e.target.value,
                      })
                    }
                    placeholder="Enter quotation details..."
                    className="input w-full h-24"
                    disabled={!selectedQuotation}
                  />
                </div>
              </div>
              {selectedQuotation && (
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setShowQuotationModal(false);
                      setSelectedQuotation(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button onClick={updateQuotation} className="btn btn-primary">
                    Update Quotation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (selectedLead || selectedQuotation) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Send Email</h3>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedLead(null);
                    setSelectedQuotation(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    To
                  </label>
                  <input
                    type="email"
                    value={emailData.to}
                    onChange={(e) =>
                      setEmailData({ ...emailData, to: e.target.value })
                    }
                    className="input w-full"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                    className="input w-full"
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message (Text)
                  </label>
                  <textarea
                    value={emailData.text}
                    onChange={(e) =>
                      setEmailData({ ...emailData, text: e.target.value })
                    }
                    placeholder="Plain text message..."
                    className="input w-full h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    HTML Content (Optional)
                  </label>
                  <textarea
                    value={emailData.html}
                    onChange={(e) =>
                      setEmailData({ ...emailData, html: e.target.value })
                    }
                    placeholder="HTML content..."
                    className="input w-full h-32"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedLead(null);
                    setSelectedQuotation(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedLead ? sendLeadEmail : sendQuotationEmail}
                  className="btn btn-primary"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with {selectedLead.name}
                </h3>
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    setSelectedLead(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {/* Initial Enquiry Message */}
                {selectedLead.message && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {selectedLead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-400">
                          {selectedLead.name} (Customer Enquiry)
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(
                            selectedLead.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm">
                        {selectedLead.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedLead.notes && selectedLead.notes.length > 0 && (
                  <>
                    {selectedLead.notes.map((note, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {note.addedBy?.fullName
                                ?.charAt(0)
                                .toUpperCase() || "S"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-600 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-400">
                              {note.addedBy?.fullName || "Sales Team"} (Note)
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(note.addedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-200 text-sm">
                            {note.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Empty State */}
                {!selectedLead.message &&
                  (!selectedLead.notes || selectedLead.notes.length === 0) && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No messages or notes yet</p>
                      <p className="text-sm text-gray-500 mt-1">
                        The conversation will appear here once the customer
                        sends an enquiry or you add notes.
                      </p>
                    </div>
                  )}
              </div>

              {/* Lead Info Summary */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Lead Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{selectedLead.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <p className="text-white">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Region:</span>
                    <p className="text-white">{selectedLead.region}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Source:</span>
                    <p className="text-white">{selectedLead.source}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedLead.status === "new"
                          ? "bg-blue-500 text-white"
                          : selectedLead.status === "contacted"
                            ? "bg-yellow-500 text-black"
                            : selectedLead.status === "follow-up pending"
                              ? "bg-orange-500 text-white"
                              : "bg-green-500 text-white"
                      }`}
                    >
                      {selectedLead.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <p className="text-white">
                      {new Date(
                        selectedLead.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    setSelectedLead(null);
                  }}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    openEmailModal(selectedLead);
                  }}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
