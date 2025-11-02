import express from "express";
import {
  getWorkerTasks,
  markTaskComplete,
  updateTaskStatus,
  uploadTasksExcel,
  uploadTaskFiles,
  addTaskComment,
} from "../controllers/task.controller.js";
import { protectWorker } from "../middleware/authMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  validateTaskId,
  validateTaskStatusUpdate,
} from "../middleware/validation.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Worker routes
router.get("/worker/assigned", protectWorker, getWorkerTasks);
router.put(
  "/worker/complete/:taskId",
  protectWorker,
  validateTaskId,
  markTaskComplete
);
router.put(
  "/worker/update-status/:taskId",
  protectWorker,
  validateTaskId,
  validateTaskStatusUpdate,
  updateTaskStatus
);

// File upload for tasks
router.post(
  "/:taskId/upload",
  protectWorker,
  validateTaskId,
  upload.array("files", 10),
  uploadTaskFiles
);

// Add comments to tasks
router.post("/:taskId/comments", protectWorker, validateTaskId, addTaskComment);

// Admin bulk upload
router.post(
  "/upload-excel",
  protectRoute,
  authorizeRole("admin"),
  upload.single("file"),
  uploadTasksExcel
);

export default router;
