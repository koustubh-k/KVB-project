import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    location: {
      type: String,
      required: false,
    },
    attachments: [
      {
        filename: String,
        url: String,
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "userType",
        },
        userType: {
          type: String,
          enum: ["Admin", "Worker"],
        },
        comment: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
