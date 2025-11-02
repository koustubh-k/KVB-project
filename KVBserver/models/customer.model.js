import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "customer",
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
