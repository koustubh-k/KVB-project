import React from "react";
import { Plus } from "lucide-react";
import { Lead, Quotation } from "@/types";

interface LeadsQuotationsPanelProps {
  leads: Lead[];
  quotations: Quotation[];
  updateLeadStatus: (id: string, status: string, notes: string) => void;
  setSelectedLead: (lead: Lead) => void;
  createQuotation: (leadId: string) => void;
}

const LeadsQuotationsPanel: React.FC<LeadsQuotationsPanelProps> = ({
  leads,
  quotations,
  updateLeadStatus,
  setSelectedLead,
  createQuotation,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Leads Panel */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Leads</h2>
          <button className="btn-primary flex items-center text-sm px-3 py-1">
            <Plus className="h-4 w-4 mr-1" /> New Lead
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Region</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.region}</td>
                  <td className="px-4 py-3">
                    <select
                      onChange={(e) =>
                        updateLeadStatus(
                          lead._id,
                          e.target.value,
                          lead.notes || ""
                        )
                      }
                      defaultValue={lead.status}
                      className="bg-gray-700 text-white rounded px-2 py-1 text-sm w-full"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="follow-up pending">Follow-up</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => setSelectedLead(lead)}
                    >
                      View
                    </button>
                    {lead.status !== "converted" && (
                      <button
                        className="text-green-400 hover:text-green-300"
                        onClick={() => createQuotation(lead._id)}
                      >
                        Convert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quotations Panel */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Quotations</h2>
          <button className="btn-primary flex items-center text-sm px-3 py-1">
            <Plus className="h-4 w-4 mr-1" /> New Quotation
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Price (₹)</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr
                  key={quotation._id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="px-4 py-3">{quotation.productId?.name}</td>
                  <td className="px-4 py-3">
                    {quotation.customerId?.fullName}
                  </td>
                  <td className="px-4 py-3">
                    ₹{quotation.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        quotation.status === "new"
                          ? "bg-blue-500 text-white"
                          : quotation.status === "quotation sent"
                            ? "bg-yellow-500 text-black"
                            : quotation.status === "accepted"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                      }`}
                    >
                      {quotation.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      View
                    </button>
                    <button className="text-green-400 hover:text-green-300">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsQuotationsPanel;
