import Enquiry from "../models/enquiry.model.js";
import Task from "../models/task.model.js";
import Quotation from "../models/quotation.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import { sendEnquiryConfirmation } from "../utils/emailService.js";

// Submit enquiry with optional file attachments
export const submitEnquiry = async (req, res) => {
  try {
    const { productId, message, region } = req.body;
    const customerId = req.customer._id;

    const attachments = [];

    // Upload files to Cloudinary if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.path,
          "enquiry-attachments"
        );
        attachments.push({
          filename: file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // Create enquiry
    const enquiry = new Enquiry({
      customerId,
      productId,
      message,
      region: region || req.customer.region,
      attachments,
    });

    await enquiry.save();

    // Populate the enquiry with product and customer details
    await enquiry.populate([
      { path: "customerId", select: "fullName email phone" },
      { path: "productId", select: "name description" },
      { path: "leadId", select: "name email status" },
    ]);

    // Send confirmation email (don't block response on email failure)
    try {
      await sendEnquiryConfirmation(
        enquiry.customerId.email,
        enquiry.customerId.fullName,
        enquiry.productId.name
      );
    } catch (emailError) {
      console.error("Failed to send enquiry confirmation email:", emailError);
      // Don't fail the enquiry submission if email fails
    }

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
      error: error.message,
    });
  }
};

// Get customer's enquiries
export const getCustomerEnquiries = async (req, res) => {
  try {
    const customerId = req.customer._id;

    const enquiries = await Enquiry.find({ customerId })
      .populate("productId", "name description image")
      .populate("leadId", "status notes")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      enquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

// Get customer's projects (combined tasks and quotations)
export const getCustomerProjects = async (req, res) => {
  try {
    const customerId = req.customer._id;
    console.log("Fetching projects for customer:", customerId);

    // Get quotations and transform to project format
    const quotations = await Quotation.find({ customerId })
      .populate("productId", "name description image")
      .populate("createdBy", "fullName")
      .sort({ createdAt: -1 });

    console.log("Found quotations:", quotations.length);

    const quotationProjects = quotations.map((quotation) => ({
      _id: quotation._id,
      title: `Quotation for ${quotation.productId?.name || "Product"}`,
      description:
        quotation.notes ||
        `Quotation request for ${quotation.productId?.name || "product"}`,
      status: quotation.status,
      type: "quotation",
      product: quotation.productId,
      createdAt: quotation.createdAt,
      updatedAt: quotation.updatedAt,
      attachments: [], // Quotations don't have attachments in this model
    }));

    // Get tasks and transform to project format
    const tasks = await Task.find({ customer: customerId })
      .populate("assignedTo", "fullName")
      .populate("product", "name")
      .select(
        "title description status dueDate location attachments createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    console.log("Found tasks:", tasks.length);

    const taskProjects = tasks.map((task) => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      type: "task",
      product: task.product,
      location: task.location,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      attachments: task.attachments || [],
    }));

    // Combine and sort all projects by creation date
    const allProjects = [...quotationProjects, ...taskProjects].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    console.log("Total projects returned:", allProjects.length);

    res.json({
      success: true,
      projects: allProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};
