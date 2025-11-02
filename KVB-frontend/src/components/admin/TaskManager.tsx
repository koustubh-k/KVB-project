import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import TaskImportExport from "./TaskImportExport";
import { taskApi } from "@/lib/api.task";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  location: string;
  dueDate: string;
  assignedTo: {
    _id: string;
    fullName: string;
  };
  customer: {
    _id: string;
    fullName: string;
  };
  product?: {
    _id: string;
    name: string;
  };
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTasks();
      setTasks(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskApi.deleteTask(taskId);
      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error deleting task");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Management</h2>
          <p className="text-gray-300 mt-1">
            View and manage all tasks across the system
          </p>
        </div>
        <button className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <TaskImportExport onSuccess={fetchTasks} />
      </div>

      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Tasks Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="px-4 py-3">{task.title}</td>
                  <td className="px-4 py-3">{task.location}</td>
                  <td className="px-4 py-3">{task.assignedTo.fullName}</td>
                  <td className="px-4 py-3">{task.customer.fullName}</td>
                  <td className="px-4 py-3">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-yellow-400 hover:text-yellow-300">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Trash2 className="w-4 h-4" />
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

export default TaskManager;
