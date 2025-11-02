import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
      default: "admin",
    },
    profilePic: {
      type: String,
      default: "",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
