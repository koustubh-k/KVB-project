import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  getAllSales,
  getAllLeads,
  getLeadById,
  updateLead,
  sendLeadEmail,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  sendQuotationEmail,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  bulkImportProducts,
  bulkImportTasks,
  bulkImportCustomers,
  exportData,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
  validateId,
  validateProduct,
  validateTask,
  validateUpdateTask,
} from "../middleware/validation.js";
import { upload, singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/customers", getAllCustomers);
router.get("/customers/:id", validateId, getCustomerById);
router.post("/customers", createCustomer);
router.put("/customers/:id", validateId, updateCustomer);
router.delete("/customers/:id", validateId, deleteCustomer);

router.get("/workers", getAllWorkers);
router.get("/workers/:id", validateId, getWorkerById);
router.post("/workers", createWorker);
router.put("/workers/:id", validateId, updateWorker);
router.delete("/workers/:id", validateId, deleteWorker);

router.get("/sales", getAllSales);

// Individual lead management
router.get("/leads", getAllLeads);
router.get("/leads/:id", validateId, getLeadById);
router.put("/leads/:id", validateId, updateLead);
router.post("/leads/:id/email", validateId, sendLeadEmail);

// Individual quotation management
router.get("/quotations", getAllQuotations);
router.get("/quotations/:id", validateId, getQuotationById);
router.put("/quotations/:id", validateId, updateQuotation);
router.post("/quotations/:id/email", validateId, sendQuotationEmail);

router.get("/products", getAllProducts);
router.post("/products", singleUpload, validateProduct, createProduct);
router.put(
  "/products/:id",
  validateId,
  singleUpload,
  validateProduct,
  updateProduct
);
router.delete("/products/:id", validateId, deleteProduct);

router.get("/tasks", getAllTasks);
router.post("/tasks", validateTask, createTask);
router.put("/tasks/:id", validateId, validateUpdateTask, updateTask);
router.delete("/tasks/:id", validateId, deleteTask);

// Bulk import/export routes
router.post("/bulk-import/products", upload.single("file"), bulkImportProducts);
router.post("/bulk-import/tasks", upload.single("file"), bulkImportTasks);
router.post(
  "/bulk-import/customers",
  upload.single("file"),
  bulkImportCustomers
);
router.get("/export/:type", exportData);

// Dashboard analytics
router.get("/dashboard", getDashboardStats);

export default router;
