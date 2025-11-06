import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Quotation } from "@/types";
import { adminAPI, salesAPI } from "@/lib/api";
import toast from "react-hot-toast";

const QuotationsTab: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Create Quotation modal state + form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuotation, setNewQuotation] = useState({
    productId: "",
    details: "",
    price: "",
  });

  // Fetch quotations
  const {
    data: quotations,
    isLoading,
    error,
  } = useQuery<Quotation[]>("admin-quotations", () =>
    adminAPI.getAllQuotations().then((res) => res.data)
  );

  // Create quotation mutation (using salesAPI.createQuotation)
  const createQuotationMutation = useMutation(
    (payload: { productId: string; details: string; price: number }) =>
      salesAPI.createQuotation(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-quotations");
        toast.success("Quotation created successfully");
        setShowCreateModal(false);
        setNewQuotation({ productId: "", details: "", price: "" });
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create quotation";
        console.error("Failed to create quotation:", err);
        toast.error(msg);
      },
    }
  );

  // Delete quotation mutation (cancel by updating status)
  const deleteQuotationMutation = useMutation(
    (quotationId: string) =>
      adminAPI.updateQuotation(quotationId, { status: "cancelled" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-quotations");
        toast.success("Quotation cancelled successfully");
      },
      onError: () => {
        toast.error("Failed to cancel quotation");
      },
    }
  );

  const filteredQuotations = (quotations || []).filter(
    (quotation) =>
      (quotation.customerId?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (quotation.productId?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (quotation.region || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusBadge = (status: string) => {
    const colorClass = getQuotationStatusColor(status);
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
      >
        {status.replace("-", " ").toUpperCase()}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleDeleteQuotation = (quotationId: string, customerName: string) => {
    if (
      window.confirm(
        `Are you sure you want to cancel quotation for "${customerName}"?`
      )
    ) {
      deleteQuotationMutation.mutate(quotationId);
    }
  };

  // Create quotation submit
  const handleCreateQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { productId, details, price } = newQuotation;

    if (!productId.trim()) {
      toast.error("Product ID is required");
      return;
    }
    if (!price.trim()) {
      toast.error("Price is required");
      return;
    }
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Price must be a positive number");
      return;
    }

    const payload = {
      productId: productId.trim(),
      details: (details || "").trim(),
      price: priceNum,
    };

    createQuotationMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Quotations Management</h2>
          <p className="text-gray-300 mt-1">
            View and manage all quotations across the system
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Quotation
          </button>
        </div>
      </div>


      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">N</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">New</p>
              <p className="text-2xl font-bold text-white">
                {(quotations || []).filter((q) => q.status === "new").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">S</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Sent</p>
              <p className="text-2xl font-bold text-white">
                {
                  (quotations || []).filter(
                    (q) => q.status === "quotation sent"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">C</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Converted</p>
              <p className="text-2xl font-bold text-white">
                {
                  (quotations || []).filter((q) => q.status === "converted")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">$</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Value</p>
              <p className="text-2xl font-bold text-white">
                {formatPrice(
                  (quotations || []).reduce((sum, q) => sum + q.price, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {quotation.customerId?.fullName || "No Customer"}
                    </div>
                    <div className="text-sm text-gray-300">
                      {quotation.customerId?.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {quotation.productId?.name || "No Product"}
                    </div>
                    <div className="text-sm text-gray-300 max-w-xs truncate">
                      {quotation.details}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white font-semibold">
                      {formatPrice(quotation.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(quotation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {quotation.createdByModel === "Sales" ? "Sales Team" : "Admin"}
                    </div>
                    <div className="text-sm text-gray-300">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 p-1" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300 p-1" title="Edit">
                        <Edit className="w-4 h-4" />
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
              
      {/* Create Quotation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              if (!createQuotationMutation.isLoading) setShowCreateModal(false);
            }}
          />
          <div className="relative w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6 z-10 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Create Quotation</h3>
            <form onSubmit={handleCreateQuotationSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-300">Product ID</label>
                <input
                  className="input w-full mt-1"
                  value={newQuotation.productId}
                  onChange={(e) => setNewQuotation((s) => ({ ...s, productId: e.target.value }))}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Enter the product id (or product reference)</p>
              </div>

              <div>
                <label className="text-sm text-gray-300">Details</label>
                <textarea
                  className="input w-full mt-1 min-h-[80px]"
                  value={newQuotation.details}
                  onChange={(e) => setNewQuotation((s) => ({ ...s, details: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Price (INR)</label>
                <input
                  className="input w-full mt-1"
                  value={newQuotation.price}
                  onChange={(e) => setNewQuotation((s) => ({ ...s, price: e.target.value }))}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    if (!createQuotationMutation.isLoading) setShowCreateModal(false);
                  }}
                  disabled={createQuotationMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createQuotationMutation.isLoading}
                >
                  {createQuotationMutation.isLoading ? "Creating..." : "Create Quotation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsTab;
