import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Filter,
  Search,
} from "lucide-react";
import { tasksAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Task } from "@/types";
import TaskCard from "@/components/worker/TaskCard";
import TaskModal from "@/components/worker/TaskModal";

const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useQuery<Task[]>(
    "worker-tasks",
    () => tasksAPI.getWorkerTasks().then((res) => res.data),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  // Filter tasks based on search and priority
  const filteredTasks =
    tasks?.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.customer?.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    }) || [];

  // Group tasks by status
  const tasksByStatus = {
    pending: filteredTasks.filter((task) => task.status === "pending"),
    "in-progress": filteredTasks.filter(
      (task) => task.status === "in-progress"
    ),
    completed: filteredTasks.filter((task) => task.status === "completed"),
    cancelled: filteredTasks.filter((task) => task.status === "cancelled"),
  };

  const columns = [
    {
      id: "pending",
      title: "To Do",
      icon: Clock,
      color: "bg-yellow-500",
      tasks: tasksByStatus.pending,
    },
    {
      id: "in-progress",
      title: "In Progress",
      icon: AlertCircle,
      color: "bg-blue-500",
      tasks: tasksByStatus["in-progress"],
    },
    {
      id: "completed",
      title: "Completed",
      icon: CheckCircle,
      color: "bg-green-500",
      tasks: tasksByStatus.completed,
    },
    {
      id: "cancelled",
      title: "Cancelled",
      icon: XCircle,
      color: "bg-red-500",
      tasks: tasksByStatus.cancelled,
    },
  ];

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    try {
      await tasksAPI.updateTaskStatus(draggableId, {
        status: destination.droppableId as Task["status"],
        comment: `Status changed from ${source.droppableId} to ${destination.droppableId}`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    refetch(); // Refresh tasks after modal closes
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load tasks</p>
        <button onClick={() => refetch()} className="mt-4 btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Tasks</h1>
            <p className="text-gray-300 mt-2">
              Welcome back, {user?.fullName}. Here are your assigned tasks.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>{tasksByStatus.pending.length} To Do</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>{tasksByStatus["in-progress"].length} In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>{tasksByStatus.completed.length} Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const Icon = column.icon;
            return (
              <div key={column.id} className="bg-gray-800 rounded-lg p-4">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 ${column.color} rounded-full`}
                    ></div>
                    <h3 className="font-semibold text-white">{column.title}</h3>
                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {column.tasks.length}
                    </span>
                  </div>
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>

                {/* Tasks */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] ${
                        snapshot.isDraggingOver
                          ? "bg-blue-950 rounded-lg p-2"
                          : ""
                      }`}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                          isDragDisabled={
                            task.status === "completed" ||
                            task.status === "cancelled"
                          }
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              className={`${
                                snapshot.isDragging ? "rotate-2 shadow-lg" : ""
                              }`}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => handleTaskClick(task)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Task Modal */}
      {showModal && selectedTask && (
        <TaskModal task={selectedTask} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default WorkerDashboard;
