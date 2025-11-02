import React from "react";
import {
  Calendar,
  User,
  AlertTriangle,
  MessageSquare,
  Package,
  MapPin,
} from "lucide-react";
import { Task } from "@/types";
import { format, isAfter, isBefore, addDays } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-900 text-red-200 border-red-700";
      case "medium":
        return "bg-yellow-900 text-yellow-200 border-yellow-700";
      case "low":
        return "bg-green-900 text-green-200 border-green-700";
      default:
        return "bg-gray-700 text-gray-200 border-gray-600";
    }
  };

  const getDueDateStatus = (dueDate: string, status: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const tomorrow = addDays(now, 1);

    if (status === "completed" || status === "cancelled") {
      return { color: "text-gray-400", label: "" };
    }

    if (isBefore(due, now)) {
      return { color: "text-red-400", label: "Overdue" };
    } else if (isBefore(due, tomorrow)) {
      return { color: "text-orange-400", label: "Due today" };
    } else if (isBefore(due, addDays(now, 3))) {
      return { color: "text-yellow-400", label: "Due soon" };
    } else {
      return { color: "text-gray-300", label: "" };
    }
  };

  const dueDateStatus = getDueDateStatus(task.dueDate, task.status);

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-white line-clamp-2 flex-1 mr-2">
          {task.title}
        </h4>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-300 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Customer */}
      <div className="flex items-center text-xs text-gray-400 mb-2">
        <User className="w-3 h-3 mr-1" />
        <span>{task.customer?.fullName}</span>
      </div>

      {/* Product (if exists) */}
      {task.product && (
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <Package className="w-3 h-3 mr-1" />
          <span>{task.product.name}</span>
        </div>
      )}

      {/* Location */}
      <div className="flex items-center text-xs text-gray-400 mb-2">
        <MapPin className="w-3 h-3 mr-1" />
        <span className="truncate">{task.location || "Location not set"}</span>
      </div>

      {/* Due Date */}
      <div className={`flex items-center text-xs mb-3 ${dueDateStatus.color}`}>
        <Calendar className="w-3 h-3 mr-1" />
        <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
        {dueDateStatus.label && (
          <>
            <span className="mx-1">•</span>
            <span className="font-medium">{dueDateStatus.label}</span>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        {/* Comments count */}
        <div className="flex items-center text-xs text-gray-400">
          <MessageSquare className="w-3 h-3 mr-1" />
          <span>{task.comments?.length || 0}</span>
        </div>

        {/* Overdue indicator */}
        {dueDateStatus.label === "Overdue" && (
          <div className="flex items-center text-xs text-red-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>Overdue</span>
          </div>
        )}

        {/* Created date */}
        <span className="text-xs text-gray-500">
          {format(new Date(task.createdAt), "MMM dd")}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
