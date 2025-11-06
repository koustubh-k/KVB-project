import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Plus, Search, Edit, Trash2, Mail, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Lead } from "@/types";
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

  // NEW: selection + modals for View/Edit
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadView, setShowLeadView] = useState(false);
  const [showLeadEdit, setShowLeadEdit] = useState(false);

  // Fetch leads
  const {
    data: leads,
    isLoading: leadsLoading,
    error: leadsError,
  } = useQuery<Lead[]>("admin-leads", () =>
    adminAPI.getAllLeads().then((res) => res.data)
  );

  // Create lead
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

  // Update lead (for Edit)
  const updateLeadMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Lead> }) =>
      adminAPI.updateLead(id, data),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries("admin-leads");
        toast.success("Lead updated");
        setShowLeadEdit(false);
        setSelectedLead(null);
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to update lead";
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

  const filteredLeads = (leads || []).filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.message || "").toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDeleteLead = (leadId: string, leadName: string) => {
    if (window.confirm(`Are you sure you want to delete lead "${leadName}"?`)) {
      deleteLeadMutation.mutate(leadId);
    }
  };

  const handleSendLeadEmail = (lead: Lead) => {
    const subject = `Follow-up regarding your enquiry - KVB Green Energies`;
    const message = `Dear ${lead.name},\n\nThank you for your interest in our products. We'd like to follow up on your recent enquiry.\n\nPlease let us know if you have any questions or need further information.\n\nBest regards,\nKVB Sales Team`;
    sendLeadEmailMutation.mutate({ leadId: lead._id, emailData: { subject, message } });
  };

  // Create lead submit
  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) {
      toast.error("Name and email are required");
      return;
    }
    const payload = {
      name: newLead.name.trim(),
      email: newLead.email.trim(),
      phone: (newLead.phone || "").toString().trim(),
      region: (newLead.region || "").trim(),
      source: (newLead.source || "").trim(),
      message: (newLead.message || "").trim(),
    };
    createLeadMutation.mutate(payload);
  };

  // NEW: View/Edit handlers for leads
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadView(true);
  };
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadEdit(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Sales Management</h2>
          <p className="text-gray-300 mt-1">Manage leads across all regions</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-primary" onClick={() => setShowAddLead(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Sub-tabs (only Leads now) */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <nav className="flex space-x-8 px-6" aria-label="Sub-tabs">
          <button
            onClick={() => setActiveSubTab("leads")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
              activeSubTab === "leads"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
            }`}
          >
            <span>Leads</span>
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">{(leads || []).length}</span>
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search leads...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Leads Table */}
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
                      <button
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="View Lead"
                        onClick={() => handleViewLead(lead)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-yellow-400 hover:text-yellow-300 p-1"
                        title="Edit Lead"
                        onClick={() => handleEditLead(lead)}
                      >
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

      {/* Lead View Modal */}
      {showLeadView && selectedLead && (
        <LeadViewModal lead={selectedLead} onClose={() => { setShowLeadView(false); setSelectedLead(null); }} />
      )}

      {/* Lead Edit Modal */}
      {showLeadEdit && selectedLead && (
        <LeadEditModal
          lead={selectedLead}
          onClose={() => { setShowLeadEdit(false); setSelectedLead(null); }}
          onSave={(data) => updateLeadMutation.mutate({ id: selectedLead._id, data })}
          saving={updateLeadMutation.isLoading}
        />
      )}
    </div>
  );
};

export default SalesTab;

/* ----------------- Modals (kept simple; same file) ----------------- */

const LeadViewModal: React.FC<{ lead: Lead; onClose: () => void }> = ({ lead, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg bg-gray-900 rounded-lg shadow-lg p-6 z-10 border border-gray-700">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">Lead Details</h3>
          <button className="text-gray-300 hover:text-white" onClick={onClose}>✕</button>
        </div>
        <div className="mt-4 text-gray-300 space-y-2">
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Phone:</strong> {lead.phone || "—"}</p>
          <p><strong>Region:</strong> {lead.region || "—"}</p>
          <p><strong>Source:</strong> {lead.source || "—"}</p>
          <p><strong>Status:</strong> {lead.status}</p>
          <p><strong>Message:</strong> {lead.message || "—"}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const LeadEditModal: React.FC<{
  lead: Lead;
  onClose: () => void;
  onSave: (data: Partial<Lead>) => void;
  saving?: boolean;
}> = ({ lead, onClose, onSave, saving = false }) => {
  const [name, setName] = useState(lead.name || "");
  const [email, setEmail] = useState(lead.email || "");
  const [phone, setPhone] = useState((lead.phone as any) || "");
  const [region, setRegion] = useState(lead.region || "");
  const [source, setSource] = useState(lead.source || "");
  const [status, setStatus] = useState(lead.status || "new");
  const [message, setMessage] = useState(lead.message || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg bg-gray-900 rounded-lg shadow-lg p-6 z-10 border border-gray-700">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">Edit Lead</h3>
          <button className="text-gray-300 hover:text-white" onClick={onClose}>✕</button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-gray-300">
          <div className="col-span-2">
            <label className="text-sm">Name</label>
            <input className="input mt-1 w-full" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input className="input mt-1 w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <input className="input mt-1 w-full" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Region</label>
            <input className="input mt-1 w-full" value={region} onChange={(e) => setRegion(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Source</label>
            <input className="input mt-1 w-full" value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Status</label>
            <select className="input mt-1 w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="new">new</option>
              <option value="contacted">contacted</option>
              <option value="follow-up pending">follow-up pending</option>
              <option value="converted">converted</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-sm">Message</label>
            <textarea className="input mt-1 w-full min-h-[80px]" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button className="btn btn-primary" onClick={() => onSave({ name, email, phone, region, source, status, message })} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="btn" onClick={onClose} disabled={saving}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
