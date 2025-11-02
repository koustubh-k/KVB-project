import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { adminAPI } from "@/lib/api";
import { Task } from "@/types";
import { format } from "date-fns";
import toast from "react-hot-toast";
import TaskForm from "./TaskForm";

const TasksTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "title" | "priority" | "status" | "dueDate" | "createdAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<Task[]>("admin-tasks", () =>
    adminAPI.getAllTasks().then((res) => res.data)
  );

  const deleteTaskMutation = useMutation(
    (id: string) => adminAPI.deleteTask(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-tasks");
        toast.success("Task deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete task");
      },
    }
  );

  // Filter and sort tasks
  const filteredTasks =
    tasks
      ?.filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.customer?.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          task.assignedTo.some((worker) =>
            worker.fullName.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesStatus =
          statusFilter === "all" || task.status === statusFilter;
        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case "title": {
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          }
          case "priority": {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority];
            bValue = priorityOrder[b.priority];
            break;
          }
          case "status": {
            aValue = a.status;
            bValue = b.status;
            break;
          }
          case "dueDate": {
            aValue = new Date(a.dueDate).getTime();
            bValue = new Date(b.dueDate).getTime();
            break;
          }
          case "createdAt": {
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          }
          default:
            return 0;
        }

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-200";
      case "in-progress":
        return "bg-blue-900 text-blue-200";
      case "completed":
        return "bg-green-900 text-green-200";
      case "cancelled":
        return "bg-red-900 text-red-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-900 text-red-200";
      case "medium":
        return "bg-yellow-900 text-yellow-200";
      case "low":
        return "bg-green-900 text-green-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTaskMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const isOverdue = (dueDate: string, status: string) => {
    return (
      new Date(dueDate) < new Date() &&
      status !== "completed" &&
      status !== "cancelled"
    );
  };

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
        <p className="text-red-600">Failed to load tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Tasks</h2>
          <p className="text-gray-400">Manage and track all tasks</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
          </span>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input w-auto"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="btn btn-outline btn-sm"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No tasks found</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-400 max-w-xs truncate">
                          {task.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {task.customer?.fullName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {task.customer?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {task.assignedTo.map((worker) => (
                          <div key={worker._id} className="text-sm text-white">
                            {worker.fullName}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <span
                          className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center text-sm ${
                          isOverdue(task.dueDate, task.status)
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {format(new Date(task.dueDate), "MMM dd, yyyy")}
                        {isOverdue(task.dueDate, task.status) && (
                          <span className="ml-2 text-xs bg-red-900 text-red-200 px-1 py-0.5 rounded">
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-primary-400 hover:text-primary-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id, task.title)}
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

      {/* Task Form Modal */}
      {showForm && <TaskForm task={editingTask} onClose={handleFormClose} />}
    </div>
  );
};

export default TasksTab;
