import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { adminAPI } from "@/lib/api";
import { Customer } from "@/types";
import { format } from "date-fns";

const CustomersTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const queryClient = useQueryClient();

  const {
    data: customers,
    isLoading,
    error,
  } = useQuery<Customer[]>("admin-customers", () =>
    adminAPI.getAllCustomers().then((res) => res.data)
  );

  // Delete customer mutation
  const deleteCustomerMutation = useMutation(
    (customerId: string) => adminAPI.deleteCustomer(customerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-customers");
      },
      onError: (error) => {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer");
      },
    }
  );

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete customer "${customerName}"?`
      )
    ) {
      deleteCustomerMutation.mutate(customerId);
    }
  };

  // Filter and sort customers
  const filteredCustomers =
    customers
      ?.filter(
        (customer) =>
          customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
      )
      .sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case "name":
            aValue = a.fullName.toLowerCase();
            bValue = b.fullName.toLowerCase();
            break;
          case "email":
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case "createdAt":
            aValue = new Date(a.createdAt || 0).getTime();
            bValue = new Date(b.createdAt || 0).getTime();
            break;
          default:
            return 0;
        }

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load customers</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Customers</h2>
          <p className="text-gray-400">
            Manage and view all registered customers
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-400">
            {filteredCustomers.length} customer
            {filteredCustomers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input w-auto"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="btn btn-outline btn-sm"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No customers found</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {customer.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={customer.profilePic}
                              alt={customer.fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-900 flex items-center justify-center">
                              <span className="text-primary-400 font-medium text-sm">
                                {customer.fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {customer.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            ID: {customer._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-white">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-sm text-white">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="max-w-xs truncate">
                          {customer.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {customer.createdAt
                          ? format(new Date(customer.createdAt), "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View and Edit functionality can be implemented later */}
                        <button
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Customer"
                          onClick={() =>
                            handleDeleteCustomer(
                              customer._id,
                              customer.fullName
                            )
                          }
                          disabled={deleteCustomerMutation.isLoading}
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
    </div>
  );
};

export default CustomersTab;
