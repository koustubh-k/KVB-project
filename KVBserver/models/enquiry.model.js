import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true,
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
    status: {
      type: String,
      enum: ["pending", "converted", "closed"],
      default: "pending",
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    region: {
      type: String,
      enum: ["North", "South", "East", "West", "Central"],
    },
  },
  { timestamps: true }
);

// Create lead from enquiry after save
enquirySchema.post("save", async function (doc) {
  if (!doc.leadId) {
    try {
      const Customer = mongoose.model("Customer");
      const Product = mongoose.model("Product");
      const Lead = mongoose.model("Lead");

      const customer = await Customer.findById(doc.customerId);
      const product = await Product.findById(doc.productId);

      if (customer && product) {
        const lead = new Lead({
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          customerId: doc.customerId, // Link to existing customer
          region: doc.region || customer.region || "Central",
          status: "new",
          source: "website enquiry",
          notes: [
            {
              message: `Enquiry for ${product.name}: ${doc.message}`,
              addedBy: null, // System generated
              addedAt: new Date(),
            },
          ],
        });

        const savedLead = await lead.save();
        doc.leadId = savedLead._id;
        await doc.save();
      }
    } catch (error) {
      console.error("Error creating lead from enquiry:", error);
    }
  }
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
