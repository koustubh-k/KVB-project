import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    region: {
      type: String,
      enum: ["North", "South", "East", "West", "Central"],
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "follow-up pending", "closed"],
      default: "new",
    },
    source: {
      type: String,
      default: "website",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sales",
    },
    notes: [
      {
        message: {
          type: String,
          required: true,
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sales", // Can be Sales, Admin, or other roles
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
