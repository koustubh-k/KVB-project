import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { salesAPI } from "@/lib/api";
import { Lead, Quotation } from "@/types";
import LeadDetailModal from "@/components/sales/LeadDetailModal";
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
} from "lucide-react";

const SalesDashboard: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  );
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateQuotation, setShowCreateQuotation] = useState(false);
  const [quotationData, setQuotationData] = useState({
    productId: "",
    customerId: "",
    price: 0,
    terms: "",
    validUntil: "",
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
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      await salesAPI.sendFollowUpEmail(emailData);
      alert("Email sent successfully!");
      setEmailData({ to: "", subject: "", text: "", html: "" });
      setSelectedLead(null);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await salesAPI.updateLead(id, { status });
      fetchData();
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const createQuotation = async () => {
    try {
      await salesAPI.createQuotation({
        ...quotationData,
        customerId: selectedLead?.customerId || "",
      });
      setShowCreateQuotation(false);
      setQuotationData({
        productId: "",
        customerId: "",
        price: 0,
        terms: "",
        validUntil: "",
      });
      fetchData();
      alert("Quotation created successfully!");
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Failed to create quotation");
    }
  };

  const updateQuotationStatus = async (id: string, status: string) => {
    try {
      await salesAPI.updateQuotation(id, { status });
      fetchData();
      alert("Quotation status updated!");
    } catch (error) {
      console.error("Error updating quotation:", error);
      alert("Failed to update quotation status");
    }
  };

  // Filter leads based on region and status
  const filteredLeads = leads.filter((lead) => {
    const matchesRegion =
      regionFilter === "all" || lead.region === regionFilter;
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    return matchesRegion && matchesStatus;
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          Sales Dashboard - {user?.fullName}
        </h1>
        <div className="flex space-x-4">
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Pipeline Analytics */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Pipeline Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Leads Table */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Leads</h2>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
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
                <tr key={lead._id} className="border-b border-gray-700">
                  <td className="px-6 py-4">{lead.name}</td>
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-500 hover:text-blue-400 text-sm"
                        title="View Lead Details & Notes"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowCreateQuotation(true);
                        }}
                        className="text-green-500 hover:text-green-400 text-sm"
                        title="Create Quotation"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <select
                        onChange={(e) =>
                          updateLeadStatus(lead._id, e.target.value)
                        }
                        defaultValue={lead.status}
                        className="bg-gray-700 text-white rounded px-2 py-1 text-xs"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="follow-up pending">
                          Follow-up Pending
                        </option>
                        <option value="converted">Converted</option>
                      </select>
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
              No leads found matching the selected filters.
            </p>
          </div>
        )}
      </div>

      {/* Quotations Table */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quotations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr key={quotation._id} className="border-b border-gray-700">
                  <td className="px-6 py-4">{quotation.productId?.name}</td>
                  <td className="px-6 py-4">
                    {quotation.customerId?.fullName}
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
                              : "bg-red-500 text-white"
                      }`}
                    >
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      onChange={(e) =>
                        updateQuotationStatus(quotation._id, e.target.value)
                      }
                      defaultValue={quotation.status}
                      className="bg-gray-700 text-white rounded px-2 py-1 text-xs"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quotation sent">Quotation Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={fetchData}
      />

      {/* Create Quotation Modal */}
      {showCreateQuotation && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              Create Quotation for {selectedLead.name}
            </h3>
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
                  required
                >
                  <option value="">Select a product</option>
                  {/* Note: In a real app, you'd fetch products from API */}
                  <option value="product1">Solar Cooker Dish</option>
                  <option value="product2">Solar Dryer</option>
                  <option value="product3">Solar Tunnel Dryer</option>
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
                  Terms & Conditions
                </label>
                <textarea
                  value={quotationData.terms}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      terms: e.target.value,
                    })
                  }
                  placeholder="Enter quotation terms and conditions..."
                  className="input w-full h-24"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => {
                  setShowCreateQuotation(false);
                  setSelectedLead(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={createQuotation} className="btn-primary">
                Create Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
