import Task from "../models/task.model.js";
import Worker from "../models/worker.model.js";
import Customer from "../models/customer.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import {
  sendTaskAssignedNotification,
  sendTaskCompletedNotification,
} from "../utils/emailService.js";

// Bulk upload tasks from Excel
export const uploadTasksExcel = async (req, res) => {
  try {
    const { parseExcel } = await import("../utils/excelParser.js");
    const data = await parseExcel(req.file.buffer);

    const tasks = [];
    for (const row of data) {
      const task = new Task({
        title: row.title,
        description: row.description,
        priority: row.priority,
        status: row.status,
        location: row.location,
        assignedTo: row.assignedTo, // Assuming ID
        customer: row.customer, // Assuming ID
        product: row.product, // Assuming ID
        assignedBy: req.admin._id,
      });
      await task.save();
      tasks.push(task);
    }

    res.status(201).json({
      message: `${tasks.length} tasks uploaded successfully`,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Worker Controllers
export const getWorkerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.worker._id })
      .populate("customer", "fullName email")
      .populate("product", "name");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markTaskComplete = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      assignedTo: req.worker._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ error: "Task not found or not assigned to you" });
    }

    task.status = "completed";
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update task status and add a comment
// @route   PUT /api/tasks/worker/update-status/:taskId
// @access  Private (Worker)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;

    const task = await Task.findOne({
      _id: req.params.taskId,
      assignedTo: req.worker._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ error: "Task not found or not assigned to you" });
    }

    if (status) {
      const validStatuses = Task.schema.path("status").enumValues;
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      task.status = status;
    }

    if (comment) {
      task.comments.push({
        user: req.worker._id,
        userType: "Worker",
        comment: comment,
      });
    }

    const updatedTask = await task.save();

    // Send email notification if task is completed
    if (status === "completed" && task.status !== "completed") {
      try {
        const customer = await Customer.findById(task.customer);
        if (customer) {
          await sendTaskCompletedNotification(
            customer.email,
            customer.fullName,
            task.title
          );
        }
      } catch (emailError) {
        console.error("Failed to send task completion email:", emailError);
        // Don't fail the update if email fails
      }
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.log("Error in updateTaskStatus controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Upload files for a task
// @route   POST /api/tasks/:taskId/upload
// @access  Private (Worker)
export const uploadTaskFiles = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      assignedTo: req.worker._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ error: "Task not found or not assigned to you" });
    }

    const attachments = [];

    // Upload files to Cloudinary if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, "task-attachments");
        attachments.push({
          filename: file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // Add attachments to task
    task.attachments.push(...attachments);
    await task.save();

    res.status(200).json({
      success: true,
      message: `${attachments.length} files uploaded successfully`,
      attachments,
    });
  } catch (error) {
    console.error("Error uploading task files:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload files",
      error: error.message,
    });
  }
};

// @desc    Add comment to a task
// @route   POST /api/tasks/:taskId/comments
// @access  Private (Worker)
export const addTaskComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: "Comment is required" });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      assignedTo: req.worker._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ error: "Task not found or not assigned to you" });
    }

    // Add comment
    task.comments.push({
      user: req.worker._id,
      userType: "Worker",
      comment: comment.trim(),
    });

    await task.save();

    // Populate the comment user details
    await task.populate({
      path: "comments.user",
      select: "fullName",
    });

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: task.comments[task.comments.length - 1],
    });
  } catch (error) {
    console.error("Error adding task comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};
