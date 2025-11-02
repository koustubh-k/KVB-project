import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
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
      default: "sales",
    },
    profilePic: {
      type: String,
      default: "",
    },
    region: {
      type: String,
      enum: ["North", "South", "East", "West", "Central"],
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;
