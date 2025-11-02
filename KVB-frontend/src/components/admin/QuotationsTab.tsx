import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Quotation } from "@/types";
import { salesAPI } from "@/lib/api";
import toast from "react-hot-toast";

const QuotationsTab: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch quotations
  const {
    data: quotations,
    isLoading,
    error,
  } = useQuery<Quotation[]>("admin-quotations", () =>
    salesAPI.getQuotations().then((res) => res.data)
  );

  // Delete quotation mutation
  const deleteQuotationMutation = useMutation(
    (quotationId: string) =>
      salesAPI.updateQuotation(quotationId, { status: "cancelled" }),
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
      quotation.customerId.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      quotation.productId.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (quotation.region || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuotationStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "quotation sent":
        return "bg-purple-100 text-purple-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "converted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Quotations Management
          </h2>
          <p className="text-gray-300 mt-1">
            View and manage all quotations across the system
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Quotation
          </button>
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
                  Region
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
                      {quotation.customerId.fullName}
                    </div>
                    <div className="text-sm text-gray-300">
                      {quotation.customerId.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {quotation.productId.name}
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
                    <div className="text-sm text-white">
                      {quotation.region || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(quotation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {quotation.createdBy}
                    </div>
                    <div className="text-sm text-gray-300">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Quotation"
                        onClick={() =>
                          handleDeleteQuotation(
                            quotation._id,
                            quotation.customerId.fullName
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
    </div>
  );
};

export default QuotationsTab;
