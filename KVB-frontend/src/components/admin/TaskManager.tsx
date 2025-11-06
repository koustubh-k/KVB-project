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
  assignedTo?: {
    _id: string;
    fullName: string;
  } | null;
  customer?: {
    _id: string;
    fullName: string;
  } | null;
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

  // view/edit modal state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // NEW: saving state for edit
  const [saving, setSaving] = useState(false);

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

  // NEW: view handler
  const handleViewTask = (taskId: string) => {
    console.log("View clicked:", taskId);
    const task = tasks.find((t) => t._id === taskId) || null;
    setSelectedTask(task);
    setShowViewModal(true);
  };

  // NEW: edit handler (opens edit modal)
  const handleEditTask = (taskId: string) => {
    console.log("Edit clicked:", taskId);
    const task = tasks.find((t) => t._id === taskId) || null;
    setSelectedTask(task);
    setShowEditModal(true);
  };

  // FIXED: actually call updateTask API and handle response
  const handleSaveEdit = async (updated: Partial<Task>) => {
    if (!selectedTask) return;
    try {
      setSaving(true);
      setError(null);

      // Call API to update on the server
      const response = await taskApi.updateTask(selectedTask._id, updated);

      // Assume server returns the updated task in response.data
      const updatedTaskFromServer: Task =
        response?.data && typeof response.data === "object"
          ? response.data
          : { ...selectedTask, ...updated } as Task;

      // update local tasks list with server result
      setTasks((prev) =>
        prev.map((t) => (t._id === selectedTask._id ? updatedTaskFromServer : t))
      );

      // close modal and clear selection
      setShowEditModal(false);
      setSelectedTask(null);

      // optionally re-fetch to keep in sync with server (uncomment if you want fresh list)
      // await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error saving task");
    } finally {
      setSaving(false);
    }
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedTask(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-black";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.customer?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (task.assignedTo?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
                  <td className="px-4 py-3">
                    {task.assignedTo?.fullName || "Unassigned"}
                  </td>
                  <td className="px-4 py-3">
                    {task.customer?.fullName || "No Customer"}
                  </td>
                  <td className="px-4 py-3">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
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
                    <button
                      aria-label={`View ${task.title}`}
                      title="View"
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => handleViewTask(task._id)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      aria-label={`Edit ${task.title}`}
                      title="Edit"
                      className="text-yellow-400 hover:text-yellow-300"
                      onClick={() => handleEditTask(task._id)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      aria-label={`Delete ${task.title}`}
                      title="Delete"
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

      {/* VIEW MODAL */}
      {showViewModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeModals}
            aria-hidden
          />
          <div className="bg-gray-900 rounded-lg shadow-lg z-10 max-w-xl w-full p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-white">
                {selectedTask.title}
              </h3>
              <button
                className="text-gray-300 hover:text-white"
                onClick={closeModals}
                aria-label="Close view"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-gray-300 space-y-2">
              <p>
                <strong>Description: </strong>
                {selectedTask.description || "—"}
              </p>
              <p>
                <strong>Location: </strong>
                {selectedTask.location || "—"}
              </p>
              <p>
                <strong>Assigned To: </strong>
                {selectedTask.assignedTo?.fullName || "Unassigned"}
              </p>
              <p>
                <strong>Customer: </strong>
                {selectedTask.customer?.fullName || "No Customer"}
              </p>
              <p>
                <strong>Due Date: </strong>
                {selectedTask.dueDate
                  ? new Date(selectedTask.dueDate).toLocaleString()
                  : "—"}
              </p>
              <p>
                <strong>Status: </strong>
                {selectedTask.status}
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  // optionally move to edit directly
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
              <button className="btn" onClick={closeModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedTask && (
        <EditModal
          task={selectedTask}
          onClose={closeModals}
          onSave={handleSaveEdit}
          saving={saving}
        />
      )}
    </div>
  );
};

export default TaskManager;

/* ---------- Small EditModal component below (in same file for simplicity) ---------- */

const EditModal: React.FC<{
  task: Task;
  onClose: () => void;
  onSave: (updated: Partial<Task>) => void;
  saving?: boolean;
}> = ({ task, onClose, onSave, saving = false }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <div className="bg-gray-900 rounded-lg shadow-lg z-10 max-w-2xl w-full p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Edit Task</h3>
          <button className="text-gray-300 hover:text-white" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4 text-gray-300">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Due Date</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="btn btn-primary"
            onClick={() =>
              onSave({
                title,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
              })
            }
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
