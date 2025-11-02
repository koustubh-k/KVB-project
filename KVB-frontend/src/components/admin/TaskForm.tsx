import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { X } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { Task, TaskFormData, Customer, Worker, Product } from "@/types";
import toast from "react-hot-toast";

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const queryClient = useQueryClient();
  const isEdit = !!task;

  // Fetch customers, workers, and products for dropdowns
  const { data: customers } = useQuery<Customer[]>("admin-customers", () =>
    adminAPI.getAllCustomers().then((res) => res.data)
  );
  const { data: workers } = useQuery<Worker[]>("admin-workers", () =>
    adminAPI.getAllWorkers().then((res) => res.data)
  );
  const { data: products } = useQuery<Product[]>("admin-products", () =>
    adminAPI.getAllProducts().then((res) => res.data)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "medium",
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      assignedTo: task?.assignedTo.map((w) => w._id) || [],
      customer: task?.customer._id || "",
      product: task?.product?._id || "",
    },
  });

  const createTaskMutation = useMutation(
    (data: TaskFormData) => adminAPI.createTask(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-tasks");
        toast.success("Task created successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to create task");
      },
    }
  );

  const updateTaskMutation = useMutation(
    (data: TaskFormData) => adminAPI.updateTask(task!._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-tasks");
        toast.success("Task updated successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to update task");
      },
    }
  );

  const onSubmit = (data: TaskFormData) => {
    if (isEdit) {
      updateTaskMutation.mutate(data);
    } else {
      createTaskMutation.mutate(data);
    }
  };

  const isLoading =
    createTaskMutation.isLoading || updateTaskMutation.isLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {isEdit ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Task Title *
            </label>
            <input
              {...register("title", { required: "Task title is required" })}
              type="text"
              className="input"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={4}
              className="input min-h-[100px] resize-none"
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Priority *
              </label>
              <select
                {...register("priority", { required: "Priority is required" })}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Due Date *
              </label>
              <input
                {...register("dueDate", { required: "Due date is required" })}
                type="date"
                className="input"
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Customer *
            </label>
            <select
              {...register("customer", { required: "Customer is required" })}
              className="input"
            >
              <option value="">Select a customer</option>
              {customers?.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.fullName} ({customer.email})
                </option>
              ))}
            </select>
            {errors.customer && (
              <p className="mt-1 text-sm text-red-400">
                {errors.customer.message}
              </p>
            )}
          </div>

          {/* Assigned Workers */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assign to Workers *
            </label>
            <select
              {...register("assignedTo", {
                required: "At least one worker must be assigned",
              })}
              multiple
              className="input min-h-[120px]"
            >
              {workers?.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.fullName} - {worker.specialization}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Hold Ctrl (or Cmd) to select multiple workers
            </p>
            {errors.assignedTo && (
              <p className="mt-1 text-sm text-red-400">
                {errors.assignedTo.message}
              </p>
            )}
          </div>

          {/* Product (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Related Product (Optional)
            </label>
            <select {...register("product")} className="input">
              <option value="">Select a product (optional)</option>
              {products?.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {isEdit ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
