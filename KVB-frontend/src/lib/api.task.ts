import api from "./api";

export const taskApi = {
  // Task CRUD operations
  getTasks: () => api.get("/admin/tasks"),
  getTaskById: (id: string) => api.get(`/admin/tasks/${id}`),
  createTask: (data: any) => api.post("/admin/tasks", data),
  updateTask: (id: string, data: any) => api.put(`/admin/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/admin/tasks/${id}`),

  // Bulk operations
  bulkImportTasks: (formData: FormData) =>
    api.post("/admin/bulk-import/tasks", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  exportTasks: () =>
    api.get("/admin/export/tasks", {
      responseType: "blob",
    }),

  downloadTemplate: () =>
    api.get("/admin/tasks/template", {
      responseType: "blob",
    }),

  // Task assignment and status management
  assignTask: (id: string, workerId: string) =>
    api.put(`/admin/tasks/${id}/assign`, { workerId }),

  updateTaskStatus: (id: string, status: string) =>
    api.put(`/admin/tasks/${id}/status`, { status }),
};
