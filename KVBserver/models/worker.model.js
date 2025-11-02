import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "worker",
    },
    specialization: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    assignedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    status: {
      type: String,
      enum: ["available", "busy", "off-duty"],
      default: "available",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
