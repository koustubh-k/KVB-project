import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  UserCheck,
  TrendingUp,
  MapPin,
  Shield,
  Mail,
  Phone,
} from "lucide-react";
import { adminAPI } from "@/lib/api";
import { User, Worker, Sales, Admin } from "@/types";
import { format } from "date-fns";
import toast from "react-hot-toast";

type UserType = "admin" | "worker" | "sales";

interface UserWithType extends User {
  userType: "admin" | "worker" | "sales";
  specialization?: string;
  region?: string;
}

interface UserFormData {
  fullName: string;
  email: string;
  password?: string;
  specialization?: string;
  region?: string;
}

const UserManagementTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<UserType | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithType | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    password: "",
    specialization: "",
    region: "",
  });

  const queryClient = useQueryClient();

  // Fetch all users
  const { data: admins } = useQuery<Admin[]>(
    "admin-admins",
    () => adminAPI.getAllWorkers().then((res) => res.data) // Note: Need separate endpoints
  );
  const { data: workers } = useQuery<Worker[]>("admin-workers", () =>
    adminAPI.getAllWorkers().then((res) => res.data)
  );
  const { data: sales } = useQuery<Sales[]>(
    "admin-sales",
    () => adminAPI.getAllWorkers().then((res) => res.data) // Note: Need separate endpoints
  );

  const allUsers = [
    ...(admins || []).map((user) => ({ ...user, userType: "admin" as const })),
    ...(workers || []).map((user) => ({
      ...user,
      userType: "worker" as const,
    })),
    ...(sales || []).map((user) => ({ ...user, userType: "sales" as const })),
  ];

  // Filter users
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      userTypeFilter === "all" || user.userType === userTypeFilter;

    return matchesSearch && matchesType;
  });

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "worker":
        return <UserCheck className="w-4 h-4 text-green-500" />;
      case "sales":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "admin":
        return "bg-red-900 text-red-200";
      case "worker":
        return "bg-green-900 text-green-200";
      case "sales":
        return "bg-blue-900 text-blue-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  const handleEdit = (user: UserWithType) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      specialization: user.specialization || "",
      region: user.region || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      // Note: Need to implement delete user API
      toast.success("User deletion would be implemented here");
    }
  };

  const handleFormSubmit = () => {
    // Note: Need to implement create/update user APIs
    toast.success(
      editingUser
        ? "User update would be implemented here"
        : "User creation would be implemented here"
    );
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      specialization: "",
      region: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <p className="text-gray-400">Manage user roles and permissions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-400">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </span>
          {/* Add User button removed as per requirements */}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* User Type Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={userTypeFilter}
            onChange={(e) =>
              setUserTypeFilter(e.target.value as UserType | "all")
            }
            className="input w-auto"
          >
            <option value="all">All Types</option>
            <option value="admin">Admins</option>
            <option value="worker">Workers</option>
            <option value="sales">Sales</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No users found</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                            {getUserTypeIcon(user.userType)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(
                          user.userType
                        )}`}
                      >
                        {getUserTypeIcon(user.userType)}
                        <span className="ml-1 capitalize">{user.userType}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1 text-gray-500" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {user.userType === "worker" &&
                          (user as Worker).specialization && (
                            <div>
                              Specialization: {(user as Worker).specialization}
                            </div>
                          )}
                        {user.userType === "sales" &&
                          (user as Sales).region && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                              Region: {(user as Sales).region}
                            </div>
                          )}
                        {user.userType === "admin" && (
                          <div>Full System Access</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {user.createdAt
                          ? format(new Date(user.createdAt), "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-primary-400 hover:text-primary-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.fullName)}
                          className="text-red-400 hover:text-red-200"
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

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    specialization: "",
                    region: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input w-full"
                  required
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User Type
                </label>
                <select
                  value={editingUser?.userType || "worker"}
                  onChange={(e) => {
                    // Reset form data when user type changes
                    setFormData({
                      ...formData,
                      specialization:
                        e.target.value === "worker"
                          ? formData.specialization
                          : "",
                      region: e.target.value === "sales" ? formData.region : "",
                    });
                  }}
                  className="input w-full"
                >
                  <option value="worker">Worker</option>
                  <option value="sales">Sales</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {(editingUser?.userType === "worker" ||
                (!editingUser && formData.specialization !== undefined)) && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                    className="input w-full"
                    placeholder="e.g., Electrician, Plumber"
                  />
                </div>
              )}

              {(editingUser?.userType === "sales" ||
                (!editingUser && formData.region !== undefined)) && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                    className="input w-full"
                  >
                    <option value="">Select Region</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    specialization: "",
                    region: "",
                  });
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleFormSubmit} className="btn btn-primary">
                {editingUser ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab;
