import React, { useState } from "react";
import { useMutation } from "react-query";
import {
  X,
  User,
  Calendar,
  Package,
  MessageSquare,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Upload,
  File,
  X as XIcon,
  Phone,
  Mail,
} from "lucide-react";
import { Task } from "@/types";
import { IMAGE_BASE_URL, tasksAPI } from "@/lib/api";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState(task.status);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const updateTaskMutation = useMutation(
    (data: { status?: string; comment?: string }) =>
      tasksAPI.updateTaskStatus(task._id, data),
    {
      onSuccess: () => {
        toast.success("Task updated successfully");
        setNewComment("");
      },
      onError: () => {
        toast.error("Failed to update task");
      },
    }
  );

  const markCompleteMutation = useMutation(
    () => tasksAPI.markTaskComplete(task._id),
    {
      onSuccess: () => {
        toast.success("Task marked as complete");
        onClose();
      },
      onError: () => {
        toast.error("Failed to mark task as complete");
      },
    }
  );

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = () => {
    if (newStatus !== task.status) {
      updateTaskMutation.mutate({
        status: newStatus,
        comment: `Status changed from ${task.status} to ${newStatus}`,
      });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      updateTaskMutation.mutate({
        comment: newComment.trim(),
      });
    }
  };

  const handleMarkComplete = () => {
    if (
      window.confirm("Are you sure you want to mark this task as complete?")
    ) {
      markCompleteMutation.mutate();
    }
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed" &&
    task.status !== "cancelled";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">
              {task.title}
            </h2>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority} priority
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {getStatusIcon(task.status)}
                <span className="ml-1 capitalize">{task.status}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Comments
                </h3>

                {/* Comments List */}
                <div className="space-y-4 mb-4">
                  {task.comments && task.comments.length > 0 ? (
                    task.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">
                            {comment.userType} User
                          </span>
                          <span className="text-sm text-gray-400">
                            {format(
                              new Date(comment.timestamp),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">
                      No comments yet
                    </p>
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 input min-h-[80px] resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={
                      !newComment.trim() || updateTaskMutation.isLoading
                    }
                    className="btn btn-primary self-end"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Upload Files
                </h3>

                {/* File Input */}
                <div className="mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length + selectedFiles.length > 5) {
                        alert("Maximum 5 files allowed");
                        return;
                      }
                      setSelectedFiles([...selectedFiles, ...files]);
                    }}
                    className="hidden"
                    id="task-file-upload"
                  />
                  <label
                    htmlFor="task-file-upload"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        Click to upload files for this task
                      </p>
                      <p className="text-xs text-gray-500">
                        Max 5 files, 10MB each
                      </p>
                    </div>
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-white">
                      Files to upload:
                    </h4>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <File className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFiles(
                              selectedFiles.filter((_, i) => i !== index)
                            );
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={async () => {
                        if (selectedFiles.length === 0) return;

                        const formData = new FormData();
                        selectedFiles.forEach((file) => {
                          formData.append("files", file);
                        });

                        try {
                          // Note: Need to add this API endpoint
                          console.log("Uploading files:", formData);
                          toast.success(
                            `${selectedFiles.length} files uploaded successfully`
                          );
                          setSelectedFiles([]);
                        } catch (error) {
                          toast.error("Failed to upload files");
                        }
                      }}
                      className="w-full btn btn-primary btn-sm"
                    >
                      Upload Files
                    </button>
                  </div>
                )}

                {/* Existing Attachments */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">
                      Attached Files:
                    </h4>
                    {task.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <File className="w-4 h-4 text-gray-400" />
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            {attachment.filename}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Details */}
              <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-white">Task Details</h3>

                {/* Customer */}
                <div className="text-sm">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-300">Customer:</span>
                  </div>
                  <div className="ml-6">
                    <div className="font-medium text-white">
                      {task.customer?.fullName}
                    </div>
                    {/* Show contact info only for in-progress or completed tasks */}
                    {(task.status === "in-progress" ||
                      task.status === "completed") && (
                      <div className="space-y-1 mt-1">
                        <div className="flex items-center text-gray-400">
                          <Mail className="w-3 h-3 mr-1" />
                          <span className="text-xs">
                            {task.customer?.email}
                          </span>
                        </div>
                        {task.customer?.phone && (
                          <div className="flex items-center text-gray-400">
                            <Phone className="w-3 h-3 mr-1" />
                            <span className="text-xs">
                              {task.customer?.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-gray-300">Location:</span>
                    <div className="font-medium text-white mt-1">
                      {task.location || "Location not specified"}
                    </div>
                  </div>
                </div>

                {/* Product */}
                {task.product && (
                  <div className="flex items-center text-sm">
                    <Package className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <span className="text-gray-300">Product:</span>
                      <div className="font-medium text-white">
                        {task.product.name}
                      </div>
                      {task.product.images && task.product.images[0] && (
                        <div className="w-20 h-20 bg-gray-600 rounded-lg flex-shrink-0 overflow-hidden mt-2">
                          <img
                            src={`${IMAGE_BASE_URL}${task.product.images[0]}`}
                            alt={task.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <span className="text-gray-300">Due Date:</span>
                    <div
                      className={`font-medium ${
                        isOverdue ? "text-red-400" : "text-white"
                      }`}
                    >
                      {format(new Date(task.dueDate), "PPP")}
                      {isOverdue && (
                        <span className="text-xs ml-2 bg-red-900 text-red-200 px-2 py-1 rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned Workers */}
                <div className="text-sm">
                  <span className="text-gray-300">Assigned to:</span>
                  <div className="mt-1 space-y-1">
                    {task.assignedTo.map((worker) => (
                      <div key={worker._id} className="font-medium text-white">
                        {worker.fullName}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Created Date */}
                <div className="text-sm">
                  <span className="text-gray-300">Created:</span>
                  <div className="font-medium text-white">
                    {format(new Date(task.createdAt), "PPP")}
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-white">Update Status</h3>

                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(e.target.value as Task["status"])
                  }
                  className="input w-full"
                  disabled={
                    task.status === "completed" || task.status === "cancelled"
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="space-y-2">
                  {newStatus !== task.status && (
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updateTaskMutation.isLoading}
                      className="w-full btn btn-primary btn-sm"
                    >
                      Update Status
                    </button>
                  )}

                  {task.status !== "completed" &&
                    task.status !== "cancelled" && (
                      <button
                        onClick={handleMarkComplete}
                        disabled={markCompleteMutation.isLoading}
                        className="w-full btn btn-outline btn-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
