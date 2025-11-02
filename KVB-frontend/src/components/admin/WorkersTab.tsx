import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Search,
  Filter,
  Mail,
  Briefcase,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { adminAPI } from "@/lib/api";
import { Worker } from "@/types";
import { format } from "date-fns";

const WorkersTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "name" | "email" | "specialization" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const queryClient = useQueryClient();

  const {
    data: workers,
    isLoading,
    error,
  } = useQuery<Worker[]>("admin-workers", () =>
    adminAPI.getAllWorkers().then((res) => res.data)
  );

  // Delete worker mutation
  const deleteWorkerMutation = useMutation(
    (workerId: string) => adminAPI.deleteWorker(workerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-workers");
      },
      onError: (error) => {
        console.error("Error deleting worker:", error);
        alert("Failed to delete worker");
      },
    }
  );

  const handleDeleteWorker = (workerId: string, workerName: string) => {
    if (
      window.confirm(`Are you sure you want to delete worker "${workerName}"?`)
    ) {
      deleteWorkerMutation.mutate(workerId);
    }
  };

  // Filter and sort workers
  const filteredWorkers =
    workers
      ?.filter(
        (worker) =>
          worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker.specialization.toLowerCase().includes(searchTerm.toLowerCase())
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
          case "specialization":
            aValue = a.specialization.toLowerCase();
            bValue = b.specialization.toLowerCase();
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
        <p className="text-red-600">Failed to load workers</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Workers</h2>
          <p className="text-gray-400">
            Manage and view all registered workers
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-400">
            {filteredWorkers.length} worker
            {filteredWorkers.length !== 1 ? "s" : ""}
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
            placeholder="Search workers..."
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
            <option value="specialization">Sort by Specialization</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="btn btn-outline btn-sm"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Workers List */}
      {filteredWorkers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No workers found</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Worker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Specialization
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
                {filteredWorkers.map((worker) => (
                  <tr key={worker._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {worker.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={worker.profilePic}
                              alt={worker.fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-900 flex items-center justify-center">
                              <span className="text-green-400 font-medium text-sm">
                                {worker.fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {worker.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            ID: {worker._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-white">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        {worker.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {worker.specialization}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {worker.createdAt
                          ? format(new Date(worker.createdAt), "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="View Worker"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                          title="Edit Worker"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Worker"
                          onClick={() =>
                            handleDeleteWorker(worker._id, worker.fullName)
                          }
                          disabled={deleteWorkerMutation.isLoading}
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

export default WorkersTab;
