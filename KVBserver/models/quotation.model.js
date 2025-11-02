import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "follow-up pending",
        "quotation sent",
        "accepted",
        "rejected",
        "closed",
        "converted",
      ],
      default: "new",
    },
    productSnapshot: {
      name: String,
      description: String,
      price: Number,
      image: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true,
    },
    createdByModel: {
      type: String,
      enum: ["Sales", "Admin"],
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    region: {
      type: String,
      enum: ["North", "South", "East", "West", "Central"],
    },
  },
  { timestamps: true }
);

const Quotation = mongoose.model("Quotation", quotationSchema);
export default Quotation;
